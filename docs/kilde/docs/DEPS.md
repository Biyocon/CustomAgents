# Dependency Map: {{PROJEKTNAVN}}
**Opdateret:** {{DATO}}
**Ref:** `docs/KØREPLAN.md` | `docs/active/` | `docs/drafts/`

<!--
Dette er change-impact-systemets hjerne.
Opdateres ALTID når:
  - En ny task oprettes (tilføj dens deps + hvad den blokerer)
  - En task flyttes til done/ (fjern den som blokerer for andre)
  - En PRD-ændring sker (løb impact-loop: se CHANGELOG.md for procedure)

Tommelfingerregel: Hvis du ikke kan se konsekvensen af en ændring ved at læse DEPS.md,
er DEPS.md forældet.
-->

---

## Blokerings-relationer

<!--
"Blokeres af" = må ikke starte før disse er done
"Blokerer" = disse kan ikke starte før denne er done
Brug task-id (#N) eller fase-betegnelse (Fase A)
-->

| Task / Fase | Blokeres af | Blokerer | Note |
|-------------|-------------|----------|------|
| #1 — {{TITEL}} | _(ingen)_ | #2, #3 | {{ÅRSAG TIL AFHÆNGIGHED}} |
| #2 — {{TITEL}} | #1 | #4 | {{ÅRSAG TIL AFHÆNGIGHED}} |
| #3 — {{TITEL}} | #1 | #4 | {{KAN KØRE PARALLELT MED #2}} |
| #4 — {{TITEL}} | #2, #3 | #5 | {{BEGGE SKAL VÆRE DONE}} |
| #5 — {{TITEL}} | #4 | _(ingen)_ | {{SLUTPUNKT}} |

---

## Kritisk sti

<!--
Den længste afhængighedskæde = minimum tid til MVP.
Alt der IKKE er på den kritiske sti kan forskydes uden at forsinke MVP.
Opdater denne sektion ved hver PRD-ændring der tilføjer/fjerner tasks på stien.
-->

**Kritisk sti (minimum tid til MVP):**

```
#1 → #2 → #4 → #5
```

**Estimeret minimumstid:** {{N uger/sprints}}

---

## Isolerede tasks

<!--
Tasks uden afhængigheder til andre aktive tasks.
Kan paralleliseres med alt andet — prioritér disse når der er ledig kapacitet.
-->

- #{{N}} — {{TITEL}} _(ingen deps, ingen blokerede tasks)_
- Docs-opdateringer er altid isolerede fra kodetasks

---

## Åbne afhængigheder

<!--
Afhængigheder der ENDNU ikke er afklaret.
Eksempel: "Fase D afhænger af en policy-beslutning (se PRD §8)"
Fjern punktet når beslutningen er taget og DEPS-tabellen er opdateret.
-->

| Afhængighed | Afventer | Frist |
|-------------|----------|-------|
| {{HVAD BLOKERER HVAD}} | {{BESLUTNING ELLER PERSON}} | {{DATO}} |

---

## Change-Impact Procedure

<!--
Kør denne procedure ved ENHVER ændring til PRD, KØREPLAN eller tasks.
-->

```
GIVEN: Ændring [C] til [fil] på [dato]

1. KLASSIFICER:
   Type: tilføjelse | fjernelse | modifikation | prioritetsændring
   Omfang: PRD-niveau | fase-niveau | task-niveau

2. QUERY DEPS.md (denne fil):
   - Find alle tasks der blokeres af det ændrede
   - Find alle tasks i samme fase/sprint

3. VURDER per berørt task:
   - Re-sekvensering nødvendig? (ja/nej + begrundelse)
   - Acceptkriterie skal opdateres? (ja/nej + forslag)
   - Task nu irrelevant? (flyt til drafts/ med note)
   - Ny bloker opstået? (opdater DEPS-tabellen)

4. OPDATER:
   - PRD.md (den ændrede sektion)
   - KØREPLAN.md (sprint-status + estimat)
   - Berørte tickets: tilføj [REVIEW: årsag · dato] i ticket-header
   - DEPS.md (nye/fjernede relationer)
   - CHANGELOG.md (entry med alle berørte tasks)

5. RAPPORTÉR:
   "X tasks påvirket. Y tasks kræver review. Z kan fortsætte."
   List [REVIEW]-markerede tickets.
   Angiv hvad der kræver menneskelig beslutning.
```
