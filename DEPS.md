# Dependency Map: AgentSkills — Custom AI Agent Harness
**Opdateret:** 2026-07-11 (post-PR F + oprydning)
**Ref:** `primer.md` | `docs/done/` | `docs/drafts/`

> Change-impact-systemets hjerne. Opdatér ALTID når en ny task oprettes, en task
> flyttes til `docs/done/`, eller en plan-ændring sker (kør proceduren nedenfor).
> Hvis du ikke kan se konsekvensen af en ændring ved at læse denne fil, er filen forældet.

---

## Blokerings-relationer

**ALLE historiske tickets (#1–#13) er LUKKET** → `docs/done/` (2026-07-09→11); den gamle
blokeringstabel er dermed afviklet og bevaret i git-historik + docs/done/-ticketernes
frontmatter (`deps`/`blocks`). Nuværende åbne arbejdsstrømme og deres afhængigheder:

| Arbejdsstrøm | Blokeres af | Blokerer | Note |
|---|---|---|---|
| Domænemodning (K-tabel-verifikation, planned_skills, DRAFT→verified) | _(ingen — FB-PDF'er + pdftotext tilgængelige)_ | Operationel/sikkerhedskritisk brug af rolleagenterne | Se primer "Næste skridt" |
| Adapter-aktivering #2+ (claude-code, kimi, gemini, …) | _(ingen — generator + skemaer findes)_ | Fuld model-agnostisk vision | codex er referenceimplementering |
| Fase G — global promovering | A–F ✅ (OPFYLDT 2026-07-11) + scope-beslutning + kollisionsfri målsti (MasterBrain optager `C:\Users\Biyocon\.agents\`) | _(slutmål)_ | Runbook: `brain/runbooks/how-to-promote-project-harness-to-global.md` |
| `.codex`-rodflytning | Ekstern verifikation af Codex-værktøjets søgesti | _(ingen)_ | Besluttet udskudt — se repo-map.md |
| Vendor-strategi (track vs gitignore) | Licensklassifikation + ejer-beslutning | _(ingen)_ | Separat vendor-PR |

---

## Kritisk sti

**Historisk kritisk sti FULDFØRT 2026-07-11:** `#1 → #2 → #11 → #3 → #6 → #10` er lukket
via ADR-roadmappen PR A–F (aktivering + gate GODKENDT). Tilbage af den oprindelige sti:

```
Domænemodning → Fase G (global promovering)
```

---

## Åbne afhængigheder

| Afhængighed | Afventer | Frist |
|---|---|---|
| Fase G (global promovering) | Scope-beslutning (hvad promoveres) + kollisionsfri målsti | Ikke fastsat |
| Domænemodning (K-tabeller) | Krydstjek mod FB-PDF'er (værktøj OK: pdftotext) | Ikke fastsat |
| planned_skills (30 refs) | Konkret domænebehov pr. skill (bevidst on-demand) | Løbende |

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
