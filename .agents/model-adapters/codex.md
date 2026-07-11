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
registry_rendering: "Aktiv runtime-registry .vscode/.codex/agents/registry.yaml GENERERES fra .agents/registry.yaml + profiler af generate-runtime.py (PR F aktiveret 2026-07-11). Håndredigeres aldrig; sync verificeres med --check (exit 0)."
memory_behavior: "PR E-politik (docs/architecture/memory-governance.md): .agents/brain/ er CANONICAL og eneste sted varig viden landes; .vscode/.codex/Brain/ er FROSSET transitional legacy (læses stadig af runtimen, håndredigeres aldrig; erstattes ved PR F). Sessionslogs er append-only snapshots i .agents/brain/memory/."
constraints:
  - "Eneste 'active' adapter i dag — backer .vscode/.codex/."
  - "Agents-laget (registry + rolleagenter) er GENERERET fra canonical (PR F, 2026-07-11). Brain forbliver frosset legacy in-place (fysisk erstatning udskudt, jf. memory-governance)."
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
