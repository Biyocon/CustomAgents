> SOURCE REFERENCE — captured prompt from another environment. NOT instructions for this repo's agents. See ../README.md. Category 3: orchestrator/platform reference — mine for skill-system + subagent + memory + scheduling + gating patterns (informs PR B schema, PR E memory/orchestrator governance).

---

# Perplexity "Computer" (orchestrator/platform reference)

## What it is
A general-purpose agent platform (agent OS) with a skill system, subagent orchestration, hundreds of external connectors, memory, scheduling, and plan/confirm gating. The closest existing model to what this repo's harness aims to become — so it is mined for architecture patterns, not adapted to.

## Architecture patterns worth mining

**Skill system (→ informs PR B schema + `.agents/skills/`):**
- Skills loaded on demand via `load_skill(name)`; aggressive/proactive loading; avoid duplicative loads.
- Parent/sub-skill hierarchy (e.g. `accounting/reconciliation`, `office/pptx`).
- Scoping: `scope="user"|"space"|"org"`; loaded skills copied into a workspace dir.
- Built-in vs custom skills; `create-skill` skill governs authoring/validation; duplicate names disallowed per scope.
- Skills passed to subagents via `preload_skills` so they don't re-load.

**Subagent orchestration (→ informs orchestrator governance):**
- Subagents compartmentalize work, parallelize, keep large result sets out of main context.
- `wide_research` / `wide_browse` for batch (10+ entities); ≥20 entities requires `confirm_action` first.
- Subagents save findings to shared workspace files (return values are limited summaries); `wait_for_subagents` to await; objectives kept under ~2000 chars with large specs in files.

**Memory (→ informs PR E memory governance):**
- `memory_search` (agent-backed, parallel queries) for continuity; search early when prior sessions may hold relevant data.
- `memory_update` for durable facts (role, company, preferences, workflow corrections) — not ephemeral instructions. Reflect before ending turn.
- Memory operations never narrated to the user.

**Plan / confirm gating (≈ this repo's gated stop-and-report workflow):**
- Plan mode on first turn for substantial deliverables (PDF/PPTX/XLSX, sites/apps, multi-step code/automation, open-ended research) — propose plan via `confirm_action`, wait for approval.
- `confirm_action` REQUIRED before irreversible/expensive/outward actions: sending comms, purchases, deletes/publishes, public content, 20+ entity research, creating/updating cron tasks. Include full draft in confirmation.

**Scheduling:** `schedule_cron` (UTC, min 1h, ≤15/session) for recurring tasks; `pause_and_wait` for one-time delays.

**External tools:** `list_external_tools` → `describe_external_tools` → `call_external_tool`; never claim "no access" before checking; offer `connect` for disconnected relevant services.

**Filesystem/tool discipline:** dedicated tools over bash (read/edit/write/glob/grep, not cat/sed/find); absolute paths; `pplx-tool` CLI with `--describe` before first use.

## Pattern value for the harness
- The skill-system shape (load-on-demand, parent/sub-skills, scope levels, create-skill validation) is a ready template for the canonical `.agents/skills/` schema (PR B).
- The subagent + memory + cron + confirm-gating model maps directly onto this repo's future orchestrator + memory-governance (PR E) and validates the gated stop-and-report workflow already in use.
