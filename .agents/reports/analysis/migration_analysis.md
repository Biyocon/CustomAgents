# Migration Analysis Report

## Dato
2026-05-06

## Resumé
Migration af 14 Banedanmark-agenter fra `.vscode/.codex/agents/` til `.agents/agents/` er gennemført.

## Kilde
- `.vscode/.codex/agents/agent-roster.json` (1048 linjer, 2 slutposter: `bro-inspektoer`, `gis-specialist`)
- `.vscode/.codex/agents/banedanmark/bd-*.md` (10 draft profiler)

## Target
`.agents/agents/<agent-id>/` med filerne:
- `AGENTS.md` — agent-instruktioner
- `profile.md` — YAML frontmatter + profilbeskrivelse
- `skills.yaml` — skills + capabilities
- `avatar.md` — avatar-placeholder

## Migratede agenter (14)

### Fuld migreret fra draft-profiler (10)
| Agent | Source | Status |
|-------|--------|--------|
| dokumentcontroller | bd-dokumentcontroller | draft |
| fagansvarlig-spor | bd-fagansvarlig-spor | draft |
| ibrugtagning | bd-ibrugtagning | draft |
| kontraktmanager | bd-kontraktmanager | draft |
| kvalitetsspecialist | bd-kvalitetsspecialist | draft |
| miljoekoordinator | bd-miljoekoordinator | draft |
| oekonomi-controller | bd-oekonomi-controller | draft |
| planlaegningskoordinator | bd-planlaegningskoordinator | draft |
| projekteringsleder | bd-projekteringsleder | draft |
| sikkerhedskoordinator | bd-sikkerhedskoordinator | draft |

### Roster-afledt (1)
| Agent | Roster-id | Status |
|-------|-----------|--------|
| interface-manager | interface-manager-project-level | FORELØBIG |

### FORELØBIG — ingen source (3)
| Agent | Bemærkning |
|-------|-----------|
| udbudskonsulent | Ingen `bd-*.md` matcher; afledt fra skill `bbtr-rådgiver-udbud` |
| projektleder | Ingen `bd-*.md` matcher; generisk projektlederprofil |
| byggeleder-tilsyn | Ingen `bd-*.md` matcher; se også `bro-inspektoer` i roster |

## Konsekvenser
- **Ingen kildedata slettet**: `.vscode/.codex/agents/` er bevaret intakt.
- **Draft-status**: Alle 10 draft-agenter bevarer `status: draft` og afventer domæneviden.
- **FORELØBIG agenter**: Kræver senere udbygning når kildeprofiler oprettes.
- **Skill-mapping**: `banebyg-*` skill-prefixer er IKKE tilstede i roster/registry; eksisterende `bbtr-*`/`bdk-*` skills er bevaret som i kildematerialet.

## Næste skridt
1. Indsamle domæneviden til de 10 draft-agenter.
2. Opret kildeprofiler for `udbudskonsulent`, `projektleder`, `byggeleder-tilsyn`.
3. Promovere draft ? active når testprompts og system prompts er valideret.
