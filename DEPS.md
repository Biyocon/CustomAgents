# Dependency Map: AgentSkills — Custom AI Agent Harness
**Opdateret:** 2026-07-01
**Ref:** `KØREPLAN.md` | `docs/active/` | `docs/drafts/`

> Change-impact-systemets hjerne. Opdatér ALTID når en ny task oprettes, en task
> flyttes til `docs/done/`, eller en PRD/KØREPLAN-ændring sker (kør proceduren
> nedenfor). Hvis du ikke kan se konsekvensen af en ændring ved at læse denne fil,
> er filen forældet.

---

## Blokerings-relationer

| Task / Fase | Blokeres af | Blokerer | Note |
|---|---|---|---|
| #1 — Løs runtime-modsigelse | _(ingen)_ | #2, #3, #4, #6, alle Fase B–E-tasks | Roden til alt andet arbejde — se `FORBEDRINGSNOTAT.md` §1 |
| #2 — Reconciliér registry.yaml | #1 (delvist — kan starte parallelt, men skal lande efter runtime-beslutning) | #3, #6 | Scripts der læser registry skal pege på reconcilieret fil |
| #3 — Afklar skill-antal | #1, #2 | #6, #7, Fase B-gate | Kræver ét reconcilieret registry at tælle imod |
| #4 — Reconciliér validation_report | #1 | Fase B-gate | Uafhængig af #2/#3, men samme fase |
| #5 — Komplettér 4 FORELØBIG subagenter | #1 | Fase C-gate | Kan køre parallelt med #6 |
| #6 — Komplettér 36 agentmapper | #1, #2 | Fase C-gate, #10 | Stor batch-task — se `docs/plans/runtime-konsolidering-plan.md` for rækkefølge |
| #7 — Udfyld 6 domæne-skills | #1 | Fase D-gate | Uafhængig af agent-komplettering |
| #8 — Ret avatar-systemprompt-tal | _(ingen)_ | _(ingen)_ | Isoleret dokumentationsrettelse, kan laves når som helst |
| #9 — QA-sikkerhedsoprydning (vendor-gitlink, API-nøgle-placeholder) | _(ingen)_ | _(ingen)_ | Isoleret — bør prioriteres højt trods ingen tekniske afhængigheder (sikkerhed) |
| #10 — Forbedr rolledækning Bro/Anlæg + Trafik/Drift | #5, #6 | Fase E-gate | Kræver at agentstrukturen er komplet før nyt fagindhold giver mening |
| #11 — Ryd op i roster/registry-fejl (arkiv-mismatch, council-chairman, Higgsfield) | #1 | #3 | Fundet ved uafhængig QA-krydstjek 2026-07-01; blokerer #3 fordi skill-/agent-antal ikke kan låses før disse fejl er rettet |

---

## Kritisk sti

**Kritisk sti (minimum tid til "konsolideret harness"):**

```
#1 → #2 → #11 → #3 → #6 → #10 → Fase G (global promovering)
```

**Parallelle spor der ikke er på kritisk sti:** #4 (validation_report), #5 (4
FORELØBIG-agenter kan startes så snart #1 er løst), #7 (domæne-skills), #8
(dokumentationsrettelse), #9 (QA/sikkerhed — bør dog ikke reelt udskydes pga. alvor).

**Estimeret minimumstid:** Afhænger af hvor hurtigt runtime-beslutningen (#1)
kan træffes — dette er et beslutnings-, ikke et implementeringsproblem, og bør
kunne lukkes inden for én arbejdssession givet at researchen allerede foreligger
i `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md`.

---

## Isolerede tasks

- #8 — Ret avatar-systemprompt-tal _(ingen deps, ingen blokerede tasks)_
- #9 — QA-sikkerhedsoprydning _(ingen deps, ingen blokerede tasks — men høj alvor)_
- Dokumentations-opdateringer i sig selv er altid isolerede fra kode-/strukturtasks

---

## Åbne afhængigheder

| Afhængighed | Afventer | Frist |
|---|---|---|
| Fase G (global promovering) | Alle øvrige faser (A–F) skal være ✅ | Ikke fastsat — afhænger af Fase A-beslutning |
| #10 (rolledækning) | Nyt kildemateriale for Bro/Anlæg og Trafik/Drift — ekstern afhængighed, ikke kun intern strukturering | Ikke fastsat |

---

## Change-Impact-procedure

Kør denne procedure ved ENHVER ændring til `PROJEKT_PLAN.md`, `KØREPLAN.md` eller tasks:

```
GIVEN: Ændring [C] til [fil] på [dato]

1. KLASSIFICÉR:
   Type: tilføjelse | fjernelse | modifikation | prioritetsændring
   Omfang: PRD-niveau (PROJEKT_PLAN) | fase-niveau (KØREPLAN) | task-niveau (docs/active|drafts)

2. QUERY DEPS.md (denne fil):
   - Find alle tasks der blokeres af det ændrede
   - Find alle tasks i samme fase/sprint

3. VURDÉR per berørt task:
   - Re-sekvensering nødvendig? (ja/nej + begrundelse)
   - Acceptkriterie skal opdateres? (ja/nej + forslag)
   - Task nu irrelevant? (flyt til docs/drafts/ med note)
   - Ny bloker opstået? (opdatér DEPS-tabellen)

4. OPDATÉR:
   - PROJEKT_PLAN.md (den ændrede sektion)
   - KØREPLAN.md (fase/sprint-status + estimat)
   - Berørte tickets: tilføj [REVIEW: årsag · dato] i ticket-header
   - DEPS.md (nye/fjernede relationer)
   - CHANGELOG.md (entry med alle berørte tasks)

5. RAPPORTÉR:
   "X tasks påvirket. Y tasks kræver review. Z kan fortsætte."
   List [REVIEW]-markerede tickets.
   Angiv hvad der kræver menneskelig beslutning.
```
