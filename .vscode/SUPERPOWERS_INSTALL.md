# Superpowers Installation - Projekt Guide

## Hurtig Start

Giv din agent Superpowers til følgende platforme:
[Claude Code](#claude-code) • [Codex CLI](#codex-cli) • [Codex App](#codex-app) • [Factory Droid](#factory-droid) • [Gemini CLI](#gemini-cli) • [OpenCode](#opencode) • [Cursor](#cursor) • [GitHub Copilot CLI](#github-copilot-cli) • [Kimi CLI](#kimi-cli)

---

## Installation

> **Bemærk:** Installation varierer efter platform. Bruger du flere platforme, installer Superpowers separat til hver.

### Claude Code

Superpowers er tilgængelig via [officielle Claude plugin markedsplads](https://claude.com/plugins/superpowers)

**Officiel Markedsplads:**
```bash
/plugin install superpowers@claude-plugins-official
```

**Superpowers Markedsplads:**
```bash
# Registrer markedspladsen
/plugin marketplace add obra/superpowers-marketplace

# Installer plugin
/plugin install superpowers@superpowers-marketplace
```

### Codex CLI

Superpowers er tilgængelig via [officielle Codex plugin markedsplads](https://github.com/openai/plugins).

```bash
# Åbn plugin søgeinterface
/plugins

# Søg efter Superpowers
superpowers

# Vælg "Install Plugin"
```

### Codex App

- I Codex app, klik på Plugins i sidebjælken
- Du vil se `Superpowers` i Coding sektionen
- Klik `+` ved siden af Superpowers og følg vejledningen

### Factory Droid

```bash
# Registrer markedsplads
droid plugin marketplace add https://github.com/obra/superpowers

# Installer plugin
droid plugin install superpowers@superpowers
```

### Gemini CLI

```bash
# Installer extension
gemini extensions install https://github.com/obra/superpowers

# Opdater senere
gemini extensions update superpowers
```

### OpenCode

OpenCode bruger sin egen plugin installation; installer Superpowers separat selvom du allerede bruger det på en anden platform.

```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

Detaljeret dokumentation: [docs/README.opencode.md](docs/README.opencode.md)

### Cursor

- I Cursor Agent chat, installer fra markedsplads:
```text
/add-plugin superpowers
```

- Eller søg efter "superpowers" i plugin markedspladsen.

### GitHub Copilot CLI

```bash
# Registrer markedsplads
copilot plugin marketplace add obra/superpowers-marketplace

# Installer plugin
copilot plugin install superpowers@superpowers-marketplace
```

### Kimi CLI

Kimi bruger et skill-baseret system kompatibelt med Superpowers' `SKILL.md` format.

#### Automatisk (anbefalet)

Kør install script fra Superpowers repo:

```bash
# macOS/Linux
curl -fsSL https://raw.githubusercontent.com/obra/superpowers/main/.kimi/install.sh | bash

# Windows (PowerShell)
iwr -useb https://raw.githubusercontent.com/obra/superpowers/main/.kimi/install.ps1 | iex
```

#### Manuel

Kopier skills til Kimis skill mappe:

```bash
# macOS/Linux
mkdir -p ~/.kimi/skills
cp -r ~/.claude/skills/* ~/.kimi/skills/

# Windows (PowerShell)
$null = New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.kimi\skills"
Copy-Item -Path "$env:USERPROFILE\.claude\skills\*" -Destination "$env:USERPROFILE\.kimi\skills\" -Recurse -Force
```

Kimi vil automatisk opdage og loade skills fra `~/.kimi/skills/` (eller falde tilbage til `~/.claude/skills/`).

**Hvordan Kimi support fungerer:**
- Kimi's skill system (`kimi_cli/skill/__init__.py`) scanner `~/.kimi/skills/` og falder tilbage til `~/.claude/skills/`
- Skills formatet (`SKILL.md` med YAML frontmatter) er næsten identisk mellem Claude og Kimi
- Skills loades automatisk når `kimi` køres i et projekt
- Ingen `plugin.json` nødvendig (Kimi's plugin system er til værktøjsintegration, ikke skills)

> **Vigtigt:** Kimi er ikke listet i upstream README som officielt understøttet. Denne integration er testet og virker via skill-systemet, men er ikke officielt anerkendt af Superpowers projektet endnu.

---

## Grundlæggende Arbejdsgang

1. **brainstorming** - Aktiveres før kodeskrivning. Refinerer idéer gennem spørgsmål, udforsker alternativer, præsenterer design i sektioner til validering.

2. **using-git-worktrees** - Aktiveres efter design godkendelse. Skaber isoleret arbejdsområde på ny branch, kører projekt setup, verificerer ren test baseline.

3. **writing-plans** - Aktiveres med godkendt design. Opdeler arbejde i bid-size opgaver (2-5 minutter hver). Hver opgave har præcise filstier, komplet kode, verifikationstrin.

4. **subagent-driven-development** eller **executing-plans** - Aktiveres med plan. Sender frisk subagent pr. opgave med to-trins review (spec compliance, derefter kodekvalitet), eller udfører i batches med menneskelige checkpoints.

5. **test-driven-development** - Aktiveres under implementering. Gennemtvinger RED-GREEN-REFACTOR: skriv fejlende test, se den fejle, skriv minimal kode, se den passere, commit. Sletter kode skrevet før tests.

6. **requesting-code-review** - Aktiveres mellem opgaver. Reviewer mod plan, rapporterer issues efter sværhedsgrad. Kritiske issues blokerer fremskridt.

7. **finishing-a-development-branch** - Aktiveres når opgaver er færdige. Verificerer tests, præsenterer muligheder (merge/PR/keep/discard), rydder op i worktree.

**Agenten tjekker for relevante skills før enhver opgave.** Obligatoriske workflows, ikke forslag.

---

## Hvad er Indeholdt

### Skills Bibliotek

**Testning**
- **test-driven-development** - RED-GREEN-REFACTOR cyklus (inkluderer testing anti-patterns reference)

**Debugging**
- **systematic-debugging** - 4-fase root cause proces (inkluderer root-cause-tracing, defense-in-depth, condition-based-waiting teknikker)
- **verification-before-completion** - Sikrer det faktisk er rettet

**Samarbejde**
- **brainstorming** - Sokratisk design forfinelse
- **writing-plans** - Detaljerede implementeringsplaner
- **executing-plans** - Batch udførelse med checkpoints
- **dispatching-parallel-agents** - Samtidige subagent workflows
- **requesting-code-review** - Pre-review checkliste
- **receiving-code-review** - Reagerer på feedback
- **using-git-worktrees** - Parallelle udviklings branches
- **finishing-a-development-branch** - Merge/PR beslutnings workflow
- **subagent-driven-development** - Hurtig iteration med to-trins review (spec compliance, derefter kodekvalitet)

**Meta**
- **writing-skills** - Skab nye skills efter bedste praksis (inkluderer test metodologi)
- **using-superpowers** - Introduktion til skills systemet

---

## Filosofi

- **Test-Driven Development** - Skriv tests først, altid
- **Systematisk over ad-hoc** - Proces over gætteri
- **Kompleksitetsreduktion** - Enkelthed som primært mål
- **Bevis over påstande** - Verificer før du erklærer succes

---

## Community

- **Discord**: [Join os](https://discord.gg/35wsABTejz) til community support, spørgsmål, og deling af hvad du bygger med Superpowers
- **Issues**: https://github.com/obra/superpowers/issues
- **Release announcements**: [Tilmeld dig](https://primeradiant.com/superpowers/)
