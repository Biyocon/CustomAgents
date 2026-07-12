# Agent Harness - Kvalifikationsordning Entreprenør

> **OPDATERET 2026-07-11 (PR F):** `.agents/` er CANONICAL source of truth; `.vscode/.codex/agents/`
> + Brain-pointeren GENERERES af `.agents/scripts/generate-runtime.py`. Beskrivelser af
> `.vscode/.codex/` som kilde nedenfor er runtime-VISNING, ikke redigeringssted. Redigér altid
> `.agents/` → `--apply` → `--check` exit 0. Se `systemkort.md` + rod-`AGENTS.md`.

Genbrugelig agent-harness-skabelon til Banedanmark-orienterede projekter og andre professionelle VS Code-agentprojekter.

## Aktiv runtime (genereret fra canonical `.agents/`)

- **Canonical kilde:** `.agents/` (agents, skills, registry, brain)
- **Prompts:** `.vscode/.codex/prompts/`
- **Skills:** `.agents/skills/` (canonical, 79; flyttet 2026-07-09)
- **Subagents:** `.vscode/.codex/agents/` (GENERERET)
- **Brain:** `.agents/brain/` (canonical); `.vscode/.codex/Brain/` = genereret pointer
- **Delte hooks:** `.vscode/hooks/`
- **Klientadaptere:** `.vscode/settings/` + `.agents/model-adapters/`

## Struktur

```text
.vscode/.codex/
├── prompts/
│   └── master-system.md          # Faelles systemprompt for alle agenter
├── skills/                        # Aktive skills (SKILL.md per skill)
├── agents/
│   ├── agent-roster.json          # Maskinlæsbar agentliste
│   ├── AGENTS.md                # Agent runtime index
│   ├── role-template.md         # Skabelon til nye agenter
│   └── banedanmark/             # Banedanmark-specifikke rolleprofiler
├── Brain/
│   ├── context.md               # Domænekontekst og arbejdshypoteser
│   ├── source-map.md            # Kildeoversigt og afgrænsninger
│   ├── glossary.md              # Domænespecifik ordliste
│   └── open-questions.md        # Åbne spørgsmål og beslutninger
```

## Modeller

**Primær:** Codex (OpenAI)
**Kompatible:** Kimi, Qwen Code, Gemini Code

Alle modeller skal pege mod samme `AGENTS.md`, skills og agentroster via adaptere i `.vscode/settings/`.

## Agent roster

27 aktive agenter + 10 Banedanmark-placeholder-agenter. Se `.vscode/.codex/agents/agent-roster.json` for maskinlæsbar oversigt og `Avatar/agents/` for agentprofiler.

## Iqra-kilde

11 rige system prompts er integreret fra `Avatar/Iqra-main/Iqra-main/lib/agents/src/index.ts` (2651 linjer TypeScript). Kildemarkeres i hver agentprofil.

## Kom i gang

1. Læs `primer.md` + `.agents/brain/context.md` for domæneforståelse
2. Læs `.vscode/.codex/prompts/master-system.md` for fælles adfærd
3. Vælg agent (loader: `invoke-agent.py -l`; canonical: `.agents/registry.yaml`)
4. Indlæs agentens profil og listede skills før leverance

## Validering (gating siden 2026-07-12)

```bash
uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py
uv run --with pyyaml python .agents/scripts/generate-runtime.py --check
```

(Pre-commit-hook + CI kører samme to vagter. Det gamle `temp/verify_agent_harness.py` er legacy.)

## Regler

- Behandl `.agents/` som canonical kilde til sandhed; genererede runtime-filer håndredigeres aldrig
- Brug ikke `.vscode/archive/` som aktiv runtime uden bevidst reaktivering (`Kombi/` findes ikke i repoet)
- Slet aldrig filer du ikke selv har oprettet
- Opdater `.agents/brain/source-map.md` ved nye kilder
