# Primer

Omskriv denne fil helt ved slutningen af hver session. Læs den først ved
sessionsstart. Dette er kondensatet — hold det kort, konkret og aktuelt. En
forældet primer lyver, og en lyvende primer er værre end ingen.

## Hukommelsessystem — læserækkefølge ved sessionsstart

1. `primer.md` (denne fil)
2. `.agents/brain/context.md` (stabil domænekontekst)
3. `.agents/brain/open-questions.md` og `.agents/brain/assumptions.md`
4. `AGENTS.md` (eneste fælles instruktionsfil — IKKE `CLAUDE.md`/`GEMINI.md`/`CODEX.md`/`KIMI.md` som hovedfil, jf. projektets egen regel)

---

## Projekt

- **Navn:** AgentSkills — Custom AI Agent Harness — model-agnostisk, genbrugelig
  AI-agent-infrastruktur til projektstyring, udviklet med Banedanmark som domæne.
- **Rod:** `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom`
- **Stack:** Markdown-baserede agent-profiler/skills + YAML-registries +
  PowerShell/Python-automatisering. Ingen traditionel applikationskode.
- **Git:** main synkron med `origin/main` (GitHub Biyocon/CustomAgents), HEAD `d4334c42`
  pr. 2026-07-11. Working tree rent.
- **Planlægningsdokumenter:** `KØREPLAN.md`, `PROJEKT_PLAN.md`, `systemkort.md`,
  `FORBEDRINGSNOTAT.md`, `DEPS.md`, `AGENTS.md` — alle git-trackede.

---

## Arkitektur-tilstand (afgjort 2026-07-09, ADR Accepted)

- **`.agents/` = CANONICAL source of truth** (ADR-multi-runtime Accepted; se
  `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`).
- **`.vscode/.codex/` = transitional aktiv runtime** for agenter/registry/Brain —
  må IKKE håndredigeres som datakilde; genereres fra canonical ved PR D/F.
- **Hybrid-tilstand:** skills er ALLEREDE flyttet permanent til `.agents/skills/`
  (79 skills; `.codex/skills/` har kun `banebyg` tilbage, bevidst). Rolleagenterne er
  2026-07-11 ligeledes migreret til canonical: `.agents/agents/banedanmark/` (19 stk.).
- **4 registries, alle med rolle-headers** (#2 lukket): `.agents/registry.yaml`=CANONICAL,
  `.vscode/.codex/agents/registry.yaml`=aktiv runtime, rod-`registry.yaml`=legacy
  build-output, `.vscode/.codex/registry.yaml`=død scaffold.

## ADR-roadmap-status (PR A–F)

| PR | Status | Indhold |
|---|---|---|
| A — ADR + repo-map | ✅ | Accepted 2026-07-09 |
| B — Canonical schema | ✅ | 5 skemaer + `validate-schemas.py`; canonical validerer **0 overtrædelser** |
| C — Adapter-plan | ✅ 2026-07-11 | 7 skema-konforme adaptere i `.agents/model-adapters/` (codex=active; claude-code/kimi/ollama/gemini/cursor/qwen-code=planned) |
| D — Export/generering | ✅ 2026-07-11 | `generate-runtime.py`: canonical → build-output + `--check` sync-drift |
| E — Memory-governance | ⬜ NÆSTE | canonical vs runtime-local vs snapshot |
| F — Runtime-aktivering | ⬜ | Anvender PR D-generatoren på `.vscode/.codex/`; lukker #1 + RELEASE-gate |

## Ticket-status

- **`docs/done/` = 12+ lukkede tickets** (#2–#13 alle lukket 2026-07-09/10).
- **Kun #1 er åben** (`docs/active/#1-los-runtime-modsigelse.md`): retning afgjort,
  men fuld aktivering + `docs/qa/RELEASE-runtime-activation-gate.md` afventer PR D–F.
  Gaten må IKKE markeres GODKENDT før faktisk aktivering.

## Verificeret (2026-07-09→11-sessionerne)

- 48-agent dybdeaudit kørt (39 agenter, rapport: `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`);
  alle 10 handlingspunkter i §9 er udført.
- Validérbar canonical: `uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py`
  → **0 overtrædelser** (registry + 47 profiler [28 personaer + 19 rolleagenter] + 79 skills + 7 adaptere).
- Harness-validering: `scripts/Validate-Harness-Unified.ps1` (afløste 3 gamle scripts, som nu er
  wrappers) → 0 Fejl; ~27 kendte advarsler (fence-regex-bug fra original, dokumenteret; bevidst urørt).
- 4 FORELØBIG-agenter komplettéret fra FB-PDF'er (**pdftotext virker** — tidligere "PDF kan ikke
  parses" var manglende værktøj). Ny `bd-bro-og-anlaeg`-agent lukker Bro/Anlæg-dækningshul.
- Avatar-tal: 27 systemprompts ↔ 27 billeder ↔ 27 roster-entries, 1:1. council-chairman er bevidst
  roster-undtaget meta-agent (`meta_agent: true` i registry; validator giver INFO, ikke WARN).
- temp/ ryddet (217→2 filer); rod-`skills/` slettet (reconciled); logopakke flyttet til temp/.

## Kendte, bevidst uløste forhold

- **Fence-regex-buggen** i Validate-Harness-Unified.ps1 Sektion A (nedarvet fra original
  scripts/validate-harness.ps1): PowerShell-backtick-escaping gør at ```text-tjekket aldrig matcher
  korrekt → 27 falske "mangler fence"-advarsler. Dokumenteret i commit be03741c; fix er redesign, ikke sket.
- ~~Role-vs-persona~~ **AFGJORT 2026-07-11: begge modeller er canonical.** 19 rolleagenter migreret til
  `.agents/agents/banedanmark/` (`agent_model: role`, roster-undtagne); runtime-kopien er generation-target.
  Restpunkt for PR D sync-validation: 29 dangling skill-refs i de gamle bd-*-profiler (præeksisterende).
- `.vscode/.codex/`-placeringen af `.codex` er dokumenteret som åbent punkt i
  `docs/architecture/repo-map.md` (bør flyttes til rod-`.codex/` via PR F's generator, ikke akut).
- Kompetencekrav-K-tabeller i alle nye agent-profiler er markeret "verificér mod PDF før
  operationel/sikkerhedskritisk brug" — bevidst konservativt.

## Vigtige filer

- `docs/architecture/ADR-multi-runtime-agent-system.md` — **Accepted**, roadmap PR A–F med status
- `docs/architecture/registry-reconciliation.md` — registry-roller + open decisions med ejer-PR
- `.agents/schema/README.md` — skema-status + conformance
- `.agents/model-adapters/README.md` — adapter-sæt (PR C)
- `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md` — dybdeaudit med alle rettelses-annoteringer

## Næste skridt

1. **PR E — Memory-governance:** policy for canonical vs runtime-local vs snapshot Brain/memory.
2. **PR F — Runtime-aktivering:** anvend `generate-runtime.py`-output på `.vscode/.codex/` (kræver
   eksplicit aktiveringsbeslutning + rollback-plan; gate: `--check` → exit 0). Lukker #1.
3. Kendt drift til PR F (fra `--check` 2026-07-11): 20 agenter kun canonical / 10 kun live (arkiverede),
   12 personaer mangler `accent` i canonical (felt-merge), 1 skill kun i live (`bdk-forbedringsloop`),
   29 dangling skill-refs i bd-*-profiler.
4. Valgfrit vedligehold: fix fence-regex-buggen. (Role-vs-persona afgjort 2026-07-11 — begge i canonical.)

## Noter

- Skriv på dansk i alle projektdokumenter, medmindre tekniske standarder kræver engelsk.
- Slet aldrig filer du ikke selv har oprettet. Commit ofte; én skribent ad gangen (OneDrive-lære).
- Efter HVER filredigering: verificér ren UTF-8 (`chr(0xFFFD) not in` …) — repoet har gentagen
  mojibake-historik, og flere agenter (inkl. AI) har selv introduceret encoding-fejl undervejs.
- Adapter-filen for Claude hedder `claude-code.md` — IKKE `claude.md` (Windows case-kollision med
  CLAUDE.md, som Claude Code auto-læser som instruktioner).
