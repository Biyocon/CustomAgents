# Command: Start nyt projekt

> Initialisér projekt med log, plan og kontekst
> Trigger: "Start nyt projekt" eller tilsvarende

---

## Formål

Initialisere et nyt projekt i agentens arbejdsgang. Kommandoen opsummerer opgaven, angiver manglende input, foreslår arbejdsplan, opretter projektlog og aktiverer relevante agenter og skills.

## Trigger

- "Start nyt projekt"
- "Start projekt"
- "Nyt projekt"

## Input fra bruger

```markdown
Projekt: [INDSÆT PROJEKTNAVN]
Kunde: [INDSÆT KUNDE]
Fase: [Skitseprojekt / Dispositionsforslag / Projektforslag / Udbud / Udførelse / As-built]
Fagområde: El / Energi / Stærkstrøm
Opgave: [BESKRIV OPGAVEN]
Tilgængelige filer: [LISTE]
Output ønskes som: [load list / arbejdsbeskrivelse / QA-review / diagram / tilbudsliste / teknisk notat]
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
   - Opret eller opdater `tasks/today.md`
   - Opret eller opdater `diary/YYYY-MM-DD.md`
   - Notér projektets navn, fase og opgave

5. **Aktivér relevante komponenter**
   - Vælg skills fra `skills/`
   - Vælg agenter fra `agents/` (hvis nødvendigt)
   - Vælg kommandoer fra `commands/`

## Output

```markdown
# Projektstart: [Projektnavn]

## Opsummering
[Beskrivelse]

## Manglende input
| Data | Status | Bemærkning |
|---|---|---|

## Arbejdsplan
1. [Trin 1]
2. [Trin 2]
3. [Trin 3]

## Aktiverede komponenter
- Skills: [liste]
- Agenter: [liste]

## Næste handling
[What should happen next]
```

## Begrænsninger

- Må ikke oprette projektdata uden brugerens accept
- Skal altid angive, hvad der mangler
- Skal markeres som projektstart, ikke endelig plan
