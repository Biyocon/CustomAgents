#!/usr/bin/env python3
"""
LLM Council — 3-stage deliberation script.

Stage 1: All council models answer individually (parallel)
Stage 2: Each model reviews and ranks anonymized responses
Stage 3: Chairman model synthesizes a final answer

Usage:
    python scripts/llm-council.py "What is the meaning of life?"
    python scripts/llm-council.py "question" --models llama3.2,qwen2.5,gemma2
    python scripts/llm-council.py "question" --chairman llama3.2 --verbose

Requires: Ollama running on localhost:11434 (or set OLLAMA_API_URL)
"""

import argparse
import asyncio
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

# ── Config ──

OLLAMA_URL = os.environ.get("OLLAMA_API_URL", "http://127.0.0.1:11434/api/chat")
TIMEOUT = int(os.environ.get("COUNCIL_TIMEOUT_SECONDS", "300"))

DEFAULT_MODELS = os.environ.get("COUNCIL_MODELS", "llama3.2,qwen2.5,gemma2").split(",")
DEFAULT_MODELS = [m.strip() for m in DEFAULT_MODELS if m.strip()]

# ── Colors ──

class C:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    GRAY = "\033[90m"

# ── Ollama client ──

def query_model(model, messages):
    """Query a single model via Ollama (non-streaming)."""
    payload = json.dumps({
        "model": model,
        "messages": messages,
        "stream": False,
    }).encode("utf-8")

    req = Request(OLLAMA_URL, data=payload, headers={"Content-Type": "application/json"})

    try:
        with urlopen(req, timeout=TIMEOUT) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = (data.get("message") or {}).get("content", "").strip()
            if not content:
                raise ValueError(f"Empty response from {model}")
            return content
    except (URLError, HTTPError, ValueError) as e:
        raise RuntimeError(f"Model {model}: {e}")


def query_models_parallel(models, messages):
    """Query multiple models in parallel using ThreadPoolExecutor."""
    results = []
    errors = []

    with ThreadPoolExecutor(max_workers=len(models)) as executor:
        futures = {executor.submit(query_model, m, messages): m for m in models}
        for future in futures:
            model = futures[future]
            try:
                start = time.time()
                response = future.result()
                elapsed = round(time.time() - start, 1)
                results.append({"model": model, "response": response, "elapsed": elapsed})
            except Exception as e:
                errors.append({"model": model, "error": str(e)})

    return results, errors

# ── Ranking parser ──

def parse_ranking(text):
    """Extract FINAL RANKING section and parse labels."""
    match = re.search(r"FINAL\s*RANKING\s*:\s*\n([\s\S]*)", text, re.IGNORECASE)
    if not match:
        # Fallback: find all Response X patterns
        return re.findall(r"Response [A-Z]", text)

    section = match.group(1).strip()
    labels = []
    for line in section.split("\n"):
        line = line.strip()
        if not line:
            continue
        m = re.match(r"^\d+[\.\)]\s*(Response\s+[A-Z])", line, re.IGNORECASE)
        if m:
            labels.append(m.group(1))
            continue
        m2 = re.match(r"^(Response\s+[A-Z])", line, re.IGNORECASE)
        if m2:
            labels.append(m2.group(1))
    return labels

# ── 3-Stage Council ──

def stage1(prompt, models):
    """Stage 1: Collect individual responses."""
    messages = [{"role": "user", "content": prompt}]
    return query_models_parallel(models, messages)

def stage2(prompt, stage1_results, models):
    """Stage 2: Peer review with anonymized responses."""
    labels = [chr(65 + i) for i in range(len(stage1_results))]
    label_to_model = {f"Response {l}": r["model"] for l, r in zip(labels, stage1_results)}

    responses_text = "\n\n".join(
        f"Response {l}:\n{r['response']}" for l, r in zip(labels, stage1_results)
    )

    ranking_prompt = f"""You are evaluating different responses to the following question:

Question: {prompt}

Here are the responses from different models (anonymized):

{responses_text}

Your task:
1. First, evaluate each response individually. For each response, explain what it does well and what it does poorly.
2. Then, at the very end of your response, provide a final ranking.

IMPORTANT: Your final ranking MUST be formatted EXACTLY as follows:
- Start with the line "FINAL RANKING:" (all caps, with colon)
- Then list the responses from best to worst as a numbered list
- Each line should be: number, period, space, then ONLY the response label (e.g., "1. Response A")

Example:

Response A provides good detail on X but misses Y...
Response B is accurate but lacks depth on Z...

FINAL RANKING:
1. Response A
2. Response B

Now provide your evaluation and ranking:"""

    messages = [{"role": "user", "content": ranking_prompt}]
    results, errors = query_models_parallel(models, messages)

    # Parse rankings
    for r in results:
        r["parsed_ranking"] = parse_ranking(r["response"])

    return results, errors, label_to_model

def stage3(prompt, stage1_results, stage2_results, chairman):
    """Stage 3: Chairman synthesizes final answer."""
    stage1_text = "\n\n".join(
        f"Model: {r['model']}\nResponse: {r['response']}" for r in stage1_results
    )
    stage2_text = "\n\n".join(
        f"Model: {r['model']}\nRanking: {r['response']}" for r in stage2_results
    )

    chairman_prompt = f"""You are the Chairman of an LLM Council. Multiple AI models have provided responses to a user's question, and then ranked each other's responses.

Original Question: {prompt}

STAGE 1 - Individual Responses:
{stage1_text}

STAGE 2 - Peer Rankings:
{stage2_text}

Your task as Chairman is to synthesize all of this information into a single, comprehensive, accurate answer to the user's original question. Consider:
- The individual responses and their insights
- The peer rankings and what they reveal about response quality
- Any patterns of agreement or disagreement

Provide a clear, well-reasoned final answer:"""

    messages = [{"role": "user", "content": chairman_prompt}]
    try:
        start = time.time()
        response = query_model(chairman, messages)
        return {"model": chairman, "response": response, "elapsed": round(time.time() - start, 1)}
    except Exception as e:
        return {"model": chairman, "response": f"Chairman synthesis failed: {e}", "elapsed": 0}

def calculate_aggregate(stage2_results, label_to_model):
    """Compute average rank position across all peer evaluations."""
    rank_sums = {}
    rank_counts = {}
    for s2 in stage2_results:
        for pos, label in enumerate(s2.get("parsed_ranking", [])):
            rank_sums[label] = rank_sums.get(label, 0) + (pos + 1)
            rank_counts[label] = rank_counts.get(label, 0) + 1

    aggregates = []
    for label, model in label_to_model.items():
        votes = rank_counts.get(label, 0)
        avg = rank_sums.get(label, 0) / votes if votes > 0 else 0
        aggregates.append({"label": label, "model": model, "avg_rank": round(avg, 2), "votes": votes})

    return sorted(aggregates, key=lambda x: x["avg_rank"])

# ── Output ──

def print_stage1(results, verbose):
    print(f"\n{C.CYAN}{'='*60}{C.RESET}")
    print(f"{C.CYAN}{C.BOLD}  STAGE 1: Individual Responses{C.RESET}")
    print(f"{C.CYAN}{'='*60}{C.RESET}\n")

    if verbose:
        for i, r in enumerate(results):
            label = chr(65 + i)
            print(f"{C.YELLOW}[{label}] {r['model']} ({r['elapsed']}s){C.RESET}")
            print(f"{C.WHITE}{r['response']}{C.RESET}")
            print(f"{C.GRAY}{'─'*60}{C.RESET}\n")
    else:
        for i, r in enumerate(results):
            label = chr(65 + i)
            preview = r["response"][:150].replace("\n", " ")
            print(f"  {C.YELLOW}[{label}]{C.RESET} {r['model']} ({r['elapsed']}s) — {preview}...")

def print_stage2(results, label_to_model, verbose):
    print(f"\n{C.CYAN}{'='*60}{C.RESET}")
    print(f"{C.CYAN}{C.BOLD}  STAGE 2: Peer Review (Anonymized){C.RESET}")
    print(f"{C.CYAN}{'='*60}{C.RESET}\n")

    for r in results:
        parsed = r.get("parsed_ranking", [])
        if parsed:
            print(f"  {C.MAGENTA}{r['model']}{C.RESET}: {' > '.join(parsed)}")
            if verbose:
                print(f"    {C.GRAY}(full text below){C.RESET}")
                print(f"    {C.GRAY}{r['response'][:500]}{C.RESET}")
        else:
            print(f"  {C.MAGENTA}{r['model']}{C.RESET}: (no parseable ranking)")
            if verbose:
                print(f"    {C.GRAY}{r['response'][:300]}{C.RESET}")

def print_stage3(result):
    print(f"\n{C.CYAN}{'='*60}{C.RESET}")
    print(f"{C.CYAN}{C.BOLD}  STAGE 3: Chairman Final Answer{C.RESET}")
    print(f"{C.CYAN}{'='*60}{C.RESET}\n")

    print(f"{C.GRAY}Chairman: {result['model']} | {result['elapsed']}s{C.RESET}\n")
    print(f"{C.GREEN}{result['response']}{C.RESET}\n")

def print_aggregate(aggregates):
    if not aggregates:
        return
    print(f"{C.CYAN}{'─'*60}{C.RESET}")
    print(f"{C.CYAN}{C.BOLD}  Aggregate Rankings{C.RESET}")
    print(f"{C.CYAN}{'─'*60}{C.RESET}\n")

    medals = ["FIRST", "SECOND", "THIRD"]
    for i, a in enumerate(aggregates):
        medal = "1." if i == 0 else f"{i+1}."
        print(f"  {medal} {a['model']:<25} avg: {a['avg_rank']}  ({a['votes']} votes)")
    print()

# ── Main ──

def main():
    parser = argparse.ArgumentParser(
        description="LLM Council — 3-stage deliberation with multiple models"
    )
    parser.add_argument("prompt", nargs="+", help="The question to ask the council")
    parser.add_argument("--models", "-m", default=None, help="Comma-separated model names")
    parser.add_argument("--chairman", "-c", default=None, help="Chairman model name")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show full responses")
    args = parser.parse_args()

    prompt = " ".join(args.prompt)
    models = args.models.split(",") if args.models else DEFAULT_MODELS
    models = [m.strip() for m in models if m.strip()]
    chairman = args.chairman or models[0]

    if len(models) < 2:
        print(f"{C.RED}Error: Council needs at least 2 models.{C.RESET}")
        sys.exit(1)

    # Header
    print(f"\n{C.GREEN}{C.BOLD}{'='*60}{C.RESET}")
    print(f"{C.GREEN}{C.BOLD}  LLM COUNCIL — 3 Stages{C.RESET}")
    print(f"{C.GREEN}{C.BOLD}{'='*60}{C.RESET}\n")

    print(f"{C.GRAY}Prompt: \"{prompt[:100]}{'...' if len(prompt) > 100 else ''}\"{C.RESET}")
    print(f"{C.GRAY}Council: {', '.join(models)}{C.RESET}")
    print(f"{C.GRAY}Chairman: {chairman}{C.RESET}\n")

    # Stage 1
    print(f"{C.BLUE}> Stage 1: Collecting individual responses...{C.RESET}")
    s1_results, s1_errors = stage1(prompt, models)

    if not s1_results:
        print(f"\n{C.RED}All models failed. Is Ollama running?{C.RESET}")
        for e in s1_errors:
            print(f"  {C.RED}{e['model']}: {e['error']}{C.RESET}")
        sys.exit(1)

    print(f"  {C.GREEN}OK {len(s1_results)}/{len(models)} models responded{C.RESET}\n")
    print_stage1(s1_results, args.verbose)

    # Stage 2
    print(f"\n{C.BLUE}> Stage 2: Peer review (anonymized)...{C.RESET}")
    s2_results, s2_errors, label_to_model = stage2(prompt, s1_results, models)
    print(f"  {C.GREEN}OK {len(s2_results)} rankings collected{C.RESET}\n")
    print_stage2(s2_results, label_to_model, args.verbose)

    # Stage 3
    print(f"\n{C.BLUE}> Stage 3: Chairman synthesizing...{C.RESET}")
    s3_result = stage3(prompt, s1_results, s2_results, chairman)
    print_stage3(s3_result)

    # Aggregate
    aggregates = calculate_aggregate(s2_results, label_to_model)
    print_aggregate(aggregates)

    if not args.verbose:
        print(f"{C.GRAY}Use --verbose for full responses and rankings.{C.RESET}\n")

if __name__ == "__main__":
    main()
