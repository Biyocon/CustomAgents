---
id: claude-code
status: planned
entrypoint: CLAUDE.md
target_paths:
  - .claude/
  - CLAUDE.md
supported_artifact_types:
  - agents
  - skills
  - prompts
  - registry
prompt_rendering: "Agentens system prompt (text-blok i profile.md) renderes til en Claude Code subagent-definition eller en CLAUDE.md-sektion. AGENTS.md kan genbruges direkte som CLAUDE.md (Claude Code læser begge)."
skill_loading: "Skills eksponeres via .claude/skills/<id>/SKILL.md (Claude Codes native skill-format matcher SKILL.md-konventionen 1:1). Kan genereres som kopi eller symlink fra .agents/skills/."
registry_rendering: "Ingen native registry; agenter renderes til .claude/agents/<id>.md subagent-filer og/eller en oversigt i CLAUDE.md. Genereres fra .agents/registry.yaml (PR D/F)."
memory_behavior: "Claude Code har filbaseret memory (~/.claude/ + projekt-.claude/). Canonical Brain (.agents/brain/) mappes til projekt-memory ved generering (PR E)."
constraints:
  - "Ikke implementeret endnu (planned). Ingen generator findes."
  - "SKILL.md-formatet er allerede Claude-kompatibelt, så skill-mapping er den letteste del."
notes: "Dette er den runtime QA/udvikling ofte køres i (Claude Code). .claude/ findes allerede i repoet på rod-niveau (korrekt mønster). ADR-multi-runtime kræver eksplicit denne adapter (Claude manglede tidligere)."
---

# Claude Adapter (`id: claude-code`, status: **planned**)

## Hvad det er
Anthropic **Claude Code** (CLI / IDE). ADR-multi-runtime-agent-system.md kræver eksplicit en Claude-adapter
— den manglede i den oprindelige adapter-samling. `.claude/` findes allerede på repo-rodniveau (det korrekte
mønster, jf. `.agents/model-adapters/`-diskussionen), så generation-target er klart.

## Sådan mapper canonical → claude-code
- **Entrypoint:** `CLAUDE.md` (Claude Code læser både `AGENTS.md` og `CLAUDE.md`; AGENTS.md kan genbruges).
- **Skills:** `.agents/skills/<id>/SKILL.md` → `.claude/skills/<id>/SKILL.md`. Formatet matcher 1:1 —
  dette er den nemmeste mapping af alle runtimes.
- **Agenter:** `profile.md` → `.claude/agents/<id>.md` (subagent-definition med system prompt).
- **Registry:** ingen native registry; renderes til subagent-filer + CLAUDE.md-oversigt.
- **Memory:** canonical Brain → projekt-`.claude/`-memory (PR E).

## Settings-template (eksempel)
Claude Code konfigureres via `.claude/settings.json` (permissions) og `CLAUDE.md` (instruktioner):
```json
{
  "permissions": { "allow": [] }
}
```
Model vælges i klienten (fx Opus/Sonnet) — ikke i en settings-fil.

## Links
- Canonical: `../../AGENTS.md`, `../../.agents/skills/`
- Runtime-mål: `../../.claude/`, `../../CLAUDE.md`
