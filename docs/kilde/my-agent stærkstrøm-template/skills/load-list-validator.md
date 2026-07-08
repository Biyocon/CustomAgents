# Skill: Load List Validator

> Kontrollér load list for fejl, mangler og inkonsistens
> Input: Færdig eller udkast til load list
> Output: Valideringsrapport med fejl og anbefalinger

---

## Formål

Validér en load list for at sikre datakvalitet, konsistens og teknisk plausibilitet. Skillen identificerer fejl, mangler og uoverensstemmelser, før listen bruges til videre beregninger.

## Input

- Load list (CSV, Excel, markdown-tabel)
- Projektets kontekst (spændingsniveau, standarder)

## Metode

1. **Tjek obligatoriske felter**
   - Tag nr., System, Udstyrstype, Installeret effekt, Spænding, Faser

2. **Tjek beregnede værdier**
   - Er beregnet strøm konsistent med effekt, cos φ og η?
   - Er enheder korrekte?

3. **Tjek plausibilitet**
   - Er strømme inden for forventede intervaller for udstyrstypen?
   - Er samtidighedsfaktorer realistiske?
   - Er cos φ og virkningsgrad inden for normale områder?

4. **Tjek konsistens**
   - Samme tag-nummer brugt flere gange?
   - Samme udstyr angivet med forskellige effekter?
   - Henvisninger til ikke-eksisterende tavler?

5. **Tjek komplethed**
   - Manglende kabelreference?
   - Manglende beskyttelse?
   - Manglende status eller kommentar?

## Output

| ID | Type | Alvor | Beskrivelse | Anbefaling | Status |
|---|---|---|---|---|---|

## Valideringskriterier

### Kritiske fejl (skal rettes)
- Manglende tag-nummer
- Manglende effekt eller spænding
- Beregnet strøm afviger > 10% fra forventet
- Ugyldige værdier (negative, urealistiske)

### Advarsler (bør efterses)
- Samtidighedsfaktor > 1
- cos φ > 1 eller < 0
- Virkningsgrad > 100%
- Startstrøm ikke angivet for motor > 5,5 kW

### Bemærkninger (kan forbedres)
- Manglende kommentar ved antagelser
- Uklar beskrivelse
- Manglende datakilde

## Eksempel på output

```
V-001 | Fejl | Kritisk | Tag nr. P-102 findes to gange | Fjern dublet eller omdøb | Åben
V-002 | Advarsel | Medium | Samtidighedsfaktor for P-101 er 1,2 | Tjek om der er fejl i input | Åben
V-003 | Bemærkning | Lav | Mangler kommentar ved antaget cos φ | Tilføj kommentar | Åben
```

## Begrænsninger

- Kan ikke validere uden kendskab til projektets specifikke krav
- Skal markere, hvis validering er baseret på generelle antagelser
