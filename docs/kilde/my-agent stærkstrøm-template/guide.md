# Guide — EnergiAgenten Template

> Oprettet: 2026-05-10
> Status: Onboarding fuldført — template klar til brug

---

## Projektstruktur

```
Sharmake/
├── AGENTS.md                    ← Masterprompt (fuld prompt)
├── CLAUDE.md                    ← Claude Code adapter
├── GEMINI.md                    ← Gemini CLI adapter
├── README.md                    ← Template-beskrivelse
├── guide.md                     ← Denne fil
│
├── agents/                      ← Specialistroller
│   ├── README.md
│   ├── lead-electrical-engineer.md
│   ├── standards-compliance-reviewer.md
│   ├── load-data-engineer.md
│   ├── calculation-engineer.md
│   ├── diagram-documentation-engineer.md
│   ├── qa-engineer.md
│   └── quantity-tender-engineer.md
│
├── skills/                      ← Genbrugelige evner
│   ├── README.md
│   ├── load-list-generator.md
│   ├── load-list-validator.md
│   ├── cable-sizing-assistant.md
│   ├── transformer-sizing-assistant.md
│   ├── switchboard-structure-designer.md
│   ├── sld-description-generator.md
│   ├── pump-motor-supply-assistant.md
│   ├── excalidraw-flow-generator.md
│   ├── work-description-writer.md
│   ├── qa-reviewer.md
│   ├── tender-list-generator.md
│   └── data-gap-analyzer.md
│
├── commands/                    ← Kaldelige workflows
│   ├── README.md
│   ├── start-project.md
│   ├── start-diary.md
│   ├── run-ralph-loop.md
│   ├── use-multi-agent.md
│   ├── generate-load-list.md
│   ├── validate-load-list.md
│   ├── generate-sld-description.md
│   ├── create-excalidraw-flow.md
│   ├── review-deliverable.md
│   ├── create-work-description.md
│   ├── create-tender-list.md
│   └── identify-missing-data.md
│
├── tools/                       ← Scripts og hjælpere
│   ├── README.md
│   ├── python/
│   │   ├── README.md
│   │   ├── load_list_tools.py
│   │   ├── excel_validator.py
│   │   └── calculation_helpers.py
│   ├── excel/
│   │   ├── README.md
│   │   └── schemas/
│   │       └── load_list_schema.md
│   ├── excalidraw/
│   │   ├── README.md
│   │   └── templates/
│   │       └── README.md
│   └── cad/
│       ├── README.md
│       └── export-notes.md
│
├── plugins/                     ← Værktøjsintegrationer
│   ├── README.md
│   ├── febdoc.md
│   ├── simaris.md
│   ├── autocad.md
│   ├── microstation.md
│   ├── sharepoint.md
│   ├── projectwise.md
│   ├── outlook.md
│   └── teams.md
│
├── mcp/                         ← MCP-ressourcer
│   ├── README.md
│   ├── servers.md
│   ├── resources.md
│   ├── prompts.md
│   └── tools.md
│
├── templates/                   ← Genbrugelige faglige skabeloner
│   ├── README.md
│   ├── load-lists/
│   ├── work-descriptions/
│   ├── tender-lists/
│   ├── qa/
│   ├── diagrams/
│   └── calculations/
│
├── memory/                      ← Brugerprofil og præferencer
│   ├── user-profile.md
│   ├── preferences.md
│   ├── engineering-principles.md
│   ├── ramboll-context.md
│   ├── open-decisions.md
│   └── lessons-learned.md
│
├── tasks/                       ← Opgaver
│   ├── today.md
│   ├── backlog.md
│   └── completed.md
│
├── diary/                       ← Teknisk arbejdsdagbog
│   └── YYYY-MM-DD.md
│
├── quality/                     ← Kvalitetssikring
│   ├── qa-findings.md
│   ├── qa-checklists/
│   └── review-templates/
│
├── docs/                        ← Standarder, Rambøll, eksempler
│   ├── standards/
│   ├── ramboll/
│   ├── project-examples/
│   └── superpowers/
│       └── specs/
│
└── projects/                    ← Aktive projekter
    └── README.md
```

---

## Modulær arkitektur

| Mappe | Formål | Indhold |
|-------|--------|---------|
| `AGENTS.md` | Masterprompt | Overordnet instruktion til agenten |
| `CLAUDE.md` | Claude adapter | Projektinstruktion for Claude Code |
| `GEMINI.md` | Gemini adapter | Kontekstfil for Gemini CLI |
| `agents/` | Specialistroller | Lead, QA, beregning, data, diagram, tilbud |
| `skills/` | Genbrugelige evner | Load lists, kabler, tavler, review, diagrammer |
| `commands/` | Kaldelige workflows | Start projekt, Ralph-loop, review, mm. |
| `tools/` | Scripts og hjælpere | Python, Excel, Excalidraw, CAD |
| `plugins/` | Værktøjsintegrationer | FEBDOC, Simaris, AutoCAD, MicroStation, SharePoint, ProjectWise, Outlook, Teams |
| `mcp/` | MCP-ressourcer | Servers, resources, prompts, tools |
| `templates/` | Faglige skabeloner | Load lists, arbejdsbeskrivelser, tilbudslister, QA, diagrammer, beregninger |
| `memory/` | Hukommelse | Brugerprofil, præferencer, principper, beslutninger |
| `tasks/` | Opgaver | Dagens opgaver, backlog, afsluttede |
| `diary/` | Dagbog | Teknisk arbejdsdagbog |
| `quality/` | Kvalitet | QA-fund, tjeklister, review-skabeloner |
| `docs/` | Reference | Standarder, Rambøll-dokumentation, projekteksempler |
| `projects/` | Aktive projekter | Kopieres fra template |

---

## Din profil — nøglepunkter

| Punkt | Værdi |
|-------|-------|
| **Rolle** | Senior rådgiver, el-ingeniør, industri |
| **Projekttyper** | Industrianlæg, procesbygninger, datacentre |
| **Opgaver** | Samtlige (load lists, dimensionering, tavler, kabler, review, udbud, QA…) |
| **Værktøjer** | Excel, VS Code, FEBDOC, Simaris, AutoCAD, MicroStation, Python, Excalidraw |
| **Output** | Struktureret dansk, markdown-tabeller, trin-for-trin beregninger, Excalidraw-struktur |
| **Kvalitet** | Mellemtrin, forudsætninger, QA-skema, track changes (AGR), mangelliste, åbne punkter med ejer/deadline |
| **Tone** | Professionel, konservativ, aktiv stemme, rent dansk |
| **Automatisering** | Excel/load lists, datamangel-lister, SLD/tavlestruktur/flowdiagrammer |
| **Memory-grænser** | Ingen CPR/persondata, ingen kontraktkritiske data |

---

## Sådan bruger du template'et

### 1. Opret nyt projekt fra template

```powershell
Copy-Item -Path "Sharmake" -Destination "MitNyeProjekt" -Recurse
```

### 2. Tilpas projektspecifikke filer

- `memory/ramboll-context.md` — tilføj projektspecifikke krav
- `memory/open-decisions.md` — tilføj projektets åbne beslutninger
- `docs/standards/` — tilføj gældende standarder
- `docs/ramboll/` — tilføj Rambøll-specifikke dokumenter
- `projects/` — tilføj projektfiler

### 3. Start agenten

Afhængigt af din klient:

- **Claude Code:** Åbn mappen — `CLAUDE.md` indlæses automatisk
- **Gemini CLI:** Brug `@GEMINI.md` og `@AGENTS.md` som kontekst
- **Codex:** `AGENTS.md` læses som projektinstruktion
- **Kimi:** Indlæs `AGENTS.md` som systemprompt

### 4. Start projektet

Brug standardkommandoen:

> "Start nyt projekt"

Eller kopier og udfyld:

```markdown
Projekt: [INDSÆT PROJEKTNAVN]
Kunde: [INDSÆT KUNDE]
Fase: [Skitseprojekt / Dispositionsforslag / Projektforslag / Udbud / Udførelse / As-built]
Fagområde: El / Energi / Stærkstrøm
Opgave: [BESKRIV OPGAVEN]
Tilgængelige filer: [LISTE]
Output ønskes som: [load list / arbejdsbeskrivelse / QA-review / diagram / tilbudsliste / teknisk notat]
```

Agenten vil:
1. Opsummere opgaven
2. Angive manglende input
3. Foreslå arbejdsplan
4. Oprette projektlog
5. Bruge Ralph-loop, hvis nødvendigt
6. Bruge multi-agent-review, hvis teknisk risiko

---

## Standardkommandoer

| Kommando | Beskrivelse | Fil |
|----------|-------------|-----|
| "Start nyt projekt" | Initialisér projekt | `commands/start-project.md` |
| "Start projektdagbog" | Opret/opdater dagbog | `commands/start-diary.md` |
| "Kør Ralph-loop" | Iterativt arbejde | `commands/run-ralph-loop.md` |
| "Brug multi-agent" | Specialistroller | `commands/use-multi-agent.md` |
| "Lav load list" | Generér load list | `commands/generate-load-list.md` |
| "Valider load list" | Tjek load list | `commands/validate-load-list.md` |
| "Lav SLD-beskrivelse" | Generér SLD-tekst | `commands/generate-sld-description.md` |
| "Lav Excalidraw-flow" | Flowdiagramstruktur | `commands/create-excalidraw-flow.md` |
| "Review dette" | Teknisk QA-review | `commands/review-deliverable.md` |
| "Lav arbejdsbeskrivelse" | Teknisk beskrivelse | `commands/create-work-description.md` |
| "Lav tilbudsliste" | Tilbudsliste | `commands/create-tender-list.md` |
| "Hvad mangler vi?" | Datamangel-liste | `commands/identify-missing-data.md` |

---

## Kvalitetskrav — husk altid

1. Alle beregninger skal vises med mellemtrin
2. Alle forudsætninger skal dokumenteres
3. QA-tjekliste + QA-procedure + QA-skema med granskningskommentar og aktioner
4. Agent reviewer skal dokumentere granskning i dokumenter med track changes, initialer (**AGR**), dato
5. Kollega skal reviewe godkendt materiale
6. Altid mangelliste
7. Altid åbne punkter med ejer og deadline

---

## Hukommelsesbegrænsninger

**Aldrig gem uden eksplicit tilladelse:**
- Personfølsomme oplysninger (CPR-numre, persondata)
- Kontraktkritiske data (tidsfrister, økonomi, risici)

**Spørg altid ved tvivl om sensitivitet.**

---

## Filbeskrivelser

| Fil | Formål |
|-----|--------|
| `AGENTS.md` | Masterprompt — agentens instruktioner og adfærd |
| `CLAUDE.md` | Claude Code-projektinstruktion og kontekst |
| `GEMINI.md` | Gemini CLI-kontekstfil med modulære imports |
| `README.md` | Template-beskrivelse og kom-i-gang-guide |
| `guide.md` | Denne vejledning |
| `memory/user-profile.md` | Brugerens profil, rolle, præferencer, projekttyper |
| `memory/preferences.md` | Sprog, outputformat, tabelstruktur |
| `memory/engineering-principles.md` | Kvalitetskrav, principper, non-negotiables |
| `memory/ramboll-context.md` | Rambøll-specifik kontekst, skabeloner, procedurer |
| `memory/open-decisions.md` | Åbne beslutninger med status og deadline |
| `memory/lessons-learned.md` | Læringspunkter fra projekter |
| `tasks/today.md` | Dagens opgaver |
| `tasks/backlog.md` | Fremtidige opgaver |
| `tasks/completed.md` | Afsluttede opgaver |
| `diary/YYYY-MM-DD.md` | Dagbog med detaljer om dagens arbejde |
| `quality/qa-findings.md` | QA-fund med observationer og anbefalinger |
| `quality/qa-checklists/` | Standardiserede tjeklister |
| `quality/review-templates/` | Review-skabeloner |
| `agents/[rolle].md` | Specialistroller med ansvar og kompetencer |
| `skills/[evne].md` | Genbrugelige faglige evner |
| `commands/[kommando].md` | Kaldelige workflows |
| `tools/python/[script].py` | Python-scripts |
| `plugins/[værktøj].md` | Integrationer til eksterne systemer |
| `mcp/[komponent].md` | MCP-servers, -resources, -prompts, -tools |
| `templates/[type]/` | Genbrugelige faglige skabeloner |
| `docs/standards/` | Gældende standarder |
| `docs/ramboll/` | Rambøll-specifik dokumentation |
| `docs/project-examples/` | Anonymiserede projekteksempler |
| `projects/[projektnavn]/` | Aktive projekter |

---

## Kontakt og support

Denne template er designet til personlig brug som el-ingeniør i energi- og stærkstrømsprojektering.
Ved spørgsmål eller behov for justeringer — opdater `AGENTS.md` eller relevante moduler.
