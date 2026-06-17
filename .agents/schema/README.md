# Canonical schemas (`.agents/schema/`)

## Status: definition only — NOT enforced

Disse JSON Schema-filer er **canonical schema-definitioner** for det fremtidige model-agnostiske `.agents/`-lag. De er **ikke håndhævet** af nogen validator endnu, og de **ændrer ikke** eksisterende data.

PR B (som tilføjede denne mappe) er **additivt, docs+schema-only**:
- Ingen eksisterende registry, agent, skill eller runtime ændres.
- Schemaerne beskriver **target-kontrakter** for fremtidig canonicalisering.
- Faktisk migration (registry-merge, skill-normalisering, skills.yaml fold-in, System_Prompt-dedup) sker **senere i særskilte PRs**.
- Runtime-output (fx `.vscode/.codex/`) skal **senere genereres/valideres fra canonical**, ikke håndvedligeholdes.
- **Åbne beslutninger** (se nedenfor + `docs/architecture/registry-reconciliation.md`) må **ikke** behandles som afgjort.

## Schema-filer
| Fil | Beskriver |
|---|---|
| `agent-profile.schema.json` | Canonical agent-profil (`.agents/agents/<id>/profile.md` frontmatter + body-kontrakt) |
| `skill.schema.json` | Canonical skill (`.agents/skills/<id>/SKILL.md` frontmatter) |
| `registry.schema.json` | Canonical registry (`.agents/registry.yaml`) |
| `runtime-adapter.schema.json` | Runtime-adapter-beskrivelser (codex/claude/kimi/ollama/gemini/cursor) |
| `archive-entry.schema.json` | Arkiverede/avatarløse agenter (`archive/avatarless-agents/`) |

## Registry-status (vigtigt for PR B)
- **`.agents/registry.yaml`** = **canonical-kandidat** (target for `registry.schema.json`). Ikke rørt i PR B.
- **`.vscode/.codex/agents/registry.yaml`** = **aktiv runtime** — må **IKKE røres i PR B**; bliver et generation-target senere (PR D/F).
- **`registry.yaml`** (rod) = legacy pointer-manifest, **deprecate-kandidat** — ikke slettet.
- **`.vscode/.codex/registry.yaml`** = tom scaffold, **deprecate-kandidat** — ikke slettet.

## Åbne beslutninger (ikke afgjort)
73 vs 33 skills · name-vs-trigger frontmatter · rolle-vs-persona agent-model · system-prompt canonical placering · skills.yaml deprecation/generated · source-library capability-kandidater · Cursor runtime-adapter · Perplexity/orchestrator-governance · vendor-strategi · validate-harness false-positives.

Se `docs/architecture/registry-reconciliation.md` for fuld kontekst.
