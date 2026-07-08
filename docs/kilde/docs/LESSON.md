# Lessons Learned: {{PROJEKTNAVN}}

<!--
HVORNÅR SKRIVES EN LESSON:
  - Ved afslutning af en FASE (ikke et sprint — for meget noise)
  - Ved en post-mortem efter en alvorlig fejl/bloker
  - Aldrig under en aktiv sprint (refleksion kræver distance)

FORMÅL:
  Forhindre gentagelse af fejl. Ikke selvkritik — konkrete handlinger.
  "Hvad ændrer vi fremover" SKAL have en handling, ikke en observation.

KOBLING TIL KØREPLAN:
  Estimat vs. faktisk-tabellen giver data til bedre estimering i næste fase.
-->

---

## Fase {{BOGSTAV}} — {{FASE-NAVN}} — Afsluttet {{DATO}}

**Varighed:** {{START-DATO}} → {{SLUT-DATO}} ({{N}} uger)
**Sprints:** {{FØRSTE}} til {{SIDSTE}}
**Tests ved start → slut:** {{N}} → {{M}}

---

### Hvad gik godt

<!--
Konkrete observationer — ikke generel ros.
"Provider-agnostisk interface gjorde det nemt at tilføje nye backends" ✅
"Teamet arbejdede godt sammen" ❌ (for vagt)
-->

- {{KONKRET OBSERVATION}}
- {{KONKRET OBSERVATION}}

---

### Hvad gik skidt

<!--
Fejl, misforståelser, undervurderinger.
Vær specifik: "Naming drift (Mythos → Zaki) skabte forvirring i 3 tests og 2 CLI-flags"
ikke "kommunikationen kunne have været bedre".
-->

- {{KONKRET OBSERVATION}}
- {{KONKRET OBSERVATION}}

---

### Hvad vi ændrer fremover

<!--
Direkte handlinger. Hvert punkt SKAL pege på en specifik ændring i process eller kode.
Kan resultere i ny PRD-sektion, ny DEPS-regel, ny konvention i KØREPLAN.
-->

- {{KONKRET HANDLING — hvad, hvornår, hvem}}
- {{KONKRET HANDLING}}

---

### Estimat vs. faktisk

| Sprint | Estimeret | Faktisk | Delta | Årsag til afvigelse |
|--------|-----------|---------|-------|---------------------|
| {{SPRINT}} | {{N}} dage | {{M}} dage | {{+/-}} | {{ÅRSAG}} |
| **Total fase** | **{{N}} uger** | **{{M}} uger** | **{{+/-}}** | |

---

### Næste lesson skrives ved

Afslutning af Fase {{NÆSTE BOGSTAV}} — {{NÆSTE FASE-NAVN}}

---

<!--
KOPIÉR DETTE BLOK VED NÆSTE FASE:

## Fase {{BOGSTAV}} — {{FASE-NAVN}} — Afsluttet {{DATO}}

**Varighed:** {{START}} → {{SLUT}}
**Sprints:** {{FØRSTE}} til {{SIDSTE}}
**Tests ved start → slut:** {{N}} → {{M}}

### Hvad gik godt
-

### Hvad gik skidt
-

### Hvad vi ændrer fremover
-

### Estimat vs. faktisk
| Sprint | Estimeret | Faktisk | Delta | Årsag |
|--------|-----------|---------|-------|-------|
-->
