---
id: codex
status: active
entrypoint: AGENTS.md
target_paths:
  - .vscode/.codex/
supported_artifact_types:
  - agents
  - skills
  - prompts
  - registry
prompt_rendering: "System prompt fra profile.md's text-blok injiceres som Codex system-instruktion; AGENTS.md læses som projektkontekst ved opstart."
skill_loading: "Skills læses fra .agents/skills/<id>/SKILL.md (canonical). Codex aktiverer skill ved at læse SKILL.md og følge instruktionerne."
registry_rendering: "Aktiv runtime-registry .vscode/.codex/agents/registry.yaml er i dag håndholdt; skal på sigt genereres fra .agents/registry.yaml (PR D/F)."
memory_behavior: "Brain læses fra .vscode/.codex/Brain/ (aktiv) og .agents/brain/ (canonical). Konsolideres ved PR E."
constraints:
  - "Eneste 'active' adapter i dag — backer .vscode/.codex/."
  - "Runtime-registry og Brain er endnu ikke genereret fra canonical."
notes: "config.toml i .vscode/.codex/ sætter model/reasoning-effort. Primær målplatform, jf. registry primary_models."
---

# Codex Adapter (`id: codex`, status: **active**)

## Hvad det er
OpenAI Codex CLI / VS Code-integration. Dette er den **eneste aktive runtime** i dag: den backer
`.vscode/.codex/`-laget. Alle andre adaptere er `planned`, indtil generatorer (PR D/F) findes.

## Sådan mapper canonical → codex
- **Entrypoint:** `AGENTS.md` (projektrod) læses som styrende kontekst.
- **Prompts:** agentens system prompt (text-blok i `profile.md`) injiceres som system-instruktion.
- **Skills:** læses canonical fra `.agents/skills/<id>/SKILL.md`.
- **Registry:** `.vscode/.codex/agents/registry.yaml` (aktiv, håndholdt) — genereres fra canonical senere.

## Settings-template (eksempel, ikke normativ)
Faktisk konfiguration ligger i `.vscode/.codex/config.toml`:
```toml
model = "gpt-5.2-codex"
model_reasoning_effort = "high"
[features]
shell_snapshot = true
web_search_request = true
```

## Links
- Canonical: `../../AGENTS.md`, `../../.agents/registry.yaml`, `../../.agents/skills/`
- Aktiv runtime: `../../.vscode/.codex/`
