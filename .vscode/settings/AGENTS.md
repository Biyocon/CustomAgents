# Settings Adapter Notes

`.vscode/settings/` er adapterlag. Det må ikke blive en separat kilde til agentinstruktioner.

## Regel

Alle klienter skal pege mod:

- root `AGENTS.md`
- `.vscode/.codex/AGENTS.md`
- `.vscode/.codex/prompts/`
- `.vscode/.codex/skills/`
- `.vscode/.codex/agents/`

## Klienter

- Codex: primær runtime via `.vscode/.codex/`
- Kimi: peg manuelt mod `AGENTS.md` og `.vscode/.codex/` hvis klienten ikke gør det automatisk
- Qwen Code: samme princip som Kimi
- Gemini Code: adapterfil findes i `gemini.json`, men aktiv kilde er stadig `.vscode/.codex/`

Opret ikke separate `Claude.md`, `Gemini.md`, `Codex.md` eller `Kimi.md` som aktive instruktioner. Brug `AGENTS.md`.
