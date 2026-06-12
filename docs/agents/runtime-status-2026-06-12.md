# Runtime Status 2026-06-12

## Beslutning

`.vscode/.codex/` er aktiv runtime og eneste lokale kilde til sandhed for drift.

`.agents/` er migration/reference. Den maa ikke behandles som aktiv runtime, foer der findes en ny valideringsrapport og en eksplicit aktiveringsbeslutning.

## Aktuel Tilstand

- Aktiv runtime: `.vscode/.codex/`
- Aktive prompts: `.vscode/.codex/prompts/`
- Aktive skills: `.vscode/.codex/skills/`
- Aktive agents: `.vscode/.codex/agents/`
- Aktiv Brain: `.vscode/.codex/Brain/`
- Fremtidig/reference-runtime: `.agents/`

Seneste direkte scan viser:

- `.vscode/.codex/skills/`: 73 skill-mapper
- `.vscode/.codex/agents/registry.yaml`: reel aktiv agent- og skill-registry
- `.agents/agents/`: 37 agentmapper
- `.agents/skills/`: 29 skill-mapper
- `.agents/reports/validation_report.md`: 61 OK, 7 advarsler, 0 fejl, 0 kritiske
- `.agents/agents/`: 36 af 37 mapper mangler fuld agentpakke efter `AGENTS.md` / `profile.md` / `skills.yaml` / `avatar.md`-testen

## Kendte Faldgruber

- `.vscode/.codex/registry.yaml` er et scaffold med tomme `agents` og `skills`; brug `.vscode/.codex/agents/registry.yaml` til den aktive agent-registry.
- Aeldre maj-rapporter beskriver `.agents/` som tom eller ufuldstaendig. De er historiske snapshots, ikke aktuel runtime-certificering.
- QA-rapporten fra 2026-06-07 er ogsaa et snapshot. Dens konklusion om at `.vscode/.codex/` er aktiv runtime er stadig gyldig, men enkelte Git/vendor-detaljer kan vaere overhalet af senere commits og lokal state.
- `HEAD` viser aktuelt `.agents/vendor/mattpocock-skills` som normal Git tree, ikke gitlink. Der findes dog untracked vendorindhold under `.agents/vendor/mattpocock-skills/skills-main/`, som skal haandteres i et separat cleanup-spor.
- Worktree indeholder allerede uncommitted audit-/Brain-state. Bevar det og laes diff foer nye edits.

## Operationel Regel

Ved almindelige agent- og skill-opgaver:

1. Laes `AGENTS.md`.
2. Brug `.vscode/.codex/` som aktiv runtime.
3. Brug `.agents/` kun som reference, migrationskilde eller planlagt fremtidig runtime.
4. Aktiver ikke `.agents/`, foer en separat beslutning siger det eksplicit.

