# AGENTS.md

## Runtime status (current: 2026-06-12)

Se også `docs/agents/runtime-status-2026-06-12.md` for den aktuelle konsoliderede status. Ældre QA- og valideringsrapporter er historiske snapshots, ikke aktiveringsbeslutninger.

- **Aktiv runtime:** `.vscode/.codex/`
- **Migration/reference:** `.agents/`
- `.agents/` må ikke behandles som aktiv runtime, før der foreligger en ny valideringsrapport og en eksplicit aktiveringsbeslutning
- `snapshot/local-pc-2026-06-07` er en auditmarkør for tracked Git-state på commit `7626c697afd6b5950cb976b62ee67d97bf35f0ed`; den er ikke en backup af ignored/temp/vendor-filer uden for normal Git-tracking
- Vendor-status: `.agents/vendor/mattpocock-skills` er almindeligt tracked vendored copy, ikke submodule; bevar vendor-indhold som read-only upstream-reference

## Projektets AI-struktur

- Aktiv runtime-kerne for dette projekt er `.vscode/.codex/`
- Aktive prompts ligger i `.vscode/.codex/prompts/`
- Aktive projektskills ligger i `.vscode/.codex/skills/`
- Aktive subagents ligger i `.vscode/.codex/agents/`
- Projektets Brain ligger i `.vscode/.codex/Brain/`
- Delte hooks ligger i `.vscode/hooks/`
- Klientadaptere ligger i `.vscode/settings/`
- Arkiveret eller upstream materiale ligger i `.vscode/archive/`
- `Kombi/` er referencekatalog og må ikke bruges som aktiv runtime uden en bevidst reaktivering

## Arbejdsregler

- Behandl `.vscode/.codex/` som eneste lokale kilde til sandhed for agent-konfiguration
- Brug ikke `.vscode/archive/` som aktiv runtime, medmindre noget bevidst reaktiveres
- Bevar Codex som primær målplatform; Claude/Gemini konfigurationer er kompatibilitetslag
- Kimi, Qwen Code og Gemini Code skal pege mod samme `AGENTS.md`, `.vscode/.codex/prompts/`, `.agents/skills/` (skills flyttet hertil 2026-07-09) og `.vscode/.codex/agents/`
- Opret ikke aktive klientfiler som `CLAUDE.md`, `GEMINI.md`, `CODEX.md` eller `KIMI.md`; brug `AGENTS.md`
- Læs `.vscode/.codex/prompts/master-system.md` ved opsætning af nye agentarbejdsgange
- Læs `.vscode/.codex/Brain/AGENTS.md` ved komplekse eller flertrinsopgaver
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

Projektet bruger single-context Brain-layout under `.vscode/.codex/Brain/`. Se `docs/agents/domain.md`.

## Fremtidig runtime: .agents/ (model-agnostisk harness)

> Denne sektion beskriver den nye ".agents/"-struktur som fremtidens model-agnostiske runtime. Strukturen er under opbygning og validering. Indtil videre bevares ".vscode/.codex/" som aktiv runtime.

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
| Agenter | ✅ Komplet | 14 Banedanmark-agenter — alle DRAFT (de 4 tidligere FORELØBIG komplettéret fra FB-PDF'er 2026-07-10, ticket #5) |
| Skills | ✅ Komplet | Kør `scripts/Validate-Harness-Unified.ps1` for aktuelt antal (metrik-linjen "Aktive skills"); alle skills ligger nu i `.agents/skills/` efter flytning 2026-07-09 |
| Model adapters | ✅ Komplet | Codex, Kimi, Qwen Code, Gemini Code |
| Scripts | ✅ Komplet | 4 PowerShell-scripts — audit, install, generate-index, validate |
| Rapporter | ✅ Komplet | 8 analyse-rapporter + 2 valideringsrapporter |
| Vendor | ✅ Afklaret | andrej-karpathy-skills og mattpocock-skills er tracked vendored/referenceindhold |

### Kendte mangler

- ~~**23 avatarer mangler** — 11 Banedanmark-roller + 12 IQRA-agenter~~ **Rettet 2026-07-10 (ticket #8):** forældet tal. Faktisk optælling: `Avatar/agents/` har **27 systemprompts** og `Avatar/` har **27 avatar-billeder**, og agent-roster.json's 27 entries har alle et avatar-felt (1:1-match). De 10 avatarløse agenter blev arkiveret til `archive/avatarless-agents/` (PR #14) — ikke "manglende". Ingen reelt avatar-hul. (Optælling: `ls Avatar/agents/System_Prompt_Agent_*.md | wc -l` = 27.)
- ~~**4 agenter er FORELØBIG** — `udbudskonsulent`, `projektleder`, `byggeleder-tilsyn`, `interface-manager` — afventer kilde-materiale~~ **Komplettéret 2026-07-10 (ticket #5):** alle 4 opgraderet til DRAFT med profiler (86–101 linjer) grundet i Banedanmark-funktionsbeskrivelser (FB-PDF'er); `udbudskonsulent` har ingen dedikeret FB-PDF og er grundet i IQRA-persona-laget + tilstødende kontraktroller (dokumenteret i profilen).
- ~~**6 domæne-skills er FORELØBIG** — `banebyg`, `bdk-brand-governance`, `bdk-gdpr-praksis`, `bdk-legal-mapping`, `shared-docx`, `shared-quality`~~ **Løst 2026-07-10 (ticket #7):** 5 fik reelt indhold via skills-flytningen (2026-07-09); `banebyg` omskrevet til router-skill der peger på de dedikerede detalje-skills.
- **Vendor-strategi er afklaret** — `.agents/vendor/mattpocock-skills` er vendored copy; fremtidige upstream-opdateringer skal ske i separat vendor-PR

### Migrationstilstand (opdateret 2026-07-09)

> **Runtime-retningen er afgjort:** ADR-multi-runtime-agent-system.md er **Accepted** (2026-07-09).
> `.agents/` er canonical source of truth; `.vscode/.codex/` er transitional runtime.
> Se `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`.

- **Fase 1 (opbygning):** ✅ FÆRDIG — `.agents/` er strukturelt komplet
- **Fase 2 (validering):** kør `scripts/Validate-Harness-Unified.ps1` (afløste de tre gamle scripts)
- **Fase 3 (aktivering):** 🔄 DELVIST — skills er flyttet til `.agents/skills/` (canonical nu); agenter/registry/Brain kører fortsat fra `.vscode/.codex/` indtil generatorer (PR B–F) findes, jf. `docs/qa/RELEASE-runtime-activation-gate.md`
- **Hybrid-tilstand:** skill-laget = `.agents/`; agent/registry/Brain-runtime = `.vscode/.codex/`. Rør ikke agent/registry/Brain-laget manuelt før den formelle aktivering — dokumentér altid hvilken sti du bruger.
