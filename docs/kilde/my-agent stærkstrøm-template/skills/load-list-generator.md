# Skill: Load List Generator

> Opret struktureret load list fra input
> Input: Rå belastningsdata, projektkontekst
> Output: Struktureret load list med beregninger

---

## Formål

Generér en komplet, struktureret load list baseret på rå input. Skillen sikrer konsistent kolonneopbygning, korrekte beregninger og tydelig markering af antagelser og mangler.

## Input

- Rå belastningsdata (CSV, Excel, tekst eller manuel indtastning)
- Projektkontekst (spændingsniveau, tavlestruktur, system)
- Eventuelle specifikke krav til kolonner

## Metode

1. **Rens og standardisér data**
   - Ensart enheder (kW, kVA, A)
   - Standardisér betegnelser
   - Fjern dubletter

2. **Gruppér og kategorisér**
   - Gruppér efter tavle, område, system
   - Kategorisér driftstype (kontinuerlig, intermitterende, standby, nød)

3. **Beregn strømme**
   - Formel: I = P / (√3 × U × cos φ × η) [tre-faset]
   - Formel: I = P / (U × cos φ × η) [en-faset]
   - Angiv mellemtrin

4. **Valider**
   - Tjek for negative værdier
   - Tjek for unormalt høje/lave strømme
   - Tjek konsistens mellem installeret og beregnet effekt

5. **Marker**
   - Usikre værdier
   - Manglende data
   - Antagelser

## Outputformat

| Kolonne | Beskrivelse |
|---------|-------------|
| Tag nr. | Udstyrets tag-nummer |
| System | Systemgruppe |
| Område | Fysisk placering |
| Udstyrstype | Type af udstyr |
| Beskrivelse | Kort beskrivelse |
| Forsyning fra | Overordnet forsyning |
| Tavle | Tavle-ID |
| Spænding | V |
| Faser | 1F / 3F |
| Installeret effekt | kW |
| Driftseffekt | kW |
| Samtidighedsfaktor | - |
| cos φ | - |
| Virkningsgrad | - |
| Beregnet strøm | A |
| Startstrøm | A (hvis relevant) |
| Driftstype | Kontinuerlig / intermitterende / standby / nød |
| Kritikalitet | A / B / C |
| Backup/nødstrøm | Ja/nej + type |
| Kabelreference | Reference |
| Beskyttelse | Type og størrelse |
| Datakilde | Kilde til værdien |
| Status | OK / antagelse / manglende |
| Kommentar | Bemærkninger |
| Åben action | Hvad skal afklares |

## Fejl og advarsler

- **Advarsel:** Samtidighedsfaktor > 1 → Tjek input
- **Advarsel:** cos φ > 1 eller < 0 → Ugyldig værdi
- **Advarsel:** Virkningsgrad > 100% → Ugyldig værdi
- **Fejl:** Manglende spænding eller effekt → Kan ikke beregne strøm

## Eksempel

```
Tag nr.: P-101
System: SPILDEVAND
Område: Pumperum A
Udstyrstype: Centrifugalpumpe
Beskrivelse: Procespumpe P-101
Forsyning fra: Hovedtavle HT-01
Tavle: UT-01
Spænding: 400
Faser: 3F
Installeret effekt: 15,0
Driftseffekt: 15,0
Samtidighedsfaktor: 1,0
cos φ: 0,85
Virkningsgrad: 0,90
Beregnet strøm: 28,4 A
Startstrøm: 142 A (DOL)
Driftstype: Kontinuerlig
Kritikalitet: A
Backup/nødstrøm: Nej
Kabelreference: Afventer
Beskyttelse: Afventer
Datakilde: Procesdata
Status: Antagelse — cos φ og η antaget
Kommentar: Verificér motorstart
Åben action: Verificér pumpekurve og driftspunkt
```

## Begrænsninger

- Må ikke gætte på effekter uden grundlag
- Skal altid angive, når en værdi er antaget
- Skal markere manglende data tydeligt
