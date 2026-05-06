# Agent Harness - Kvalifikationsordning Entreprenør

Genbrugelig agent-harness-skabelon til Banedanmark-orienterede projekter og andre professionelle VS Code-agentprojekter.

## Aktiv runtime

- **Runtime-kerne:** `.vscode/.codex/`
- **Prompts:** `.vscode/.codex/prompts/`
- **Skills:** `.vscode/.codex/skills/`
- **Subagents:** `.vscode/.codex/agents/`
- **Brain:** `.vscode/.codex/Brain/`
- **Delte hooks:** `.vscode/hooks/`
- **Klientadaptere:** `.vscode/settings/`

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

1. Læs `.vscode/.codex/Brain/context.md` for domæneforståelse
2. Læs `.vscode/.codex/prompts/master-system.md` for fælles adfærd
3. Vælg agent efter fagrolle i `.vscode/.codex/agents/agent-roster.json`
4. Indlæs agentens profil og listede skills før leverance

## Validering

```bash
python temp/verify_agent_harness.py
```

## Regler

- Behandl `.vscode/.codex/` som eneste lokale kilde til sandhed
- Brug ikke `.vscode/archive/` eller `Kombi/` som aktiv runtime uden bevidst reaktivering
- Slet aldrig filer du ikke selv har oprettet
- Opdater `source-map.md` ved nye kilder
