# AGENTS.md

## Runtime status (current: 2026-07-11 — PR F-aktivering gennemført)

- **CANONICAL source of truth:** `.agents/` (ADR-multi-runtime Accepted 2026-07-09; roadmap PR A–F fuldført 2026-07-11)
- **Aktiv runtime:** `.vscode/.codex/` — agents-laget (registry + rolleagenter) **GENERERES** nu fra canonical af `.agents/scripts/generate-runtime.py`; håndredigér aldrig genererede filer. Gate: `docs/qa/RELEASE-runtime-activation-gate.md` (GODKENDT). Sync-verifikation: `uv run --with pyyaml python .agents/scripts/generate-runtime.py --check` (exit 0 = i sync)
- Nye agenter/skills/ændringer laves i `.agents/` og aktiveres via generatoren (`--apply`)
- **Gating (2026-07-12):** pre-commit-hook (`.githooks/pre-commit`; aktivér med `git config core.hooksPath .githooks`) + CI (`.github/workflows/validate.yml`) blokerer commits/push med skema-overtrædelser eller runtime-drift
- `snapshot/local-pc-2026-06-07` er en auditmarkør for tracked Git-state på commit `7626c697afd6b5950cb976b62ee67d97bf35f0ed`; den er ikke en backup af ignored/temp/vendor-filer uden for normal Git-tracking
- Vendor-status: `.agents/vendor/mattpocock-skills` er almindeligt tracked vendored copy, ikke submodule; bevar vendor-indhold som read-only upstream-reference
- `snapshot/local-pc-2026-06-07` er en auditmarkør for tracked Git-state på commit `7626c697afd6b5950cb976b62ee67d97bf35f0ed`; den er ikke en backup af ignored/temp/vendor-filer uden for normal Git-tracking
- Vendor-status: `.agents/vendor/mattpocock-skills` er almindeligt tracked vendored copy, ikke submodule; bevar vendor-indhold som read-only upstream-reference

## Projektets AI-struktur

- Canonical kilde for agenter/skills/registry/brain er `.agents/`
- Aktiv runtime-kerne er `.vscode/.codex/` (agents-laget GENERERET fra canonical, PR F)
- Aktive prompts ligger i `.vscode/.codex/prompts/`
- Aktive projektskills ligger i `.agents/skills/` (flyttet 2026-07-09)
- Aktive subagents ligger i `.vscode/.codex/agents/` (genereret fra `.agents/agents/`)
- Projektets hukommelse er `.agents/brain/` (canonical); `.vscode/.codex/Brain/` er kun en genereret pointer (jf. `docs/architecture/memory-governance.md`)
- Delte hooks ligger i `.vscode/hooks/`
- Klientadaptere ligger i `.vscode/settings/`
- Arkiveret eller upstream materiale ligger i `.vscode/archive/`
- `Kombi/` er referencekatalog og må ikke bruges som aktiv runtime uden en bevidst reaktivering

## Arbejdsregler

- Behandl `.agents/` som canonical kilde til sandhed for agent-konfiguration; `.vscode/.codex/agents/` er genereret output og håndredigeres aldrig
- Brug ikke `.vscode/archive/` som aktiv runtime, medmindre noget bevidst reaktiveres
- Bevar Codex som primær målplatform; Claude/Gemini konfigurationer er kompatibilitetslag
- Kimi, Qwen Code og Gemini Code skal pege mod samme `AGENTS.md`, `.vscode/.codex/prompts/`, `.agents/skills/` (skills flyttet hertil 2026-07-09) og `.vscode/.codex/agents/`
- Opret ikke aktive klientfiler som `CLAUDE.md`, `GEMINI.md`, `CODEX.md` eller `KIMI.md`; brug `AGENTS.md`
- Læs `.vscode/.codex/prompts/master-system.md` ved opsætning af nye agentarbejdsgange
- Læs `primer.md` + `.agents/brain/context.md` ved komplekse eller flertrinsopgaver (runtime-Brain er reduceret til en genereret pointer, post-PR F-oprydning 2026-07-11)
- **Invoke-agent system**: `.vscode/.codex/scripts/invoke-agent.ps1 -l` lister de aktive agenter (kør for aktuelt antal); se `.vscode/.codex/AGENTS.md` for detaljer
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

Projektet bruger single-context Brain-layout under `.agents/brain/` (canonical; runtime-Brain er en genereret pointer siden 2026-07-11). Se `docs/agents/domain.md`.

## Canonical runtime: .agents/ (model-agnostisk harness)

> Denne sektion beskriver ".agents/"-strukturen. Siden PR F-aktiveringen (2026-07-11) er den
> IKKE længere "fremtidig": `.agents/` er canonical, og `.vscode/.codex/agents/` + Brain-pointeren
> genereres derfra. Tabellen nedenfor læses nu som "genereret output" vs. "canonical kilde".

### Overblik

".agents/" er en model-agnostisk agent-harness-struktur der virker paa tvaers af Codex, Kimi, Qwen Code og Gemini Code. Den adskiller aktiv runtime fra IDE-specifik konfiguration og giver:

- **Brain**: Persistent kontekstarkiv (".agents/brain/")
- **Agenter**: Specialiserede AI-roller (".agents/agents/")
- **Skills**: Genanvendelige evner (".agents/skills/")
- **Registry": Central konfigurationsfil (".agents/registry.yaml")
- **Runbooks**: Driftsguides for vedligeholdelse

### Primaer vs. sekundaer runtime

| Aspekt | Aktiv (indtil videre) | Fremtidig (under validering) |
|--------|----------------------|------------------------------|
| Runtime-kerne | ".vscode/.codex/" | ".agents/" |
| Prompts | ".vscode/.codex/prompts/" | ".agents/agents/" + ".agents/skills/" |
| Brain | ".vscode/.codex/Brain/" | ".agents/brain/" |
| Skills | ".vscode/.codex/skills/" | ".agents/skills/" |
| Hooks | ".vscode/hooks/" | ".agents/hooks/" (planlagt) |

### Hvordan vaelges subagents?

1. **Via registry**: ".agents/registry.yaml" lister alle registrerede agenter med deres triggers.
2. **Via agent-map**: ".agents/brain/maps/agent-map.md" viser roller og relationer.
3. **Manuelt**: Brugeren vaelger agent baseret på opgavens domaene.

Nar en agent vaelges, laeser den:
- Sit eget "AGENT.md"-manifest
- Relevante skills fra ".agents/skills/"
- Projektkontekst fra ".agents/brain/context.md"

### Hvordan vaelges skills?

1. **Via skill-map**: ".agents/brain/maps/skill-map.md" viser trigger-scope for hver skill.
2. **Via registry**: ".agents/registry.yaml" lister alle skills med deres anvendelsesomraade.
3. **Automatisk**: Agenter kan referere til skills i deres "afhaengigheder"-sektion.

### Hvordan bruges Brain?

Brain (".agents/brain/") er projektets persistente hukommelse:

- **context.md**: Stabil projektkontekst — laes ved opstart af komplekse opgaver
- **glossary.md**: Domaenesprog og forkortelser — laes naar du moeder ukendte begreber
- **assumptions.md**: Ikke-verificerede antagelser — tjek foer du traeffer beslutninger
- **open-questions.md**: Uafklarede forhold — tilfoej nye spoergsmaal under arbejdet
- **decisions/**: Architecture Decision Records — laes foer arkitekturaendringer
- **runbooks/**: Driftsguides — foelg ved vedligeholdelse

### Arbejdsregler for .agents/

- Behandl ".agents/brain/" som strategisk hukommelse, ikke som aktiv runtime
- Opdater "assumptions.md" naar antagelser verificeres eller afkraeftes
- Stil spoergsmaal i "open-questions.md" naar du finder uafklarede forhold
- Brug runbooks til standardopgaver (tilfoej agent, tilfoej skill, promover harness)
- Skriv paa dansk, medmindre tekniske standarder kraever engelsk

### Bygge-status (opdateret efter Phase 1-15)

| Komponent | Status | Detaljer |
|-----------|--------|----------|
| Brain | ✅ Komplet | 9 filer — kontekst, glossary, antagelser, spørgsmål, ADR, kort, runbooks |
| Registry | ✅ Komplet | `registry.yaml` v1 — agenter, skills, model adapters, scripts |
| Agenter | ✅ Komplet | 47 canonical agenter (28 personaer + 19 Banedanmark-rolleagenter i `.agents/agents/banedanmark/`); dobbeltformatet blev afviklet ved PR F — runtime-visningen genereres. K-verifikation mod FB-PDF'er udført for 5 profiler 2026-07-12 |
| Skills | ✅ Komplet | Kør `scripts/Validate-Harness-Unified.ps1` for aktuelt antal (metrik-linjen "Aktive skills"); alle skills ligger nu i `.agents/skills/` efter flytning 2026-07-09 |
| Model adapters | ✅ Komplet | 7 skema-konforme: codex + claude-code (**active**), kimi/ollama/gemini/cursor/qwen-code (planned) |
| Scripts | ✅ Komplet | 4 PowerShell-scripts — audit, install, generate-index, validate |
| Rapporter | ✅ Komplet | 8 analyse-rapporter + 2 valideringsrapporter |
| Vendor | ✅ Afklaret | andrej-karpathy-skills og mattpocock-skills er tracked vendored/referenceindhold |

### Kendte mangler

- ~~**23 avatarer mangler** — 11 Banedanmark-roller + 12 IQRA-agenter~~ **Rettet 2026-07-10 (ticket #8):** forældet tal. Faktisk optælling: `Avatar/agents/` har **27 systemprompts** og `Avatar/` har **27 avatar-billeder**, og agent-roster.json's 27 entries har alle et avatar-felt (1:1-match). De 10 avatarløse agenter blev arkiveret til `archive/avatarless-agents/` (PR #14) — ikke "manglende". Ingen reelt avatar-hul. (Optælling: `ls Avatar/agents/System_Prompt_Agent_*.md | wc -l` = 27.)
- ~~**4 agenter er FORELØBIG** — `udbudskonsulent`, `projektleder`, `byggeleder-tilsyn`, `interface-manager` — afventer kilde-materiale~~ **Komplettéret 2026-07-10 (ticket #5):** alle 4 opgraderet til DRAFT med profiler (86–101 linjer) grundet i Banedanmark-funktionsbeskrivelser (FB-PDF'er); `udbudskonsulent` har ingen dedikeret FB-PDF og er grundet i IQRA-persona-laget + tilstødende kontraktroller (dokumenteret i profilen).
- ~~**6 domæne-skills er FORELØBIG** — `banebyg`, `bdk-brand-governance`, `bdk-gdpr-praksis`, `bdk-legal-mapping`, `shared-docx`, `shared-quality`~~ **Løst 2026-07-10 (ticket #7):** 5 fik reelt indhold via skills-flytningen (2026-07-09); `banebyg` omskrevet til router-skill der peger på de dedikerede detalje-skills.
- **Vendor-strategi er afklaret** — `.agents/vendor/mattpocock-skills` er vendored copy; fremtidige upstream-opdateringer skal ske i separat vendor-PR

### Migrationstilstand (opdateret 2026-07-11 — FULDFØRT)

> **Runtime-aktiveringen er gennemført:** ADR-multi-runtime = Accepted (2026-07-09), roadmap
> PR A–F fuldført og aktiveret 2026-07-11 (gate GODKENDT). Se ADR-0003 + `docs/qa/RELEASE-runtime-activation-gate.md`.

- **Fase 1 (opbygning):** ✅ FÆRDIG — `.agents/` er strukturelt komplet
- **Fase 2 (validering):** ✅ `scripts/Validate-Harness-Unified.ps1` + `validate-schemas.py` + `generate-runtime.py --check`
- **Fase 3 (aktivering):** ✅ FÆRDIG (PR F, 2026-07-11) — `.vscode/.codex/agents/` + Brain-pointer genereres fra canonical
- **Arbejdsregel:** redigér kun `.agents/`; aktivér med `generate-runtime.py --apply`; bekræft `--check` exit 0. Genererede filer håndredigeres aldrig.
