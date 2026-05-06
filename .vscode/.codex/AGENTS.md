# AGENTS.md

## Projektets AI-struktur

- Aktiv runtime-kerne er denne mappe: `.vscode/.codex/`
- Aktive projektskills ligger i `.vscode/.codex/skills/`
- Aktive prompts ligger i `.vscode/.codex/prompts/`
- Aktive subagents ligger i `.vscode/.codex/agents/`
- Projektets Brain ligger i `.vscode/.codex/Brain/`
- Delte hooks ligger i `.vscode/hooks/`
- `.vscode/archive/` er kun reference- og historikområde

## Master prompt

- Fælles master/system prompt ligger i `.vscode/.codex/prompts/master-system.md`
- Nye rolleagenter bygges fra `.vscode/.codex/prompts/subagent-builder.md`
- Avatar-agentroster ligger i `.vscode/.codex/agents/agent-roster.json`
- Banedanmark-rolleprofiler ligger i `.vscode/.codex/agents/banedanmark/`

## Skills

- Matt Pocock-skills er installeret projektlokalt i `.vscode/.codex/skills/`
- `karpathy-guidelines` er installeret som fælles adfærds-skill
- BDK-/BBTR-/BBE-/BKP-skills prioriteres ved Banedanmark-opgaver
- `Kombi/` og `.vscode/archive/` er referencekilder, ikke aktiv runtime

## Critical Rules

- NEVER delete files you didn't create
- ALWAYS use `uv run` to execute Python scripts
- ALWAYS write newly created scripts to the `temp/` subfolder (create it if it doesn't exist)
- ALWAYS verify before marking a task complete that your solution fully addresses the original request
