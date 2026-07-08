# Sharmake — Agent Template for El-ingeniør

> Modulær agentplatform/template til el-teknisk projektering.
> Designet til brug på tværs af Claude Code, Codex, Gemini CLI og Kimi.

---

## Hvad er Sharmake?

Sharmake er en **genbrugelig agent-template** til el-ingeniører, der arbejder med energi, stærkstrøm og teknisk projektering. Template'et giver:

- En **masterprompt** (`AGENTS.md`) der definerer agentens identitet og adfærd
- **Modulære komponenter**: skills, agents, commands, tools, plugins
- **Hukommelse og dagbog**: brugerprofil, præferencer, beslutninger, læring
- **Kvalitetssikring**: QA-fund, tjeklister, review-skabeloner
- **Faglige skabeloner**: load lists, arbejdsbeskrivelser, tilbudslister, diagrammer

---

## Kom i gang

### 1. Kopier template til nyt projekt

```powershell
Copy-Item -Path "Sharmake" -Destination "MitNyeProjekt" -Recurse
```

### 2. Tilpas projektspecifikke filer

- `memory/ramboll-context.md` — tilføj projektspecifikke krav
- `memory/open-decisions.md` — tilføj projektets åbne beslutninger
- `docs/standards/` — tilføj gældende standarder for projektet
- `docs/ramboll/` — tilføj Rambøll-specifikke dokumenter
- `projects/` — tilføj projektfiler og undermapper efter behov

### 3. Start agenten

Afhængigt af din klient:

- **Claude Code:** Åbn mappen — `CLAUDE.md` indlæses automatisk
- **Gemini CLI:** Brug `@GEMINI.md` og `@AGENTS.md` som kontekst
- **Codex:** `AGENTS.md` læses som projektinstruktion
- **Kimi:** Indlæs `AGENTS.md` som systemprompt

Kom derefter med din opgave, eller brug en standardkommando fra `commands/`.

---

## Projektstruktur

```
Sharmake/
├── AGENTS.md                    ← Masterprompt
├── CLAUDE.md                    ← Claude Code adapter
├── GEMINI.md                    ← Gemini CLI adapter
├── README.md                    ← Denne fil
├── guide.md                     ← Brugervejledning
│
├── agents/                      ← Specialistroller
├── skills/                      ← Genbrugelige evner
├── commands/                    ← Kaldelige workflows
├── tools/                       ← Scripts og hjælpere
│   ├── python/
│   ├── excel/
│   ├── excalidraw/
│   └── cad/
├── plugins/                     ← Værktøjsintegrationer
├── mcp/                         ← MCP-ressourcer
│
├── memory/                      ← Brugerprofil og præferencer
├── tasks/                       │
├── diary/                       │
├── quality/                     │
│
├── templates/                   ← Genbrugelige faglige skabeloner
├── docs/                        ← Standarder, Rambøll, eksempler
└── projects/                    ← Aktive projekter
```

---

## Nøgleprincipper

1. **Sikkerhed først**
2. **Dokumentér altid forudsætninger**
3. **Skeln mellem fakta, antagelser og forslag**
4. **Brug kun verificeret Rambøll-praksis**
5. **Marker usikkerheder og manglende data tydeligt**
6. **Vis mellemtrin i alle beregninger**
7. **Gennemfør QA med track changes (AGR)**

---

## Sprog og tone

- **Standard:** Rent dansk
- **Til kunder:** "Rambøll anbefaler…"
- **Internt:** Direkte formulering
- **Stemme:** Aktiv
- **Tone:** Professionel og konservativ

---

## Hvad må ikke gemmes

Uden eksplicit tilladelse:

- CPR-numre og persondata
- Kontraktkritiske data (tidsfrister, økonomi, risici)

---

## Bidrag og tilpasning

Template'et er personligt og tilpasses løbende. Opdater:

- `memory/user-profile.md` når din rolle ændres
- `memory/preferences.md` når dine præferencer ændres
- `memory/engineering-principles.md` når du lærer nyt
- `skills/` og `commands/` når nye evner og workflows tilføjes
- `plugins/` når nye værktøjsintegrationer tilføjes

---

## Licens og brug

Template'et er til personlig, professionel brug i el-teknisk projektering.
Ingen garanti gives for teknisk korrekthed — alt output skal gennemgå faglig review.
