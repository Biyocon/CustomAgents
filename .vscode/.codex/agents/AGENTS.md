# Agent Runtime Index

Denne mappe er den aktive agent-indgang for projektet.

## Kilder

- Avatar-agentprofiler: `Avatar/agents/`
- Maskinlæsbar roster: `.vscode/.codex/agents/agent-roster.json`
- Banedanmark-rolleprofiler: `.vscode/.codex/agents/banedanmark/`
- Subskills: `.vscode/.codex/skills/`

## Agentregler

- Vælg agent efter fagrolle, ikke efter avatar.
- Indlæs agentens profil og de listede subskills, før der produceres en faglig leverance.
- Brug `karpathy-guidelines` som basal adfærdsregel: tænk før handling, hold ændringer små, og verificér mod succeskriterier.
- Ved Banedanmark-opgaver skal BDK-/BBTR-/BBE-/BKP-skills prioriteres over generiske skills.
- Hvis en rolle mangler, opret en ny profil fra `role-template.md` i stedet for at genbruge en forkert agent.
