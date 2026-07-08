# Integrationsplan: Sharmake-mønstre i Custom .agents/

> Dato: 2026-07-01
> Status: Udført — første overførsel gennemført
> Mål: Integrere Sharmakes operationelle lag (commands, tools, templates, plugins, memory) i `.agents/`-strukturen, så den kan fungere som model-agnostisk canonical kilde for Custom agent-harnesset.

---

## 1. Baggrund

Sharmake (EnergiAgenten-template) er en komplet, lille agent-template til el/stærkstrøm med klare arbejdsgange, skabeloner, værktøjer og personlig hukommelse. Custom `.agents/` er en større model-agnostisk struktur med mange agenter, skills, Brain og registry, men den manglede de operationelle lag som gør Sharmake brugbar fra dag ét.

Denne plan beskriver, hvordan Sharmake-mønstrene er blevet overført og integreret.

---

## 2. Hvad er overført

Følgende nye mapper og filer er oprettet under `.agents/`:

### 2.1 `.agents/commands/` — kaldelige workflows

13 commands, inspireret af Sharmake, men tilpasset Custom/Banedanmark-konteksten:

| Fil | Trigger | Formål |
|-----|---------|--------|
| `start-project.md` | "Start nyt projekt" | Initialisér projekt, log, plan og kontekst |
| `start-diary.md` | "Start dagbog" | Opret/opdater dagens dagbog |
| `run-ralph-loop.md` | "Kør Ralph-loop" | Iterativ PDCA-lignende arbejdsgang |
| `use-multi-agent.md` | "Brug multi-agent" | Aktivér specialistagenter og syntetisér |
| `review-deliverable.md` | "Review dette" | QA-review af leverance |
| `identify-missing-data.md` | "Hvad mangler vi?" | Find manglende data og afklaringer |
| `generate-requirement-matrix.md` | "Lav kravmatrix" | Strukturer krav fra input |
| `create-decision-note.md` | "Lav beslutningsnotat" | Udarbejd beslutningsklart notat |
| `create-risk-log.md` | "Lav risikolog" | Identificér og strukturér risici |
| `create-work-description.md` | "Lav arbejdsbeskrivelse" | Teknisk arbejdsbeskrivelse |
| `create-tender-list.md` | "Lav tilbudsliste" | Tilbudsliste med poststruktur |

### 2.2 `.agents/tools/` — eksekverbare hjælpere

| Mappe/Fil | Formål |
|-----------|--------|
| `python/validation_helpers.py` | Generelle valideringsfunktioner |
| `python/calculation_helpers.py` | Matematiske beregningshjælpere |
| `python/excel_validator.py` | Validering af Excel-filer |
| `excel/schemas/README.md` | Standard kolonnedefinitioner |
| `excalidraw/templates/README.md` | Diagramskabeloner |
| `cad/export-notes.md` | CAD-eksportnoter |

### 2.3 `.agents/templates/` — output-skabeloner

8 skabelonkategorier:

- `load-lists/`
- `work-descriptions/`
- `tender-lists/`
- `qa/`
- `diagrams/`
- `calculations/`
- `decision-notes/`
- `risk-logs/`

Hver undermappe har en `README.md` med formål og brugsanvisning.

### 2.4 `.agents/plugins/` — eksterne værktøjsintegrationer

8 plugin-beskrivelser:

- `sharepoint.md`
- `projectwise.md`
- `teams.md`
- `outlook.md`
- `autocad.md`
- `microstation.md`
- `febdoc.md`
- `simaris.md`

Hver fil er et scaffold, der skal udfyldes med konkret organisationsviden.

### 2.5 `.agents/brain/personal/`, `.agents/brain/diary/`, `.agents/brain/tasks/` — personlig hukommelse og opgavestyring

| Fil/Mappe | Formål |
|-----------|--------|
| `brain/personal/user-profile.md` | Brugerprofil |
| `brain/personal/preferences.md` | Præferencer |
| `brain/personal/lessons-learned.md` | Læring |
| `brain/personal/open-decisions.md` | Åbne beslutninger |
| `brain/diary/YYYY-MM-DD.md` | Daglig arbejdsdagbog |
| `brain/tasks/today.md` | Dagens opgaver |
| `brain/tasks/backlog.md` | Fremtidige opgaver |
| `brain/tasks/completed.md` | Afsluttede opgaver |

---

## 3. Integrationsprincipper

### 3.1 Bevare eksisterende struktur

De nye mapper er tilføjet uden at ændre eksisterende:

- `.agents/agents/` — uændret
- `.agents/skills/` — uændret
- `.agents/brain/context.md` — uændret
- `.agents/brain/assumptions.md` — uændret
- `.agents/brain/open-questions.md` — uændret
- `.agents/model-adapters/` — uændret
- `.agents/registry.yaml` — opdateres (se nedenfor)

### 3.2 Commands bruger eksisterende skills og agenter

Commands er designet til at aktivere eksisterende komponenter:

- `review-deliverable.md` bruger `shared-quality` eller `qa`
- `generate-requirement-matrix.md` bruger `to-prd` / `to-issues`
- `create-risk-log.md` bruger `bdk-risk-profile` / `bbtr-risiko-myndighed`
- `create-tender-list.md` bruger `bbtr-raadgiver-udbud` / `bdk-legal-mapping`
- `use-multi-agent.md` bruger `.agents/agents/` og `.vscode/.codex/agents/`

### 3.3 Templates bruges som udgangspunkt

Templates må ikke redigeres direkte med projektspecifikke data. De kopieres til projektets mappe og tilpasses der.

### 3.4 Tools køres med `uv run`

Python-scripts i `.agents/tools/python/` skal køres via `uv run`, i overensstemmelse med projektets regler.

---

## 4. Forhold til `.vscode/.codex/`

Per `AGENTS.md` er `.vscode/.codex/` stadig den aktive runtime. `.agents/` er fremtidig canonical kilde under opbygning.

Derfor gælder:

1. De nye `.agents/commands/`, `.agents/tools/`, `.agents/templates/`, `.agents/plugins/` og `.agents/brain/personal/` skal på sigt synkroniseres til `.vscode/.codex/`.
2. Indtil `.agents/` er aktiveret som aktiv runtime, bør brugeren enten:
   - Bruge `.vscode/.codex/` som aktiv, eller
   - Eksplicit aktivere `.agents/` og synkronisere.
3. `invoke-agent.ps1` bør udvides, så commands kan aktiveres direkte.

---

## 5. Nødvendige næste skridt

### 5.1 Kortsigtet (denne uge)

1. **Opdater `.agents/registry.yaml`** — tilføj nye mapper og filer.
2. **Udfyld plugin-scaffolds** — `sharepoint.md`, `projectwise.md`, etc. med konkret organisationsviden.
3. **Udfyld personlig hukommelse** — `brain/personal/user-profile.md`, `preferences.md`.
4. **Opdater `invoke-agent.ps1`** så commands kan listes og aktiveres.
5. **Kør validering** — `.agents/scripts/validate-harness.ps1`.

### 5.2 Mellemlangt (inden for måneden)

1. **Synkroniser `.agents/` → `.vscode/.codex/`** — kopier relevante commands, tools, templates.
2. **Udbyg templates** — tilføj faktiske skabelonindhold (ikke kun README'er).
3. **Udbyg tools** — færdiggør `excel_validator.py` og tilføj tests.
4. **Skriv runbook** for vedligeholdelse af commands og templates.

### 5.3 Langsigtet

1. **Aktiver `.agents/` som aktiv runtime** — kræver ny valideringsrapport og eksplicit beslutning.
2. **Etablér sync-mekanisme** — script der automatisk propagerer `.agents/` → `.vscode/.codex/`.
3. **Fjern duplikering** — når `.agents/` er aktiv, kan `.vscode/.codex/` blive en ren runtime-cache.

---

## 6. Valideringskriterier

Før `.agents/` kan betragtes som fuldt integreret med Sharmake-mønstrene, skal følgende være opfyldt:

- [ ] `.agents/commands/` kan listes og anvendes af agenter
- [ ] `.agents/templates/` indeholder mindst ét brugbart eksempel i hver kategori
- [ ] `.agents/tools/python/` kan køres med `uv run`
- [ ] `.agents/plugins/` er udfyldt med konkret organisationsviden
- [ ] `.agents/brain/personal/user-profile.md` og `preferences.md` er udfyldt
- [ ] `.agents/registry.yaml` reflekterer nye mapper
- [ ] Valideringsscript kører uden fejl
- [ ] Relevante dele er synkroniseret til `.vscode/.codex/`

---

## 7. Risici og afbødning

| Risiko | Impact | Afbødning |
|--------|--------|-----------|
| Commands forbliver tomme skabeloner | Lav brugbarhed | Udfyld med konkrete triggers og trin |
| `.agents/` og `.vscode/.codex/` divergerer yderligere | Forvirring | Etablér sync-runbook |
| Plugins indeholder for generisk info | Ingen reel værdi | Udfyld med specifikke organisationsregler |
| Personlig hukommelse ikke vedligeholdt | Agenter kender ikke brugeren | Gør det til vane at opdatere ved onboarding |

---

## 8. Konklusion

Sharmake-mønstrene er nu overført til `.agents/` som et nyt operationelt lag. Custom-harnesset har nu både:

- **Strategisk infrastruktur:** agenter, skills, Brain, registry, model-adapters
- **Operationelt lag:** commands, tools, templates, plugins, personal memory, diary, tasks

Næste fase er at udfylde scaffolds, opdatere registry, og etablere en sync-mekanisme til `.vscode/.codex/`.
