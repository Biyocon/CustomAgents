---
name: bdk-brand-governance
version: "1.0"
description: Styr korrekt anvendelse af Banedanmarks brand-assets på tværs af kanaler, med valg af logo, regler og preflight. Brug når BDK-logo skal anvendes korrekt i materiale, når der ønskes én samlet brand-vurdering før publicering, eller ved tvivl om korrekt logo-variant, farve eller typografi.
metadata:
  owner: Biyocon
  created: 2026-02-25
  last_reviewed: 2026-02-25
---

# BDK Brand Governance

## Hvornår skillen bruges
- Når brugeren vil anvende BDK-logo korrekt i materiale.
- Når brugeren vil have én samlet brand-vurdering før publicering.
- Når brugeren er i tvivl om korrekt logo-variant, farve eller typografi.

## Autoritative kilder
1. **BDK Designguide Nyt logo 2021** (primær) — officiel intern designguide fra Banedanmark (13 sider)
2. **Banedanmark logopakke 2021** — officielle logofiler (RGB/CMYK/AI, 14 filer ekskl. støj)
3. **references/bdk-brand-designsystem.md** — komplet udtrukket regelsæt fra designguiden

## Kerneregelsæt (quick reference)

### Logo
- **3 varianter:** 2-dæk (primær), 1-dæk (sekundær), krone alene (sekundær)
- **2 farver:** Grå (`#323232`) på lyse baggrunde, hvid (`#FFFFFF`) på mørke
- **ALDRIG** andre farver uden tilladelse fra kommunikationsafdelingen
- **Respektafstand** skal overholdes (baseret på bomærkets dimensioner)
- **Altid** på baggrund med tydelig kontrast

### Farver (5 officielle)
| Farve | Type | HEX |
|-------|------|-----|
| Petrol-grøn | Primær | `#004E51` |
| Koks-grå | Primær | `#323232` |
| Mint | Sekundær | `#43FFC8` |
| Pink | Sekundær | `#FFC8C8` |
| Gul | Sekundær | `#FFFF66` |

Alle farver i 100%, 50% og 20% mætning. Petrol-grøn vejer tungest i grafisk hierarki.

### Typografi
- **Segoe UI** (regular + bold) — eneste font til daglig brug
- Noir No1 og "Det 5. element" — FORBEHOLDT grafikere
- Arial, Calibri og andre fonter er IKKE autoriserede

## Arbejdsgang
1. Læs `references/bdk-brand-designsystem.md` og `references/source-map.md`.
2. Afklar leverancekontekst:
   - Kanal (digital/print/professionel produktion)
   - Målgruppe
   - Baggrund (lys/mørk)
   - Format og placering
3. Kald `bdk-logo-asset-valg` → konkret filvalg med begrundelse.
4. Kald `bdk-brand-regler-anvendelse` → regelcheck mod designguide.
5. Kald `bdk-brand-preflight-leverance` → slutkontrol og pakning.
6. Levér samlet brandstatus med alle resultater.

## Outputformat
1. Kontekst (kanal, målgruppe, baggrund, format)
2. Valgte assets og begrundelse (filstier)
3. Regelcheck (compliant/ikke-compliant pr. regel)
4. Preflight-resultat (pass/fail med detaljer)
5. **Klar/Ikke klar** + næste handling
6. Kilder (repo-stier)

## Kvalitetsflags
- **FLAG-001:** `Logo-RGB-2-dark.png` er undersized (250x100 px vs forventet 761x409). Anbefal erstatning fra kommunikationsafdelingen ved brug på mørke digitale baggrunde.

## Fast QA-rutine (alle punkter skal bestås)
- [ ] **Logo-variant:** Korrekt variant valgt (2-dæk primær, 1-dæk/krone kun sekundært)
- [ ] **Logo-farve:** Kun grå (`#323232`) eller hvid (`#FFFFFF`) — ingen andre farver
- [ ] **Respektafstand:** Overholdt baseret på bomærkets dimensioner
- [ ] **Kontrast:** Logo står på baggrund med tydelig kontrast
- [ ] **Farver:** Kun officielle BDK-farver (5 HEX-værdier + justerede udgaver)
- [ ] **Typografi:** Kun Segoe UI i ikke-grafiker materiale
- [ ] **Farverum:** RGB til digital, CMYK til print, AI til produktion
- [ ] **Støjfiler:** Ingen __MACOSX, .DS_Store, ._* i leverance

## Styringsregler
- Ved tvivl om regel: designguiden er højeste lokale kilde.
- Ingen antagelser om rettigheder eller rebranding uden dokumenteret grundlag.
- Ingen kreative undtagelser uden tydelig risikomarkering og eskalering til kommunikationsafdelingen.
- Kontakt for godkendelse af undtagelser: redaktion@bane.dk
