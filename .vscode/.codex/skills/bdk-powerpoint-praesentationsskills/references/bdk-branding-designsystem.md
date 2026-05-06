# BDK Branding Designsystem for Præsentationer

Baseret på **BDK Designguide Nyt logo 2021** (officiel intern designguide, 13 sider) og verificeret mod 15 PPTX-decks (batch 1: 8, batch 2: 7).

---

## Typografi

### Officiel BDK-typografi (iht. Designguide 2021)

| Font | Snit | Brug | Tilgængelighed |
|------|------|------|----------------|
| **Noir No1** | light, regular, demibold, bold | Grafisk produktion | FORBEHOLDT grafikere |
| **Segoe UI** | regular, bold | Daglig brug i BDK | Alle medarbejdere |
| **"Banedanmark" (Det 5. element)** | regular | Dekoration, rubrikker | FORBEHOLDT grafikere |

Designguiden siger eksplicit: *"Til daglig brug i Banedanmark benytter vi fonten Segoe UI."*

### Anbefaling for nye præsentationer
- **Brug KUN Segoe UI** (regular + bold) som tekst-font i nye decks
- Noir No1 kun hvis præsentationen produceres af/med grafikere
- Forsøg ALDRIG at emulere "Det 5. element"-fonten eller Noir No1 - det bryder med reglen om daglig brug og holder produktionen urealistisk
- Arial, Calibri og andre fonter er IKKE autoriseret af designguiden

### Reparativ font-strategi
- Arial (1771 forekomster) og andre uautoriserede fonter i eksisterende decks betragtes som **støj**, ikke som præcedens
- Ved nyt indhold: tving konsekvent Segoe UI igennem for at trække porteføljen tilbage mod den officielle standard
- Genbrug ALDRIG Arial fra referencematerialet i nye slides, selvom det findes hyppigt i de analyserede decks
- **Konserverende strategi** (kun ved bevidst match af legacy-decks): Behold eksisterende fonter for at undgå at introducere nye fejl i gamle dokumenter

### Font-kvalitetsflags
- **ＭＳ Ｐゴシック** (13 forekomster, kun OPEX-decket): Typisk et "fingeraftryk" fra objekter kopieret ind fra Excel eller eksterne kilder. Forekomsten er en direkte instruks om skjult uformateret importindhold, der bør renses ved oprydning.
- **+mj-lt** (50 forekomster, flere decks): Brudt tema-reference — et placeholder-token der peger på "major latin" fonten men ikke er resolvet korrekt. Indikerer beskadiget tema-arv, typisk fra kopiering mellem decks med forskellige temaer.
- **+mn-lt** (164 forekomster, primært Light Projektgrundlag og Gevinstdiagram): Placeholder for "minor latin" tema-font. Samme type brudt reference som +mj-lt.
- **+mn-cs** (530 forekomster, udbredt i 14/15 decks): Placeholder for "minor complex script" tema-font. Den mest udbredte brudte tema-reference — indikerer at complex script-fonten i temaet ikke er defineret eller er beskadiget. Harmløst i vesteuropæisk kontekst men et tegn på tema-kvalitetsproblemer.
- **+mj-cs** (5 forekomster, OPEX og Ledelsesforankring): Placeholder for "major complex script" tema-font. Sjælden variant af samme problem.

### Observeret fontbrug i eksisterende decks (PPTX-analyse, 15 decks)

| Font | Forekomster | Status iht. designguide |
|------|-------------|------------------------|
| Segoe UI | 2229 | Officiel daglig font |
| Arial | 1787 | Ikke i designguiden - uautoriseret afvigelse |
| Open Sans | 665 | Ikke i designguiden |
| Calibri | 301 | Ikke i designguiden |
| Verdana | 142 | Ikke i designguiden |
| Trebuchet MS | 139 | Ikke i designguiden |
| Øvrige | 423 | Times New Roman (82), Wingdings (55), Aptos (49), Raleway (23), Avenir Book (22), Tiempos Text (14), ＭＳ Ｐゴシック (13), Corbel (9), Aptos Serif (6), +mj-lt (3), Symbol (3), Georgia (3), Courier New (1) |

**Ny observation (batch 2, 7 decks):** Selv når temaet er "Banedanmark PP" (Segoe UI), bruger kun 2/7 nye decks reelt Segoe UI som dominant font. Font-drift sker primært via kopiering af indhold fra andre kilder — ikke via forkert tema-valg.

---

## Farvekort

### Officielt BDK-farvekort (5 farver, iht. Designguide 2021)

| Farve | Type | HEX | RGB | CMYK |
|-------|------|-----|-----|------|
| **Petrol-grøn** | Primær | `#004E51` | 0, 78, 81 | 100-30-60-60 |
| **Koks-grå** | Primær | `#323232` | 50, 50, 50 | 0-0-0-85 |
| **Mint** | Sekundær | `#43FFC8` | 67, 255, 200 | 65-0-45-0 |
| **Pink** | Sekundær | `#FFC8C8` | 255, 200, 200 | 0-40-10-0 |
| **Gul** | Sekundær | `#FFFF66` | 255, 255, 102 | 0-0-80-0 |

**Farvejusterede udgaver:** Alle 5 farver kan bruges i 100%, 50% og 20% mætning.

**Hierarki ved grafikker:** Petrol-grøn (+ farvejusterede udgaver) vejer tungest. Sekundære farver bruges ud fra mængden af data.

### Afvigelser i PPTX-temaer

PPTX-temaerne i de 15 analyserede decks bruger en let modificeret palet:

| Accent | PPTX-tema HEX | Officiel HEX | Afvigelse |
|--------|---------------|--------------|-----------|
| accent1 | `#004E51` | `#004E51` | Ens |
| accent2 | `#43FFC8` | `#43FFC8` | Ens |
| accent3 | `#FAAAB9` | `#FFC8C8` | Mere mættet/laks i PPTX |
| accent4 | `#FFE650` | `#FFFF66` | Mere gylden/amber i PPTX |
| accent5 | `#323232` | `#323232` | Ens |
| accent6 | `#ADADAD` | - | Ikke i officiel guide |

**Farve-normalisering (kontekstafhængig):**
- **Nyt deck:** Brug altid de officielle HEX-værdier (`#FFC8C8` for pink, `#FFFF66` for gul)
- **Eksisterende deck:** Brug de observerede tema-farver (`#FAAAB9`, `#FFE650`) for at undgå visuelt patchwork i det specifikke dokument

---

## Logo

### Officielle logo-retningslinjer (iht. Designguide 2021)

**Logoet** består af et bomærke (krone) og et navnetræk ("BANEDANMARK").

**Tre varianter:**
1. **2-dæk** (PRIMÆR) - krone over navnetræk
2. **1-dæk** (sekundær) - krone ved siden af navnetræk
3. **Krone alene** (sekundær) - kun når Banedanmarks navn er markant til stede i nærheden

**Farver:**
- Positiv (grå logo): `#323232` (RGB 50, 50, 50)
- Negativ (hvidt logo): `#FFFFFF` (RGB 255, 255, 255)
- Logoet må ALDRIG gengives i andre farver uden tilladelse fra kommunikationsafdelingen

**Respektafstand:**
- 2-dæk: Baseret på bomærkets højde
- 1-dæk: Baseret på bomærkets bredde ud fra navnetræk
- Krone alene: Baseret på halvdelen af bomærkets bredde

**Placering:** Logoet skal altid stå på baggrund med tydelig kontrast.

**Logofiler til digital brug (RGB):**
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/Logo-RGB-2-dark.png` (2-dæk, mørk bg)
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/Logo-RGB-2-light.png` (2-dæk, lys bg)
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/Logo-RGB-1-dark.png` (1-dæk, mørk bg)
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/Logo-RGB-1-light.png` (1-dæk, lys bg)
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/Logo-RGB-krone.png` (krone, lys bg)
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/Logo-RGB-krone-ng.png` (krone, mørk bg)

---

## Fire template-familier (observeret i 15 PPTX-decks)

### Familie A: "Banedanmark PP" (officiel BDK-skabelon) — 13/15 decks
- **Bruges i:** OPEX, BaneByg_0.1, Ledelsesforankring, Kvartalsvis, Ledelse, Projektforum, Interessentanalyse, Kommunikationsplan, Light Projektgrundlag, Banebyg, Styregruppevejledning (+ dual med andre i IPM, Gevinstdiagram, Projektorganisation)
- **Tema-fonter:** Segoe UI (major) / Segoe UI (minor)
- **dk1:** `#323232`, **dk2:** `#F6F6F6`, **lt1:** `#FFFFFF`, **lt2:** `#FFFFFF`
- **Accentfarver:** `#004E51`, `#43FFC8`, `#FAAAB9`, `#FFE650`, `#323232`, `#ADADAD`

### Familie A2: "Tema3" / "1_Banedanmark PP" (dual-master variant) — 2/15 decks
- **Bruges i:** IPM, Gevinstdiagram
- **Tema-fonter:** Segoe UI (major) / Segoe UI (minor) — identisk med Familie A
- **Forskel:** Dobbelt masterslide med separate tema-navne, men samme fonter og farver
- **Brug:** Primært i decks der er bygget ved at kombinere to forskellige BDK-masters

### Familie B: "2_Office Theme" / Corbel-baseret (legacy) — 1/15 decks
- **Bruges i:** Kun Ledelsesgrundlag
- **Tema-fonter (theme1):** Corbel (major) / Corbel (minor)
- **dk1:** `#000000`, **dk2:** `#44546A`, **lt1:** `#FFFFFF`, **lt2:** `#E7E6E6`
- **Accentfarver:** `#004E51`, `#44546A`, `#004E51`, `#004E51`, `#FFFFFF`, `#000000`

### Familie C: "Office-tema" / Aptos-baseret (ny Office-default) — 1/15 decks
- **Bruges i:** Projektorganisation (dual med Banedanmark PP)
- **Tema-fonter:** Aptos Display (major) / Aptos (minor)
- **Oprindelse:** Standard Office-tema fra nyere Microsoft 365 — ikke BDK-specifikt
- **Note:** Indikerer at masterslide er oprettet i en ren Office-installation og derefter kombineret med BDK-master

---

## Visuelt hierarki
1. **Titel:** kort og handlingsorienteret (Segoe UI bold, stor)
2. **Subtitel:** kontekst - møde, dato, ejer (Segoe UI regular, medium)
3. **Kernebudskab:** tydelig i første tredjedel af slide (Segoe UI bold, fremhævet)
4. **Evidens:** figur/tabel/punkter (Segoe UI regular, normal størrelse)
5. **Beslutning/næste skridt:** nederst eller dedikeret slutslide

## Kreative retninger (vælg en pr. deck)
- **Executive Clear:** stram, høj kontrast, få elementer - god til kort ledelsesstatus (10-13 slides)
- **Operational Pulse:** status- og fremdriftsfokus med tydelige KPI-zoner - god til kvartalsrapporter
- **Transformation Story:** narrativ progression med før/efter og beslutningspunkter - god til forankring og implementering

## Slide-hygiejne
- Maks 1 hovedbudskab pr. slide
- Maks 5 hovedbullets pr. tekstslide
- Undgå tekstblokke med lav scanningsevne
- Brug farve til betydning, ikke pynt
- Konsistent sidehoved og sidefod gennem hele decket
- Dato, versionsnummer og præsentationsejer på titelslide
- Logo-placering med respektafstand (se logo-retningslinjer)

## Konsistenskrav
- Kun Segoe UI som tekst-font (iht. designguide)
- Officielle BDK-farver fra 5-farvekort
- Samme titelgrid og sidefod gennem hele decket
- Ens brug af dato, versionsnummer og præsentationsejer
- Gentagelige diagramstile og ikonbrug (ikoner fra BDK-ikonbank på baneinfo)
- Logo i korrekt variant og farve med respektafstand

## Visuelle elementer (inspireret af primære reference-decks)

### Primære reference-decks
1. **IPM-standardpræsentationen** (38 slides, 72 billeder, 28 noter) - gold standard for metode-/modelkommunikation
2. **Ledelsesbriefingen** (13 slides, 71 billeder, 1 chart, 7 diagrammer, 13 noter) - gold standard for kompakte lederbriefings

### Visuel termostat (billedtæthedsstyring)
Brug reference-decks som kalibreringsmål for visuel densitet:
- **IPM-stil** = lav/moderat grafiktæthed (~1,9 billeder/slide) - egnet til metode, procesflow, modelkommunikation
- **Ledelse-stil** = høj grafiktæthed (~5,5 billeder/slide) - egnet til kompakte lederbriefings med chart + diagrammer
- Brugeren kan styre densitet med: "Lav dette deck med en visuel densitet som IPM" eller "som Ledelse"

### Retningslinjer for visuelle elementer
- **Diagrammer:** Brug til organisering, governance-strukturer, processer og interfaces. Ledelse-decket bruger 7 diagrammer i 13 slides til governance-visualisering. BaneByg viser at diagramtung præsentation (27 i 12 slides) er effektiv til organisationsstruktur.
- **Charts/grafer:** Brug til kvantitativ status, fremdriftsvisualisering og gap-analyser. Ledelse-decket kombinerer 1 chart (stærkstrøm/kørestrøm gap) med 7 diagrammer.
- **Tabeller:** Brug til strukturerede data, roller/ansvar, planer og matricer. Tabeller er den primære datavisualiseringsform i skabelon/projektværktøj-decks (batch 2: 22 tabeller i 62 slides). Light Projektgrundlag har 11 tabeller i 11 slides (1 pr. slide). Interessentanalyse bruger 3 tabeller i 4 slides (4×4 matrix-format). Styregruppevejledning kombinerer 5 tabeller med 38 billeder.
  - **Tabel-styling i BDK-kontekst:** Brug BDK-farver i tabelhoveder (Petrol-grøn `#004E51` som header-baggrund med hvid tekst). Anvend Petrol 20% (`#CCE0E1`) eller hvid til alternerende rækker. Segmenter med sekundærfarver (Pink/Mint/Gul) ved kategori-opdeling.
- **Billeder:** Billedtæthed styres via visuel termostat (se ovenfor). Billeder bruges som baggrunde, ikoner og kontekstuelle illustrationer.
- **Taler-noter:** Inkludér noter til alle slides med uddybende kontekst og talepunkter (IPM: 28 noter, Ledelse: 13 noter = 100% note-dækning). Batch 2 viser lavere note-dækning (40%) i skabelon-decks — men note-vejledning er stadig værdifuld i udfyldningsskabeloner.
- **Tilpas til indhold:** Processer = diagrammer/flowcharts, kvantitative data = charts/grafer, governance = organisationsdiagrammer, milepæle = tidslinjer, strukturerede data/roller = tabeller.

### Arketype-specifikke visuelle forventninger
| Format | Kreativ retning | Visuel profil |
|--------|----------------|---------------|
| Lederbriefing (10-13 slides) | Executive Clear | Chart + diagrammer, høj billedtæthed, kompakt |
| Metode/model (30-50 slides) | Transformation Story | Høj billedtæthed, procesdiagrammer, noter |
| Governance/organisation | Executive Clear | Diagramtung, organisationsmodeller |
| Kvartalsstatus | Operational Pulse | KPI-charts, statusfarver, beslutningsslides |
| Seminar/workshop (100+ slides) | Facilitator-flow | Interaktionsmomenter, Menti, gruppeøvelser |
| Policy/ledelsesgrundlag | Executive Clear | Normativ teksttyngde, policy-rammesætning |
| Skabelon/projektværktøj (1-4 slides) | Funktionel | Tabel-centreret, BDK-farver i headers, udfyldningsfelter, noter som vejledning |
| Vejledning/guide (20-30 slides) | Instruktionel | Blanding af tabeller, billeder og tekst, sektionsopdelt, tydelige overskrifter |
| Light projektgrundlag (8-12 slides) | Strukturel | Høj tabeltæthed (1/slide), moderat billedtæthed, fasebaseret progression |

## Ikoner
- Banedanmarks ikon-bank er inspireret af "Det 5. element"-fonten
- Tilgængelig på baneinfo
- Bestilling af nye ikoner: redaktion@bane.dk
