# Skill: Pump/Motor Supply Assistant

> El-teknisk dimensionering af pumpe- og motorforsyninger
> Input: Motordata, installationsforhold, driftstype
> Output: Forsyningsanbefaling med kabel, beskyttelse og start

---

## Formål

Beregn og anbefal el-teknisk forsyning til pumper og motorer, herunder motorstørrelse, startmetode, kabeldimensionering, beskyttelse og EMC-forhold.

## Input

- Motoreffekt (kW)
- Spænding (V)
- Driftstype (kontinuerlig, intermitterende)
- Startmetode (DOL, softstarter, frekvensomformer)
- Kabellængde
- Installationsmetode
- Omgivelsestemperatur
- EMC-krav
- Krav til lokale/serviceafbrydere
- Signaler til automatik

## Metode

1. **Vælg startmetode**
   - DOL: < 5,5 kW (typisk)
   - Softstarter: 5,5-75 kW
   - Frekvensomformer: > 15 kW eller variabelt flow

2. **Beregn fuldlaststrøm**
   - I = P / (√3 × U × cos φ × η)

3. **Beregn startstrøm**
   - DOL: 5-7 × I_fuldlast
   - Softstarter: 2-4 × I_fuldlast
   - Frekvensomformer: 1 × I_fuldlast

4. **Dimensionér kabel**
   - Juster for omgivelsestemperatur
   - Tjek spændingsfald
   - Tjek kortslutning

5. **Vælg beskyttelse**
   - Motorværn (termisk, magnetisk)
   - Jordfejlsrelæ (hvis krævet)

6. **Vurder EMC**
   - Frekvensomformer kræver skærmede kabler
   - Jording af skærm

## Output

| Parameter | Værdi | Enhed |
|-----------|-------|-------|
| Motoreffekt | [værdi] | kW |
| Fuldlaststrøm | [værdi] | A |
| Startmetode | [type] | - |
| Startstrøm | [værdi] | A |
| Kabel | [form snit/type] | mm² |
| Beskyttelse | [type/størrelse] | - |
| EMC | [krav/tiltag] | - |
| Lokale afbrydere | [ja/nej] | - |
| Automatik-signaler | [liste] | - |

## Begrænsninger

- Hydraulisk dimensionering kræver mekanisk/procesmæssigt input
- Skal altid angive, at pumpekurve og driftspunkt skal verificeres
- Skel mellem motor- og pumpeleverandørens data
