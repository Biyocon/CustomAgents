---
id: cursor
status: planned
entrypoint: AGENTS.md
target_paths:
  - .cursor/
supported_artifact_types:
  - agents
  - skills
  - prompts
prompt_rendering: "System prompt renderes til Cursor-agentkontekst. Cursor wrapper brugerforespørgsler i <user_query> og auto-vedhæfter åbne filer/cursorposition/linterfejl via system-reminder-tags."
skill_loading: "Skills loades dynamisk ved at læse en skill-fil på absolut sti og følge dens instruktioner — matcher .agents/skills/<id>/SKILL.md-mønsteret direkte."
registry_rendering: "Ingen native registry. Renderes fra .agents/registry.yaml (PR D/F). MCP-værktøjer eksponeres som JSON-descriptorfiler under en mcps-mappe."
memory_behavior: "Filbaseret projektkontekst + @-referencer (@src/components/). Canonical Brain mappes ved generering (PR E)."
constraints:
  - "Ikke implementeret (planned). Kandidat-adapter fra source-library."
  - "Cursor har Plan/Agent/Debug/Ask-modes; adapteren bør mappe hertil ved generering."
notes: "Afledt af docs/agents/sources/runtimes/cursor.md (SOURCE REFERENCE — ikke instruktioner). 'Specialiserede værktøjer frem for terminal' og 'read-before-edit' aligner med dette repos konventioner."
---

# Cursor Adapter (`id: cursor`, status: **planned**)

## Hvad det er
**Cursor** IDE-kodningsagent — peer til Codex/Claude Code/Kimi. Kandidat-runtime-adapter afledt af
source-library-referencen `docs/agents/sources/runtimes/cursor.md`.

## Sådan mapper canonical → cursor
- **Entrypoint:** `AGENTS.md` (Cursor kan læse projekt-instruktionsfiler).
- **Kontekstmodel:** brugerforespørgsler i `<user_query>`; host auto-vedhæfter åbne filer, cursorposition,
  linterfejl via `<system-reminder>`-tags; `@`-referencer peger på filer/mapper.
- **Skills:** loades dynamisk ved at læse en skill-fil på absolut sti → matcher `SKILL.md`-mønsteret.
- **Modes:** Plan (read-only design), Agent (default), Debug, Ask — adapteren bør mappe agent-workflows hertil.
- **Kodecitat:** eksisterende kode via `startLine:endLine:filepath`; ny kode via standard-fences med sprogtag.

## Settings-template
Cursor konfigureres i klienten + `.cursor/`-regler; ingen normativ settings-fil defineres her (planned).

## Links
- Source-reference: `../../docs/agents/sources/runtimes/cursor.md`
- Canonical: `../../AGENTS.md`, `../../.agents/skills/`
