---
id: "#10"
title: "Forbedr rolledækning for Bro/Anlæg (0%) og Trafik/Drift (10%)"
fase: "E"
sprint: "TBD"
status: draft
prioritet: "P2"
deps:
  - "#5"
  - "#6"
blocks: []
oprettet: "2026-07-01"
---

---

## Hvad & Hvorfor

`reports/audits/AUDIT_2026-05-06_Banedanmark_Roles.md` viser samlet rolledækning
på ca. 65%, med Bro og Anlæg på 0% og Trafik og Drift på 10% — markant lavere
end de øvrige fagområder. Dette fremgår ikke i README's "Kendte mangler"-tabel,
som fokuserer på avatarer og agenter, ikke domænedækning.

---

## Done ser sådan ud

Bro/Anlæg og Trafik/Drift har mindst én agentprofil hver, bygget på reelt
Banedanmark-fagmateriale, ikke placeholder.

---

## Teknisk scope (foreløbigt)

- [ ] Identificér eller indsaml kildemateriale for Bro/Anlæg-fagrollen
- [ ] Identificér eller indsaml kildemateriale for Trafik/Drift-fagrollen
- [ ] Opret/udvid tilhørende agentprofiler i det canonical runtime-lag (afgjort af #1)
- [ ] Opdatér `reports/audits/`-tallene i en ny, dateret audit

---

## Åbne spørgsmål før aktivering

- [ ] Findes kildemateriale for disse to områder internt, eller kræver det ekstern indsamling (uden for denne sessions adgang)?

---

## Blocker / noter

2026-07-01: Afventer #5 og #6 (agentstruktur skal være komplet før nyt
fagindhold giver mening at placere). Reel ekstern afhængighed på
kildemateriale — kan ikke lukkes af dokumentationsarbejde alene.
