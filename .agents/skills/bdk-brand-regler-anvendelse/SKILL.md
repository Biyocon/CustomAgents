---
name: bdk-brand-regler-anvendelse
version: "1.0"
description: Anvend og kvalitetssikr brandregler fra BDK designguiden ved brug af logo i kommunikationsmateriale. Brug når brand-compliance i et layout skal valideres, ved tvivl om korrekt eller ukorrekt logobrug, eller når et materiale skal godkendes mod BDK-brandregler før publicering.
metadata:
  owner: Biyocon
  created: 2026-02-25
  last_reviewed: 2026-02-25
---

# BDK Brand Regler Anvendelse

## Hvornår skillen bruges
- Når brugeren vil validere brand-compliance i et layout.
- Når brugeren er i tvivl om korrekt/ukorrekt logobrug.
- Når et materiale skal godkendes mod BDK-brandregler før publicering.

## Autoritative kilder
1. **BDK Designguide Nyt logo 2021** (primær) — officielle regler
2. **bdk-brand-governance/references/bdk-brand-designsystem.md** — komplet udtrukket regelsæt

## Komplet regelkatalog

### R1: Logo-variant
| Regel | Krav |
|-------|------|
| R1.1 | 2-dæk er primær variant — brug den medmindre layout kræver andet |
| R1.2 | 1-dæk kun ved begrænset vertikal plads |
| R1.3 | Krone alene kun når "Banedanmark" er markant til stede i nærheden |
| R1.4 | Navnetrækket optræder altid sammen med bomærket (undtagen krone alene) |

### R2: Logo-farve
| Regel | Krav |
|-------|------|
| R2.1 | Kun grå (`#323232`) eller hvid (`#FFFFFF`) |
| R2.2 | Grå (positiv) på lyse baggrunde |
| R2.3 | Hvid (negativ) på mørke baggrunde |
| R2.4 | ALDRIG andre farver uden tilladelse fra kommunikationsafdelingen |

### R3: Respektafstand
| Regel | Krav |
|-------|------|
| R3.1 | 2-dæk: friområde baseret på bomærkets højde |
| R3.2 | 1-dæk: friområde baseret på bomærkets bredde ud fra navnetrækket |
| R3.3 | Krone alene: friområde baseret på halvdelen af bomærkets bredde |
| R3.4 | Intet grafisk element inden for respektafstanden |

### R4: Baggrund og kontrast
| Regel | Krav |
|-------|------|
| R4.1 | Logoet skal altid stå på baggrund med tydelig kontrast |
| R4.2 | Undgå komplekse baggrundsbilleder der reducerer læsbarhed |

### R5: Farver (generelt)
| Regel | Krav |
|-------|------|
| R5.1 | Kun officielle 5 farver (+ 50%/20% justerede udgaver) |
| R5.2 | Petrol-grøn vejer tungest i grafisk hierarki |
| R5.3 | Sekundære farver som blikfang, ikke som bærende |
| R5.4 | Digital: brug HEX/RGB-værdier. Print: brug CMYK-værdier |

### R6: Typografi
| Regel | Krav |
|-------|------|
| R6.1 | Segoe UI (regular + bold) til daglig brug |
| R6.2 | Noir No1 kun ved grafiker-produktion |
| R6.3 | "Det 5. element" kun ved grafiker-produktion (dekoration) |
| R6.4 | Arial, Calibri og andre fonter er uautoriserede |

### R7: Farverum
| Regel | Krav |
|-------|------|
| R7.1 | Digital output: RGB |
| R7.2 | Print output: CMYK |
| R7.3 | Professionel produktion: AI-vektor foretrækkes |

## Arbejdsgang
1. Læs `bdk-brand-governance/references/bdk-brand-designsystem.md`.
2. Afklar layoutscenariet:
   - Kanal (digital/print)
   - Baggrund (lys/mørk/kompleks)
   - Placering og størrelse
   - Typografi i brug
   - Farver i brug
3. Kør vurdering mod alle relevante regler (R1-R7).
4. Returnér compliant/ikke-compliant med specifik regelhenvisning.

## Outputformat
1. Scenarie (layout, kanal, baggrund)
2. Regelvurdering (pr. regel: compliant/ikke-compliant)
3. Afvigelser (med regelkode, fx "R2.4: Logo i blå farve")
4. Korrigerende handlinger (konkrete rettelser pr. afvigelse)
5. Kilder (designguide-sidehenvisning + repo-stier)

## Styringsregler
- Designguiden er højeste lokale kilde — ingen undtagelser uden eskalering.
- Hvis designguide ikke kan udlæses fuldt teknisk, markér usikkerhed eksplicit.
- Ingen kreative undtagelser uden tydelig risikomarkering.
- Eskalering ved tvivl: redaktion@bane.dk
