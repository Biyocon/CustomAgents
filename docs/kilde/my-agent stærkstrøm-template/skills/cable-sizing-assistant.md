# Skill: Cable Sizing Assistant

> El-teknisk kabeldimensionering
> Input: Belastningsdata, installationsforhold, standardkrav
> Output: Kabelanbefaling med beregninger

---

## Formål

Beregn og anbefal kabelformsnit baseret på belastningsstrøm, installationsmetode, omgivelsestemperatur, kortslutningsforhold og spændingsfald.

## Input

- Beregnet strøm (A)
- Spænding (V)
- Faser (1F/3F)
- Installationsmetode (rør, kabelbakke, direkte i jord, etc.)
- Omgivelsestemperatur (°C)
- Kabellængde (m)
- Kortslutningsstrøm (kA) og varighed (s)
- Tilladt spændingsfald (%)
- Kabeltype (Cu/Al, XLPE/PVC, etc.)

## Metode

1. **Vælg grundlæggende strøm (Iz)**
   - Juster for omgivelsestemperatur
   - Juster for installationsmetode (gruppering, jordvarme, etc.)

2. **Tjek kortslutningsforhold**
   - Min. tværsnit for kortslutningsvarme: S = I × √t / k
   - k-værdi afhænger af kabeltype og isolering

3. **Beregn spændingsfald**
   - ΔU = √3 × I × L × (R × cos φ + X × sin φ) [3-faset]
   - ΔU% = (ΔU / U) × 100

4. **Vælg standardformsnit**
   - Vælg næste standardformsnit, der opfylder alle krav

5. **Dokumentér**
   - Input, metode, mellemtrin, resultat

## Output

| Parameter | Værdi | Enhed |
|-----------|-------|-------|
| Beregnet strøm | [værdi] | A |
| Justeret strøm Iz | [værdi] | A |
| Kortslutning krav | [værdi] | mm² |
| Spændingsfald | [værdi] | % |
| Anbefalet form snit | [værdi] | mm² |
| Kabeltype | [type] | - |
| Beskyttelse | [type/størrelse] | - |

## Standarder

- DS/HD 60364-5-52 (kablers bæreevne)
- DS/HD 60364-5-54 (jording)
- DS/EN 50525 (kabeltyper)

## Begrænsninger

- Kræver verificerede kortslutningsdata
- Kræver kendskab til installationsforhold
- Skal altid markeres som foreløbig, indtil verificeret
