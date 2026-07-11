---
id: "#10"
title: "Forbedr rolledækning for Bro/Anlæg (0%) og Trafik/Drift (10%)"
fase: "E"
sprint: "TBD"
status: done
prioritet: "P2"
deps:
  - "#5"
  - "#6"
blocks: []
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-10"
lukket: "2026-07-10"
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

- [x] Kildemateriale for Bro/Anlæg (2026-07-10): FB-PDF'erne `Bro-inspektør.pdf`, `Brofoged.pdf`, `Brovagt.pdf`, `Anlægschef.pdf` (læst med pdftotext).
- [x] Trafik/Drift: **allerede dækket** — `bd-trafikleder` + `bd-materielkoordinator` + `bd-systemadministrator` blev oprettet i commit `50638c45` (efter 2026-05-06-audit'en #10 refererer). "10 %"-tallet er stale.
- [x] Opret Bro/Anlæg-agent: `bd-bro-og-anlaeg.md` (86 linjer, draft) grundet i de 4 FB-PDF'er, mapper Bro-inspektør/Brofoged/Brovagt/Anlægschef.
- [x] Dateret dæknings-opdatering tilføjet som addendum i `reports/audits/AUDIT_2026-05-06_Banedanmark_Roles.md` (ikke fuld ny audit — bevidst let, jf. note).

---

## Åbne spørgsmål før aktivering

- [x] Findes kildemateriale internt? **Ja** — begge områder har dedikerede FB-PDF'er i `Funktions- og stillingsbeskrivelser/FB/`; ingen ekstern indsamling nødvendig. pdftotext gør dem læsbare.

**Status 2026-07-10: løst.** Både Bro/Anlæg og Trafik/Drift har nu mindst én agentprofil bygget på
reelt Banedanmark-fagmateriale. Kompetencekrav-K-tabeller markeret "verificér mod PDF før operationel
brug" (konservativt). Klar til `docs/done/`.

---

## Blocker / noter

2026-07-01: Afventer #5 og #6 (agentstruktur skal være komplet før nyt
fagindhold giver mening at placere). Reel ekstern afhængighed på
kildemateriale — kan ikke lukkes af dokumentationsarbejde alene.
