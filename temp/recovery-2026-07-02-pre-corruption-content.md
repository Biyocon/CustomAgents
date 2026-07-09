# Genopretningsreference — pre-korruptions-indhold (2026-07-02, kl. ~00:44)

Kilde: fuld `git diff HEAD` fanget af Fable 5-sessionen FØR filkorruptionen kl. 00:47:05/00:48:56.
Dette er det KOMPLETTE ikke-committede indhold der fandtes i arbejdstræet ved review-start.
Halerne af de 3 afkortede filer gendannes fra HEAD (`git show HEAD:<fil>`), de er ikke gentaget her.

**Encoding-note:** I originalen var em-tankestreger allerede korrupte (cp1252 0x97 → usynlig U+0097)
og trætegn `│` var blevet til `¦`. Ved genskabelse: brug rigtige `—` og `│` i stedet for at
reproducere korruptionen. Disse steder er markeret med `<EM-DASH>` nedenfor.

---

## 1. README.md — banner-blok (OVERLEVER stadig på disk, linje 3–24)

Indsat efter `# AgentSkills — Custom AI Agent Harness` + tom linje:

```markdown
## ⚠️ Projektstyrings-dokumentation (tilføjet 2026-07-01)

Dette repo har en **uafklaret P0-modsigelse** om hvilken runtime der er aktiv
(se linjen nedenfor vs. `docs/architecture/ADR-multi-runtime-agent-system.md`).
Læs `primer.md` og `systemkort.md` FØR du handler på "Aktiv runtime"-linjen
nedenfor — den er én af to modstridende kilder.

Nyt PM-system, læs i denne rækkefølge:

1. `primer.md` — kort statuskondensat, læses ved hver sessionsstart
2. `systemkort.md` — autoritativ arkitektur inkl. den uafklarede runtime-modstrid
3. `FORBEDRINGSNOTAT.md` — dyb kritik + samlet roadmap
4. `KØREPLAN.md` — faseopdelt implementeringsplan (Fase A–G)
5. `PROJEKT_PLAN.md` — idébank, designbeslutninger, ønskeliste
6. `DEPS.md` — afhængigheder og kritisk sti mellem tasks
7. `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` — konsolideret fund-liste
8. `docs/active/`, `docs/drafts/`, `docs/done/` — sporede opgaver med acceptkriterier
9. `docs/qa/RELEASE-runtime-activation-gate.md` — gate før runtime-beslutning aktiveres
10. `docs/plans/runtime-konsolidering-plan.md` — løsningsdesign for P0-modstriden
11. `LESSON.md`, `CHANGELOG.md` — retrospektiv og ændringslog for selve PM-systemet

---
```

OBS fra code-review: `docs/done/` findes ikke på disk (kun `docs/active/` og `docs/drafts/`).
Ret eller opret ved genskabelse.

## 2. README.md — hale (TABT, gendannes fra HEAD)

Alt fra `## Pri...` (= `## Principper for skills`) og resten: `git show HEAD:README.md` fra
overskriften `## Principper for skills` til EOF. Ingen ændringer var lavet i halen.

---

## 3. .agents/brain/README.md — tilføjelser (afsnit OVERLEVER, hale TABT)

### 3a. Nyt afsnit efter "## Formaal"-listen, før "## Struktur" (overlever på disk):

```markdown
## Personlig hukommelse og opgavestyring

Udover den fælles projektkontekst indeholder Brain nu også:

- **personal/**: Brugerens profil, præferencer, læring og åbne beslutninger.
- **diary/**: Teknisk arbejdsdagbog (`YYYY-MM-DD.md`).
- **tasks/**: Aktive opgaver, backlog og afsluttede opgaver.

Dette gør agenter i stand til at tilpasse sig brugeren og huske kontekst på tværs af sessioner.
```

### 3b. Struktur-træet — nye linjer indsat efter `maps/`-blokken, før `runbooks/` (overlever på disk; brug `│` ikke `¦`):

```
+-- memory/                # Sessionslogfiler
+-- personal/              # Personlig brugerhukommelse
│   +-- user-profile.md
│   +-- preferences.md
│   +-- lessons-learned.md
│   +-- open-decisions.md
+-- diary/                 # Teknisk arbejdsdagbog
+-- tasks/                 # Opgaver og backlog
```

### 3c. Hale (TABT): reglerne 3–6 + `## Relation til AGENTS.md` — gendannes fra
`git show HEAD:.agents/brain/README.md` (fra midten af regel 3 til EOF). Eneste ændring
i diffen dér var kosmetisk (em-dash-tegnet i regel 6) — behold HEAD-teksten, evt. med rigtig `—`.

---

## 4. .agents/brain/context.md — tilføjelse (HELT TABT fra disk)

Tilføjet i bunden af filen, efter "Hvornaar skal denne fil laeses?"-listen:

```markdown
## Operationelt lag

Fra 2026-07-01 er følgende operationelle komponenter tilføjet `.agents/` for at gøre harnesset mere anvendeligt:

- **commands/**: Korte, kaldelige workflows (`start-project`, `review-deliverable`, `use-multi-agent`, etc.)
- **tools/**: Scripts, beregningshjælpere, validering og automatisering.
- **templates/**: Genbrugelige skabeloner til load lists, arbejdsbeskrivelser, tilbudslister, QA, diagrammer, beregninger, beslutningsnotater og risikolog.
- **plugins/**: Integrationer til eksterne værktøjer (SharePoint, ProjectWise, Teams, Outlook, AutoCAD, MicroStation, FEBDOC, Simaris).
- **brain/personal/**, **brain/diary/**, **brain/tasks/**: Personlig hukommelse, dagbog og opgavestyring.

Se `docs/audit/integration-plan-sharmake-patterns.md` for detaljer.
```

Halen (sidste bullet `- Foer der traekkes arkitekturbeslutninger` + ordet `domaene`) gendannes fra HEAD.
De øvrige diff-linjer i denne fil var kun em-dash-kosmetik — behold HEAD-tekst.

---

## 5. .agents/brain/assumptions.md — §10 (HELT TABT fra disk)

Tilføjet i bunden af filen efter antagelse 9's Impact-linje (indsæt en tom linje før overskriften):

```markdown
## Overførsel af Sharmake-mønstre (2026-07-01)

10. **Nye operationelle komponenter i `.agents/` er brugbare og korrekt placeret**
    - Commands, tools, templates, plugins og personal memory er overført fra Sharmake-template og tilpasset Custom/Banedanmark-konteksten.
    - De er placeret under `.agents/` selvom `.vscode/.codex/` stadig er aktiv runtime.
    - **Impact**: Indtil `.agents/` aktiveres, vil de nye komponenter ikke være tilgængelige for den aktive VS Code/Codex-runtime medmindre de synkroniseres.
    - **Status**: Overført som scaffolds; skal valideres og eventuelt synkroniseres til `.vscode/.codex/`.
```

---

## 6. .agents/registry.yaml — tilføjelser

### 6a. Agent-entry (OVERLEVER på disk, linje 123–127):

```yaml
  - id: council-chairman
    name: Council Chairman
    role: LLM Council Orchestrator
    category: Meta og deliberation
```

OBS fra code-review: council-chairman mangler i `.vscode/.codex/agents/agent-roster.json`
(validate-harness.ps1 giver WARN) og er avatarløs (konvention: avatarløse arkiveres).

### 6b. Skill-entry (OVERLEVER på disk):

```yaml
  - id: llm-council
```

### 6c. Blok i bunden af filen (HELT TABT fra disk) — tilføjet efter `validation_commands`:

```yaml

# Operationelt lag overført fra Sharmake-template (2026-07-01)
# Se docs/audit/integration-plan-sharmake-patterns.md for detaljer.
operational_layer:
  commands:
    path: commands/
    description: Korte, kaldelige workflows
    count: 12
  tools:
    path: tools/
    description: Scripts, beregningshjælpere, validering og automatisering
    subdirs:
      - python
      - excel/schemas
      - excalidraw/templates
      - cad
  templates:
    path: templates/
    description: Genbrugelige faglige og projektstyringsmæssige skabeloner
    subdirs:
      - load-lists
      - work-descriptions
      - tender-lists
      - qa
      - diagrams
      - calculations
      - decision-notes
      - risk-logs
  plugins:
    path: plugins/
    description: Integrationer og adapters til eksterne værktøjer
    entries:
      - sharepoint
      - projectwise
      - teams
      - outlook
      - autocad
      - microstation
      - febdoc
      - simaris

# Udvidet Brain med personlig hukommelse og opgavestyring
extended_brain_paths:
  personal:
    path: brain/personal/
    files:
      - user-profile.md
      - preferences.md
      - lessons-learned.md
      - open-decisions.md
  diary:
    path: brain/diary/
    pattern: YYYY-MM-DD.md
  tasks:
    path: brain/tasks/
    files:
      - today.md
      - backlog.md
      - completed.md
```

---

## Snapshot af det korrupte NU-stadie (til efterforskning)

`C:\Users\Biyocon\AppData\Local\Temp\claude\C--Users-Biyocon-OneDrive---Biyocon-Desktop-Custom\d440833e-9c26-4f1d-ab04-dd9ec8d13b91\scratchpad\snapshot-005128\`
(indeholder de 5 filer som de så ud kl. 00:51 + current-diff.patch)

## Tidslinje (dokumenteret)

- ~00:44 — fuld `git diff HEAD` fanget: alle 5 filer komplette
- 00:47:05 — README.md, brain/README.md, brain/context.md, registry.yaml omskrevet samtidigt (batch)
- 00:48:56 — assumptions.md omskrevet (faldt tilbage til HEAD-indhold)
- 00:51+ — stabilt siden

Fingeraftryk: cp1252→UTF-8-transkodning (0x97 → U+0097) + afkortning midt i ord + manglende
EOF-newline = en encoding-omskrivning (PowerShell `Set-Content`/Python-rewrite-stil) der blev
afbrudt — IKKE et OneDrive-linjeskift-fænomen. Tjek OneDrive-versionshistorik på de 5 filer
for at se hvilken proces der skrev 00:47:05-versionerne.
