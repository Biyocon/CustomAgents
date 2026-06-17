# Repo map: CustomAgents multi-runtime architecture

Ledsagedokument til [ADR-multi-runtime-agent-system.md](ADR-multi-runtime-agent-system.md). Kortlægger repoets mapper, registries, runtimes, memory og arkiv samt de åbne beslutninger.

## Current folders

| Folder | Current role | Classification | Future role | Notes |
|---|---|---|---|---|
| `.agents/` | model-agnostisk reference (agents, skills, brain, vendor, model-adapters) | source | **canonical source of truth** | skal modnes; har 27 persona-agenter + 29 skills |
| `.vscode/.codex/` | aktiv runtime (codex/VS Code) | runtime | **generated runtime** (transitional nu) | 14 rolle-agenter, ~73 skills, aktiv registry, aktiv Brain |
| `Avatar/` | persona-prompts (System_Prompt_Agent_*.md) + portrætbilleder | source | canonical persona-input | 27 avatar-backed agenter |
| `archive/avatarless-agents/` | arkiv for 10 avatarløse agenter | archive | versioneret arkiv | ikke aktiv runtime |
| `scripts/` | PowerShell-automatisering (8 scripts) | tooling | konsolidér til ét script-sæt | overlapper `.agents/scripts/` |
| `.agents/scripts/` | PowerShell-automatisering (4 scripts) | tooling | konsolidér til ét script-sæt | overlapper `scripts/` |
| `docs/` | dokumentation (agents, architecture, runtime-status) | docs | versioneret dokumentation | denne ADR bor her |
| root `skills/` | ældre skill-lag (~35 dirs) | legacy | konsolidér/arkivér | forgænger til `.agents/skills/` |
| `temp/` | midlertidige scripts + scratch | scratch | dels ignored, dels slettes | helper-scripts parkeret |
| `Funktions- og stillingsbeskrivelser/` | kildemateriale (213+ FB-PDF'er) | source/archive | flyt til kilde/arkiv (tidligere besluttet, ikke eksekveret) | provenans-grundlag for agenter |
| validation reports | `validation-report.json` (untracked/ignored), `.agents/reports/validation_report.md` (tracked) | generated | generated artifact | JSON allerede untracket via PR #12 |
| Brain/memory/session-filer | `.vscode/.codex/Brain/session-history.md`, `Brain/memory/**`, `docs/agents/end-of-day-memory-*.md` | runtime-local / snapshot | afgøres i PR E | se Memory map |

## Registry map

| Registry | Størrelse/rolle | Fremtid |
|---|---|---|
| `registry.yaml` (root) | ældre top-level registry | konsolidér/afvikl |
| `.agents/registry.yaml` | reference-registry (agents + archived_avatarless_agents + skills) | **ENESTE canonical på sigt** |
| `.vscode/.codex/registry.yaml` | tom scaffold (~946 B) | afvikl/konsolidér |
| `.vscode/.codex/agents/registry.yaml` | reel aktiv registry (~29.9 KB) | **generated** fra canonical |

**Beslutning:** kun `.agents/registry.yaml` skal være canonical på sigt. Runtime-registries skal **genereres eller valideres** fra canonical, ikke vedligeholdes i hånden.

## Runtime map

| Runtime | Indgang | Status i dag | Target |
|---|---|---|---|
| **Codex / VS Code** | `AGENTS.md` + `.vscode/.codex/` | ✅ aktiv runtime | generated runtime fra canonical |
| **Claude** | `CLAUDE.md` (pointer → AGENTS.md) | ⚠️ ad-hoc (`.vscode/claude.md`, `claude.json`) | adapter target — `.claude/` + skills |
| **Kimi** | adapter-prompt | ⚠️ kun adapter-note + integrations-doc | adapter target |
| **Ollama** | Modelfile (`SYSTEM` baked in) | ❌ findes ikke | adapter target — Modelfiles |
| **Gemini / Gemini CLI** | `GEMINI.md` | ⚠️ kun `gemini.json` + adapter-note | adapter target |

Fælles indgang er `AGENTS.md`; hver runtime får en adapter der mapper canonical → runtime-format.

## Memory map

| Type | Filer | Behandling |
|---|---|---|
| **Canonical memory** | `.vscode/.codex/Brain/context.md`, `glossary.md`, `operating-principles.md`, `source-map.md`, `adr/` | varig, kurateret, in-place, versioneret |
| **Runtime-local memory** | `.vscode/.codex/Brain/session-history.md` (append-log), aktiv Brain working state | runtime-lokal; commit-policy afgøres i PR E |
| **Session-history** | `session-history.md` | manuel/agent-vedligeholdt append-log med auditværdi |
| **Snapshots / end-of-day** | `docs/agents/end-of-day-memory-*.md`, `.vscode/.codex/Brain/memory/session-*-audit.md` | audit/handoff-snapshots; versioneres hvis klar auditværdi |

**Skal besluttes i PR E:** om session-history committes periodisk vs holdes lokal; hvor snapshots bor canonical; hvordan canonical Brain deles på tværs af runtimes.

## Archive map

- `archive/avatarless-agents/` indeholder de **10 arkiverede avatarless agents** (flyttet via `git mv` i PR #14, historik bevaret).
- Arkivet er **versioneret, men ikke aktiv runtime**.
- Indeholder spejlet struktur: `Avatar/agents/System_Prompt_Agent_<id>.md` + `.agents/agents/<id>/**` + en README der dokumenterer årsag ("no matching avatar image").

## Open decisions

- **Agent schema** — canonical struktur for `profile.md` + `skills.yaml` (+ System_Prompt-felt).
- **Skill schema** — canonical struktur for `SKILL.md`.
- **Registry reconciliation** — de 4 registries → én canonical.
- **73 vs 29 skills** — hvilket skill-sæt er sandheden (aktiv `.codex` vs kurateret `.agents`)?
- **Role-agents vs persona-agents** — hvilken agent-model er canonical (rolle `.codex/banedanmark` vs persona `.agents/agents`)?
- **Claude/Ollama adapter implementation** — mangler helt; Codex/Kimi/Gemini findes kun som noter.
- **Memory governance** — canonical vs runtime-local vs snapshot (PR E).
- **Vendor/temp/audit handling** — vendor `skills-main`, temp helper-scripts, `MULTI_AGENT_AUDIT_*.md` afventer separat beslutning.
