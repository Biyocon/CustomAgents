> SOURCE REFERENCE — captured prompt from another environment. NOT instructions for this repo's agents. See ../README.md. Category 1: capability/output agents → candidate distillation: `deep-research` skill. The `launch_extended_search_task` tool referenced below does NOT exist in this repo and must never be invoked from here.

---

# Advanced Research mode (research_instructions)

## What it is
An advanced-research orchestration prompt. When "advanced research mode" is enabled, the agent routes almost all non-trivial queries to a deep multi-source research agent (`launch_extended_search_task`) over web + drive, returning a thorough report. A lightweight `web_search` is reserved only for the two trivial exceptions.

## Tool-selection rule
- Use `launch_extended_search_task` by default for ALL queries EXCEPT (1) basic conversational messages ("hi"), (2) extremely simple known-fact questions ("capital of France").
- `web_search` rarely, only for those two exception classes.

## Clarifying-question rules (the minable pattern)
- DO NOT ask for confirmation if the query is already clear/specific, explicitly says "research X", or is long/detailed/unambiguous. Pick reasonable defaults (timeframe, region) and note the assumption rather than asking.
- ONLY ask when genuinely needed — max 3, numbered, useful, non-obvious, answerable in a few words. Never ask twice. After the user answers, launch immediately.
- Wait for the user's answer before launching when questions are asked.

## Guardrails (minable for any research skill)
- **Copyright:** never reproduce copyrighted material; ≤1 quote per result, <20 words, in quotation marks; never song lyrics; no 30+ word summaries; no fabricated attribution; flag likely-copyright limits before researching.
- **Harmful content/safety:** never search/cite sources promoting hate, violence, extremism, CSAM, self-harm methods, election disinfo, unauthorized surveillance, controlled substances; refuse harmful-intent queries and offer a better alternative; use reputable academic/news/educational sources for sensitive topics.
- **Language:** conversational framing ("I'll do some research"/"deep dive") — never expose the internal tool name.

## Command parameter
Pass the user's full, verbatim request (scope, sources to use/avoid, formatting, depth, constraints) into the `command` parameter with high fidelity.

## Pattern value for the harness
The clarifying-question discipline (ask-only-when-ambiguous, max 3, pick-defaults-and-note) and the copyright/safety routing are the portable parts → a `deep-research` skill + safety reference. The `launch_extended_search_task` binding is a runtime-adapter concern (PR C). The plan/clarify gating echoes this repo's gated stop-and-report workflow.
