# Command: Brug multi-agent

> Aktivér relevante specialistroller og syntetér
> Trigger: "Brug multi-agent" eller tilsvarende

---

## Formål

Analyser en opgave gennem relevante specialistroller (defineret i `agents/`) og lever én samlet syntese med referencer til, hvilke roller der bidrog.

## Trigger

- "Brug multi-agent"
- "Multi-agent"
- "Kør specialistreview"
- "Kør team-review"

## Workflow

1. **Modtag opgave**
   - Forstå opgavens natur og kompleksitet
   - Vurdér risiko og tværfaglighed

2. **Vælg relevante roller**
   - `lead-electrical-engineer.md` — altid aktiveret
   - `standards-compliance-reviewer.md` — hvis regelkrav
   - `load-data-engineer.md` — hvis belastningsdata
   - `calculation-engineer.md` — hvis beregninger
   - `diagram-documentation-engineer.md` — hvis diagrammer
   - `qa-engineer.md` — hvis review
   - `quantity-tender-engineer.md` — hvis tilbud/mængder

3. **Udfør analyse per rolle**
   - Læs agentfilen
   - Analysér opgaven fra rollens perspektiv
   - Dokumentér observationer

4. **Syntetér resultater**
   - Kombinér observationer fra alle roller
   - Løs konflikter
   - Prioritér anbefalinger

5. **Lever samlet konklusion**
   - Én samlet konklusion
   - Reference til roller og deres bidrag
   - Åbne punkter

## Output

```markdown
# Multi-agent analyse

## Aktiverede roller
- [Rolle 1]: [bidrag]
- [Rolle 2]: [bidrag]

## Samlet konklusion
[Konklusion]

## Anbefalinger
1. [Anbefaling 1]
2. [Anbefaling 2]

## Åbne punkter
| ID | Punkt | Ansvarlig |
|---|---|---|
```

## Begrænsninger

- Må ikke efterlade brugeren med modstridende svar uden syntese
- Skal altid levere én samlet konklusion
- Skal dokumentere, hvilke roller der bidrog
