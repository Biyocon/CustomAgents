# AgentSkills — Custom AI Agent Harness — System Map (opdateret 2026-07-11, post-PR F)

> Autoritativ arkitekturreference. Læs denne FØR arkitekturbeslutninger træffes.
> Hvert komponent bærer en reel runtime-status (✅ aktiv / ⚠️ delvis / ⬜ planlagt),
> ikke en ambition. Denne fil erstatter ikke `docs/architecture/repo-map.md` — den
> er det korte, autoritative resumé; repo-map.md har den fulde detalje.

---

## Core-distinktion: RUNTIME ER AKTIVERET (2026-07-11) ✅

**ADR-multi-runtime-roadmappen PR A–F er FULDFØRT.** ADR'en er Accepted (2026-07-09,
ADR-0003); aktiveringen er gennemført og gated (`docs/qa/RELEASE-runtime-activation-gate.md`
= GODKENDT 2026-07-11). Ticket #1 (den historiske P0-modsigelse) er lukket → `docs/done/`.

| Lag | Rolle |
|---|---|
| `.agents/` | **CANONICAL source of truth** — eneste redigeringssted for agenter, skills, registry og brain. |
| `.vscode/.codex/` | **Aktiv runtime.** Agents-laget (registry + 19 rolleagenter) og Brain-pointeren **GENERERES** af `.agents/scripts/generate-runtime.py`. Håndredigeres ALDRIG. |

**Arbejdsregel:** redigér canonical → `generate-runtime.py --apply` → bekræft `--check`
(exit 0 = i sync). Historik: modstriden var åben som P0 fra 2026-06-17 til beslutningen
2026-07-09 og aktiveringen 2026-07-11; se `docs/done/#1-los-runtime-modsigelse.md`.

---

## Andre kerne-distinktioner

- **Vendor vs. Kurateret vs. Domæne:** `.agents/vendor/` = read-only open source.
  `.agents/skills/` = udvalgte/tilpassede skills (79). `.agents/agents/` + `.agents/brain/`
  = Banedanmark-specifik domæneviden. Redigér aldrig vendor direkte.
- **Persona vs. rolleagent (AFGJORT 2026-07-11 — begge canonical):** 28 personaer
  (navngivne, avatar-backed + council-chairman) i `.agents/agents/<id>/`; 19 Banedanmark-
  **rolleagenter** (`agent_model: role`, roster-undtagne) i `.agents/agents/banedanmark/<id>/`.
- **Registry-landskab = 2:** `.agents/registry.yaml` (CANONICAL) + `.vscode/.codex/agents/registry.yaml`
  (GENERERET). Rod-registry, tom scaffold og Export-Registry.ps1 blev slettet ved
  post-PR F-oprydningen (git-historik bevaret).

---

## Layer overview

```
┌──────────────────────────────────────────────────────────────┐
│  Instruktionslag:  AGENTS.md (eneste fælles instruksfil)      │
│  Operationelt lag: PROMPT.md, .agents/model-adapters/         │
├──────────────────────────────────────────────────────────────┤
│  CANONICAL:  .agents/  (agents, skills, registry, brain)   ✅ │
│  GENERERET:  .vscode/.codex/agents/ + Brain-pointer        ✅ │
│              (generate-runtime.py --apply / --check)          │
├──────────────────────────────────────────────────────────────┤
│  Agent-lag:    28 personaer + 19 BDK-rolleagenter (47)        │
│  Skill-lag:    vendor / kurateret (79) / planned_skills (30)  │
│  Brain-lag:    context, glossary, assumptions, open-questions,│
│                decisions (ADR), maps, memory, runbooks        │
│  Automation:   scripts/ (rod) + .agents/scripts/              │
└──────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Instruktionslag

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| `AGENTS.md` | Eneste fælles instruktionsfil for alle LLM'er (Codex, Kimi, Qwen, Gemini, Claude) | ✅ |
| `PROMPT.md` | Operationelle prompts til Codex/Kimi i VS Code | ✅ |
| `.agents/model-adapters/*.md` | 7 skema-konforme adaptere: codex (**active**), claude-code, kimi, ollama, gemini, cursor, qwen-code (planned) | ✅ plan-lag; 1/7 aktiv |

---

## Layer 2: Runtime-lag (AKTIVERET 2026-07-11, PR F)

| Komponent | Rolle | Runtime-status |
|---|---|---|
| `.agents/` | **Canonical source of truth** (ADR Accepted 2026-07-09; PR A–F fuldført 2026-07-11). Skills (79), agenter (28+19), registry og brain er canonical. | ✅ Canonical (eneste redigeringssted) |
| `.vscode/.codex/` | **Aktiv runtime — agents-laget + Brain-pointer GENERERET** af `generate-runtime.py`. | ✅ Genereret; håndredigeres aldrig |

**Ét entydigt ✅:** aktiveringen er gennemført, gaten GODKENDT, sync vagtes løbende af
`generate-runtime.py --check` (exit 0 = i sync; exit 1 = drift → nogen har håndredigeret
runtime eller glemt `--apply`).

---

## Layer 3: Agent-lag

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| 28 personaer (`.agents/agents/<id>/`) | Navngivne fagpersonaer (27 avatar-backed + council-chairman meta-agent) | ✅ Alle med profile.md; skema-validerede (0 overtrædelser) |
| 19 BDK-rolleagenter (`.agents/agents/banedanmark/<id>/`) | Faglige roller (Dokumentcontroller, Trafikleder, Bro/Anlæg m.fl.), `agent_model: role` | ✅ Skema-validerede; ⚠️ indholdsmodning: K-tabeller markeret "verificér mod PDF", 4 draft-FB-agenter, 30 planned_skills venter |
| `Avatar/` (27 personaer) | Visuelle profiler + systemprompts (27 ↔ 27 ↔ 27, 1:1 verificeret 2026-07-10) | ✅ |
| Loader: `invoke-agent.py` | Læser Avatar + runtime-rolleagenter + canonical | ✅ 47 agenter, testet post-aktivering |

---

## Layer 4: Skill-lag

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| `.agents/vendor/` (mattpocock + karpathy) | Read-only upstream-referencer | ✅ tracked vendored indhold |
| `.agents/skills/` (kurateret, **79 skills**) | Model-agnostiske + BDK/BBTR-domæneskills; kanonisk tal = harness-validatorens METRIKKER-sektion | ✅ 79/79 skema-valideret |
| `planned_skills:` i profiler (30 refs) | Bevarede intentioner fra gap-analysen 2026-05-06 — endnu ikke oprettet som skills | ⬜ oprettes efter behov (--check har integritetsvagt) |

---

## Layer 5: Brain-lag (`.agents/brain/` = CANONICAL)

| Komponent | Rolle | Runtime-status |
|---|---|---|
| `context.md`, `glossary.md` | Stabil kontekst/domænesprog | ✅ |
| `assumptions.md`, `open-questions.md` | Levende usikkerheds-log | ✅ (kurateret post-PR F 2026-07-11) |
| `decisions/ADR-*.md` | ADR-0001..0003 — alle Accepted | ✅ |
| `maps/`, `runbooks/`, `memory/` (snapshots), `source-map.md` | Navigation, drift, historik | ✅ |
| `.vscode/.codex/Brain/` | KUN en genereret pointer (AGENTS.md) til canonical brain | ✅ genereret, --check-dækket |

Memory-klasser (CANONICAL / RUNTIME-LOKAL / SNAPSHOT): `docs/architecture/memory-governance.md`.

---

## Layer 6: Registry & automation

| Komponent | Hvad den gør | Runtime-status |
|---|---|---|
| `.agents/registry.yaml` | CANONICAL registry (47 agenter, 79 skills, adaptere, brain-paths) | ✅ skema-valideret |
| `.vscode/.codex/agents/registry.yaml` | GENERERET runtime-registry | ✅ genereret af generate-runtime.py |
| `.agents/scripts/generate-runtime.py` | Generator + sync-vagt (`--apply`/`--check`) | ✅ |
| `.agents/scripts/validate-schemas.py` | Skema-conformance (registry+profiler+skills+adaptere) | ✅ 0 overtrædelser |
| `scripts/Validate-Harness-Unified.ps1` | Samlet harness-validering (Sektion A–H) | ✅ 0 fejl; kendt baseline: 12 ægte fence-advarsler (12 avatar-prompts uden ```text-fence) |
| Øvrige `scripts/*.ps1` | Activate-Agent, Invoke-Council, New-AgentProfile, Sync-Skills m.fl. | ✅ (Export-Registry.ps1 slettet ved oprydningen) |

---

## Kendte forhold (accepteret tilstand pr. 2026-07-11)

- 12 avatar-promptfiler bruger struktureret markdown uden ```text-fence (ægte
  advarsler efter fence-regex-fixet; normalisering = indholdsbeslutning).
- K-kompetencetabeller i nye rolleagenter er markeret "verificér mod PDF før
  operationel/sikkerhedskritisk brug" (bevidst konservativt).
- `.vscode/.codex/`-placeringen (vs. rod-`.codex/`) er dokumenteret åben i repo-map.md;
  flyt kræver verifikation af det eksterne Codex-værktøjs søgesti.
- Alle historiske QA-fund fra 2026-07-01-listen er lukket via tickets #2–#13 (docs/done/).

---

## Seneste større ændringer

- 2026-07-11: PR D+E+F leveret samme dag — generator, memory-governance, AKTIVERING.
  Role-vs-persona afgjort (begge canonical). Post-oprydning: Brain-pointer, registry-
  landskab 4→2. KØREPLAN/FORBEDRINGSNOTAT arkiveret til `docs/plans/arkiv/`.
- 2026-07-09/10: ADR Accepted; 48-agent dybdeaudit; skills-flytning; tickets #2–#13 lukket.
