# Kombi-analyse og anvendelsesvurdering

## Scope

`Kombi/` er gennemgået på struktur-, README-, skill- og repræsentativ filniveau. Mappen indeholder flere tusinde filer, så den bør behandles som referencekatalog og ikke som direkte runtime.

## Hovedfund

| Kilde | Vurdering | Anbefalet brug |
|---|---|---|
| `skills-main` / `mattpocock/skills` | Høj værdi. Små, komponerbare engineering-skills. | Installer projektlokalt i `.vscode/.codex/skills/`. |
| `andrej-karpathy-skills-main` | Høj værdi som adfærdsprincipper. | Brug som `karpathy-guidelines` skill og Brain-princip. |
| `everything-claude-code-main` | Meget omfattende harness med agents, commands, hooks. | Brug selektivt til mønstre; kopier ikke hele runtime. |
| `agency-agents-main` | God inspiration til rolleprofiler. | Brug format og ideer til Banedanmark-subagents. |
| `planning-with-files-master` | God til plan-/filbaseret arbejdsdisciplin og multi-klient-adaptere. | Brug som reference for adapterstrategi. |
| `system_prompts_leaks-main` | Risikabelt som runtime; nyttigt kun til analyse af mønstre. | Må ikke anvendes som autoritativ systemprompt. |
| `claude-code-main`, `agentic-stack-master`, `oh-my-openagent-dev`, `get-shit-done-main` | Store frameworks med blandet relevans. | Udtræk kun hooks/agentmønstre efter review. |

## Beslutning

Projektet skal ikke kombinere alle frameworks direkte. Den robuste løsning er et smalt aktivt lag:

- `AGENTS.md` som fælles instruktion
- `.vscode/.codex/prompts/` for master- og workflowprompts
- `.vscode/.codex/skills/` for aktive skills
- `.vscode/.codex/agents/` for rolleprofiler
- `.vscode/.codex/Brain/` for principper og beslutninger
- `.vscode/settings/` som adapterlag

## Kritisk vurdering

Det største risikopunkt er at kopiere for meget fra store agent-frameworks. Det giver hurtigt konflikter, dobbelte hooks, modstridende regler og lavere forudsigelighed. Den bedste praksis for dette projekt er at installere små skills, definere klare rolleprofiler og kun aktivere hooks, som håndhæver konkrete projektregler.

## Status efter opsætning

- Matt Pocock-skills er installeret projektlokalt.
- Karpathy-principper er installeret som skill.
- Brain-struktur er oprettet.
- Avatar-agenter har individuelle promptprofiler.
- Interface Manager er oprettet som første Banedanmark/BaneByg-subagent.
