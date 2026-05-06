# AGENTS.md

## Projektets AI-struktur

- Aktiv runtime-kerne er denne mappe: `.vscode/.codex/`
- Aktive projektskills ligger i `.vscode/.codex/skills/`
- Aktive prompts ligger i `.vscode/.codex/prompts/`
- Aktive subagents ligger i `.vscode/.codex/agents/`
- Projektets Brain ligger i `.vscode/.codex/Brain/`
- Delte hooks ligger i `.vscode/hooks/`
- `.vscode/archive/` er kun reference- og historikomraade

## Agent-invokation

```powershell
# List alle 50+ agenter (Avatar + Banedanmark)
.vscode/.codex/scripts/invoke-agent.ps1 -l

# Aktiver en specifik agent — viser profil + system prompt
.vscode/.codex/scripts/invoke-agent.ps1 "Projektleder"

# Kun prompt (klar til copy-paste i din AI-chat)
.vscode/.codex/scripts/invoke-agent.ps1 "Ahmad El Wali" -p

# JSON output (til integration)
.vscode/.codex/scripts/invoke-agent.ps1 "byggeleder" -j
```

Alternativt via Python direkte:
```bash
python .vscode/.codex/scripts/invoke-agent.py -l
python .vscode/.codex/scripts/invoke-agent.py "Udbudskonsulent" -p
```

### Agenter dækker
- **37 Avatar-agenter**: Professionelle profiler (Ahmad El-Wali, Hassan, Mehtap, m.fl.)
- **13 Banedanmark-rolleagenter**: Byggeleder, Dokumentcontroller, Kontraktmanager, Udbudskonsulent, osv.

## Master prompt

- Faelles master/system prompt ligger i `.vscode/.codex/prompts/master-system.md`
- Nye rolleagenter bygges fra `.vscode/.codex/prompts/subagent-builder.md`
- Avatar-agentroster ligger i `.vscode/.codex/agents/agent-roster.json`
- Banedanmark-rolleprofiler ligger i `.vscode/.codex/agents/banedanmark/`

## Skills

- Matt Pocock-skills er installeret projektlokalt i `.vscode/.codex/skills/`
- `karpathy-guidelines` er installeret som faelles adfaerds-skill
- BDK-/BBTR-/BBE-/BKP-skills prioriteres ved Banedanmark-opgaver
- `Kombi/` og `.vscode/archive/` er referencekilder, ikke aktiv runtime

## Projekt-erfaringer (persistent memory)

### Agent-invokation
- Kommando: `.vscode/.codex/scripts/invoke-agent.ps1 -l` lister alle 50 agenter
- Kommando: `.vscode/.codex/scripts/invoke-agent.ps1 "<navn>" -p` outputter kun prompt til copy-paste
- Python-engine: `.vscode/.codex/scripts/invoke-agent.py` (fuzzy match, JSON-mode)

### Encoding-regler
- Projektet har **blandet encoding**: nye filer er UTF-8, gamle Avatar `System_Prompt_Agent_*.md` er Latin-1 (Windows-1252)
- Ved fil-læsning: prøv `utf-8` → `utf-8-sig` → `latin-1` → `cp1252`
- Ved fil-skrivning: brug altid `utf-8` med `ensure_ascii=False` for JSON

### Sti-konventioner
- Scripts i `.vscode/.codex/scripts/` kræver **3× `parent`** for at nå projektrod
- `Path(__file__).resolve().parent.parent.parent` = projektrod
- `Path.cwd()` er ikke pålidelig (afhænger af hvor brugeren kalder fra)

### Agent-kilder og prioritering
- **Master**: `.vscode/.codex/agents/` (aktiv runtime)
- **Mirror**: `.agents/agents/` (backup, fases ud senere)
- Ved deduplikering: prioriter `.vscode/.codex/` over `.agents/`
- Avatar-agenter: `Avatar/agents/` → `Avatar/2_Avatar_Agent_*` billeder + `System_Prompt_Agent_*.md` tekst
- Banedanmark-agenter: `.vscode/.codex/agents/banedanmark/` → YAML-frontmatter `.md` filer

### Roster-synkronisering
- `agent-roster.json` er master for Avatar-agenter
- `registry.yaml` er master for Banedanmark-agenter
- `temp/agent-roster-full.json` er legacy — bør ikke bruges som master

## Critical Rules

- NEVER delete files you didn't create
- ALWAYS use `uv run` to execute Python scripts
- ALWAYS preserve non-ASCII characters (Danish æøå) when editing files
- ALWAYS check encoding before parsing text files in this project
