# AGENTS.md

> Opdateret 2026-07-12 (post-PR F): `.agents/` er CANONICAL; agents-laget og Brain-pointeren
> i denne mappe GENERERES af `.agents/scripts/generate-runtime.py`. Redigér aldrig genererede
> filer — redigér canonical og kør `--apply`. Se root `AGENTS.md` for de fulde arbejdsregler.

## Projektets AI-struktur

- CANONICAL kilde: `.agents/` (agents, skills, registry, brain)
- Denne mappe er genereret/runtime-visning: `.vscode/.codex/agents/` (genereret), `Brain/AGENTS.md` (genereret pointer)
- Aktive projektskills ligger i `.agents/skills/` (canonical; flyttet 2026-07-09)
- Aktive prompts ligger i `.vscode/.codex/prompts/` (runtime-egne, håndvedligeholdte)
- Delte hooks ligger i `.vscode/hooks/`
- `.vscode/archive/` er kun reference- og historikomraade

## Agent-invokation

```powershell
# List alle agenter (Avatar-personaer + Banedanmark-rolleagenter; kør for aktuelt antal)
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
- **27 Avatar-personaer** (Ahmad El-Wali, Hassan, Mehtap, m.fl.) + council-chairman (meta-agent)
- **19 Banedanmark-rolleagenter** (Byggeleder, Dokumentcontroller, Kontraktmanager, Trafikleder, osv.)
- Kanonisk tal: kør `invoke-agent.py -l` eller læs `.agents/registry.yaml` — hardkod ikke antallet her

## Master prompt

- Faelles master/system prompt ligger i `.vscode/.codex/prompts/master-system.md`
- Nye rolleagenter bygges fra `.vscode/.codex/prompts/subagent-builder.md`
- Avatar-agentroster ligger i `.vscode/.codex/agents/agent-roster.json`
- Banedanmark-rolleprofiler ligger i `.vscode/.codex/agents/banedanmark/`

## Skills

- Alle skills ligger canonical i `.agents/skills/` (107; `.vscode/.codex/skills/` har kun det
  bevidste `banebyg`-leftover, vagtes af `generate-runtime.py --check`)
- `karpathy-guidelines` er faelles adfaerds-skill; BDK-/BBTR-/BBE-/BKP-skills prioriteres ved
  Banedanmark-opgaver
- `.vscode/archive/` er referencekilde, ikke aktiv runtime (`Kombi/` findes ikke i repoet)

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

### Agent-kilder og prioritering (opdateret post-PR F)
- **CANONICAL/master**: `.agents/agents/` — eneste redigeringssted
- **Genereret visning**: `.vscode/.codex/agents/` (produceres af generate-runtime.py --apply)
- invoke-agent.py's dedup foretrækker runtime-visningen ved id-sammenfald — indholdet er identisk
  fordi laget genereres fra canonical (--check håndhæver det)
- Avatar-agenter: `Avatar/agents/` → `Avatar/2_Avatar_Agent_*` billeder + `System_Prompt_Agent_*.md` tekst
- Banedanmark-agenter: `.vscode/.codex/agents/banedanmark/` → YAML-frontmatter `.md` filer

### Roster-synkronisering
- `agent-roster.json` er master for Avatar-agenter
- `registry.yaml` er master for Banedanmark-agenter
- ~~`temp/agent-roster-full.json` er legacy — bør ikke bruges som master~~ (fjernet 2026-07-09, del af `temp/`-oprydning, se `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`)

## Critical Rules

- NEVER delete files you didn't create
- ALWAYS use `uv run` to execute Python scripts
- ALWAYS preserve non-ASCII characters (Danish æøå) when editing files
- ALWAYS check encoding before parsing text files in this project
