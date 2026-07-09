# Arkitektur-Audit: AgentSkills — Custom AI Agent Harness

> **RETTELSE (addendum, 2026-07-09):** Finding B-1 nedenfor (skill-antal-uenighed 29 vs.
> 73 vs. 33 vs. 188) er nu løst — `.vscode/.codex/skills/` blev flyttet permanent ind i
> `.agents/skills/` (79 skills i dag). Se `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`
> og commit `ff2e3907`. Originalt indhold nedenfor bevaret uændret som historik.

**Dato:** 2026-07-01
**Scope:** Hele repoet — runtime-lag (`.vscode/.codex/` vs. `.agents/`), registries,
skill-/agent-optælling, validerings-historik, QA-fund
**Udført af:** Claude (Cowork), baseret på systematisk kryds-reference af README.md,
AGENTS.md, DESIGN.md, docs/agents/*, docs/architecture/*, reports/*, .agents/brain/*,
.agents/registry.yaml, registry.yaml (rod)
**Trigger:** ANMODNING — bruger bad om fuld kodebase-scan og ny PM-dokumentation

**Se også:** `docs/audit/architecture-review-agents-vs-vscode.html` — visuel
arkitektur-sammenligning (modul/interface/dybde/søm-sprog) af `.agents/` vs.
`.vscode/.codex/` med 4 konkrete integrationskandidater og en topanbefaling.

**Opdatering 2026-07-01 (uafhængig QA-krydstjek, "codex"-agent + direkte verificering):**
En uafhængig QA-gennemgang fandt yderligere konkrete fund, som herefter er
bekræftet direkte mod filsystemet (kommandoresultater, ikke antagelser):

- **`.vscode/.codex/scripts/invoke-agent.py` indlæser allerede fra 3 kilder**
  (`Avatar/agents`, `.vscode/.codex/agents/banedanmark`, `.agents/agents`) —
  runtimen er de facto allerede hybrid ved brug, selvom kilderne til sandhed
  (registries) ikke er det. Dette gør #1 mindre risikabelt end antaget: der
  findes allerede et fungerende læse-søm mellem lagene.
- **10 arkiverede agenter optræder stadig i den aktive `agent-roster.json`**
  (37 entries totalt, hvoraf 10 er bekræftet identiske med
  `archive/avatarless-agents/`-listen: bro-inspektoer,
  configuration-manager-project-level, contract-manager-project-level,
  document-manager-project-level, gis-specialist, incident-manager,
  interface-manager-project-level, projekteringsleder,
  si-manager-csm-interoperabilitet, test-manager-project-level). Dette er
  årsagen til at `validate-harness.ps1` rapporterer manglende
  systemprompt-filer — rosteren tæller arkiverede personaer med som aktive.
- **`council-chairman` er fejlplaceret som arkiveret i `.agents/registry.yaml`**
  (listet i samme YAML-blok som de øvrige `archived_reason`-poster), selvom
  `.agents/agents/council-chairman/` findes aktivt med profile.md + skills.yaml.
- **4 Higgsfield-skills findes på disk men i INGEN af de 4 registries**
  (`.agents/skills/higgsfield-generate`, `-marketplace-cards`,
  `-product-photoshoot`, `-soul-id`) — bekræftet fraværende fra samtlige
  `registry.yaml`-filer, ikke kun `.agents/registry.yaml`.
- **Korrektion af tidligere dokumenterede tal:** Avatar-systemprompts er 27
  (ikke 26, som først antaget). `.agents/agents/`-mappepakker: **0 af 28** har
  fuld filpakke (profile.md+skills.yaml+AGENTS.md+avatar.md) — alle 28 har
  præcis profile.md+skills.yaml (2/4), ingen har AGENTS.md eller avatar.md.
  Den tidligere note "kun 1 af 37" i denne audit og i `systemkort.md`/
  `FORBEDRINGSNOTAT.md`/`#6` var en sammenblanding af `.agents/agents/`s
  mappeantal (28) og `.vscode/.codex/`-rosterens entry-antal (37) — rettet.
- **Registry-linjetal ustabile på tværs af to uafhængige gennemgange**
  (222/240/43/613 verificeret direkte lige nu vs. 216/231/35/607 fra den
  uafhængige QA) — endnu et konkret eksempel på Workstream B's pointe:
  metrikker uden ét autoritativt script kan ikke stoles på, selv når begge
  parter "lige har kørt en kommando".

---

## Executive Summary

**Samlet vurdering:** ACCEPTABEL — strukturelt solidt fundament, men med flere
uafklarede P0/P1-modsigelser der skal lukkes før projektet retmæssigt kan kaldes
"konsolideret" eller klar til global promovering.

| Severity | Antal | Åbne | Løst i denne audit |
|---|---|---|---|
| P0 | 4 | 4 | 0 |
| P1 | 6 | 6 | 0 |
| P2 | 4 | 4 | 0 |
| P3 | 0 | 0 | 0 |

*(Opdateret 2026-07-01 efter uafhængig QA-krydstjek: +2 P1 — roster/archive-mismatch, council-chairman-fejlplacering; +1 P2 — uregistrerede Higgsfield-skills)*

**Blokerer release (global promovering, Fase G i KØREPLAN.md):** JA — se P0-findings

---

## Workstream A — Arkitektur & Struktur

| ID | Finding | Fil | Severity | Status |
|---|---|---|---|---|
| A-1 | Runtime-modsigelse: README/AGENTS.md/runtime-status (2026-06-12) siger `.vscode/.codex/` er aktiv; ADR-0002 (2026-06-17, Status: Proposed) og end-of-day-memory-2026-06-17 siger `.agents/` er canonical target. Ingen forklarende overgangsfil. | `README.md`, `AGENTS.md`, `docs/agents/runtime-status-2026-06-12.md`, `docs/architecture/ADR-multi-runtime-agent-system.md`, `docs/agents/end-of-day-memory-2026-06-17.md` | P0 | ÅBEN |
| A-2 | To ikke-synkroniserede `registry.yaml`-filer med samme navn: rod (241 linjer) vs. `.agents/` (223 linjer), næsten uden overlap i skill-sæt | `registry.yaml`, `.agents/registry.yaml` | P0 | ÅBEN |
| A-3 | 36 af 37 mapper i `.agents/agents/` mangler fuld filpakke (profile.md+skills.yaml+AGENTS.md+avatar.md), bekræftet af intern QA-rapport (finding 2, high severity) | `.agents/agents/*` | P1 | ÅBEN |
| A-4 | `registry-reconciliation.md` og `repo-map.md` lister 10 uafklarede beslutninger (skill-tal, name- vs. trigger-frontmatter, role- vs. persona-agenter, manglende Claude/Ollama-adaptere) | `docs/architecture/registry-reconciliation.md`, `docs/architecture/repo-map.md` | P1 | ÅBEN |
| A-5 | 10 arkiverede agenter (fra `archive/avatarless-agents/`) optræder stadig som aktive entries i `.vscode/.codex/agents/agent-roster.json` (37 total, 10 bekræftet arkiv-duplikater) | `.vscode/.codex/agents/agent-roster.json`, `archive/avatarless-agents/` | P1 | ÅBEN |
| A-6 | `council-chairman` listet i arkiv-blokken i `.agents/registry.yaml`, men mappen findes aktivt (`profile.md`+`skills.yaml`) i `.agents/agents/council-chairman/` | `.agents/registry.yaml` (linje ~177), `.agents/agents/council-chairman/` | P1 | ÅBEN |
| A-7 | 4 Higgsfield-skills (`higgsfield-generate`, `-marketplace-cards`, `-product-photoshoot`, `-soul-id`) findes på disk i `.agents/skills/` men er fraværende fra samtlige 4 registry.yaml-filer | `.agents/skills/higgsfield-*`, alle `registry.yaml` | P2 | ÅBEN |
| A-8 | `.vscode/.codex/scripts/invoke-agent.py` indlæser allerede agenter fra 3 kilder (Avatar/agents, .vscode/.codex/agents/banedanmark, .agents/agents) — runtimen er de facto hybrid ved brug, uafhængigt af hvilket lag der formelt er "aktivt" | `.vscode/.codex/scripts/invoke-agent.py` (linje 24-40) | P2 (observation, ikke fejl — men vigtig kontekst for #1) | NOTERET |

**Konklusion:** Arkitekturen er velovervejet i princippet (tre-lags-adskillelse er
sund), men implementeringen har to konkurrerende sandhedskilder som aldrig er
formelt forligt. Dette er den enkeltstående risiko der underminerer flest andre
antagelser i resten af repoet.

---

## Workstream B — Dokumentkvalitet & Metrikker

| ID | Finding | Fil | Severity | Status |
|---|---|---|---|---|
| B-1 | Skill-antal rapporteres forskelligt: 29 (README/AGENTS.md), 73 vs. 33 (registry-reconciliation.md), 188 reelt talte SKILL.md-filer (plus 1101 arkiverede) | `README.md`, `docs/architecture/registry-reconciliation.md`, filsystem | P0 | ÅBEN |
| B-2 | To modstridende `validation_report.md`: ældre (2026-05-06) "3 PASS/2 PARTIAL/4 FAIL", nyere (`.agents/reports/`, 2026-06-17) "69 OK, 0 fejl" — ingen forklaring på forbedring | `reports/validation_report.md` (+ .bak-filer), `.agents/reports/validation_report.md` | P0 | ÅBEN |
| B-3 | README's påstand om "23 manglende avatar-systemprompts" er forældet — faktisk optælling viser 26 eksisterende prompts i `Avatar/agents/` | `README.md`, `AGENTS.md`, `Avatar/agents/*` | P2 | ÅBEN |

**Test-coverage:** Ikke relevant (ingen applikationskode/testsuite i traditionel forstand)
**Typefejl:** N/A
**Filer over 500 linjer:** Ikke undersøgt systematisk i denne audit-runde (kan tilføjes i næste)

**Konklusion:** Metrikkerne i projektets egen dokumentation kan pt. ikke bruges
til at måle reel fremdrift, da de modsiger hinanden internt.

---

## Workstream C — Sikkerhed & Konfiguration

| ID | Finding | Fil | Severity | Status |
|---|---|---|---|---|
| C-1 | Defekt vendor-gitlink uden tilhørende `.gitmodules` | Vendor-reference til mattpocock-skills (jf. QA_2026-06-07_CustomAgents.md) | P1 | ÅBEN |
| C-2 | Tracked temp-fil med API-nøgle-placeholder — bør fjernes/roteres af forsigtighed | Identificeret i QA_2026-06-07_CustomAgents.md, konkret sti bør bekræftes ved oprydning | P2 | ÅBEN |

**Konklusion:** Ingen bekræftet lækket reel hemmelighed, men praksis (tracked
placeholder-nøgler, løse gitlinks) bør strammes op før global promovering til
andre projekter, hvor risikoen for reelle nøgler er højere.

---

## Workstream D — QA & Kryds-verifikation

| ID | Original finding | Verificeret | Konklusion |
|---|---|---|---|
| A-1 | Runtime-modsigelse | JA — bekræftet i 5 uafhængige filer på tværs af to datoer | REEL |
| A-2 | Registry-divergens | JA — filstørrelse og indhold sammenlignet | REEL |
| B-1 | Skill-antal-modsigelse | JA — krydsrefereret mod faktisk filoptælling | REEL |
| B-2 | Validation_report-modsigelse | JA — begge filer eksisterer og læst i fuld | REEL |
| B-3 | Avatar-systemprompt-tal | JA — Avatar/agents/ optalt til 26 | REEL, men lav alvor (kun dokumentationsfejl) |

---

## Handlingsplan

| Finding | Task oprettet | Ansvarlig | Frist |
|---|---|---|---|
| A-1 (P0) | `docs/active/#1-los-runtime-modsigelse.md` | Projektejer + agent | Før Fase B påbegyndes |
| A-2 (P0) | `docs/active/#2-reconciliér-registry.md` | Projektejer + agent | Før Fase B påbegyndes |
| B-1 (P0) | `docs/active/#3-afklar-skill-antal.md` | Agent | Efter A-2 |
| B-2 (P0) | `docs/active/#4-reconciliér-validation-report.md` | Agent | Efter A-1 |
| A-3 (P1) | `docs/active/#6-komplettér-agentmapper.md` | Agent | Efter A-1, A-2 |
| A-4 (P1) | `docs/drafts/#7-udfyld-domaene-skills.md` (delvist relateret) + fremtidig ticket for de resterende 10 punkter | Projektejer + agent | Efter Fase A |
| C-1 (P1) | `docs/drafts/#9-qa-sikkerhedsoprydning.md` | Agent | Kan startes med det samme |
| C-2 (P2) | Del af `docs/drafts/#9-qa-sikkerhedsoprydning.md` | Agent | Kan startes med det samme |
| B-3 (P2) | `docs/drafts/#8-ret-avatar-tal.md` | Agent | Kan startes med det samme |

---

## Gates

- [ ] P0-findings har tasks i `docs/active/` — **opfyldt** (denne leverance)
- [ ] P1-findings har tasks i `docs/drafts/` eller `docs/active/` — **opfyldt** (denne leverance)
- [ ] Executive summary er udfyldt — **opfyldt**
- [ ] `CHANGELOG.md` har entry for denne audit — **opfyldt**
- [ ] Næste audit-dato er aftalt: efter Fase A er lukket (se `KØREPLAN.md`)
