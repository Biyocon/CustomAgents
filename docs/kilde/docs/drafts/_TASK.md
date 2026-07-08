---
id: "#{{N}}"
title: "{{OPGAVE-TITEL}}"
fase: "{{A-Z}}"
sprint: "{{TBD}}"
status: draft
prioritet: "{{P0 | P1 | P2}}"
deps:
  - "#{{M}}"
blocks:
  - "#{{K}}"
oprettet: "{{DATO}}"
---

<!--
DENNE FIL BRUGES TIL: Foreslåede opgaver der ikke er prioriteret endnu.
PLACERING: docs/drafts/#N-titel.md
LIVSCYKLUS: drafts/ → active/ (når prioriteret) | drafts/ → slettet (hvis irrelevant)

En draft må gerne være løs og ufuldstændig.
Udfyld kun "Hvad & Hvorfor" og "Done ser sådan ud" — resten kan vente til den aktiveres.
Tilføj [REVIEW: årsag · dato] i headeren hvis en PRD-ændring påvirker denne draft.
-->

---

## Hvad & Hvorfor

{{BESKRIV IDÉEN KORT — det er nok til at huske formålet}}

---

## Done ser sådan ud

{{HVAD KAN BRUGEREN GØR/SE NÅR DETTE ER DONE — kan være løst formuleret}}

---

## Teknisk scope (foreløbigt)

<!--
Ikke obligatorisk for en draft. Udfyld hvis det er åbenlyst.
-->

- [ ] {{MULIG SUBTASK}}

---

## Relevante filer

<!--
Ikke obligatorisk for en draft.
-->

---

## Åbne spørgsmål før aktivering

<!--
Hvad skal afklares INDEN denne task kan flyttes til active/?
-->

- [ ] {{SPØRGSMÅL DER SKAL BESVARES}}
- [ ] {{AFHÆNGIGHED DER SKAL RESOLVES}}

---

## Blocker / noter

{{DATO}}: {{ÅRSAG TIL AT DETTE ER EN DRAFT}}
