---
name: llm-council
description: 3-stage LLM deliberation — multiple models answer, review each other (anonymized), and a Chairman synthesizes a final answer. Use when user says "council", "råde", "flere modeller", "bedøm hinanden", or wants a higher-quality answer by cross-checking multiple LLMs.
---

# LLM Council

A 3-stage deliberation process where multiple LLMs collaborate to produce a better answer than any single model could alone.

## When to Use

- Complex questions where a single model answer might miss nuances
- High-stakes decisions where cross-validation matters
- When the user wants multiple perspectives synthesized into one answer
- When the user explicitly asks for a "council" or "råde" of models

## Process

### Stage 1 — Collect Individual Responses

1. Send the user's question to all council models in parallel (non-streaming, `stream: false`).
2. Collect all successful responses. Filter out failures gracefully.
3. Present each response with its model name.

### Stage 2 — Peer Review (Anonymized)

1. Label responses as "Response A", "Response B", "Response C", etc. — never reveal model names to the reviewing models.
2. Create a `label_to_model` mapping for later de-anonymization.
3. Send all anonymized responses to each council model with this prompt:

```
You are evaluating different responses to the following question:
Question: {prompt}
Here are the responses from different models (anonymized):
{responses_text}
Your task:
1. Evaluate each response individually — what it does well and poorly.
2. At the end, provide a FINAL RANKING formatted as:
FINAL RANKING:
1. Response C
2. Response A
3. Response B
```

4. Parse the `FINAL RANKING:` section to extract ordered labels.
5. Collect rankings from all models in parallel.

### Stage 3 — Chairman Synthesis

1. The designated Chairman model receives all Stage 1 responses + Stage 2 rankings.
2. The Chairman prompt asks it to synthesize a single, comprehensive answer considering:
   - Individual responses and their insights
   - Peer rankings and what they reveal about quality
   - Patterns of agreement or disagreement
3. The Chairman's output is the final answer presented to the user.

### Aggregate Rankings

After all 3 stages, compute average rank position for each model across all peer evaluations. Present as a sorted table.

## Running the Council

### Option A: Python Script

```bash
python scripts/llm-council.py "What is the best approach to..."
```

With options:
```bash
python scripts/llm-council.py "question" --models llama3.2,qwen2.5,gemma2 --chairman llama3.2 --verbose
```

### Option B: Manual (via agent)

The agent can orchestrate the council by:
1. Calling `ollama run <model> "<prompt>"` for each model in Stage 1
2. Constructing the ranking prompt and calling each model again for Stage 2
3. Constructing the chairman prompt and calling the chairman model for Stage 3

## Configuration

Environment variables (or `.env`):
- `OLLAMA_API_URL` — default: `http://127.0.0.1:11434/api/chat`
- `COUNCIL_MODELS` — comma-separated model names (e.g. `llama3.2,qwen2.5,gemma2`)
- `COUNCIL_TIMEOUT_SECONDS` — per-model timeout (default: 300)

## Pitfalls

- **Models must be available in Ollama** — run `ollama list` to verify. Pull missing models with `ollama pull <name>`.
- **At least 2 models** are required for a meaningful council.
- **Anonymization is critical** — if models can see their own name, they may self-favor.
- **Cloud models via Ollama** (e.g. `glm-5.2:cloud`) may incur costs — warn the user before running.
- **Stage 2 parsing** — models don't always follow the `FINAL RANKING:` format perfectly. The parser falls back to regex for `Response X` patterns.
- **Timeout** — cloud models can be slow; set `COUNCIL_TIMEOUT_SECONDS` high enough.
