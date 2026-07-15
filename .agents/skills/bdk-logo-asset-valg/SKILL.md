---
name: bdk-logo-asset-valg
version: "1.0"
description: Vælg korrekt Banedanmark-logo-asset ud fra kanal, farverum, baggrund og layoutbehov. Brug når en konkret logo-fil skal vælges til et materiale, ved tvivl om RGB/CMYK, dark/light eller logovariant, eller når den præcise filsti til det rette logo-asset skal findes.
metadata:
  owner: Biyocon
  created: 2026-02-25
  last_reviewed: 2026-02-25
---

# BDK Logo Asset Valg

## Hvornår skillen bruges
- Når brugeren skal vælge konkret logo-fil til et materiale.
- Når der er tvivl om RGB/CMYK, dark/light eller logovariant.
- Når brugeren vil have den præcise filsti til det rette logo-asset.

## Autoritative kilder
1. **BDK Designguide Nyt logo 2021** — logo-varianter og regler (side 2-4)
2. **Banedanmark logopakke 2021** — 14 filer (6 RGB + 6 CMYK + 2 AI)
3. **references/logo-asset-analyse.md** — komplet filanalyse med dimensioner og kvalitetsflags

## Logo-varianter

| Variant | Beskrivelse | Prioritet | Filnavn-mønster |
|---------|-------------|-----------|-----------------|
| **2-dæk** | Krone over navnetræk | PRIMÆR | `*-2-*` |
| **1-dæk** | Krone ved siden af navnetræk | Sekundær | `*-1-*` |
| **Krone alene** | Kun bomærket | Sekundær | `*-krone*` / `*-krone-ng*` |

## Beslutningsmatrix

### Trin 1: Kanal → Farverum
| Kanal | Farverum | Mappe |
|-------|----------|-------|
| Digital (web, app, præsentation, social) | RGB | `Banedanmark Logo 2021/RGB/` |
| Print (tryksag, plakat, brochure) | CMYK | `Banedanmark Logo 2021/CMYK/` |
| Professionel produktion (grafiker) | Vektor | `Banedanmark Logo 2021/AI-filer/` |

### Trin 2: Layout → Variant
| Layoutbehov | Variant |
|-------------|---------|
| Standard (mest luft, vertikal plads tilgængelig) | 2-dæk (primær) |
| Begrænset vertikal plads (header, banner) | 1-dæk (sekundær) |
| Kun ikon / BDK-navn er markant andetsteds | Krone alene (sekundær) |

### Trin 3: Baggrund → Farve
| Baggrund | Logo-version | Filnavn |
|----------|-------------|---------|
| Lys baggrund | Positiv (grå `#323232`) | `*-light*` |
| Mørk baggrund | Negativ (hvid `#FFFFFF`) | `*-dark*` / `*-ng*` |

## Hyppigste valg (top 5 scenarier)

| Scenarie | Anbefalet fil | Note |
|----------|--------------|------|
| PowerPoint, lys baggrund | `RGB/Logo-RGB-2-light.png` (761x409) | Standard-valg |
| PowerPoint, mørk baggrund | `RGB/Logo-RGB-2-dark.png` (250x100) | **OBS: FLAG-001** |
| Website header, lys | `RGB/Logo-RGB-1-light.png` (810x207) | 1-dæk for bredde |
| Trykt brochure, lys | `CMYK/Logo-CMYK-2-light.png` (761x410) | Print-standard |
| App-ikon / favicon | `RGB/Logo-RGB-krone.png` (4962x4961) | Skalér ned |

## Kvalitetsflags
- **FLAG-001:** `Logo-RGB-2-dark.png` er 250x100 px — kun 33% af forventet opløsning (761x409). Den primære logo-variant til digitalt brug på mørke baggrunde er for lavopløst. Anbefal erstatning fra kommunikationsafdelingen (redaktion@bane.dk).

## Arbejdsgang
1. Læs `references/logo-asset-analyse.md` og `references/source-map.md`.
2. Afklar:
   - Digital vs. print → farverum
   - Lys vs. mørk baggrund → dark/light
   - Vertikal/horisontal/pladsbegrænset layout → variant (2/1/krone)
3. Vælg filvariant via beslutningsmatrix.
4. Tjek kvalitetsflags for den valgte fil.
5. Returnér præcis filsti, dimensioner og fallback-variant.

## Outputformat
1. Kontekst (kanal, baggrund, layout)
2. Primær filanbefaling (sti + dimensioner)
3. Fallback-fil (alternativ ved pladsmangel eller kvalitetsissue)
4. Hvad man skal undgå
5. Kvalitetsflags (hvis relevant)
6. Kilder (repo-stier)

## Styringsregler
- Digitalt output: ALTID `RGB`-mappen.
- Printworkflow: ALTID `CMYK`-mappen eller `AI`-filer ved professionel produktion.
- Vælg `dark/light` efter baggrundskontrast — aldrig omvendt.
- Ved FLAG-001: advisér bruger og foreslå erstatning eller midlertidig workaround.
