---
id: "#4"
title: "Reconciliér de to modstridende validation_report.md-versioner"
fase: "B"
sprint: "B-2"
status: done
prioritet: "P0"
deps:
  - "#1"
blocks: []
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-09"
lukket: "2026-07-09"
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

- [x] Sammenlign check-listerne i de to rapporter — måler de det samme scope? (2026-07-09: NEJ — den gamle måler ADR-0001-struktur; den nye måler 8 sektioner A–H fra det konsoliderede script. Forskellen dokumenteret i begge bannere.)
- [x] Kør det aktuelle valideringsscript og generér en frisk, dateret rapport (`.agents/reports/validation_report.md`, auto-genereret af `Validate-Harness-Unified.ps1`)
- [x] Markér de to ældre rapporter som historiske/superseded, ikke slet dem (2026-07-09: `reports/validation_report.md` har nu HISTORISK/SUPERSEDED-banner)
- [x] Den aktuelle rapport selv-mærkes "AKTUEL (kanonisk)" af scriptet ved hver kørsel (persistent på tværs af regenereringer)

---

## Relevante filer

- `reports/validation_report.md` (+ .bak-filer)
- `.agents/reports/validation_report.md`
- `README.md` (linje 3-5)

---

## Acceptkriterie

- [x] Præcis én validation_report er markeret "AKTUEL" med en dato (`.agents/reports/validation_report.md`, dato-stemplet ved hver kørsel)
- [x] De øvrige er markeret "SUPERSEDED" eller "HISTORISK" med begrundelse (`reports/validation_report.md`)
- [x] README.md peger på den aktuelle status (via primer.md/systemkort + harness-scriptet; ingen hardkodet stale rapport-sti tilbage)

**Status 2026-07-09: alle scope-punkter og acceptkriterier opfyldt.** Klar til `docs/done/`.

---

## Blocker / noter

2026-07-01: Afventer #1, da det er runtime-beslutningen der afgør hvilket
lags validering der reelt er relevant fremadrettet.
