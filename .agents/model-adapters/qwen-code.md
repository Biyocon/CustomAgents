---
id: qwen-code
status: planned
entrypoint: AGENTS.md
target_paths:
  - .qwen/
supported_artifact_types:
  - agents
  - skills
  - prompts
prompt_rendering: "System prompt injiceres via AGENTS.md-workspace-scanning (VS Code / JetBrains). Qwen Code er Codex-CLI-kompatibel."
skill_loading: "Skills eksponeres som Markdown via plugin-indstillinger fra .agents/skills/. Kræver manuel/genereret synkronisering."
registry_rendering: "Ingen native registry. Renderes fra .agents/registry.yaml (PR D/F)."
memory_behavior: "Filbaseret via .qwen/. Canonical Brain mappes ved generering (PR E)."
constraints:
  - "Ikke implementeret (planned)."
  - "SEKUNDÆR runtime (registry secondary_models), ikke i ADR'ens 5 core-targets."
  - "Primært kode-optimeret; mindre stærk i dansk sprog."
notes: "Qwen Code er en Codex-CLI-kompatibel fork (Alibaba). Bevaret som sekundær adapter, jf. registry secondary_models. 'qwen-code' tilføjet til runtime-adapter.schema.json's id-enum 2026-07-11 så adapteren kan valideres."
---

# Qwen Code Adapter (`id: qwen-code`, status: **planned**, sekundær)

## Hvad det er
**Qwen Code** (Alibaba Cloud) — en Codex-CLI-kompatibel kodningsagent. **Sekundær** runtime (jf. registry
`secondary_models`), ikke en af ADR'ens 5 core-targets, men bevaret som dokumenteret adapter.

## Sådan mapper canonical → qwen-code
- **Entrypoint:** `AGENTS.md` (via IDE-workspace-scanning).
- **Prompts:** `profile.md` text-blok injiceres via AGENTS.md.
- **Skills:** eksponeres som Markdown fra `.agents/skills/` via plugin-indstillinger.
- **Registry:** renderes fra `.agents/registry.yaml` (PR D/F).

## Settings-template (eksempel)
```json
{
  "model": "qwen3-coder",
  "temperature": 0.2
}
```

## Links
- Canonical: `../../AGENTS.md`, `../../.agents/skills/`
- Runtime-mål: `.qwen/` (genereres senere)
