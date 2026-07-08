---
id: "#4"
title: "Reconciliér de to modstridende validation_report.md-versioner"
fase: "B"
sprint: "B-2"
status: active
prioritet: "P0"
deps:
  - "#1"
blocks: []
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-01"
---

---

## Hvad & Hvorfor

`reports/validation_report.md` (2026-05-06) viser "3 PASS/2 PARTIAL/4 FAIL".
`.agents/reports/validation_report.md` (nyere, 2026-06-17) viser "69 OK, 0 fejl".
Ingen fil forklarer forbedringen eller angiver hvilken der er gældende. Dette
gentager samme mønster som runtime-modsigelsen: to autoritative kilder, ingen
forligsfil.

---

## Done ser sådan ud

Én validation_report er markeret som "AKTUEL", den anden er enten opdateret
til at matche eller eksplicit markeret "SUPERSEDED {{DATO}} — se [ny fil]" med
en kort begrundelse for forskellen (fx "målte forskellige lag" eller "checks
blev udvidet/indsnævret mellem de to kørsler").

---

## Teknisk scope

- [ ] Sammenlign check-listerne i de to rapporter — måler de det samme scope?
- [ ] Kør det aktuelle valideringsscript (efter #1's beslutning om hvilket lag) og generér en frisk, dateret rapport
- [ ] Markér de to ældre rapporter som historiske/superseded, ikke slet dem
- [ ] Opdatér `README.md`s reference til "hvor du finder aktuel status" (linje 3-5)

---

## Relevante filer

- `reports/validation_report.md` (+ .bak-filer)
- `.agents/reports/validation_report.md`
- `README.md` (linje 3-5)

---

## Acceptkriterie

- [ ] Præcis én validation_report er markeret "AKTUEL" med en dato
- [ ] De øvrige er markeret "SUPERSEDED" eller "HISTORISK" med begrundelse
- [ ] README.md peger på den aktuelle rapport

---

## Blocker / noter

2026-07-01: Afventer #1, da det er runtime-beslutningen der afgør hvilket
lags validering der reelt er relevant fremadrettet.
