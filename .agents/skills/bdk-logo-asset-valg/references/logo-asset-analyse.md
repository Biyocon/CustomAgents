# Logo-asset analyse

Analyse af alle filer i `Banedanmark logopakke 2021/Banedanmark Logo 2021/`.
Genereret via `logo_inventory.ps1`.

---

## Filstruktur

```
Banedanmark logopakke 2021/
└── Banedanmark Logo 2021/
    ├── AI-filer/          (2 vektor-kildefiler)
    ├── CMYK/              (6 print-PNG-varianter)
    └── RGB/               (6 digitale PNG-varianter)
```

**Støjfiler (skal udelukkes fra leverancer):**
- `__MACOSX/` (macOS metadata-artefakter)
- `.DS_Store` (macOS directory metadata)
- `._*` (macOS resource forks)

---

## Komplet filoversigt

### AI-filer (vektor-kilder)

| Fil | Størrelse | Brug |
|-----|-----------|------|
| `Logo-CMYK.ai` | 1.442 KB | Print-produktion (vektor) |
| `Logo-RGB.ai` | 282 KB | Digital produktion (vektor) |

### CMYK (print-PNG)

| Fil | Størrelse | Bredde | Højde | Variant | Baggrund |
|-----|-----------|--------|-------|---------|----------|
| `Logo-CMYK-1-dark.png` | 7,1 KB | 810 px | 208 px | 1-dæk | Mørk |
| `Logo-CMYK-1-light.png` | 6,5 KB | 810 px | 208 px | 1-dæk | Lys |
| `Logo-CMYK-2-dark.png` | 9,0 KB | 761 px | 409 px | 2-dæk | Mørk |
| `Logo-CMYK-2-light.png` | 8,3 KB | 761 px | 410 px | 2-dæk | Lys |
| `Logo-CMYK-krone.png` | 153,9 KB | 4.962 px | 4.961 px | Krone | Lys |
| `Logo-CMYK-krone-ng.png` | 148,7 KB | 4.962 px | 4.961 px | Krone | Mørk |

### RGB (digital-PNG)

| Fil | Størrelse | Bredde | Højde | Variant | Baggrund | Flag |
|-----|-----------|--------|-------|---------|----------|------|
| `Logo-RGB-1-dark.png` | 7,2 KB | 810 px | 207 px | 1-dæk | Mørk | OK |
| `Logo-RGB-1-light.png` | 6,6 KB | 810 px | 207 px | 1-dæk | Lys | OK |
| `Logo-RGB-2-dark.png` | 6,6 KB | 250 px | 100 px | 2-dæk | Mørk | **UNDERSIZED** |
| `Logo-RGB-2-light.png` | 8,3 KB | 761 px | 409 px | 2-dæk | Lys | OK |
| `Logo-RGB-krone.png` | 152,7 KB | 4.962 px | 4.961 px | Krone | Lys | OK |
| `Logo-RGB-krone-ng.png` | 148,6 KB | 4.962 px | 4.961 px | Krone | Mørk | OK |

---

## Kvalitetsflags

### FLAG-001: Logo-RGB-2-dark.png er undersized
- **Fil:** `RGB/Logo-RGB-2-dark.png`
- **Problem:** 250x100 px — forventet ~761x409 px (baseret på CMYK-ækvivalent og RGB-2-light)
- **Risiko:** For lav opløsning til de fleste digitale formål. Vil se pixeleret ud ved skalering.
- **Anbefaling:** Erstat med korrekt opløsning fra kommunikationsafdelingen (redaktion@bane.dk), eller brug `Logo-RGB-2-light.png` på inverteret baggrund som midlertidig løsning.
- **Note:** Dette er den primære logo-variant (2-dæk) til digital brug på mørke baggrunde — altså en kritisk fil.

---

## Navngivningskonventioner

| Mønster | Betydning |
|---------|-----------|
| `*-1-*` | 1-dæk variant (krone ved siden af navnetræk) |
| `*-2-*` | 2-dæk variant (krone over navnetræk) — primær |
| `*-krone*` | Krone alene (kun bomærket) |
| `*-dark*` | Til mørke baggrunde (hvidt/negativt logo) |
| `*-light*` | Til lyse baggrunde (gråt/positivt logo) |
| `*-ng*` | Negativ (mørk baggrund) — bruges kun ved krone-varianten |
| `Logo-RGB-*` | Digital brug (RGB farverum) |
| `Logo-CMYK-*` | Print brug (CMYK farverum) |

---

## Beslutningsmatrix for logo-filvalg

### Trin 1: Kanal
| Kanal | Farverum | Mappe |
|-------|----------|-------|
| Digital (web, app, præsentation, social) | RGB | `RGB/` |
| Print (tryksag, plakat, brochure) | CMYK | `CMYK/` |
| Professionel produktion (grafiker) | Vektor | `AI-filer/` |

### Trin 2: Variant
| Layoutbehov | Variant | Filnavn |
|-------------|---------|---------|
| Standard (mest luft) | 2-dæk (primær) | `*-2-*` |
| Begrænset vertikal plads | 1-dæk (sekundær) | `*-1-*` |
| Kun ikon / BDK-navn er markant andetsteds | Krone alene | `*-krone*` |

### Trin 3: Baggrund
| Baggrund | Version | Filnavn |
|----------|---------|---------|
| Lys baggrund | Positiv (grå logo) | `*-light*` |
| Mørk baggrund | Negativ (hvid logo) | `*-dark*` / `*-ng*` |

### Eksempler

| Scenarie | Anbefalet fil |
|----------|--------------|
| PowerPoint på lys baggrund | `RGB/Logo-RGB-2-light.png` |
| PowerPoint på petrol-grøn baggrund | `RGB/Logo-RGB-2-dark.png` (**OBS: undersized, se FLAG-001**) |
| Website header, lys | `RGB/Logo-RGB-1-light.png` (1-dæk for horisontal plads) |
| Trykt brochure, lys | `CMYK/Logo-CMYK-2-light.png` |
| App-ikon / favicon | `RGB/Logo-RGB-krone.png` |
| Professionel tryksag | `AI-filer/Logo-CMYK.ai` |

---

## Aggregerede nøgletal

| Metric | Værdi |
|--------|-------|
| Samlede filer (ekskl. støj) | 14 |
| PNG-varianter | 12 (6 RGB + 6 CMYK) |
| Vektor-kilder | 2 (AI) |
| Kvalitetsflags | 1 (FLAG-001: RGB-2-dark undersized) |
| Støjfiler | 4 (__MACOSX + .DS_Store + ._*) |
