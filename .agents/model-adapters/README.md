# Runtime-adaptere (`.agents/model-adapters/`)

## Status: PLAN (PR C) — beskrivelser, ingen generatorer

Hver fil beskriver **hvordan det canonical `.agents/`-lag mapper onto en specifik runtime**. Adapterne er
**planer**, ikke implementeringer: der findes ingen generator der producerer runtime-output fra canonical
endnu (det er PR D/F). Kun `codex` er `active` (backer `.vscode/.codex/`); resten er `planned`.

Hver adapter-fil har YAML-frontmatter der er konform med `.agents/schema/runtime-adapter.schema.json` og
kan valideres:

```bash
uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py
```

## Adapter-sæt

| Fil | id | Status | Rolle | Entrypoint | Runtime-mål |
|---|---|---|---|---|---|
| `codex.md` | codex | **active** | core (primary) | AGENTS.md | `.vscode/.codex/` |
| `claude-code.md` | claude-code | planned | core | CLAUDE.md | `.claude/` |
| `kimi.md` | kimi | planned | core (primary) | AGENTS.md | `.kimi/` |
| `ollama.md` | ollama | planned | core | Modelfile | `ollama/` |
| `gemini.md` | gemini | planned | core | GEMINI.md | `.gemini/` |
| `cursor.md` | cursor | planned | kandidat | AGENTS.md | `.cursor/` |
| `qwen-code.md` | qwen-code | planned | sekundær | AGENTS.md | `.qwen/` |

**Core-targets (ADR):** codex, claude-code, kimi, ollama, gemini. **Kandidat:** cursor
(fra `docs/agents/sources/runtimes/cursor.md`). **Sekundær:** qwen-code (registry `secondary_models`).

## Noter
- **Claude manglede tidligere** — tilføjet i PR C (`claude-code.md`). Filen hedder bevidst `claude-code.md`,
  ikke `claude.md`, for at undgå case-insensitiv kollision med `CLAUDE.md` (som Claude Code auto-læser som
  instruktioner) på Windows.
- **Ollama manglede tidligere** — tilføjet i PR C. Ollama er den mest begrænsede runtime (model-runner uden
  native skills/tools/memory); adapteren dokumenterer dette frem for at love paritet.
- `gemini.md` blev renamet fra `gemini-code.md` for at matche schema-enum'en.
- Faktisk runtime-generering (canonical → runtime-output) er **PR D/F**, ikke PR C.

Se `docs/architecture/ADR-multi-runtime-agent-system.md` (Roadmap) og
`docs/architecture/registry-reconciliation.md`.
