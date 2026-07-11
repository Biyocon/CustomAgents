# Repo map: CustomAgents multi-runtime architecture

Ledsagedokument til [ADR-multi-runtime-agent-system.md](ADR-multi-runtime-agent-system.md).
Kortlægger repoets mapper, registries, runtimes, memory og arkiv samt beslutningsstatus.
**Opdateret 2026-07-11 efter PR A–F-fuldførelse + post-oprydning.**

## Current folders

| Folder | Current role | Classification | Notes |
|---|---|---|---|
| `.agents/` | **CANONICAL source of truth** (agents, skills, registry, brain, vendor, model-adapters, schema, scripts) | source | 28 personaer + 19 rolleagenter (banedanmark/), 79 skills, 7 adaptere; 0 skema-overtrædelser |
| `.vscode/.codex/` | aktiv runtime | **generated runtime** | agents-laget (registry + 19 rolleagenter) + Brain-pointer genereres af `generate-runtime.py`; `skills/` har kun `banebyg` (bevidst leftover); `prompts/`, `config.toml`, scripts er runtime-egne |
| `Avatar/` | persona-prompts (System_Prompt_Agent_*.md) + portrætbilleder | source | 27 avatar-backed personaer, 1:1 med roster |
| `archive/avatarless-agents/` | arkiv for 10 avatarløse agenter | archive | versioneret, ikke aktiv runtime; eksponeres som `subagents` i genereret registry |
| `scripts/` | PowerShell-automatisering | tooling | konsolideret om `Validate-Harness-Unified.ps1` (gamle validatorer = wrappers); Export-Registry.ps1 SLETTET 2026-07-11 |
| `.agents/scripts/` | generator + validering | tooling | `generate-runtime.py` (--apply/--check), `validate-schemas.py`, audit-harness |
| `docs/` | dokumentation (architecture, qa, audit, done-tickets, plans/arkiv) | docs | `docs/active/` er tom — alle tickets lukket |
| `temp/` | parkeret materiale | scratch | tracked: Banedanmark logopakke 2021 (eneste kopi, bevidst parkeret) + verify_agent_harness.py (legacy verifikationsscript) |
| `Funktions- og stillingsbeskrivelser/` | kildemateriale (213+ FB-PDF'er) | source/archive | provenans-grundlag for rolleagenter; flyt-til-arkiv tidligere besluttet, ikke eksekveret (lav prioritet) |
| validation reports | `.agents/reports/validation_report.md` (tracked snapshot, regenereres af værktøj) | generated | .bak-kopier er gitignored |

## Registry map (efter oprydning 2026-07-11: 4 → 2)

| Registry | Rolle |
|---|---|
| `.agents/registry.yaml` | **CANONICAL** (agents + archived + skills + adaptere + brain-paths) |
| `.vscode/.codex/agents/registry.yaml` | **GENERERET** af `generate-runtime.py` — håndredigeres aldrig |
| ~~`registry.yaml` (root)~~ | SLETTET (deprecated legacy build-output; git-historik) |
| ~~`.vscode/.codex/registry.yaml`~~ | SLETTET (deprecated tom scaffold; git-historik) |

## Runtime map

| Runtime | Indgang | Status 2026-07-11 |
|---|---|---|
| **Codex / VS Code** | `AGENTS.md` + `.vscode/.codex/` | ✅ aktiv, GENERERET fra canonical (adapter: codex, active) |
| **Claude Code** | `CLAUDE.md` (pointer) + `.claude/` | adapter `claude-code` (aktiveres som adapter #2 — se model-adapters/) |
| **Kimi** | `AGENTS.md` + adapter-note | planned |
| **Ollama** | Modelfile | planned (mest begrænsede runtime) |
| **Gemini / Gemini CLI** | `GEMINI.md`-target + `gemini.json` | planned |
| **Cursor / Qwen Code** | `AGENTS.md` | planned (kandidat/sekundær) |

Fælles indgang er `AGENTS.md`; hver runtime får en adapter der mapper canonical → runtime-format.

## Memory map (afgjort i PR E — se `memory-governance.md`)

| Klasse | Placering | Behandling |
|---|---|---|
| **CANONICAL** | `.agents/brain/` | levende sandhed; redigeres in-place; én skribent; UTF-8-vagt |
| **RUNTIME-LOKAL** | `.vscode/.codex/Brain/AGENTS.md` | KUN genereret pointer (legacy-indholdet landet i canonical og slettet) |
| **SNAPSHOT** | `.agents/brain/memory/`, `diary/`, `.agents/reports/` | append-only, dateret, redigeres aldrig retroaktivt |

## Archive map

- `archive/avatarless-agents/`: de 10 arkiverede avatarless agents (git mv, historik bevaret);
  spejlet struktur + README med årsag.

## Beslutningsstatus (tidligere "Open decisions")

- ~~Agent schema / Skill schema~~ — **leveret** (PR B, `.agents/schema/`, validérbare, 0 overtrædelser).
- ~~Registry reconciliation 4→1~~ — **fuldført** (PR D/F + oprydning: 1 canonical + 1 genereret).
- ~~73 vs 29 skills~~ — afgjort 2026-07-09 (79 canonical).
- ~~Role-agents vs persona-agents~~ — **afgjort 2026-07-11: BEGGE canonical** (personaer i
  `.agents/agents/<id>/`, rolleagenter i `.agents/agents/banedanmark/<id>/`, `agent_model: role`).
- ~~Claude/Ollama adapter-beskrivelser mangler~~ — leveret i PR C (7 skema-konforme adaptere).
- ~~Memory governance~~ — leveret i PR E (`memory-governance.md`).
- **Vendor-strategi** (mattpocock track vs gitignore) — fortsat åben; ejer: separat vendor-PR.
- **System-prompt canonical placering + dedup** (profile.md vs Avatar/) — åben; se registry-reconciliation.
- **`.vscode/.codex/` vs rod-`.codex/`** — **BESLUTTET 2026-07-11: forbliver under `.vscode/`
  indtil videre.** Analysen (nedenfor) er fortsat gyldig — rod-`.codex/` er det rigtige mønster —
  men flytningen udføres IKKE før det er eksternt verificeret hvor Codex-værktøjet faktisk leder
  efter sin config (kan ikke afgøres indefra repoet). Generatoren gør selve flytningen mekanisk
  (skift target_paths i codex-adapteren + `--apply`), så beslutningen kan genåbnes når
  verifikationen foreligger. Oprindelig analyse: `.vscode/` er VS Codes eget config-rum;
  `.codex/` er editor-uafhængig (config.toml følger OpenAI Codex-konvention); projektet følger
  allerede rod-mønstret for `.claude/`.
