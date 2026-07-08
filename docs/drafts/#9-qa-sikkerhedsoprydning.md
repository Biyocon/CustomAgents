---
id: "#9"
title: "QA-sikkerhedsoprydning: vendor-gitlink og tracked API-nøgle-placeholder"
fase: "F"
sprint: "TBD"
status: draft
prioritet: "P1"
deps: []
blocks: []
oprettet: "2026-07-01"
---

---

## Hvad & Hvorfor

`QA_2026-06-07_CustomAgents.md` identificerede (1) en defekt vendor-gitlink
uden tilhørende `.gitmodules`, og (2) en tracked temp-fil med en
API-nøgle-placeholder. Ingen bekræftet reel lækage, men praksis bør strammes
op før global promovering af harnesset til andre projekter.

---

## Done ser sådan ud

`git submodule status` fejler ikke. Ingen tracked fil indeholder
nøgle-lignende strenge (verificeret ved grep-mønster for typiske API-nøgle-formater).

---

## Teknisk scope (foreløbigt)

- [ ] Identificér den specifikke vendor-gitlink-fejl og enten tilføj korrekt `.gitmodules` eller konvertér til almindeligt tracked indhold (jf. README's note om at mattpocock-skills allerede er "tracked vendored copy, ikke submodule")
- [ ] Find den specifikke temp-fil med API-nøgle-placeholder og fjern/erstat den
- [ ] Kør en grep-baseret sikkerhedsscan for lignende mønstre andre steder i repoet

---

## Åbne spørgsmål før aktivering

- [ ] Er den fundne "vendor-gitlink" faktisk en git submodule-reference, eller en almindelig sti-reference der fejlagtigt ligner en gitlink?
- [ ] Præcis filsti for temp-filen med API-nøgle-placeholder — skal bekræftes i `QA_2026-06-07_CustomAgents.md` inden oprydning

---

## Blocker / noter

2026-07-01: Ingen tekniske afhængigheder, men bør prioriteres hurtigt af
sikkerhedshensyn selvom den er sat som draft — flyt til `docs/active/` ved
næste sprint-planlægning.
