# Command: Start nyt projekt

> Initialisér projekt med log, plan og kontekst
> Trigger: "Start nyt projekt" eller tilsvarende

## Trigger

- "Start nyt projekt"
- "Start projekt"
- "Nyt projekt"

## Input fra bruger

```markdown
Projekt: [INDSÆT PROJEKTNAVN]
Kunde: [INDSÆT KUNDE]
Fase: [Skitse / Dispositionsforslag / Projektforslag / Udbud / Udførelse / As-built]
Domaene: [BaneByg / BBTR / BBE / BKP / generelt]
Opgave: [BESKRIV OPGAVEN]
Tilgængelige filer: [LISTE]
Output ønskes som: [beslutningsnotat / kravmatrix / risikolog / leveranceplan / reviewliste]
```

## Workflow

1. **Opsummer opgaven**
   - Gentag kort, hvad opgaven går ud på
   - Angiv antagelser
   - Angiv, hvad der mangler

2. **Angiv manglende input**
   - Liste over input, der er modtaget
   - Liste over input, der mangler
   - Kilder
   - Antagelser

3. **Foreslå arbejdsplan**
   - Trin-for-trin plan
   - Aktiver relevante skills og agenter
   - Estimeret tidsforbrug (hvis muligt)

4. **Opret projektlog**
   - Opret eller opdater `brain/tasks/today.md`
   - Opret eller opdater `brain/diary/YYYY-MM-DD.md`
   - Notér projektets navn, fase og opgave

5. **Aktivér relevante komponenter**
   - Vælg skills fra `.agents/skills/`
   - Vælg agenter fra `.agents/agents/` (hvis nødvendigt)
   - Vælg commands fra `.agents/commands/`

## Output

- Kort projektopsummering
- Liste over modtagne og manglende input
- Forslag til arbejdsplan
- Links til tasks/diary
