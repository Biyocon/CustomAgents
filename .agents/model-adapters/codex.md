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
memory_behavior: "PR E-politik (docs/architecture/memory-governance.md): .agents/brain/ er CANONICAL og eneste sted varig viden landes; .vscode/.codex/Brain/ er reduceret til én GENERERET pointer (AGENTS.md, emitteret af generate-runtime.py, --check-dækket; oprydning 2026-07-11). Sessionslogs er append-only snapshots i .agents/brain/memory/."
constraints:
  - "Eneste 'active' adapter i dag — backer .vscode/.codex/."
  - "Agents-laget (registry + rolleagenter) OG Brain-pointeren er GENERERET fra canonical (PR F + oprydning, 2026-07-11). Intet i .vscode/.codex/agents/ eller Brain/ håndredigeres."
notes: "config.toml i .vscode/.codex/ sætter model/reasoning-effort. Primær målplatform, jf. registry primary_models."
---

# Codex Adapter (`id: codex`, status: **active**)

## Hvad det er
OpenAI Codex CLI / VS Code-integration — **referenceimplementeringen** blandt de aktive adaptere
(claude-code blev aktiveret som adapter #2 2026-07-12; de øvrige 5 er `planned`). Backer
`.vscode/.codex/`-laget, som siden PR F (2026-07-11) GENERERES fra canonical.

## Sådan mapper canonical → codex
- **Entrypoint:** `AGENTS.md` (projektrod) læses som styrende kontekst.
- **Prompts:** agentens system prompt (text-blok i `profile.md`) injiceres som system-instruktion.
- **Skills:** læses canonical fra `.agents/skills/<id>/SKILL.md`.
- **Registry:** `.vscode/.codex/agents/registry.yaml` — **GENERERET** af `generate-runtime.py`
  (PR F); håndredigeres aldrig; sync vagtes af `--check`.

## Artefakt-dækning (præcisering efter audit 2026-07-12)
Genereret + `--check`-dækket: `agents/registry.yaml`, `agents/banedanmark/<id>/profile.md` (19),
`Brain/AGENTS.md`-pointer, samt vagter for skills-leftover og avatar-prompt-dedup.
**Håndvedligeholdt (bevidst, udenfor --check):** `prompts/` (runtime-egne prompts),
`config.toml` (runtime-konfiguration), `.vscode/.codex/AGENTS.md` (runtime-doc) og
`agents/agent-roster.json` (Avatar-roster; krydstjekkes af Validate-Harness-Unified Sektion G).
At tage roster+prompts ind under generatoren er et kendt muligt næste skridt.

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
