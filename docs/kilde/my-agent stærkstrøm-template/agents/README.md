# agents/

> Specialistroller til multi-agent metode.
> Hver fil definerer en agents ansvar, kompetencer og outputkrav.

---

## Formål

Denne mappe indeholder **genbrugelige agentprofiler**, der repræsenterer forskellige specialistroller i el-teknisk projektering. Når en opgave er stor, tværfaglig eller risikofyldt, kan agenten aktivere én eller flere af disse roller for at sikre grundig analyse og syntese.

Agenten tænker og kontrollerer arbejdet gennem disse roller, men leverer altid **én samlet konklusion**.

---

## Hvilke filer mappen indeholder

| Fil | Rolle | Fokus |
|-----|-------|-------|
| `lead-electrical-engineer.md` | Lead Electrical Engineer | Samlet teknisk retning, projekteringslogik, syntese |
| `standards-compliance-reviewer.md` | Standards & Compliance Reviewer | Standarder, myndighedskrav, sikkerhed, dokumentation |
| `load-data-engineer.md` | Load & Data Engineer | Belastningslister, datakvalitet, forbrugsstruktur |
| `calculation-engineer.md` | Calculation Engineer | Beregninger, enheder, formler, kontrolberegninger |
| `diagram-documentation-engineer.md` | Diagram & Documentation Engineer | Flowdiagrammer, Excalidraw, tegningsnoter, dokumentstruktur |
| `qa-engineer.md` | QA Engineer | Review, fejlfinding, tjeklister, sporbarhed |
| `quantity-tender-engineer.md` | Quantity & Tender Engineer | Mængdeudtræk, tilbudslister, optioner, forbehold |

---

## Hvordan agenten skal bruge mappen

1. Ved komplekse opgaver: identificér, hvilke roller der er relevante.
2. Læs de relevante agentfiler for at forstå deres perspektiv.
3. Gennemfør analysen gennem hver rolles øjne.
4. Syntetér resultatet til én samlet konklusion.
5. Dokumentér, hvilke roller der blev aktiveret, og hvorfor.

---

## Hvad der ikke må gemmes her

- Projekt-specifikke beregninger eller data
- Personfølsomme oplysninger
- Kontraktkritiske data
- Midlertidige notater eller udkast

---

## Eksempel på brug

> Bruger: "Brug multi-agent"
>
> Agent:
> 1. Læser `lead-electrical-engineer.md` for overordnet retning
> 2. Læser `calculation-engineer.md` for beregninger
> 3. Læser `qa-engineer.md` for review
> 4. Udfører analysen gennem alle tre roller
> 5. Leverer én samlet konklusion med reference til, hvilke roller der bidrog
