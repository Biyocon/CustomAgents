---
name: bdk-powerpoint-praesentationsskills
version: "2.1"
description: Skab kreative, BDK-brandede PowerPoint-præsentationer og projektværktøjer, baseret på BDK Designguide 2021 og analyse af 15 Banedanmark-decks (338 slides). Brug når en ny præsentation med Banedanmark-branding skal genereres, når projektstyringsværktøjer som interessentmatrix, gevinstdiagram eller kommunikationsplan skal oprettes, når råt indhold skal omskrives til et præsentationsnarrativ eller en instruktiv vejledning, eller når konsistent design og font-/temahygiejne skal sikres.
metadata:
  owner: Biyocon
  created: 2026-02-25
  last_reviewed: 2026-03-06
---

# BDK PowerPoint Præsentationsskills (v2.1)

## Hvornår skillen bruges
- Når brugeren vil generere en ny præsentation med Banedanmark branding.
- Når brugeren vil oprette **projektstyringsværktøjer** (interessentmatrix, gevinstdiagram, kommunikationsplan).
- Når brugeren vil omskrive råt indhold til et stærkt præsentationsnarrativ eller en instruktiv vejledning.
- Når brugeren vil sikre konsistent design og teknisk "hygiejne" (font/tema-rens).

## Autoritative kilder
1. **BDK Designguide Nyt logo 2021** (primær) - officiel intern designguide
2. **Banedanmark logopakke 2021** - officielle logofiler
3. **15 analyserede PPTX-decks** (sekundær) - observeret praksis fra 338 slides (opdateret 2026-02-26)

## Primære reference-decks (gold standard)
Brug disse som kalibreringsmål for stil og visuel densitet:

1. **IPM-standardpræsentation** (Metode/Proces)
   - **Stil:** Lav/moderat grafiktæthed (~1,9 img/slide).
   - **Brug til:** Procesflow, modelkommunikation, standardiseret stakeholder-info.
2. **Ledelsesbriefingen** (Beslutning/Status)
   - **Stil:** Høj grafiktæthed (~5,5 img/slide).
   - **Brug til:** Kompakte lederbriefings, eskalering, governance.
3. **Værktøjs-decks** (Matrix/Tabel) - **NY v2.0**
   - **Stil:** Tabel-dominant datavisualisering (22 tabeller observeret).
   - **Brug til:** Interessentanalyser, kommunikationsplaner, gevinstdiagrammer.

### Visuel elementstrategi
- **Tabeller:** Primær data-carrier i værktøjs-decks. Brug Petrol-grønne headers og alternerende rækker (#F0F6F6).
- **Matrix-layouts:** Til segmentering (f.eks. interessenter). Brug klare farvekoder fra BDK-paletten.
- **Diagrammer:** Til organisering og governance.
- **Charts:** Bruges sparsomt (kun 6 observeret i 338 slides). Overvej om data præsenteres bedre i en tabel.
- **Taler-noter:** Obligatoriske til alle slides for at sikre 100% kontekst.

## Arbejdsgang
1. Læs references/source-map.md og references/bdk-branding-designsystem.md.
2. Afklar brief: Målgruppe, formål (beslutte/informere/værktøj) og format.
3. Vælg designretning: "Banedanmark PP"-template (Segoe UI-baseret).
4. Anvend typografi og farver iht. designguide.
5. Konverter indhold til storyboard baseret på relevante arketyper.
6. **Kør QA-gate (obligatorisk):**
   - [ ] **Fonter:** KUN Segoe UI. Fjern Arial, Calibri, Aptos og asiatisk fontstøj.
   - [ ] **Kvalitetsflag:** Tjek for +mj-lt, +mn-lt, +mn-cs, +mj-cs eller ＭＳ Ｐゴシック (tegn på korrupt tema/import).
   - [ ] **Tema:** Ingen Office-standardfarver (blå/orange). Brug kun BDK HEX-koder.
   - [ ] **Logo:** 2-dæk primær variant med korrekt respektafstand.
   - [ ] **Noter:** Er der talepunkter til alle slides?

## Arketype-specifikke retningslinjer (v2.0)
- **Executive Clear:** Stram, høj kontrast, beslutningsorienteret.
- **Transformation Story:** Narrativ progression, procesfokus.
- **Projektværktøj (NY):** Matrix-layouts, tabel-dominans, høj informationsdensitet.
- **Instruktionsvejledning (NY):** Høj teksttæthed kombineret med tabeller (f.eks. Styregruppevejledning).

## Typografi & Farver (iht. BDK Designguide 2021)
- **Font:** Segoe UI (Regular/Bold).
- **Primær:** Petrol-grøn #004E51.
- **Sekundær:** Pink #FFC8C8 (til risici/stop), Mint #43FFC8 (til succes), Gul #FFFF66 (opmærksomhed).
- **Tekst:** Koks-grå #323232.

## Scripts
- scripts/analyze_pptx.ps1 - Bruges til teknisk audit af decks. Brug -OutputJson for maskinlæsbar QA-rapport.
