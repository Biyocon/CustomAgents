---
id: "#7"
title: "Udfyld de 6 FORELØBIG domæne-skills"
fase: "D"
sprint: "TBD"
status: done
prioritet: "P2"
deps:
  - "#1"
blocks: []
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-10"
lukket: "2026-07-10"
---

---

## Hvad & Hvorfor

`banebyg`, `bdk-brand-governance`, `bdk-gdpr-praksis`, `bdk-legal-mapping`,
`shared-docx`, `shared-quality` har struktur men intet reelt indhold i deres
SKILL.md.

**Status 2026-07-10 (løst):** Præmissen var sand da ticket blev skrevet (den refererede
`.agents/skills/`-placeholder-versioner med `trigger:`-frontmatter). Men **skills-flytningen
2026-07-09 (commit `ff2e3907`)** erstattede dem med de fyldige `.codex`-versioner. Verificeret
nuværende tilstand:
- **bdk-brand-governance (85 l), bdk-gdpr-praksis (32 l), bdk-legal-mapping (36 l), shared-docx (28 l),
  shared-quality (27 l):** reelt indhold med klar trigger/arbejdsgang — IKKE tomme skabeloner.
  (bdk-legal-mapping's ene "markér ukendte"-linje er korrekt praksis-vejledning, ikke placeholder.)
- **banebyg:** var den eneste med ægte placeholders ("UKENDT"). Omskrevet 2026-07-10 til en
  **router/index-skill** der peger på de nu-eksisterende detalje-skills (`bbe-dokumenter-platform`,
  `bdk-bkp-v17-data-model/-overview`, `bbtr-*`, `bdk-tilsynsapp-*`) i stedet for at kalde dem placeholder.
  Tilføjet `name: banebyg`-frontmatter (fikser trigger-only-compliance).

**Compliance-note:** bdk-gdpr-praksis og bdk-legal-mapping har reelt, men bevidst konservativt indhold
(de instruerer i at markere ukendte koblinger og ikke udlede bindende tekst). Dybere juridisk verifikation
mod officielle kilder er stadig et separat, fagligt spor — men skillene er ikke længere tomme skabeloner.

---

## Done ser sådan ud

Hver af de 6 skills har et SKILL.md med reelt, domænekorrekt indhold og et
klart trigger-scope — ikke en tom skabelon.

---

## Teknisk scope (foreløbigt)

- [x] Identificér kildemateriale for hver skill (2026-07-10): 5/6 fik reelt indhold via skills-flytningen; banebyg's detaljer findes nu som dedikerede skills (bbe-dokumenter-platform, bdk-bkp-v17-*)
- [x] Skriv indhold, ikke bare struktur (banebyg omskrevet til router-skill; øvrige 5 har allerede reelt indhold)

**Status 2026-07-10: løst.** Se "Hvad & Hvorfor" ovenfor for detaljer. Klar til `docs/done/`.

---

## Åbne spørgsmål før aktivering

- [ ] Findes der allerede kildemateriale et sted i repoet (fx `Funktions- og stillingsbeskrivelser/`) der kan genbruges, eller kræver dette ekstern research?
- [ ] Skal disse 6 prioriteres før eller efter agent-komplettering (#6)?

---

## Blocker / noter

2026-07-01: Sat som draft (ikke active) fordi kildemateriale-tilgængelighed
ikke er bekræftet endnu — afklar dette før den flyttes til `docs/active/`.
