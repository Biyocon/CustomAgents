---
id: claude-code
status: active
entrypoint: CLAUDE.md
target_paths:
  - .claude/
  - CLAUDE.md
supported_artifact_types:
  - agents
prompt_rendering: "Agentens canonical prompt (```text-blok i profile.md; rolleagenter: hele profil-body'en) renderes til en Claude Code subagent-definition .claude/agents/<id>.md (frontmatter name/description + body = system prompt) af generate-runtime.py."
skill_loading: "Skills laeses canonical fra .agents/skills/<id>/SKILL.md. Kopiering til .claude/skills/ er BEVIDST udskudt: 79 trackede dubletter er uoenskede, og SKILL.md-formatet kan laeses direkte naar det refereres."
registry_rendering: "Ingen native registry; alle 47 canonical agenter renderes til .claude/agents/<id>.md subagent-filer af generate-runtime.py (--apply). Sync vagtes af --check (check_claude_agents: manglende/afvigende/foraeldreloese genererede filer = drift)."
memory_behavior: "Claude Code har filbaseret memory (~/.claude/ + projekt-.claude/). Canonical hukommelse er .agents/brain/ (memory-governance, PR E); Claude laeser den direkte — ingen kopi genereres."
constraints:
  - "AKTIVERET 2026-07-12 som adapter #2 (efter codex): agents-artefakten genereres; skills/prompts-artefakter bevidst udskudt."
  - "Haandskrevne .claude/agents/-filer (uden GENERERET-markoer) er tilladt og ignoreres af --check."
notes: "Dette er den runtime QA/udvikling ofte køres i (Claude Code). .claude/ ligger på rod-niveau (korrekt mønster). ADR-multi-runtime kræver eksplicit denne adapter."
---

# Claude Adapter (`id: claude-code`, status: **active** — aktiveret 2026-07-12)

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
