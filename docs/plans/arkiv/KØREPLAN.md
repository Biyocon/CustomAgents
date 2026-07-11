# KØREPLAN: AgentSkills — Custom AI Agent Harness — Implementeringsplan

> **⚠️ ARKIVERET 2026-07-11 — historisk dokument, vedligeholdes ikke.**
> Fase-planen (A–G) er overhalet af den fuldførte ADR-multi-runtime-roadmap (PR A–F, 2026-07-11).
> **Aktuel sandhed:** `primer.md` + `docs/architecture/ADR-multi-runtime-agent-system.md`.
> Bevaret som historik; læs ikke som gældende plan.

> Den sekventielle udførelsesplan. Svarer på "hvad gør vi nu, og i hvilken rækkefølge?"
> Hvorfor'et lever i `PROJEKT_PLAN.md`. Læs kun den relevante fase/sprint ved
> sessionstart — aldrig hele filen. `primer.md` er kondensatet der peger hertil.

---

## STATUS PR. 2026-07-01 (autoritativ)

- **Nuværende fase:** Fase A — Runtime- og registry-konsolidering
- **Nuværende sprint:** A-1
- **Senest lukket:** — (dette er baseline for det nye PM-system)
- **Næste op:** A-1 (løs runtime-modsigelsen), parallelt A-2 (registry-reconciliation)

Status-signatur: ✅ DONE · ⏳ I GANG · ⚠️ PARTIEL (kode findes, ikke ende-til-ende) · ⬜ IKKE STARTET

> En sprint er kun ✅ når: kode/dokument findes på disk **og** er krydstjekket mod
> mindst én anden kilde **og** er verificeret af et script eller en anden agent
> **og** stien er koblet ind i registry/README. "Filen findes" ≠ "done" — det har
> selve dette projekts historik bevist (jf. de to modstridende validation_reports).

---

## Overblik: Faser

| Fase | Tema | Sprints | Status |
|---|---|---|---|
| A | Runtime- og registry-konsolidering | A-1 til A-3 | ⏳ |
| B | Metrik-sandhed (skills, validering) | B-1 til B-2 | ⬜ |
| C | Agent- og avatar-komplettering | C-1 til C-3 | ⬜ |
| D | Domæne-skills indhold | D-1 til D-2 | ⬜ |
| E | Rolledækning (Bro/Anlæg, Trafik/Drift) | E-1 til E-2 | ⬜ |
| F | Sikkerheds-/QA-oprydning | F-1 til F-2 | ⬜ |
| G | Global promovering til skabelon | G-1 | ⬜ |

---

## FASE A: Runtime- og registry-konsolidering

**Mål:** Fjern den P0-modsigelse mellem `.vscode/.codex/` og `.agents/`, og
reconciliér de to `registry.yaml`-filer, så der findes ét ubestrideligt svar på
"hvor er sandheden".
**Blokeret af:** _(ingen — første fase)_
**Blokerer:** Fase B, C, D, E, F, G (alt andet arbejde risikerer at lande i det forkerte lag før dette er løst)

### Sprint A-1 — Løs runtime-modsigelsen [⏳]

**Mål:** Én formel, dateret beslutning: enten opgradér ADR-0002 til "Accepted"
(`.agents/` bliver canonical, `.vscode/.codex/` udfases planmæssigt), eller
"Rejected" (`.vscode/.codex/` forbliver aktiv, ADR-0002 arkiveres med begrundelse).

**Primære berørte områder:**
- `docs/architecture/ADR-multi-runtime-agent-system.md` — status opdateres
- `README.md`, `AGENTS.md`, `docs/agents/runtime-status-2026-06-12.md` — opdateres til at matche beslutningen
- `systemkort.md` Layer 2 — opdateres når beslutningen er taget

**Tasks:**
- [ ] A-1.1 Sammenlign `.vscode/.codex/` og `.agents/` indholdsmæssigt (ikke kun filantal) — se `docs/plans/runtime-konsolidering-plan.md`
- [ ] A-1.2 Træf beslutning og opdatér ADR-0002-status
- [ ] A-1.3 Opdatér alle modstridende dokumenter til at pege samme vej

**Acceptkriterier:**
- Ingen fil i repoet modsiger en anden om hvilken runtime der er aktiv
- ADR-0002 har status "Accepted" eller "Rejected", ikke "Proposed"

**Verifikation:** Grep for ".vscode/.codex" og ".agents/" på tværs af README, AGENTS.md, ADR'er — alle skal være konsistente

---

### Sprint A-2 — Reconciliér `registry.yaml` [⬜]

**Mål:** Én autoritativ registry, eller to tydeligt adskilte og eksplicit begrundede.

**Tasks:**
- [ ] A-2.1 Diff `registry.yaml` (rod) mod `.agents/registry.yaml`
- [ ] A-2.2 Beslut: mergen til én fil, eller omdøb begge til selvforklarende navne
- [ ] A-2.3 Opdatér alle scripts der læser fra registry (`Export-Registry.ps1`, `generate-agent-index.ps1`)

**Acceptkriterier:**
- Kun én fil hedder `registry.yaml`, eller begge filer har navne der gør deres formål utvetydigt
- Alle scripts der bruger registry kører fejlfrit mod den/de reconcilierede fil(er)

**Verifikation:** Kør `Validate-AgentHarness.ps1` / `validate-harness.ps1` (vælg efter A-1-beslutning) uden fejl

---

### Sprint A-3 — Opdatér systemkort og luk runtime-audit [⬜]

**Tasks:**
- [ ] A-3.1 Opdatér `systemkort.md` Layer 2 til ét ✅
- [ ] A-3.2 Luk `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` findings A-1/A-2 som LØST

**Acceptkriterier:**
- `systemkort.md` viser ingen ⚠️-markeringer for runtime-laget

**Fase-gate:** Fase B-F må ikke betragtes som "sikkert arbejde" før Fase A er ✅ —
ellers risikerer nyt arbejde at lande i det lag der senere nedlægges.

---

## FASE B: Metrik-sandhed

**Mål:** Ét script bliver eneste kilde til skill-antal, agent-antal og
valideringsstatus. Ingen hardkodede tal i README/AGENTS.md fremover.
**Blokeret af:** Fase A (registry skal være reconcilieret først)
**Blokerer:** Fase C, D, E (deres "done"-kriterier bruger disse tal)

| Sprint | Opgave | Status | Acceptkriterie |
|---|---|---|---|
| B-1 | Afklar reelt skill-antal (29 vs. 73 vs. 33 vs. 188) | ⬜ | Ét script udskriver ét tal, dokumenteret i `docs/active/#3` |
| B-2 | Reconciliér de to modstridende validation_reports | ⬜ | `docs/active/#4` done, kun én validation_report-fil er "aktuel" |

**Fase-gate:** Én kommando (`validate-harness.ps1` e.l.) giver samme svar hver gang den køres.

---

## FASE C: Agent- og avatar-komplettering

**Mål:** Alle 14 Banedanmark-subagenter har fuld status (ikke FORELØBIG), og
`.agents/agents/`-mappernes filpakke er komplet.
**Blokeret af:** Fase A, B

| Sprint | Opgave | Status | Acceptkriterie |
|---|---|---|---|
| C-1 | Komplettér 4 FORELØBIG subagenter (udbudskonsulent, projektleder, byggeleder-tilsyn, interface-manager) | ⬜ | Alle 4 har profile.md med kildemateriale, ikke placeholder |
| C-2 | Komplettér de resterende 36 agentmapper i `.agents/agents/` | ⬜ | Hver mappe har profile.md + skills.yaml + AGENTS.md + avatar.md |
| C-3 | Ret avatar-systemprompt-optælling i README/AGENTS.md (26 findes, ikke "23 mangler") | ⬜ | Tallet i dokumentationen matcher faktisk filoptælling |

---

## FASE D: Domæne-skills indhold

**Mål:** De 6 FORELØBIG domæne-skills har reelt indhold.
**Blokeret af:** Fase A

| Sprint | Opgave | Status | Acceptkriterie |
|---|---|---|---|
| D-1 | Udfyld banebyg, bdk-brand-governance, bdk-gdpr-praksis, bdk-legal-mapping | ⬜ | Hver SKILL.md har reelt trigger-scope + indhold, ikke placeholder |
| D-2 | Udfyld shared-docx, shared-quality | ⬜ | Samme som ovenfor |

---

## FASE E: Rolledækning

**Mål:** Løft dækningen for Bro/Anlæg (0%) og Trafik/Drift (10%) markant.
**Blokeret af:** Fase C

| Sprint | Opgave | Status | Acceptkriterie |
|---|---|---|---|
| E-1 | Kildemateriale-indsamling for Bro/Anlæg | ⬜ | Mindst 1 ny/opdateret agentprofil med reel fagkilde |
| E-2 | Kildemateriale-indsamling for Trafik/Drift | ⬜ | Samme |

---

## FASE F: Sikkerheds-/QA-oprydning

**Mål:** Luk QA_2026-06-07-findings.
**Blokeret af:** _(ingen — kan køre parallelt med alt andet)_

| Sprint | Opgave | Status | Acceptkriterie |
|---|---|---|---|
| F-1 | Ret defekt vendor-gitlink / tilføj `.gitmodules` | ⬜ | `git submodule status` fejler ikke |
| F-2 | Fjern/erstat tracked temp-fil med API-nøgle-placeholder | ⬜ | Ingen nøgle-lignende streng i tracked filer (grep-verificeret) |

---

## FASE G: Global promovering

**Mål:** Flyt færdigt harness til `C:\Users\Biyocon` som genanvendelig skabelon
(README's eget langsigtede mål).
**Blokeret af:** Fase A–F (alt skal være konsistent og komplet før promovering)

| Sprint | Opgave | Status | Acceptkriterie |
|---|---|---|---|
| G-1 | Kopiér reconcilieret harness til global sti + skriv runbook | ⬜ | `.agents/brain/runbooks/how-to-promote-project-harness-to-global.md` fulgt og verificeret |

---

## Afhængighedsgraf (kritisk sti)

```
Fase A (runtime + registry)
   → Fase B (metrik-sandhed)
      → Fase C (agent/avatar-komplettering) ──┐
      → Fase D (domæne-skills)                ├─→ Fase G (global promovering)
         → Fase E (rolledækning, efter C)      │
Fase F (sikkerhed/QA) — parallel, ingen afhængighed ─┘
```

---

## Sammendrag-statistik

- Total faser: 7 (A–G)
- Done: 0 · I gang: 1 (A) · Ikke startet: 6
- Se `DEPS.md` for task-niveau-afhængigheder inden for hver fase.
