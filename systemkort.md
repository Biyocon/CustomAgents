# AgentSkills — Custom AI Agent Harness — System Map (opdateret 2026-07-01)

> Autoritativ arkitekturreference. Læs denne FØR arkitekturbeslutninger træffes.
> Hvert komponent bærer en reel runtime-status (✅ aktiv / ⚠️ delvis-kun-kode / ⬜ planlagt),
> ikke en ambition. Denne fil erstatter ikke `docs/architecture/repo-map.md` — den
> er det korte, autoritative resumé; repo-map.md har den fulde detalje.

---

## Core-distinktion: RUNTIME-RETNINGEN ER AFGJORT (2026-07-09) ✅

**Den tidligere P0-modsigelse er løst.** `docs/architecture/ADR-multi-runtime-agent-system.md`
er nu **Accepted** (2026-07-09, se `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`).

| Lag | Rolle efter beslutningen |
|---|---|
| `.agents/` | **Canonical source of truth** — det model-agnostiske kildelag. Skill-laget (`.agents/skills/`) er allerede canonical efter flytning 2026-07-09. |
| `.vscode/.codex/` | **Transitional aktiv runtime** for agenter/registry/Brain — skal på sigt genereres fra `.agents/` via PR B–F. |

**Hybrid-tilstand (vigtig):** Skills er flyttet til `.agents/skills/` og er canonical nu.
Agenter, roster, registry og Brain kører fortsat fra `.vscode/.codex/` indtil den formelle
aktivering (`docs/qa/RELEASE-runtime-activation-gate.md`). Rør ikke agent/registry/Brain-laget
i `.vscode/.codex/` manuelt før aktivering — sync-garantien mistes ellers.

**Historik:** Modstriden var åben som P0 (`docs/active/#1-los-runtime-modsigelse.md`,
`docs/audit/AUDIT-2026-07-01-runtime-og-registry.md`) fra 2026-06-17 (ADR "Proposed") til
2026-07-09 (ADR "Accepted"). Ticket #1 forbliver `active` for de resterende sync-punkter
(README/AGENTS.md/systemkort er opdateret; RELEASE-gaten afventer selve aktiveringen).

---

## Andre kerne-distinktioner

- **Vendor vs. Kurateret vs. Domæne** (fra `README.md`): `.agents/vendor/` = read-only
  open source. `.agents/skills/` = udvalgte/tilpassede skills. `.agents/agents/` +
  `.agents/brain/` = Banedanmark-specifik domæneviden. Redigér aldrig vendor direkte.
- **Agent-rolle vs. Avatar-persona:** De 14 Banedanmark-subagenter (`.agents/agents/`)
  er *faglige roller* med skills.yaml. Avatar-mappen indeholder 26+ *visuelle personaer*
  med systemprompts — delvist overlappende, delvist separate (sport/pædagogik/sundhed-avatarer
  har intet Banedanmark-fagligt modstykke).
- **Registry (root) vs. Registry (.agents):** `registry.yaml` (repo-rod) og
  `.agents/registry.yaml` er to **forskellige, ikke-synkroniserede** filer (241 vs. 223
  linjer, forskellige skill-sæt, næsten uden overlap), selvom navnet antyder samme kilde.
  Se `docs/active/#2-reconciliér-registry.md`.

---

## Layer overview

```
┌─────────────────────────────────────────────────────────────┐
│  Instruktionslag:  AGENTS.md (eneste fælles instruksfil)     │
│  Operationelt lag: PROMPT.md, model-adapters/                │
├─────────────────────────────────────────────────────────────┤
│  Runtime A (påstået aktiv):   .vscode/.codex/                │
│  Runtime B (påstået canonical): .agents/         ← MODSTRID  │
├─────────────────────────────────────────────────────────────┤
│  Agent-lag:    14 Banedanmark-subagenter + 26+ avatar-personaer│
│  Skill-lag:    vendor / kurateret / domæne (antal uafklaret) │
│  Brain-lag:    context, glossary, assumptions, open-questions,│
│                decisions (ADR), maps, memory, runbooks       │
│  Registry-lag: registry.yaml (rod) ≠ .agents/registry.yaml   │
│  Automation:   scripts/*.ps1 (rod) + .agents/scripts/*.ps1   │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Instruktionslag

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| `AGENTS.md` | Eneste fælles instruktionsfil for alle LLM'er (Codex, Kimi, Qwen, Gemini) | ✅ |
| `PROMPT.md` | Operationelle prompts til Codex/Kimi i VS Code | ✅ |
| `.agents/model-adapters/*.md` | Model-specifikke noter (codex, kimi, qwen-code, gemini-code) | ✅ |

---

## Layer 2: Runtime-lag (retningen afgjort 2026-07-09)

| Komponent | Rolle | Runtime-status |
|---|---|---|
| `.agents/` | **Canonical source of truth** (ADR-multi-runtime **Accepted** 2026-07-09). Skill-laget (`.agents/skills/`, 79 skills) er canonical nu efter flytning. | ✅ Canonical (skills aktive; agenter/registry/Brain modnes via PR B–F) |
| `.vscode/.codex/` | **Transitional aktiv runtime** for agenter/registry/Brain, indtil generatorer findes. | ✅ Aktiv runtime (transitional, planlagt genereret fra `.agents/`) |

**Retningen er ét entydigt ✅:** `.agents/` er canonical. Den fulde aktivering (agenter/registry/Brain)
afventer PR B–F og `docs/qa/RELEASE-runtime-activation-gate.md`. Se
`docs/plans/runtime-konsolidering-plan.md` for løsningsdesignet.

---

## Layer 3: Agent-lag

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| 14 Banedanmark-subagenter (`.agents/agents/` + `.vscode/.codex/agents/`) | Faglige roller (Interface Manager, Udbudskonsulent, Projektleder, m.fl.) | ⚠️ 4/14 FORELØBIG (udbudskonsulent, projektleder, byggeleder-tilsyn, interface-manager); 10/14 DRAFT |
28 mapper i `.agents/agents/` | Non-Banedanmark personaer (Yunus, William, Ahmad, Qanac, osv.) | ⚠️ 0 af 28 mapper har fuld filpakke — alle har profile.md+skills.yaml (2/4), ingen har AGENTS.md/avatar.md (verificeret 2026-07-01, korrigerer tidligere "1 af 37") |
| `Avatar/` (26+ personaer) | Visuelle profiler + systemprompts | ⚠️ README/AGENTS.md's påstand om "23 mangler" er forældet — faktisk optælling viser 27 eksisterende systemprompts i `Avatar/agents/` (verificeret direkte 2026-07-01). Tallet skal rettes, ikke opgaverne genskabes. |

---

## Layer 4: Skill-lag

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| `.agents/vendor/mattpocock-skills`, `.agents/vendor/andrej-karpathy-skills` | Read-only upstream-referencer | ✅ tracked som almindeligt vendored indhold |
| `.agents/skills/` (kurateret) | Tilpassede skills, model-agnostiske | ⚠️ Skill-antal er internt modstridende: README/AGENTS.md siger 29, `docs/architecture/registry-reconciliation.md` siger 73 vs. 33, faktisk filoptælling giver 188 relevante SKILL.md på tværs af tre lokationer (plus 1101 arkiverede). **Intet af disse tal er pt. verificeret som "det rigtige".** |
| 6 domæne-skills (banebyg, bdk-brand-governance, bdk-gdpr-praksis, bdk-legal-mapping, shared-docx, shared-quality) | Banedanmark-specifik fagviden | ⬜ Struktur oprettet, indhold mangler (FORELØBIG) |

---

## Layer 5: Brain-lag (`.agents/brain/`)

| Komponent | Rolle | Runtime-status |
|---|---|---|
| `context.md` | Stabil projektkontekst | ✅ |
| `glossary.md` | Domænesprog/forkortelser | ✅ |
| `assumptions.md` | Ikke-verificerede antagelser | ✅ men indhold bør krydstjekkes mod denne systemkort-fils fund |
| `open-questions.md` | Uafklarede forhold | ⚠️ 11 åbne spørgsmål, inkl. hvornår `.vscode/.codex/` migreres fuldt til `.agents/` — direkte relateret til P0-modstriden ovenfor |
| `decisions/ADR-*.md` | Arkitekturbeslutninger | ⚠️ ADR-0002 (multi-runtime) har status "Proposed" — ikke besluttet |
| `maps/agent-map.md`, `maps/skill-map.md` | Relationer/trigger-scope | ✅ |
| `runbooks/*.md` | Driftsguides | ✅ |

---

## Layer 6: Registry & automation

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| `registry.yaml` (repo-rod) | Central konfiguration — 241 linjer | ⚠️ Diverget fra `.agents/registry.yaml` |
| `.agents/registry.yaml` | Central konfiguration — 223 linjer | ⚠️ Diverget fra rod-versionen — næsten uden overlap i skill-sæt |
| `scripts/*.ps1` (rod) | Activate-Agent, Export-Registry, Invoke-Council, New-AgentProfile, Sync-Skills, Validate-AgentHarness | ✅ |
| `.agents/scripts/*.ps1` | audit-harness, install-skills, generate-agent-index, validate-harness | ✅ (kun beregnet til `.agents/`-laget) |

---

## Kendte QA/sikkerhedsfund (kræver handling)

- **(2026-07-01, uafhængig QA-krydstjek)** `.vscode/.codex/scripts/invoke-agent.py` indlæser allerede fra 3 kilder (Avatar/agents, .vscode/.codex/agents/banedanmark, .agents/agents) — runtimen er de facto hybrid ved brug.
- **(2026-07-01)** 10 arkiverede agenter optræder stadig i den aktive `agent-roster.json` (37 total, 10 arkiv-duplikater) — se `docs/active/#11`.
- **(2026-07-01)** `council-chairman` fejlplaceret som arkiveret i `.agents/registry.yaml` selvom mappen er aktiv.
- **(2026-07-01)** 4 Higgsfield-skills findes på disk men i ingen registry.
- Defekt vendor-gitlink uden tilhørende `.gitmodules` (QA_2026-06-07, finding).
- Tracked temp-fil med API-nøgle-placeholder — bør fjernes/roteres af forsigtighed
  selvom det "kun" er en placeholder (QA_2026-06-07, finding).
- To versioner af `validation_report.md` med modstridende konklusioner: ældre
  (2026-05-06) viser "3 PASS/2 PARTIAL/4 FAIL", nyere (`.agents/reports/`, 2026-06-17)
  viser "69 OK, 0 fejl" — uden forklaring på forbedringen.
- Rolledækning (AUDIT_2026-05-06_Banedanmark_Roles.md): ca. 65% samlet; Bro og Anlæg
  0%, Trafik og Drift 10%.

---

## Seneste tilføjelser

- 2026-07-01: Denne systemkort.md oprettet som del af nyt PM-dokumentationssystem
  (kombination af `docs/kilde/docs` task-skabeloner og `docs/kilde/project-docs`
  hukommelsesskabeloner).

## Planlagte udvidelser

- Når `docs/active/#1-los-runtime-modsigelse.md` er done: opdatér Layer 2-tabellen
  til at vise ÉN ✅ runtime i stedet for to ⚠️.
