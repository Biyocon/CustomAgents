# Command: Start projektdagbog

> Opret eller opdater dagens dagbog
> Trigger: "Start projektdagbog" eller tilsvarende

---

## Formål

Initialisere eller opdatere den tekniske arbejdsdagbog for dagen. Dagbogen dokumenterer projekt, opgave, input, antagelser, beslutninger, beregninger, output og åbne punkter.

## Trigger

- "Start projektdagbog"
- "Dagbog"
- "Opdater dagbog"

## Workflow

1. **Tjek eksisterende dagbog**
   - Find `diary/YYYY-MM-DD.md` for i dag
   - Hvis den ikke findes, opret ny

2. **Udfyld standardfelter**
   - Dato
   - Projekt
   - Opgave
   - Input modtaget
   - Antagelser
   - Beslutninger
   - Beregninger
   - Output produceret
   - Åbne punkter
   - Næste handlinger
   - Filer ændret
   - Kvalitetskontroller udført

3. **Opdater `tasks/today.md`**
   - Marker afsluttede opgaver
   - Tilføj nye opgaver

## Output

Filen `diary/YYYY-MM-DD.md` opdateret med dagens aktiviteter.

## Begrænsninger

- Gem ikke følsomme oplysninger uden tydelig grund
- Spørg før permanent lagring af fortrolig information
