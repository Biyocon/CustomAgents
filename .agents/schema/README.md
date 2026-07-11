# Canonical schemas (`.agents/schema/`)

## Status: definerede + VALIDÉRBARE (ikke-gating) — opdateret 2026-07-10 (PR B schema-modning)

Disse JSON Schema-filer er **canonical schema-definitioner** for det model-agnostiske `.agents/`-lag.
Siden 2026-07-10 er de **validérbare** mod den faktiske canonical data via
`.agents/scripts/validate-schemas.py` — men **ikke gating** (valideringen blokerer ikke commits endnu;
den er opt-in og kan senere kobles på CI).

```bash
uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py
```

### Nuværende conformance (kørt 2026-07-10)
- `.agents/registry.yaml` → **OK** (validerer mod registry.schema.json).
- `.agents/skills/` (79) → **78 OK**, 1 afvigelse (`higgsfield-generate` description > 1024 tegn).
- `.agents/agents/` (28) → **17 OK**, 11 afvigelser (persona-profiler mangler `name` og/eller `source`).

De 11+1 afvigelser er **kendte data-huller** som valideringen nu synliggør — rettelse er separat
conformance-opfølgning (ændring af data, uden for PR B's "kun schema+docs"-scope).

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

## Registry-status (vigtigt for PR B)
- **`.agents/registry.yaml`** = **canonical-kandidat** (target for `registry.schema.json`). Ikke rørt i PR B.
- **`.vscode/.codex/agents/registry.yaml`** = **aktiv runtime** — må **IKKE røres i PR B**; bliver et generation-target senere (PR D/F).
- **`registry.yaml`** (rod) = legacy pointer-manifest, **deprecate-kandidat** — ikke slettet.
- **`.vscode/.codex/registry.yaml`** = tom scaffold, **deprecate-kandidat** — ikke slettet.

## Beslutningsstatus
**Afgjort:** ~~73 vs 33 skills~~ (LØST: .agents = 79 canonical) · ~~name-vs-trigger frontmatter~~ (LØST: alle skills har name) · ~~registry-klarhed~~ (LØST via #2, headers).
**Stadig åbne:** rolle-vs-persona agent-model · system-prompt canonical placering · skills.yaml deprecation/generated · source-library capability-kandidater · Cursor runtime-adapter · Perplexity/orchestrator-governance · vendor-strategi · validate-harness false-positives.

Se `docs/architecture/registry-reconciliation.md` for fuld kontekst.
