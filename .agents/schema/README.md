# Canonical schemas (`.agents/schema/`)

## Status: definerede + VALIDÉRBARE (ikke-gating) — opdateret 2026-07-10 (PR B schema-modning)

Disse JSON Schema-filer er **canonical schema-definitioner** for det model-agnostiske `.agents/`-lag.
Siden 2026-07-10 er de **validérbare** mod den faktiske canonical data via
`.agents/scripts/validate-schemas.py` — men **ikke gating** (valideringen blokerer ikke commits endnu;
den er opt-in og kan senere kobles på CI).

```bash
uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py
```

### Nuværende conformance (kørt 2026-07-11, post-PR F)
- `.agents/registry.yaml` → **OK**.
- `.agents/skills/` (79) → **79 OK**.
- `.agents/agents/` (47 = 28 personaer + 19 rolleagenter) → **47 OK**.
- `.agents/model-adapters/` (7) → **7 OK**.

**0 skema-overtrædelser i alt.** (De historiske "11+1 afvigelser" fra 2026-07-10-kørslen blev
rettet undervejs i PR C–F-arbejdet; denne sektion var stale indtil 2026-07-11.)

PR B (som tilføjede denne mappe) var **additivt, docs+schema-only**:
- Ingen eksisterende registry, agent, skill eller runtime **data** ændres af PR B.
- Schemaerne beskriver **target-kontrakter** for fremtidig canonicalisering.
- Faktisk migration (registry-merge, skills.yaml fold-in, System_Prompt-dedup) sker **senere i særskilte PRs**.
- Runtime-output (fx `.vscode/.codex/`) skal **senere genereres/valideres fra canonical**, ikke håndvedligeholdes.
- **Åbne beslutninger** (se nedenfor + `docs/architecture/registry-reconciliation.md`) må **ikke** behandles som afgjort.

### Modnet 2026-07-10 (schema-modning)
- Tilføjet `.agents/scripts/validate-schemas.py` (validérbarhed).
- `agent-profile.schema.json`: status-enum udvidet med `draft` (den faktisk anvendte mellemstatus).
- `skill.schema.json`: opdaterede scope-noter (79 skills; name-vs-trigger og 73-vs-33 nu LØST).

## Schema-filer
| Fil | Beskriver |
|---|---|
| `agent-profile.schema.json` | Canonical agent-profil (`.agents/agents/<id>/profile.md` frontmatter + body-kontrakt) |
| `skill.schema.json` | Canonical skill (`.agents/skills/<id>/SKILL.md` frontmatter) |
| `registry.schema.json` | Canonical registry (`.agents/registry.yaml`) |
| `runtime-adapter.schema.json` | Runtime-adapter-beskrivelser (codex/claude/kimi/ollama/gemini/cursor) |
| `archive-entry.schema.json` | Arkiverede/avatarløse agenter (`archive/avatarless-agents/`) |

## Registry-status (opdateret post-PR F + oprydning, 2026-07-11)
- **`.agents/registry.yaml`** = **CANONICAL** (validerer mod registry.schema.json).
- **`.vscode/.codex/agents/registry.yaml`** = **GENERERET** af `generate-runtime.py` — håndredigeres aldrig.
- Rod-registry + tom scaffold = **SLETTET** ved post-PR F-oprydningen (git-historik bevaret).

## Beslutningsstatus (opdateret 2026-07-11)
**Afgjort:** 73-vs-33 skills (79 canonical) · name-vs-trigger · registry-klarhed · rolle-vs-persona
(BEGGE canonical) · Cursor-adapter (planned, leveret PR C) · Perplexity/orchestrator (dispositioneret PR E)
· fence-regex-buggen (fixet; baseline 12 ægte advarsler).
**Stadig åbne:** system-prompt canonical placering + dedup · skills.yaml deprecation/fold-in ·
source-library capability-kandidater · vendor-strategi · validation-hygiene-sporet.

Se `docs/architecture/registry-reconciliation.md` for fuld kontekst.
