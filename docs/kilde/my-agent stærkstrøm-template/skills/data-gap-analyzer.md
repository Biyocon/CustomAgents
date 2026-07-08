# Skill: Data Gap Analyzer

> Identificér manglende data og afklaringer
> Input: Opgave, datagrundlag, projektkontekst
> Output: Datamangel-liste med afklaringsspørgsmål

---

## Formål

Systematisk identificere, hvilke data der mangler for at gennemføre en opgave, og formulere strukturerede afklaringsspørgsmål.

## Input

- Opgavebeskrivelse
- Tilgængeligt datagrundlag
- Projektets fase og krav

## Metode

1. **Identificér nødvendige data**
   - Hvad skal bruges til beregninger?
   - Hvad skal bruges til dokumentation?
   - Hvad skal bruges til afklaringer?

2. **Sammenlign med tilgængeligt**
   - Hvad har vi?
   - Hvad mangler vi?

3. **Kategorisér mangler**
   - Kritisk (blokerer opgaven)
   - Høj (påvirker kvalitet)
   - Medium (kan antages midlertidigt)
   - Lav (kan afklares senere)

4. **Formulér afklaringsspørgsmål**
   - Præcise spørgsmål
   - Henvisning til, hvorfor data er nødvendig
   - Forslag til, hvem der kan svare

5. **Foreslå antagelser**
   - Hvad kan antages midlertidigt?
   - Hvilke konsekvenser har antagelsen?

## Output

| ID | Data | Kategori | Begrundelse | Afklaringsspørgsmål | Ansvarlig | Deadline | Antagelse | Konsekvens |
|---|---|---|---|---|---|---|---|---|

## Output — prioriteret mangelliste

```markdown
## Kritiske mangler (blokerer)
- [ID]: [beskrivelse] → [spørgsmål]

## Høje mangler (påvirker kvalitet)
- [ID]: [beskrivelse] → [spørgsmål]

## Middel mangler (kan antages)
- [ID]: [beskrivelse] → [foreslået antagelse]

## Lave mangler (senere)
- [ID]: [beskrivelse] → [spørgsmål]
```

## Begrænsninger

- Skel mellem manglende data og usikkerheder
- Marker altid, hvad der er antaget
- Opdater listen løbende
