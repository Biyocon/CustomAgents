---
id: gemini
status: planned
entrypoint: GEMINI.md
target_paths:
  - .gemini/
  - GEMINI.md
supported_artifact_types:
  - agents
  - skills
  - prompts
prompt_rendering: "Agentens system prompt renderes til GEMINI.md-sektioner og/eller .gemini/-instruktionsfiler. Gemini CLI læser GEMINI.md automatisk fra projektrod."
skill_loading: "Ingen standardiseret native skill-arkitektur. Skills eksponeres som Markdown under .gemini/ (kopi fra .agents/skills/) eller inlines i GEMINI.md."
registry_rendering: "Ingen native registry. Agenter renderes til .gemini/-instruktioner; genereres fra .agents/registry.yaml (PR D/F)."
memory_behavior: "Filbaseret kontekst via .gemini/. Canonical Brain mappes ved generering (PR E)."
constraints:
  - "Ikke implementeret (planned)."
  - "Skill-arkitektur ikke standardiseret — kræver kopi/inline frem for native load."
notes: "Registry-id'et 'gemini-code' (secondary_models) er det samme runtime; adapteren bruger schema-enum-id 'gemini'. Filen blev renamet fra gemini-code.md 2026-07-11."
---

# Gemini Adapter (`id: gemini`, status: **planned**)

## Hvad det er
Google **Gemini / Gemini CLI** (IDE-plugin + CLI). ADR-target-runtime. Renamet fra `gemini-code.md`
til `gemini.md` for at matche schema-enum'en (`gemini`).

## Sådan mapper canonical → gemini
- **Entrypoint:** `GEMINI.md` (læses automatisk fra projektrod af Gemini CLI).
- **Prompts:** `profile.md` text-blok → GEMINI.md-sektion / `.gemini/`-instruktion.
- **Skills:** `.agents/skills/<id>/SKILL.md` → `.gemini/`-Markdown (kopi) eller inline. Ingen native
  skill-loader.
- **Registry:** renderes til `.gemini/`-instruktioner; genereres fra canonical senere.

## Settings-template (eksempel)
```json
{
  "model": "gemini-2.5-pro",
  "temperature": 0.2
}
```

## Links
- Canonical: `../../AGENTS.md`, `../../.agents/skills/`
- Runtime-mål: `.gemini/`, `GEMINI.md` (genereres senere)
