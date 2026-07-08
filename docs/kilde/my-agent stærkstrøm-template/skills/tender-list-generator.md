# Skill: Tender List Generator

> Udarbejd tilbudsliste med poster, mængder og grænseflader
> Input: Projektomfang, belastningsdata, specifikationer
> Output: Struktureret tilbudsliste

---

## Formål

Generér en komplet tilbudsliste med tydelig poststruktur, mængder, enheder, grænseflader og forbehold.

## Input

- Projektomfang
- Load list eller belastningsoversigt
- Tavlestruktur
- Kabeloversigt
- Arbejdsbeskrivelser
- Kundekrav

## Metode

1. **Strukturér poster**
   - Gruppér efter fagområde og system
   - Nummerér poster

2. **Beskriv ydelse**
   - Kort, præcis beskrivelse
   - Reference til tegning eller specifikation

3. **Angiv omfang**
   - Hvad er inkluderet i posten
   - Hvad er ekskluderet

4. **Angiv enhed og mængde**
   - Brug passende enheder (stk, m, sæt, etc.)
   - Marker usikre mængder

5. **Skel mellem ydelser**
   - Levering
   - Montage
   - Test
   - Dokumentation
   - Idriftsættelse

6. **Identificér grænseflader**
   - Hvilke andre fag berøres
   - Hvem har ansvar for hvad

7. **Foreslå optioner og forbehold**
   - Alternative løsninger
   - Usikkerheder

## Output

| Post nr. | Fagområde | System | Beskrivelse | Omfang | Enhed | Mængde | Levering | Montage | Test | Dok. | Grænseflader | Forudsætninger | Kommentar | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Output — forbehold og optioner

```markdown
## Forbehold
- [Forbehold 1]

## Optioner
| ID | Beskrivelse | Prispåvirkning | Bemærkning |
|---|---|---|---|
```

## Begrænsninger

- Mængder baseret på input — skal verificeres
- Skel mellem leverandør- og entreprenøransvar
- Skal markeres som foreløbig
