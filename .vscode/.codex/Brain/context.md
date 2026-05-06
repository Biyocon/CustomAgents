# Brain Context

## Formål

Projektet er en genbrugelig agent-harness-skabelon til Banedanmark-orienterede projekter og andre professionelle VS Code-agentprojekter.

## Domænebegreber

- **Agent harness**: Den samlede struktur af instruktioner, prompts, skills, hooks, adaptere og rolleprofiler.
- **Runtime-kerne**: `.vscode/.codex/`, som er lokal kilde til sandhed.
- **Adapterlag**: `.vscode/settings/`, som hjælper andre klienter med at pege mod samme runtime.
- **Skill**: En genbrugelig arbejdsinstruktion med `SKILL.md`.
- **Subagent**: En rolleprofil med systemprompt og tilknyttede skills.
- **Brain**: Projektets varige hukommelses- og beslutningslag.
- **BaneByg / BBTR / BBE / BKP**: Banedanmark-relaterede domæneområder, der skal håndteres med dedikerede skills.

## Arbejdshypotese

Codex er primær målplatform. Kimi, Qwen Code og Gemini Code skal bruge samme `AGENTS.md`, skills og agentroster, men kan kræve adaptere eller manuel pegekonfiguration.

## Vigtige afgrænsninger

- `Kombi/` er reference- og inspirationsmateriale, ikke aktiv runtime.
- `system_prompts_leaks` må ikke kopieres som autoritativ systemprompt.
- Upstream repos må kun adopteres efter kritisk vurdering og lokal tilpasning.
