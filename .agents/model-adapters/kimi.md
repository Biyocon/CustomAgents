---
id: kimi
status: planned
entrypoint: AGENTS.md
target_paths:
  - .kimi/
supported_artifact_types:
  - agents
  - skills
  - prompts
prompt_rendering: "Agentens system prompt injiceres via AGENTS.md-kontekst; Kimi Code læser AGENTS.md rekursivt fra projektrod og undermapper."
skill_loading: "Skills læses fra .agents/skills/<id>/SKILL.md. Kimi følger Anthropic/Claude-nære skill-konventioner, så SKILL.md-formatet er kompatibelt."
registry_rendering: "Ingen native registry. Agenter renderes fra .agents/registry.yaml (PR D/F)."
memory_behavior: "Filbaseret kontekst. Canonical Brain mappes ved generering (PR E)."
constraints:
  - "Ikke implementeret (planned)."
  - "Ingen indbygget git-integration; bruger Shell-værktøj."
notes: "Stort kontekstvindue (~2M tokens). Primær målplatform sammen med Codex, jf. registry primary_models."
---

# Kimi Adapter (`id: kimi`, status: **planned**)

## Hvad det er
**Kimi Code CLI** (Moonshot AI). ADR-target-runtime og — sammen med Codex — en af de to `primary_models`
i registryet. Native tools (Shell/ReadFile/WriteFile/StrReplaceFile) og stort kontekstvindue.

## Sådan mapper canonical → kimi
- **Entrypoint:** `AGENTS.md` (læses rekursivt fra projektrod + undermapper).
- **Prompts:** `profile.md` text-blok injiceres via AGENTS.md-kontekst.
- **Skills:** canonical `.agents/skills/<id>/SKILL.md` (Claude-nært format er kompatibelt).
- **Registry:** renderes fra `.agents/registry.yaml` (PR D/F).

## Settings-template (eksempel)
```json
{
  "model": "kimi-k2",
  "temperature": 0.3
}
```

## Links
- Canonical: `../../AGENTS.md`, `../../.agents/skills/`
- Runtime-mål: `.kimi/` (genereres senere)
