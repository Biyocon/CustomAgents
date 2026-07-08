# Command: Valider load list

> Kontrollér load list for fejl og mangler
> Trigger: "Valider load list" eller tilsvarende

---

## Formål

Validér en eksisterende load list ved at aktivere skill `load-list-validator.md`.

## Trigger

- "Valider load list"
- "Tjek load list"
- "Review load list"

## Workflow

1. **Modtag load list**
   - Færdig eller udkast til load list

2. **Aktivér skill**
   - `skills/load-list-validator.md`

3. **Udfør validering**
   - Tjek obligatoriske felter
   - Tjek beregnede værdier
   - Tjek plausibilitet
   - Tjek konsistens
   - Tjek komplethed

4. **Generér rapport**
   - Liste over fejl og advarsler
   - Anbefalinger til rettelser

## Output

- Valideringsrapport (QA-matrix)
- Liste over fejl og advarsler
- Anbefalinger

## Begrænsninger

- Kræver load list som input
- Kan ikke validere uden kendskab til projektets specifikke krav
