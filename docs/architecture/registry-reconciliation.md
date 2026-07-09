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
1. **PR B (nu):** definér schemas + denne plan. Ingen data rørt.
2. **Senere:** udvid `.agents/registry.yaml` til canonical-schema (felt-merge fra runtime). Stadig ingen runtime-ændring.
3. **PR D:** export/validation-scripts der *genererer* runtime-registry fra canonical + validerer sync.
4. **PR F:** runtime activation — `.vscode/.codex/` genereres fra canonical; manuel dobbeltvedligehold afvikles; root + scaffold-registry deprecates formelt.

Ingen big-bang. Aktiv runtime brydes ikke før generator + validation findes og en eksplicit aktiveringsbeslutning er taget.

## Afgjorte punkter
- ~~**73 vs 33 skills** — `.vscode/.codex/skills` (73) vs `.agents/skills` (33, incl. 4 Higgsfield). Hvilket sæt er canonical; migreres de 40+ codex-only skills ind?~~
  **Afgjort 2026-07-09:** `.agents/skills` er canonical og har nu 79 skills — hele `.vscode/.codex/skills`-indholdet
  (inkl. de 40+ codex-only skills) er migreret ind (permanent flytning, verificeret uden dataskade).
  `.vscode/.codex/skills` har kun `banebyg/` tilbage. Se `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`, commit `ff2e3907`.

## Open decisions (ikke afgjort)
- **name vs trigger** — 27 skills har `name:`, 6 har `trigger:` uden `name:` (banebyg, bdk-brand-governance, bdk-legal-mapping, bdk-gdpr-praksis, shared-quality, shared-docx). Normalisering er senere migration.
- **role vs persona** — aktiv runtime er rolle-baseret (`.codex/agents/banedanmark/`, 14), `.agents/agents/` er persona-baseret (27). Hvilken er canonical agent-model?
- **system prompt canonical placering** — `profile.md` body (canonical-forslag) vs `Avatar/agents/System_Prompt_Agent_*.md` (dublet). Dedup er senere.
- **skills.yaml deprecation/generated** — fold `skills[]`+`capabilities[]` ind i profile-frontmatter; deprecér/generér `skills.yaml`.
- **source-library capability candidates** — design-artifacts, visual-explainer, deep-research (fra `docs/agents/sources/`). Registreres som `source_prompt_references`, ikke aktive skills.
- **Cursor runtime adapter** — adapter-kandidat (fra `docs/agents/sources/runtimes/cursor.md`).
- **Perplexity / orchestrator governance** — `docs/agents/sources/orchestrators/perplexity-computer.md` informerer skill-loading/subagent/memory/scheduling/confirm-gating-design (PR E).
- **vendor strategy** — `.agents/vendor/mattpocock-skills/skills-main/**` som read-only upstream; track vs gitignore.
- **validation false positives** — `archived_avatarless_agents` flages evt. fejlagtigt af validate-harness.

## Separate senere spor (IKKE PR B)
- **Validation-hygiene:** archived false-positives, stale `project_root` i rapporter, report-output-path.
- **`.claude/settings.json` gitignore-beslutning** (benign lokal Claude Code permissions-config) — separat mikro-beslutning, ikke PR B.
- vendor/temp cleanup, branch cleanup, orphan-branch-beslutning, full-verbatim source-prompt expansion.
- faktisk migration: registry-merge, skill-normalisering, skills.yaml fold-in, System_Prompt-dedup, runtime generation (PR D/F), adapter-impl (PR C), memory-governance (PR E).
