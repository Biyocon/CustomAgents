# AGENTS.md

## Projektets AI-struktur

- `.vscode/.codex/` er den aktive runtime-kerne
- `.vscode/settings/` er adapterlag for andre klienter
- `.vscode/hooks/` er fælles håndhævelse af generelle regler
- `.vscode/archive/` er arkiv og upstream-reference, ikke aktiv runtime

## Adapterregler

- Alle klienter skal bruge root `AGENTS.md` og `.vscode/.codex/AGENTS.md` som fælles instruktion
- Codex er primær målplatform
- Kimi, Qwen Code og Gemini Code skal pege mod `.vscode/.codex/prompts/`, `.vscode/.codex/skills/`, `.vscode/.codex/agents/` og `.vscode/.codex/Brain/`
- Opret ikke aktive klient-specifikke instruktioner som `CLAUDE.md`, `GEMINI.md`, `CODEX.md` eller `KIMI.md`
- Adapter-specifikke noter ligger i `.vscode/settings/AGENTS.md`

## Critical Rules

- NEVER delete files you didn't create
- ALWAYS use `uv run` to execute Python scripts
- ALWAYS write newly created scripts to the `temp/` subfolder (create it if it doesn't exist)
- ALWAYS verify before marking a task complete that your solution fully addresses the original request
