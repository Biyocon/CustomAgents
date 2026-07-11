# ADR: Multi-runtime VS Code agent system

## Status

**Accepted (2026-07-09)** — besluttet af projektejer (Biyocon) efter 48-agent dybdeaudit
(`docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`). Se `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`
for formel registrering og forholdet til ADR-0002.

**Vigtigt:** "Accepted" gælder retningen (punkt 1-8 i Decision nedenfor), ikke at migrationen er
udført. `.vscode/.codex/` forbliver aktiv runtime indtil PR B-F (se Roadmap) er gennemført —
intet i `.vscode/.codex/` må slettes eller ændres alene på baggrund af denne status-opdatering.

~~Proposed (2026-06-17)~~

## Context

Slutproduktet for dette repo er et **komplet, model-agnostisk agent-system til VS Code**, der kan bruges direkte med flere LLM-runtimes:

- Claude
- Codex
- Kimi
- Ollama
- Gemini / Gemini CLI
- andre lokale/cloud LLM'er

Den nuværende tilstand:

- `.vscode/.codex/` er **aktiv runtime** i dag (eneste lokale kilde til sandhed for drift).
- `.agents/` er et **model-agnostisk reference-/canonical-kandidat-lag** (3-lags-design: vendor / kurateret / domæne; med et `model-adapters/`-lag).

Det centrale problem er **divergens og dobbeltvedligeholdelse** mellem de to lag:

- `.vscode/.codex/` og `.agents/` er i dag **divergerende, ikke spejlede**.
- **Rolle-agenter vs persona-agenter:** `.vscode/.codex/agents/banedanmark/` har ~14 rolle-baserede agenter; `.agents/agents/` har 27 persona-baserede agenter.
- ~~**73 skills vs 29 skills:** `.vscode/.codex/skills/` har ~73 skills; `.agents/skills/` har 29 kuraterede.~~
  **Opdateret 2026-07-09:** Løst i praksis — projektejer flyttede hele `.vscode/.codex/skills/`-indholdet
  til `.agents/skills/` (permanent, native OS-flytning). `.agents/skills/` har nu 79 skills;
  `.vscode/.codex/skills/` har kun `banebyg/` tilbage (bevidst bevaret). Se
  `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md` og commit `ff2e3907`.
- **Flere registries:** root `registry.yaml`, `.agents/registry.yaml`, en tom scaffold `.vscode/.codex/registry.yaml`, og den reelle aktive `.vscode/.codex/agents/registry.yaml`.
- **Adapter-laget er primært dokumentation, ikke generatorer:** `.agents/model-adapters/` indeholder beskrivende noter for codex/kimi/qwen/gemini — der findes ingen Claude- eller Ollama-adapter og ingen export/generate-mekanisme.

PR #9–#14 har ryddet persona/reference-laget:

- 27 avatar-backed agents i normal roster.
- 10 avatarless agents arkiveret i `archive/avatarless-agents/`.
- `hassan-dahir` er avatar-backed og ikke arkiveret.
- Aktiv runtime `.vscode/.codex/**` er hidtil urørt.

## Decision

1. **`.agents/` skal modnes til canonical source of truth** for agenter, skills, prompts og canonical Brain — det model-agnostiske lag, ikke det codex-navngivne runtime-lag.
2. **`.vscode/.codex/` forbliver aktiv runtime midlertidigt** (transitional), så drift ikke afbrydes.
3. **`.vscode/.codex/` skal på sigt genereres eller valideres fra `.agents/`** — runtime-output, ikke selvstændig kilde.
4. **Runtime-adapters skal bygges** for Claude, Codex, Kimi, Ollama og Gemini/Gemini CLI.
5. **Én canonical registry skal etableres senere** (`.agents/registry.yaml`); øvrige registries genereres/valideres fra den.
6. **Runtime-output må ikke blive permanent separat sandhed** — ingen parallel håndvedligehold når generatorer findes.
7. **Memory opdeles i tre kategorier:**
   - canonical memory (varig projektviden: context, glossary, operating-principles, ADR'er)
   - runtime-local working memory (aktiv Brain, session-history)
   - session/audit snapshots (end-of-day, audit-noter)
8. **Migration sker PR-for-PR, ikke big-bang.**

## Consequences

**Positivt:**
- Model-agnostisk system, der virker på tværs af Claude/Codex/Kimi/Ollama/Gemini.
- Mindre dobbeltvedligeholdelse (én kilde → genererede runtimes).
- Bedre portabilitet i VS Code og på tværs af projekter.
- Klarere governance (source vs runtime vs memory vs archive).

**Negativt / forudsætninger:**
- Kræver et canonical schema (agent/skill/registry).
- Kræver generatorer/export-scripts.
- Kræver adapter-dokumentation pr. runtime.
- Kræver registry-reconciliation (de 4 registries → én canonical).

**Risiko:**
- Aktiv runtime (`.vscode/.codex/`) kan brækkes ved for hurtig migration.
- **Materialiseret 2026-07-09 for skills-delen:** Projektejer valgte bevidst at flytte hele
  `.vscode/.codex/skills/` til `.agents/skills/` nu, forud for den planlagte PR-rækkefølge
  (ingen generator/export-script bygget først). Verificeret uden dataskade (fuldt encoding-sweep,
  0 korruption). Risikoen for `.vscode/.codex/agents/` (roller/registry/Brain) er **ikke**
  materialiseret — kun skills-laget er rørt.

**Mitigering:**
- `.vscode/.codex/agents/`, `.vscode/.codex/registry.yaml` og `.vscode/.codex/Brain/` røres
  **stadig ikke** før export/validation-mekanismer findes og en eksplicit aktiveringsbeslutning
  er taget. (Skills-laget er undtaget — se Risiko ovenfor.)
- ~~Reconciliation (73 vs 29 skills, rolle vs persona) afklares før canonicalisering.~~
  Skills-reconciliation er udført (2026-07-09). Rolle-vs-persona-afklaringen for `agents/` er
  fortsat åben.

## Non-goals

- Ingen migration i denne PR.
- Ingen schema i denne PR.
- Ingen adapter-implementation i denne PR.
- Ingen memory commit i denne PR.
- Ingen cleanup.
- Ingen branch deletion.
- Ingen Funktionsbeskrivelser-flytning.

Denne PR er **udelukkende dokumentation** (ADR + repo-map).

## Target model

```text
.agents/  (CANONICAL SOURCE — model-agnostisk)
   │
   │  export/generate + validation (senere PR'er)
   ▼
   ├─> .vscode/.codex/        # generated Codex / VS Code runtime (i dag håndholdt)
   ├─> .claude/ + CLAUDE.md   # generated Claude runtime
   ├─> kimi runtime           # generated Kimi runtime
   ├─> ollama/ Modelfiles     # generated Ollama runtime (SYSTEM baked in)
   └─> gemini/ + GEMINI.md    # generated Gemini / Gemini CLI runtime
```

Princip: canonical (`.agents/`) → genererede runtime-outputs via scripts; adapters beskriver mapping; docs/archive er versioneret; memory/scratch er lokal/delvist ignored.

## Roadmap

PR-sekvens (denne ADR er PR A):

- **PR A — ADR + repo map** (denne PR): fastslår target architecture og kortlægger repoet. Kun dokumentation.
- **PR B — Canonical schema:** ✅ **LEVERET (2026-07-02) + modnet (2026-07-10).** JSON Schema for agent `profile`, `skill`, `registry` (+ archive-entry, runtime-adapter) i `.agents/schema/`. Modning: validérbar via `.agents/scripts/validate-schemas.py`; canonical `.agents/`-lag validerer 0 overtrædelser; status-enum + scope-noter opdateret. Registry-klarhed (4→utvetydige) leveret separat i #2.
- **PR C — Adapter plan:** README + settings-templates pr. runtime (Claude/Codex/Kimi/Ollama/Gemini).
- **PR D — Export/validation scripts:** generér runtime fra canonical; sync-validation; konsolidér de eksisterende script-sæt.
- **PR E — Memory governance:** policy for canonical vs runtime-local vs snapshot; landing af memory-artefakter.
- **PR F — Runtime activation/migration:** generér `.vscode/.codex/` fra canonical; afvikl manuel dobbeltvedligehold. Højeste risiko — kræver rollback-plan og eksplicit aktiveringsbeslutning.
