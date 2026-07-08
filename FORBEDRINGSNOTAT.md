# Forbedringsnotat: AgentSkills — Custom AI Agent Harness

**Dato:** 2026-07-01
**Ref:** `systemkort.md` | `docs/architecture/ADR-multi-runtime-agent-system.md` |
`docs/audit/AUDIT-2026-07-01-runtime-og-registry.md`

> Formål: dyb arkitekturkritik mod projektets egen erklærede vision ("model-agnostisk,
> genbrugelig agent-harness, paradigme for alle fremtidige projekter") → konkret
> roadmap. Denne fil er den permanente kritik-log; konkrete tasks lever i
> `docs/active/` og `docs/drafts/`.

---

## 1. Runtime-modsigelsen er projektets største risiko

**Kritik:** To autoritative kilder erklærer to forskellige lag som "sandheden"
(`.vscode/.codex/` vs. `.agents/`) uden nogen fil der dokumenterer overgangen.
Det betyder at enhver ny session — menneskelig eller agent — risikerer at arbejde
i det forkerte lag, duplikere arbejde, eller slette noget der faktisk er i brug.

**Hvorfor det er alvorligt:** Projektets egen vision-sætning siger at "alle [LLM'er]
skal pege mod samme opsætning" — runtime-modsigelsen underminerer dette direkte.
Det er ikke en kosmetisk uoverensstemmelse; det er et strukturelt single-source-of-truth-brud.

**Anbefaling:** Træf en eksplicit, dateret aktiveringsbeslutning (opgraduér ADR-0002
fra "Proposed" til "Accepted" eller "Rejected"), baseret på en frisk sammenligning af
indhold (ikke kun filantal). Se `docs/plans/runtime-konsolidering-plan.md`.

---

## 2. Selvmodsigende metrikker underminerer al anden rapportering

**Kritik:** Skill-antallet er rapporteret som 29 (README), 73 vs. 33
(registry-reconciliation.md), og 188 (faktisk filoptælling). Rolle-antallet for
avatarer er rapporteret som "23 mangler" men faktisk optælling viser 26 til stede.
To validerings-rapporter modsiger hinanden fuldstændigt (3 PASS/2 PARTIAL/4 FAIL vs.
69 OK/0 fejl) uden forklaring.

**Hvorfor det er alvorligt:** Når tal ikke kan stoles på, kan intet "kendt mangler"-
udsagn i README eller AGENTS.md tages for pålydende. Dette gør det umuligt at måle
reel fremdrift — hvilket direkte modarbejder projektets eget krav om
"verificerbare succeskriterier" (Karpathy-princip #5 i README).

**Anbefaling:** Ét script (`scripts/Validate-AgentHarness.ps1` eller
`.agents/scripts/validate-harness.ps1` — vælg ÉT efter runtime-beslutningen) bliver
eneste kilde til disse tal. Alle dokumenter refererer til scriptets output-dato,
aldrig til et hardkodet tal.

---

## 3. To ikke-synkroniserede registries med samme filnavn

**Kritik:** `registry.yaml` (rod) og `.agents/registry.yaml` er reelt forskellige
filer med næsten intet overlap. Et navn der antyder "central konfiguration" i to
forskellige, divergerende udgaver er en klassisk kilde til stille fejl (nogen
redigerer den ene, forventer effekt i den anden).

**Anbefaling:** Reconciliér til én fil, eller omdøb tydeligt (fx `registry.root.yaml`
vs. `registry.agents.yaml`) hvis begge reelt skal bestå i en overgangsperiode.

---

## 4. 36 af 37 agentmapper i `.agents/agents/` er ufuldstændige

**Kritik:** README fremhæver `.agents/` som det fremtidige, rigere lag, men i
praksis mangler næsten alle mapper der den fulde filpakke (profile.md, skills.yaml,
AGENTS.md, avatar.md) som QA-rapporten selv definerer som "komplet". Kun 1 mappe
opfylder kravet. Dette betyder at "rigere indhold" (jf. linjetal i README-analysen)
dækker over strukturel ufuldstændighed.

**Anbefaling:** Behandl dette som en kvantificerbar backlog (36 tasks eller én
batch-task med tjekliste), ikke som en løs observation. Se
`docs/active/#6-komplettér-agentmapper.md`.

---

## 5. Domænedybde er ujævn og optimistisk fremstillet

**Kritik:** 6 domæne-skills er FORELØBIG (tom struktur), og rolledækningen for
Bro/Anlæg (0%) og Trafik/Drift (10%) er markant lavere end de øvrige områder,
uden at dette fremgår tydeligt i README's "Kendte mangler"-tabel (som fokuserer på
avatarer og agenter, ikke domænedækning).

**Anbefaling:** Tilføj domænedækning som en eksplicit KPI i `KØREPLAN.md`
(Fase E), ikke kun i en isoleret audit-fil fra maj.

---

## 6. Dokumentationssystemet mangler et granulært task-lag

**Kritik:** `docs/agents/issue-tracker.md` og `triage-labels.md` indeholder kun
procesbeskrivelser, ingen konkrete issues. End-of-day-memory-filerne fanger
statusøjebliksbilleder, men ingen fil giver et samlet, filtrerbart overblik over
"hvad er åbent, hvem/hvad blokerer det, og hvornår er det done" med målbare
acceptkriterier.

**Anbefaling:** Dette er præcis hvad `docs/active/`, `docs/drafts/`, `docs/done/`
task-livscyklussen (introduceret 2026-07-01, se `KØREPLAN.md`) løser. Se det som
den strukturelle rettelse af denne kritik, ikke en ekstra proces oveni de
eksisterende rapporter.

---

## Samlet roadmap (kritik → handling)

| # | Kritikpunkt | Task | Prioritet |
|---|---|---|---|
| 1 | Runtime-modsigelse | `docs/active/#1-los-runtime-modsigelse.md` | P0 |
| 2 | Registry-divergens | `docs/active/#2-reconciliér-registry.md` | P0 |
| 3 | Selvmodsigende metrikker (skills, validation) | `docs/active/#3-afklar-skill-antal.md`, `docs/active/#4-reconciliér-validation-report.md` | P0/P1 |
| 4 | Ufuldstændige agentmapper | `docs/active/#6-komplettér-agentmapper.md` | P1 |
| 5 | Domænedybde/rolledækning | `docs/drafts/#10-forbedr-rolledaekning.md` | P2 |
| 6 | Manglende task-lag | Løst strukturelt af nyt PM-system (denne leverance) | — |

Se `DEPS.md` for rækkefølge og kritisk sti.
