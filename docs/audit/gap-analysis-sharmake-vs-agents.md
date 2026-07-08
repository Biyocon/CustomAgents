# Gap-analyse: Sharmake-template vs. Custom .agents/ vs. .vscode/.codex/

> Dato: 2026-07-01
> Kilde: `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom\docs\kilde\my-agent stærkstrøm-template`
> Sammenligningsmål: `Custom\.agents\` og `Custom\.vscode\.codex\`
> Formål: Vurdere hvilke Sharmake-mønstre der bør overføres til Custom-harnesset, og hvordan de integreres i den eksisterende struktur.

---

## Executive summary

**Sharmake (EnergiAgenten)** er en lille, komplet og praktisk agent-template til én fagdisciplin (el/stærkstrøm). Den har klare arbejdsgange, faglige skabeloner, værktøjer, plugin-integration og personlig hukommelse. Custom `.agents/` og `.vscode/.codex/` er større, strategiske agent-harness-strukturer med mange agenter, skills, Brain og registry, men de mangler de operationelle lag som gør Sharmake anvendelig fra dag ét.

**Konklusion:** Custom-harnesset har bedre *skala*, *struktur* og *domænedybde*, men Sharmake er langt mere *operationelt færdig*. De vigtigste huller i Custom er:

1. Ingen `commands/`-mappe med kaldelige workflows.
2. Ingen `tools/`-mappe med eksekverbare hjælpere og integrationer.
3. Ingen `templates/`-mappe med standardiserede output-skabeloner.
4. Ingen `plugins/`-mappe med eksterne værktøjsintegrationer.
5. Ingen personlig `memory/`-struktur (brugerprofil, præferencer, læring).
6. Ingen dagbog- eller opgavestruktur (`diary/`, `tasks/`).

Denne rapport anbefaler at overføre Sharmake-mønstrene som et nyt operationelt lag under `.agents/`, tilpasset Custom/Banedanmark-konteksten.

---

## 1. Sharmake-template: overblik

| Egenskab | Måling |
|----------|--------|
| Filer | 86 |
| Mapper | 13 |
| Markdown-filer | 83 |
| Samlede linjer | ~3.887 |
| Agenter | 7 |
| Skills | 13 |
| Commands | 13 |
| Plugins | 8 |
| Tool-kategorier | 4 (python, excel, excalidraw, cad) |
| Template-kategorier | 6 (load-lists, work-descriptions, tender-lists, qa, diagrams, calculations) |
| Memory-filer | 7 (user-profile, preferences, engineering-principles, ramboll-context, open-decisions, lessons-learned, user-profile) |

### 1.1 Filosofi
Sharmake er tænkt som en **personlig, faglig AI-template**. Den bygger på:

- Én masterprompt (`AGENTS.md`) der definerer agentens identitet.
- Klientadapters (`CLAUDE.md`, `GEMINI.md`) for forskellige AI-klienter.
- Modulære komponenter (`agents/`, `skills/`, `commands/`, `tools/`, `plugins/`).
- Persistent brugerhukommelse (`memory/`, `diary/`, `tasks/`).
- Kvalitetssikring (`quality/`, QA-fund, review-skabeloner).
- Faglige leveranceskabeloner (`templates/`).

### 1.2 Styrker

1. **Anvendelighed:** Brugeren kan kopiere templaten og arbejde med det samme.
2. **Klare workflows:** `commands/` giver 13 genkendelige, kaldelige processer.
3. **Faglig skabelonbank:** `templates/` sikrer konsistente load lists, arbejdsbeskrivelser, tilbudslister, QA, diagrammer, beregninger.
4. **Tool-integrering:** Python-scripts, Excel-schemas, Excalidraw-templates, CAD-export-noter.
5. **Plugin-økosystem:** Beskrivelser af integrationer til Simaris, FEBDOC, AutoCAD, MicroStation, SharePoint, ProjectWise, Outlook, Teams.
6. **Personlig hukommelse:** Brugerprofil, præferencer, principper, åbne beslutninger, læring.
7. **Diary/opgaver:** Struktur til at følge arbejdsgangen over tid.

### 1.3 Begrænsninger

1. **Domæne:** Kun el/stærkstrøm — ikke skaleret til mange fagdiscipliner.
2. **Ingen registry/agents-struktur:** Agenter er flade markdown-filer, ikke YAML-frontmatter-profiler.
3. **Ingen multi-model adapterstruktur:** Kun `CLAUDE.md`/`GEMINI.md`, ikke en systematisk model-agnostisk adapter.
4. **Ingen Brain/registry:** Ingen central kontekst- eller konfigurationsfil.
5. **Ingen runtime-integration:** Templaten bruges manuelt, ikke via `invoke-agent.ps1`.

---

## 2. Custom `.agents/`: overblik

| Egenskab | Måling |
|----------|--------|
| Filer | 329 |
| Mapper | 8 (top-level) |
| Markdown-filer | 262 |
| Samlede linjer | ~25.726 |
| Agenter | 28 mapper |
| Skills | 34 mapper |
| Brain-filer | 9+ |
| Registry | `registry.yaml` + rod-`registry.yaml` |
| Model-adapters | 4 |
| Scripts | 4 PowerShell |
| Reports | 8+ |

### 2.1 Filosofi
`.agents/` er den **fremtidige model-agnostiske canonical kilde**. Den adskiller:

- `agents/`: persona-baserede profiler med `profile.md` + `skills.yaml`.
- `skills/`: kuraterede, genbrugelige evner med `SKILL.md`.
- `brain/`: persistent projektkontekst, antagelser, spørgsmål, ADR'er, runbooks, kort.
- `registry.yaml`: maskinlæsbar manifest.
- `model-adapters/`: adapters til Codex, Kimi, Qwen Code, Gemini Code.
- `vendor/`: upstream skill-referencer.

### 2.2 Styrker

1. **Skala og dækning:** 28 agenter, 34 skills, mange domæner (Banedanmark, IQRA, generel engineering).
2. **Struktur:** Klar konvention for agenter (`profile.md` + `skills.yaml` + `AGENTS.md` + `avatar.md`).
3. **Model-agnostisk:** Bygget til at virke på tværs af Codex, Kimi, Qwen Code, Gemini Code.
4. **Brain:** Stabil projektkontekst, antagelser, åbne spørgsmål, ADR'er, runbooks.
5. **Registry:** Forsøg på maskinlæsbar manifest.
6. **Domænedybde:** BBTR, BBE, BKP, BaneByg, CSM/TSI, trafikale regler, etc.

### 2.3 Begrænsninger

1. **Ingen operationelle workflows:** Ingen `commands/`-mappe med kaldelige processer.
2. **Ingen værktøjsbank:** Ingen `tools/`-mappe med scripts, schemas, export-noter.
3. **Ingen output-skabeloner:** Ingen `templates/`-mappe med standardiserede leverancer.
4. **Ingen plugin/integrationer:** Ingen `plugins/`-mappe med eksterne værktøjsbeskrivelser.
5. **Ingen personlig hukommelse:** `.agents/brain/memory/` kun har sessionslogfiler, ikke brugerprofil/præferencer.
6. **Ingen opgave-/dagbogstruktur:** Ingen `tasks/` eller `diary/`.
7. **Registry divergerer:** `.agents/registry.yaml` og rod-`registry.yaml` er ikke synkroniserede.
8. **Delvist placeholder-indhold:** Nogle skills er meget korte/tomme (`edit-article` 10 linjer, `grill-me` 8 linjer, `zoom-out` 7 linjer).

---

## 3. Custom `.vscode/.codex/`: overblik

| Egenskab | Måling |
|----------|--------|
| Filer | 272 |
| Mapper | 5 (top-level) |
| Markdown-filer | 213 |
| Samlede linjer | ~14.438 |
| Agenter | 14 Banedanmark-rollemapper + avatar-roster |
| Skills | 74 mapper |
| Brain | Ja |
| Prompts | `prompts/` |
| Scripts | `invoke-agent.ps1`, `invoke-agent.py`, etc. |

### 3.1 Filosofi
`.vscode/.codex/` er den **aktive runtime** for VS Code/Codex i dag. Den har:

- `prompts/master-system.md`: fælles systemprompt.
- `agents/banedanmark/`: 14 rolleagenter med 4-fil-pakke.
- `skills/`: 74 skills, mange domænespecifikke.
- `Brain/`: aktiv hukommelse.
- `scripts/`: invoke-agent, validering, etc.

### 3.2 Styrker

1. **Aktiv runtime:** Bruges direkte af VS Code/Codex.
2. **Invoke-agent system:** `invoke-agent.ps1 -l` lister agenter, `-p` outputter prompt.
3. **Rolleagenter:** 14 Banedanmark-roller med klar 4-fil-struktur.
4. **Mange skills:** 74 skills, inklusive mange BDK/BBTR/BBE/BKP-skills.
5. **Master-system prompt:** `.vscode/.codex/prompts/master-system.md` giver fælles adfærd.

### 3.3 Begrænsninger

1. **FORELØBIGE agenter:** 4 af 14 Banedanmark-roller er `FORELØBIG` (`byggeleder-tilsyn`, `interface-manager`, `projektleder`, `udbudskonsulent`).
2. **Ingen commands/tools/templates/plugins:** Samme huller som `.agents/`.
3. **Model-specifik:** Tæt koblet til VS Code/Codex, selvom den også har Kimi/Qwen/Gemini-adapters.
4. **Roster-divergens:** `agent-roster.json` har 37 agenter, men 10 er arkiverede uden avatar.
5. **To registries:** `.vscode/.codex/registry.yaml` er en tom scaffold.

---

## 4. Sammenligning efter kategori

### 4.1 Agenter

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Antal | 7 | 28 | 14 + 37 i roster |
| Type | Specialistroller | Personaer | Banedanmark-roller + personaer |
| Struktur | Flade `.md` | `profile.md` + `skills.yaml` + `AGENTS.md` + `avatar.md` | `profile.md` + `skills.yaml` + `AGENTS.md` + `avatar.md` |
| Længde | 33-42 linjer | 40-255 linjer | 28-59 linjer (Banedanmark) |
| Fokus | Faglige el-roller | Brede personaer/domæner | BaneByg-roller |
| Mangler | YAML-frontmatter, registry-binding | Faglige specialistroller under hver persona | Fuld indhold i 4 profiler |

**Vurdering:** Custom har bedre agent-struktur, men Sharmake har mere brugbare faglige specialistroller. En fusion ville være: behold Custom's agent-struktur, men tilføj faglige specialistroller og commands til at aktivere dem.

### 4.2 Skills

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Antal | 13 | 34 | 74 |
| Længde | 49-96 linjer | 7-249 linjer | varierer |
| Fokus | El-tekniske opgaver | Generelle + Banedanmark | Generelle + Banedanmark |
| Struktur | Flade `.md` | `SKILL.md` + references/scripts | `SKILL.md` + references/scripts |
| Commands | Nej | Nej | Nej |

**Vurdering:** Custom har flere skills, men Sharmake's skills er mere operationelle (de beskriver konkrete opgaver med input/output/metode). Custom har generelle adfærdsskills og domæneskills, men færre "gør det her"-skills. Sharmake-skills som `load-list-generator`, `work-description-writer`, `qa-reviewer` burde tilføjes som generiske patterns.

### 4.3 Commands / workflows

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Mappe | `commands/` | Ingen | Ingen |
| Antal | 13 | 0 | 0 |
| Eksempler | `start-project`, `generate-load-list`, `review-deliverable` | — | — |

**Vurdering:** Dette er Sharmake's største fordel. Custom har ingen kaldelige workflows. Brugeren skal selv vide, hvilken agent/skill der skal bruges. Overførsel af commands-konceptet er højeste prioritet.

### 4.4 Tools

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Mappe | `tools/` | Ingen | Ingen |
| Python-scripts | 3 | 0 | 0 |
| Excel-schemas | 1 | 0 | 0 |
| Excalidraw-templates | 1 | 0 | 0 |
| CAD-noter | 2 | 0 | 0 |

**Vurdering:** Custom har ingen eksekverbare værktøjer. Sharmake's tool-mappe er et pattern, der bør kopieres. Indholdet kan genbruges generisk (load list tools, Excel validator, Excalidraw templates).

### 4.5 Templates

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Mappe | `templates/` | Ingen | Ingen |
| Kategorier | 6 | 0 | 0 |

**Vurdering:** Custom har ingen skabelonbank. Dette er kritisk for konsistente leverancer. Sharmake's template-kategorier bør overføres som generiske output-skabeloner.

### 4.6 Plugins / MCP

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Plugin-mappe | `plugins/` | Ingen | Ingen |
| MCP-mappe | `mcp/` | Ingen | Ingen |
| Beskrevne integrationer | 8 | 0 | 0 |

**Vurdering:** Custom har ingen beskrivelser af, hvordan agenter interagerer med eksterne værktøjer. Sharmake's plugin-pattern bør overføres.

### 4.7 Memory / Brain

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Brugerprofil | `memory/user-profile.md` | Ingen | Ingen |
| Præferencer | `memory/preferences.md` | Ingen | Ingen |
| Åbne beslutninger | `memory/open-decisions.md` | `brain/open-questions.md`, `brain/assumptions.md` | `Brain/` |
| Læring | `memory/lessons-learned.md` | Ingen | Ingen |
| Dagbog | `diary/` | Ingen | Ingen |
| Opgaver | `tasks/` | Ingen | Ingen |
| Projektkontekst | `docs/ramboll/`, `docs/standards/` | `brain/context.md` | `Brain/context.md` |

**Vurdering:** Custom har stærk projektkontekst (Brain), men mangler personlig brugerhukommelse og opgave-/dagbogstruktur. Sharmake's `memory/`, `diary/`, `tasks/` bør integreres.

### 4.8 Klient-adapters

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Filer | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | `model-adapters/codex.md`, etc. | `prompts/master-system.md`, `.vscode/settings/` |
| Model-agnostisk | Delvist | Ja | Delvist |

**Vurdering:** `.agents/model-adapters/` er den mest systematiske tilgang. Sharmake's `CLAUDE.md`/`GEMINI.md` er simple adapters, der kan inspirere `.agents/model-adapters/`.

### 4.9 Registry

| Aspekt | Sharmake | `.agents/` | `.vscode/.codex/` |
|---|---|---|---|
| Registry | Ingen | `registry.yaml` + rod-`registry.yaml` | `agent-roster.json` + `registry.yaml` |
| Status | — | Divergerende | Tom scaffold + roster |

**Vurdering:** Custom har registry-infrastruktur, men den er ikke konsolideret. Nye mapper (`commands/`, `tools/`, `templates/`, `plugins/`) skal tilføjes til registry.

---

## 5. Kritiske huller i Custom (prioriteret)

| Prioritet | Hul | Impact | Foreslået løsning |
|---|---|---|---|
| 1 | Ingen `commands/` | Brugeren har ingen kaldelige workflows | Opret `.agents/commands/` med 10-15 generiske workflows baseret på Sharmake |
| 2 | Ingen `templates/` | Inkonsekvente leverancer | Opret `.agents/templates/` med output-skabeloner |
| 3 | Ingen `tools/` | Ingen eksekverbare hjælpere | Opret `.agents/tools/` med generiske scripts og schemas |
| 4 | Ingen `plugins/` | Ingen integration til eksterne værktøjer | Opret `.agents/plugins/` med værktøjsbeskrivelser |
| 5 | Ingen personlig `memory/` | Agenter kender ikke brugerens præferencer | Opret `.agents/brain/personal/` med user-profile, preferences, lessons-learned |
| 6 | Ingen `diary/`/`tasks/` | Ingen opgave- og lærings-tracking | Opret `.agents/brain/diary/` og `.agents/brain/tasks/` |
| 7 | Registry-divergens | Risiko for at agenter bruger forkert metadata | Reconciliér registries og tilføj nye mapper |
| 8 | Placeholder skills | Nogle skills er for tynde til at være brugbare | Udbyg eller marker `FORELØBIG` tydeligt |

---

## 6. Anbefaling

### 6.1 Kortsigtet: overfør Sharmake-mønstrene til `.agents/`

1. **Opret `.agents/commands/`** med generiske workflow-kommandoer inspireret af Sharmake:
   - `start-project.md`
   - `start-diary.md`
   - `run-ralph-loop.md`
   - `use-multi-agent.md`
   - `review-deliverable.md`
   - `identify-missing-data.md`
   - `generate-requirement-matrix.md`
   - `create-decision-note.md`
   - `create-risk-log.md`
   - `generate-load-list.md` (Banedanmark-tilpasset)
   - `create-work-description.md`
   - `create-tender-list.md`
   - `create-excalidraw-flow.md`

2. **Opret `.agents/tools/`** med:
   - `python/README.md` + generiske validerings- og beregningshjælpere.
   - `excel/schemas/README.md` + standard kolonnedefinitioner.
   - `excalidraw/README.md` + diagramskabeloner.
   - `cad/README.md` + eksportnoter.

3. **Opret `.agents/templates/`** med:
   - `load-lists/`
   - `work-descriptions/`
   - `tender-lists/`
   - `qa/`
   - `diagrams/`
   - `calculations/`
   - `decision-notes/`
   - `risk-logs/`

4. **Opret `.agents/plugins/`** med integrationer til relevante værktøjer:
   - `sharepoint.md`
   - `projectwise.md`
   - `teams.md`
   - `outlook.md`
   - `autocad.md`
   - `microstation.md`
   - `febdoc.md`
   - `simaris.md`

5. **Udvid `.agents/brain/` med personlig hukommelse**:
   - `brain/personal/user-profile.md`
   - `brain/personal/preferences.md`
   - `brain/personal/lessons-learned.md`
   - `brain/personal/open-decisions.md`
   - `brain/diary/YYYY-MM-DD.md`
   - `brain/tasks/today.md`
   - `brain/tasks/backlog.md`
   - `brain/tasks/completed.md`

### 6.2 Langsigtet: integration mellem lagene

1. `.agents/` skal være **canonical kilde** for:
   - `agents/`, `skills/`, `commands/`, `tools/`, `templates/`, `plugins/`, `brain/`, `registry.yaml`.
2. `.vscode/.codex/` skal **genereres/synkroniseres** fra `.agents/`.
3. Sharmake kan beholdes som **domæne-reference** under `.agents/vendor/sharmake-template/` eller `docs/kilde/`.
4. Udvikl et `sync` script, der kopierer nødvendige dele fra `.agents/` → `.vscode/.codex/`.

---

## 7. Risici ved ikke at overføre

1. **Operationelt gab:** Custom forbliver en stor konfigurationsstruktur uden brugbare workflows.
2. **Dobbelt vedligehold:** Brugeren vil fortsætte med at bruge Sharmake separat, parallelt med Custom.
3. **Inkonsistent output:** Ingen skabeloner giver inkonsistente leverancer på tværs af agenter.
4. **Manglende værktøjsintegration:** Agenter kan ikke guide brugeren i at bruge FEBDOC, Simaris, etc.
5. **Ingen læring på tværs af projekter:** Uden `memory/`, `diary/`, `tasks/` mister projektet erfaringer.

---

## 8. Næste skridt

1. Godkend denne gap-analyse.
2. Overfør udvalgte Sharmake-komponenter til `.agents/` (se detaljeret plan).
3. Opdater `.agents/registry.yaml` med nye mapper.
4. Skriv et `sync`-runbook eller script til at propagerer ændringer til `.vscode/.codex/`.
5. Kør `validate-harness.ps1` og ret eventuelle nye fejl.
6. Dokumentér ændringerne i CHANGELOG og issue-tracker.
