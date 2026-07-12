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
| ~~Fase G — global promovering~~ | **UDFØRT 2026-07-12** (ADR-0004): skabelon i `~\.agents\templates\customagents-harness\`, kun generiske komponenter, kollisionsfri | _(slutmålet er nået)_ | Opdateres envejs ved gentaget promovering |
| `.codex`-rodflytning | Ekstern verifikation af Codex-værktøjets søgesti | _(ingen)_ | Besluttet udskudt — se repo-map.md |
| Vendor-strategi (track vs gitignore) | Licensklassifikation + ejer-beslutning | _(ingen)_ | Separat vendor-PR |

---

## Kritisk sti

**HELE den oprindelige kritiske sti er FULDFØRT** (2026-07-11→12): `#1 → #2 → #11 → #3 → #6
→ #10` lukket via ADR-roadmap PR A–F; Fase G (global promovering) udført 2026-07-12
(ADR-0004). Domænemodning (K-tabel-verifikation + planned_skills-oprettelse) blev igangsat
2026-07-12 — se profilernes kildelinjer og skills-laget for aktuel status.

---

## Åbne afhængigheder

| Afhængighed | Afventer | Frist |
|---|---|---|
| Yderligere adapter-aktivering (kimi/gemini/ollama/…) | Behov + generator-rendering pr. runtime | Løbende |
| Resterende domæneverifikation (skills markeret FORELØBIG) | Krydstjek mod Banedanmarks officielle kilder | Løbende |

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
