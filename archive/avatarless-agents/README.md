# Archived avatarless agents

## Formål
Dette arkiv indeholder agent-profiler der er **arkiveret** ud af det normale persona-/reference-lag, fordi der **ikke findes et matchende avatar-billede** for dem ("no matching avatar image").

De er **ikke slettet**: indhold og git-historik er bevaret via `git mv`. De er blot flyttet ud af den normale roster, så persona-laget kun indeholder avatar-backed agenter.

## Arkiverede agent-id'er (10)

| Agent-id | Rolle |
|---|---|
| bro-inspektoer | Bro-inspektør |
| configuration-manager-project-level | Configuration Manager, Project Level |
| contract-manager-project-level | Contract Manager, Project Level |
| document-manager-project-level | Document Manager, Project Level |
| gis-specialist | GIS-specialist |
| incident-manager | Incident Manager |
| interface-manager-project-level | Interface Manager, Project Level |
| projekteringsleder | Projekteringsleder |
| si-manager-csm-interoperabilitet | S&I Manager CSM og Interoperabilitet |
| test-manager-project-level | Test Manager, Project Level |

Årsag for alle: **no matching avatar image**.

## Struktur
Arkivet spejler kildestrukturen:

```
archive/avatarless-agents/
├─ Avatar/agents/System_Prompt_Agent_<id>.md   (10 filer)
└─ .agents/agents/<id>/                         (profile.md, skills.yaml; projekteringsleder har desuden AGENTS.md + avatar.md)
```

## Vigtige afgrænsninger
- **Aktiv runtime er ikke ændret.** `.vscode/.codex/**` er bevidst out of scope — herunder `.vscode/.codex/agents/registry.yaml` og `.vscode/.codex/agents/banedanmark/**`.
- **`projekteringsleder`** har en separat **aktiv runtime-kopi** under `.vscode/.codex/agents/banedanmark/projekteringsleder/`. Kun persona-/reference-kopien er arkiveret her; den aktive kopi er urørt.
- **`hassan-dahir` er IKKE arkiveret.** Den var tidligere uden billede, men avataren `Avatar/2_Avatar_Agent_Hassan_Dahir_Technical_Interface_Product_Owner.png` blev tilføjet og landet i PR #13. Hassan Dahir er dermed avatar-backed og forbliver i det normale persona-lag.
- De 27 avatar-backed agenter (inkl. hassan-dahir) er ikke ændret.

## Reference-registries opdateret
- `.agents/registry.yaml` — de 10 flyttet fra `agents:` til `archived_avatarless_agents:`.
- `.agents/agents/AGENTS.md` — de 10 flyttet til en "Arkiverede avatarløse agenter"-sektion med links hertil.
