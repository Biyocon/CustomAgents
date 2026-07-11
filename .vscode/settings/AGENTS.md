# Settings Adapter Notes

`.vscode/settings/` er adapterlag. Det må ikke blive en separat kilde til agentinstruktioner.

> Opdateret 2026-07-11 (post-PR F): `.agents/` er CANONICAL; `.vscode/.codex/agents/` +
> Brain-pointeren GENERERES af `.agents/scripts/generate-runtime.py`. Adapterlaget peger
> på runtime-VISNINGEN, men redigering sker altid i canonical.

## Regel

Alle klienter skal pege mod:

- root `AGENTS.md` (fælles instruktionsfil)
- `.vscode/.codex/prompts/`
- `.agents/skills/` (canonical skills, flyttet 2026-07-09)
- `.vscode/.codex/agents/` (genereret agents-lag)
- `.agents/brain/` (canonical hukommelse)

## Klienter

- Codex: primær runtime via `.vscode/.codex/` (genereret fra canonical)
- Kimi: peg manuelt mod `AGENTS.md` + stierne ovenfor hvis klienten ikke gør det automatisk
- Qwen Code: samme princip som Kimi
- Gemini Code: adapterfil findes i `gemini.json`; kilden er canonical `.agents/` + genereret runtime
- Claude Code: se `.agents/model-adapters/claude-code.md`

Opret ikke separate `Claude.md`, `Gemini.md`, `Codex.md` eller `Kimi.md` som aktive instruktioner. Brug `AGENTS.md`.
