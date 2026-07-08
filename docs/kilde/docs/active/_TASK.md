---
id: "#{{N}}"
title: "{{OPGAVE-TITEL}}"
fase: "{{A-Z}}"
sprint: "{{A-1}}"
status: active
prioritet: "{{P0 | P1 | P2}}"
deps:
  - "#{{M}}"
blocks:
  - "#{{K}}"
oprettet: "{{DATO}}"
sidst_opdateret: "{{DATO}}"
---

<!--
DENNE FIL BRUGES TIL: Opgaver der aktivt arbejdes på nu.
PLACERING: docs/active/#N-titel.md
LIVSCYKLUS: drafts/ → active/ → done/
  Flyt til done/ når ALLE acceptkriterier er opfyldt og verificeret.
  Flyt tilbage til drafts/ hvis den blokeres og ikke kan fortsætte.

[REVIEW: årsag · dato] — tilføjes i denne header-linje hvis change-impact loop påvirker tasken.
-->

---

## Hvad & Hvorfor

<!--
1-3 sætninger fra brugerens perspektiv.
Svar på: Hvad opnår vi, og HVORFOR er det vigtigt lige nu?
Undgå teknisk sprog her — det hører i "Teknisk scope" nedenfor.
-->

{{BESKRIV OPGAVEN FRA BRUGERPERSPEKTIV}}

---

## Done ser sådan ud

<!--
Konkret, testbar beskrivelse. Hvad KAN brugeren gøre/se/teste når dette er done?
Skriv det som om du beskriver det til en ikke-teknisk stakeholder.
Eksempel: "Bruger kan skrive /plan 'byg login', se opgaveliste, approve med Enter."
-->

{{BESKRIV DEN FÆRDIGE TILSTAND}}

---

## Teknisk scope

<!--
Subtasks i rækkefølge. Markér done med [x].
Hold listen under 10 punkter — opdel ellers i flere tickets.
-->

- [ ] {{SUBTASK 1}}
- [ ] {{SUBTASK 2}}
- [ ] {{SUBTASK 3}}

---

## Relevante filer

<!--
Peg præcist. Linjenummer-ranges er guld.
Format: `sti/til/fil.ts:linje-start-linje-slut`
-->

- `{{STI/TIL/FIL.ts:1-50}}`
- `{{STI/TIL/FIL.ts}}`

---

## Acceptkriterie

<!--
Hvert punkt SKAL kunne besvares ja/nej.
Ingen vage termer: "fungerer korrekt" → "returnerer HTTP 200 med korrekt JSON schema"
Minimum 2 punkter, maksimum 8.
-->

- [ ] {{TESTBAR BETINGELSE 1}}
- [ ] {{TESTBAR BETINGELSE 2}}
- [ ] {{TESTBAR BETINGELSE 3}}

---

## Blocker / noter

<!--
Dato-stemplede noter. Seneste øverst.
Skriv her når du støder på noget uventet, en beslutning der skal tages, eller en ekstern afhængighed.
-->

{{DATO}}: {{NOTE ELLER BLOCKER}}
