---
id: "#{{N}}"
title: "{{OPGAVE-TITEL}}"
fase: "{{A-Z}}"
sprint: "{{A-1}}"
status: done
prioritet: "{{P0 | P1 | P2}}"
deps:
  - "#{{M}}"
blocks:
  - "#{{K}}"
oprettet: "{{OPRETTET-DATO}}"
done_dato: "{{DONE-DATO}}"
commit: "{{COMMIT-HASH}}"
---

<!--
DENNE FIL ER UFORANDERLIG efter den er placeret i done/.
Eneste tilladte ændring: tilføj commit-hash i frontmatter hvis den mangler.
Formål: revisionshistorik og traceability.
-->

---

## Hvad & Hvorfor

{{BESKRIV HVAD DER BLE BYGGET OG HVORFOR}}

---

## Done ser sådan ud

{{BESKRIV HVAD BRUGEREN KAN GØR/SE/TESTE}}

---

## Teknisk scope (afsluttet)

- [x] {{SUBTASK 1}}
- [x] {{SUBTASK 2}}
- [x] {{SUBTASK 3}}

---

## Relevante filer

- `{{STI/TIL/FIL.ts:linje-range}}`

---

## Acceptkriterie (alle opfyldt)

- [x] {{BETINGELSE 1}} — verificeret {{DATO}}
- [x] {{BETINGELSE 2}} — verificeret {{DATO}}

---

## Verifikation

**Verificeret af:** {{AGENT/PERSON}}
**Dato:** {{DATO}}
**Metode:** {{npm test | manuel test | CI-pipeline | audit}}
**Resultat:** {{N}}/{{N}} tests grønne. Build clean.

---

## Hvad det muliggjorde

<!--
Hvilke tasks blev unblocked da denne task blev done?
Hjælper med at forstå systemets fremdrift retrospektivt.
-->

Unblockede: #{{K}}, #{{L}}
