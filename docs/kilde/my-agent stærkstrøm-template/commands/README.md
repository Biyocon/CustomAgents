# commands/

> Korte, eksekverbare workflows.
> Hver fil beskriver en specifik kommando med trin-for-trin udførelse.

---

## Formål

Denne mappe indeholder **kaldelige workflows**, som brugeren kan aktivere med en kort sætning. En command er en komplet proces fra start til slut, typisk ved at kombinere flere skills og eventuelt agentroller.

Commands adskiller sig fra skills ved at være **komplette workflows**, ikke isolerede metoder.

---

## Hvilke filer mappen indeholder

| Fil | Kommando | Beskrivelse |
|-----|----------|-------------|
| `start-project.md` | "Start nyt projekt" | Initialisér projekt med log, plan og kontekst |
| `start-diary.md` | "Start projektdagbog" | Opret eller opdater dagens dagbog |
| `run-ralph-loop.md` | "Kør Ralph-loop" | Iterativt arbejde med plan, udførelse, kontrol, forbedring |
| `use-multi-agent.md` | "Brug multi-agent" | Aktivér relevante specialistroller og syntetér |
| `generate-load-list.md` | "Lav load list" | Generér komplet load list fra input |
| `validate-load-list.md` | "Valider load list" | Kontrollér load list for fejl og mangler |
| `generate-sld-description.md` | "Lav SLD-beskrivelse" | Generér tekstbeskrivelse af SLD |
| `create-excalidraw-flow.md` | "Lav Excalidraw-flow" | Opret flowdiagramstruktur |
| `review-deliverable.md` | "Review dette" | Udfør teknisk QA-review af leverance |
| `create-work-description.md` | "Lav arbejdsbeskrivelse" | Udarbejd teknisk arbejdsbeskrivelse |
| `create-tender-list.md` | "Lav tilbudsliste" | Udarbejd tilbudsliste |
| `identify-missing-data.md` | "Hvad mangler vi?" | Identificér manglende data og afklaringer |

---

## Hvordan agenten skal bruge mappen

1. Genkend brugerens kommando (eksakt eller varianter).
2. Læs den tilsvarende command-fil.
3. Følg workflowets trin.
4. Aktivér relevante skills og agents undervejs.
5. Dokumentér fremgang og resultater.

---

## Hvad der ikke må gemmes her

- Projekt-specifikke resultater
- Personfølsomme oplysninger
- Kontraktkritiske data
- Midlertidige notater

---

## Eksempel på brug

> Bruger: "Kør Ralph-loop"
>
> Agent:
> 1. Læser `run-ralph-loop.md`
> 2. Følger cyklus: forstå → læs → planlæg → udfør → kontrollér → forbedr → gem
> 3. Opdaterer `tasks/today.md`, `tasks/backlog.md`, `diary/YYYY-MM-DD.md`, `quality/qa-findings.md`
> 4. Stopper ved stopkriterier og rapporterer status
