# AGENTS.md

## Projektets AI-struktur

- Aktiv runtime-kerne for dette projekt er `.vscode/.codex/`
- Aktive prompts ligger i `.vscode/.codex/prompts/`
- Aktive projektskills ligger i `.vscode/.codex/skills/`
- Aktive subagents ligger i `.vscode/.codex/agents/`
- Projektets Brain ligger i `.vscode/.codex/Brain/`
- Delte hooks ligger i `.vscode/hooks/`
- Klientadaptere ligger i `.vscode/settings/`
- Arkiveret eller upstream materiale ligger i `.vscode/archive/`
- `Kombi/` er referencekatalog og må ikke bruges som aktiv runtime uden en bevidst reaktivering

## Arbejdsregler

- Behandl `.vscode/.codex/` som eneste lokale kilde til sandhed for agent-konfiguration
- Brug ikke `.vscode/archive/` som aktiv runtime, medmindre noget bevidst reaktiveres
- Bevar Codex som primær målplatform; Claude/Gemini konfigurationer er kompatibilitetslag
- Kimi, Qwen Code og Gemini Code skal pege mod samme `AGENTS.md`, `.vscode/.codex/prompts/`, `.vscode/.codex/skills/` og `.vscode/.codex/agents/`
- Opret ikke aktive klientfiler som `CLAUDE.md`, `GEMINI.md`, `CODEX.md` eller `KIMI.md`; brug `AGENTS.md`
- Læs `.vscode/.codex/prompts/master-system.md` ved opsætning af nye agentarbejdsgange
- Læs `.vscode/.codex/Brain/AGENTS.md` ved komplekse eller flertrinsopgaver
- NEVER delete files you didn't create
- ALWAYS use `uv run` to execute Python scripts
- ALWAYS write newly created scripts to the `temp/` subfolder (create it if it doesn't exist)
- ALWAYS verify before marking a task complete that your solution fully addresses the original request

## Agent skills

### Issue tracker

Projektet bruger lokal markdown til issues og planer, indtil et GitHub/GitLab-remote er valgt. Se `docs/agents/issue-tracker.md`.

### Triage labels

Standardlabel-mapping er `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Se `docs/agents/triage-labels.md`.

### Domain docs

Projektet bruger single-context Brain-layout under `.vscode/.codex/Brain/`. Se `docs/agents/domain.md`.
