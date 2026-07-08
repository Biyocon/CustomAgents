# Skill: Transformer Sizing Assistant

> Transformerdimensionering og -valg
> Input: Belastningsdata, forsyningsspecifikation, krav
> Output: Anbefalet transformerstørrelse med begrundelse

---

## Formål

Beregn og anbefal transformerstørrelse baseret på belastningsdata, samtidighed, reservekapacitet, kortslutningsforhold og specifikke projektkrav.

## Input

- Installeret effekt (kW/kVA)
- Driftseffekt (kW/kVA)
- Samtidighedsfaktor
- Belastningskategori (kontinuerlig, intermitterende, etc.)
- Spændingsniveau (primær/sekundær)
- Kortslutningsdata
- Krav til reservekapacitet (%)
- Krav til redundans
- Omgivelsestemperatur
- Kølingsmetode

## Metode

1. **Beregn dimensionerende effekt**
   - S_dim = Σ(S_installeret × samtidighed) / cos φ_gennemsnit
   - Tilføj reservekapacitet

2. **Vælg standardstørrelse**
   - Vælg næste standardtransformer ≥ S_dim
   - Typiske standardstørrelser: 250, 400, 630, 800, 1000, 1250, 1600, 2000, 2500 kVA

3. **Tjek belastningsgrad**
   - Belastningsgrad = S_dim / S_transformer
   - Anbefalet: 60-80% ved normal drift

4. **Tjek kortslutningsforhold**
   - Sørg for, at transformeren kan holde til kortslutningsstrømme
   - Impedans skal være passende

5. **Vurder redundans**
   - N+1, N+N, eller ingen redundans?
   - Påvirker valget af antal og størrelse

## Output

| Parameter | Værdi | Enhed |
|-----------|-------|-------|
| Dimensionerende effekt | [værdi] | kVA |
| Reservekapacitet | [værdi] | % |
| Anbefalet transformer | [værdi] | kVA |
| Belastningsgrad | [værdi] | % |
| Antal transformere | [værdi] | stk |
| Redundansprincip | [princip] | - |
| Bemærkning | [tekst] | - |

## Begrænsninger

- Kræver verificerede belastningsdata
- Kræver kendskab til kortslutningsforhold
- Skel mellem foreløbig, projekterings- og endelig dimensionering
- Skal markeres som foreløbig, indtil verificeret
