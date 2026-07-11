# Registry reconciliation plan

Ledsagedokument til `.agents/schema/` og [ADR-multi-runtime-agent-system.md](ADR-multi-runtime-agent-system.md). **PR B er docs+schema-only og additivt — ingen registry ændres her.**

## Formål
Definere vejen fra det nuværende fragmenterede registry-landskab (4 registries, 3 schemas) til **én canonical registry** med genererede runtime-outputs — uden at bryde den aktive runtime.

## Nuværende registry-landskab

| Registry | Schema/struktur | Rolle | Klassifikation |
|---|---|---|---|
| `registry.yaml` (rod) | `project:` + `agents:` som **pointers** (roster_json, profiles_dir, banedanmark_dir, count) | manifest-af-pointers | **legacy / deprecate-kandidat** (ikke slettet) |
| `.agents/registry.yaml` | `version, agents[]{id,name,role,category}, archived_avatarless_agents[], skills[], brain_paths, vendor_sources, model_adapters, validation_commands` | model-agnostisk roster | **canonical-kandidat** |
| `.vscode/.codex/registry.yaml` | `agents:[]`, `skills:[]` tomme | tom scaffold | **deprecate-kandidat** (ikke slettet) |
| `.vscode/.codex/agents/registry.yaml` | rige entries `{id,name,role,category,accent,status,skills[] inline,capabilities[] inline}` | **aktiv runtime** | **generation-target senere** — må IKKE røres i PR B |

3 forskellige schemas på tværs af de 4 filer.

## Målmodel
- **`.agents/registry.yaml` = canonical kilde** (target for `registry.schema.json`). Udvides senere med felter den aktive runtime har (`accent`, `status`, `source`, inline `capabilities`) — **ikke i PR B**.
- **`.vscode/.codex/agents/registry.yaml` = genereret** fra canonical (PR D/F). Indtil da: aktiv sandhed, urørt.
- **root `registry.yaml` + `.vscode/.codex/registry.yaml` = deprecate** (dokumentér; slet ikke uden ordre).

## Reconciliation-strategi (4 → 1)
1. ~~**PR B (nu):** definér schemas + denne plan. Ingen data rørt.~~ **LEVERET + modnet 2026-07-10:** de 5 schemas findes (2026-07-02), er nu *validérbare* via `.agents/scripts/validate-schemas.py`, og det canonical `.agents/`-lag validerer 100% rent (0 overtrædelser). Se `.agents/schema/README.md`.
2. **Senere:** udvid `.agents/registry.yaml` til canonical-schema (felt-merge fra runtime). Stadig ingen runtime-ændring.
3. ~~**PR D:** export/validation-scripts der *genererer* runtime-registry fra canonical + validerer sync.~~
   **LEVERET 2026-07-11:** `.agents/scripts/generate-runtime.py` (generering til `.agents/build/runtime/<adapter>/`
   + `--check`-driftrapport mod live runtime). Live runtime stadig urørt; aktivering = PR F.
   `--check` kvantificerer også trin 2's felt-merge-rest (12 personaer mangler `accent` i canonical).
4. **PR F:** runtime activation — `.vscode/.codex/` genereres fra canonical; manuel dobbeltvedligehold afvikles; root + scaffold-registry deprecates formelt.

Ingen big-bang. Aktiv runtime brydes ikke før generator + validation findes og en eksplicit aktiveringsbeslutning er taget.

## Afgjorte punkter
- ~~**73 vs 33 skills** — `.vscode/.codex/skills` (73) vs `.agents/skills` (33, incl. 4 Higgsfield). Hvilket sæt er canonical; migreres de 40+ codex-only skills ind?~~
  **Afgjort 2026-07-09:** `.agents/skills` er canonical og har nu 79 skills — hele `.vscode/.codex/skills`-indholdet
  (inkl. de 40+ codex-only skills) er migreret ind (permanent flytning, verificeret uden dataskade).
  `.vscode/.codex/skills` har kun `banebyg/` tilbage. Se `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`, commit `ff2e3907`.

## Registry-klarhed (afgjort 2026-07-09, ticket #2)

De 4 registry-filer er nu **utvetydige**: hver fil har en selv-dokumenterende
header-kommentar der angiver dens rolle og forholdet til de andre. Ingen risikabel
omdøbning eller data-merge (den hører til PR D/F). Roller:

| Fil | Header-markering |
|---|---|
| `.agents/registry.yaml` | **CANONICAL SOURCE OF TRUTH** |
| `.vscode/.codex/agents/registry.yaml` | **AKTIV RUNTIME** (transitional; må ikke håndredigeres som datakilde) |
| `registry.yaml` (rod) | **LEGACY / genereret build-output** (deprecate-kandidat) |
| `.vscode/.codex/registry.yaml` | **TOM SCAFFOLD** (deprecated) |

`scripts/Export-Registry.ps1` emitterer nu også en provenance-header/`_note` i sit
output, så et regenereret rod-registry forbliver selv-dokumenterende.

## Open decisions (ikke afgjort — hver har eksplicit ejer-PR)

> Alle punkter nedenfor er bevidst **udskudt** til en senere PR (ejer = den angivne PR).
> Ingen af dem blokerer #2's registry-klarhed, som er lukket ovenfor.

- ~~**name vs trigger** — 6 skills har `trigger:` uden `name:`. Ejer: PR B/skill-normalisering.~~ **LØST 2026-07-10:** alle 79 skills har nu `name:` (banebyg fik det; øvrige via .codex-versionerne). Verificeret via validate-schemas.py.
- ~~**role vs persona** — rolle-baseret (`.codex/agents/banedanmark/`) vs persona (`.agents/agents/`). Hvilken canonical agent-model? Ejer: PR D/F (runtime-generering).~~
  **AFGJORT 2026-07-11 (brugerbeslutning): BEGGE modeller er canonical.** De 19 Banedanmark-rolleagenter
  (14 `bd-*` + byggeleder-tilsyn/interface-manager/projektleder/udbudskonsulent + interface-manager-banebyg)
  er migreret til `.agents/agents/banedanmark/<id>/profile.md` (skema-konforme, skills/capabilities i
  frontmatter jf. target-kontrakt) og registreret i `.agents/registry.yaml` med `agent_model: role` +
  `roster_exempt: true`. Runtime-kopien i `.vscode/.codex/agents/banedanmark/` er urørt (generation-target,
  PR D/F). 9 afledte runtime-`skills.yaml` var CP1252 og er normaliseret til UTF-8 i canonical.
  **Kendt restpunkt (ejer: PR D sync-validation):** de gamle bd-*-profiler refererer 29 skill-id'er der
  ikke findes i `.agents/skills/` (dangling refs, præeksisterende i runtime-kilden — ikke opfundet væk).
- **system prompt canonical placering** — `profile.md` body vs `Avatar/agents/System_Prompt_Agent_*.md`. Dedup. **Ejer: PR D/F.**
- **skills.yaml deprecation/generated** — fold `skills[]`+`capabilities[]` ind i profile-frontmatter. **Ejer: PR D.**
- **source-library capability candidates** — design-artifacts, visual-explainer, deep-research. **Ejer: PR C (adapter/source-library).**
- ~~**Cursor runtime adapter** — adapter-kandidat. Ejer: PR C.~~ **LEVERET 2026-07-11:** `.agents/model-adapters/cursor.md` (status planned, kandidat), afledt af source-library-referencen.
- **Perplexity / orchestrator governance** — informerer skill-loading/subagent/memory/scheduling. **Ejer: PR E.**
- **vendor strategy** — `.agents/vendor/mattpocock-skills/skills-main/**` track vs gitignore. **Ejer: separat vendor-PR** (foreløbig: tracked, committet 2026-07-09).
- **validation false positives** — `archived_avatarless_agents` flages evt. af validate-harness. **Ejer: validation-hygiene-spor** (council-chairman-delen er allerede løst 2026-07-09).

## Separate senere spor (IKKE PR B)
- **Validation-hygiene:** archived false-positives, stale `project_root` i rapporter, report-output-path.
- **`.claude/settings.json` gitignore-beslutning** (benign lokal Claude Code permissions-config) — separat mikro-beslutning, ikke PR B.
- vendor/temp cleanup, branch cleanup, orphan-branch-beslutning, full-verbatim source-prompt expansion.
- faktisk migration: registry-merge, skill-normalisering, skills.yaml fold-in, System_Prompt-dedup, runtime generation (PR D/F), adapter-impl (PR C), memory-governance (PR E).
