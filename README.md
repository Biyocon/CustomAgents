# AgentSkills — Custom AI Agent Harness

> Genbrugelig, model-agnostisk agent-harness til professionelle VS Code-projekter. Udviklet med udgangspunkt i jernbane- og entreprenørkompetencer (Banedanmark), men strukturen er generisk og kan tilpasses ethvert domæne.

## Hvad er dette?

Dette repository indeholder en komplet runtime til AI-assisteret projektstyring med specialiserede agenter, skills og persistent brain-kontekst. Harnesset understøtter flere AI-modeller (Codex, Kimi, Qwen Code, Gemini Code) via en fælles konfigurationsstruktur.

## Aktiv runtime

| Komponent | Sti |
|-----------|-----|
| Prompts | `.vscode/.codex/prompts/` |
| Skills | `.vscode/.codex/skills/` |
| Subagents | `.vscode/.codex/agents/` |
| Brain (kontekst) | `.vscode/.codex/Brain/` |
| Hooks | `.vscode/hooks/` |
| Adaptere | `.vscode/settings/` |

## Fremtidig runtime (under validering)

En model-agnostisk `.agents/`-struktur er under opbygning som fremtidig runtime:

| Komponent | Sti |
|-----------|-----|
| Brain | `.agents/brain/` |
| Agenter | `.agents/agents/` |
| Skills | `.agents/skills/` |
| Registry | `.agents/registry.yaml` |

## Hurtig start

1. Læs `.vscode/.codex/Brain/context.md` for domæneforståelse
2. Læs `.vscode/.codex/prompts/master-system.md` for fælles adfærdsregler
3. Vælg agent efter fagrolle i `.vscode/.codex/agents/agent-roster.json`
4. Indlæs agentens profil og listede skills før leverance

## Agent-roster

- **27 aktive agenter** — specialiserede roller inden for projektledelse, teknik, jura, økonomi, kvalitet m.m.
- **10+ Banedanmark-profiler** — domænespecifikke agenter til jernbaneprojekter
- Se `Avatar/agents/` for visuelle profiler og `.vscode/.codex/agents/agent-roster.json` for maskinlæsbar oversigt

## Skills-bibliotek

29 skills dækker bl.a.:

- **Ingeniørskills:** TDD, diagnose, arkitekturforbedring, code review
- **Projektstyring:** Issue-tracking, triage, PRD-udarbejdelse, refactoring-planer
- **Domænespecifikke:** BaneByg, dokumentstyring, kvalitetssikring, GDPR, legal mapping
- **Workflows:** Brainstorming, grill-me, zoom-out, caveman mode

## Validering

Kør valideringsscriptet for at tjekke harnessets integritet:

```bash
uv run python temp/verify_agent_harness.py
```

Eller via PowerShell:

```powershell
.\.agents\scripts\validate-harness.ps1
```

## Projektstruktur

```text
.
├── .agents/                    # Fremtidig model-agnostisk runtime
├── .vscode/.codex/             # Aktiv runtime (prompts, skills, agenter, brain)
├── Avatar/                     # Agent-avatarer og visuelle profiler
├── docs/                       # Dokumentation og ADR'er
├── Funktions- og stillingsbeskrivelser/   # Rollebeskrivelser og kompetencekrav
├── reports/                    # Analyser, audits og valideringsrapporter
├── scripts/                    # PowerShell-automatisering
├── skills/                     # Domain-skills (BBTR, kvalitet, risiko m.m.)
├── Task/                       # Opgavesporing og audit-logs
└── temp/                       # Midlertidige scripts og verifikation
```

## Regler

- Behandl `.vscode/.codex/` som den **eneste lokale kilde til sandhed** for aktiv drift
- Brug ikke `.vscode/archive/` som aktiv runtime uden bevidst reaktivering
- Slet aldrig filer du ikke selv har oprettet
- Opdater `source-map.md` ved nye kilder
- Skriv på dansk, medmindre tekniske standarder kræver engelsk

## Licens

Intern projektstruktur — tilpass og genbrug efter behov.
