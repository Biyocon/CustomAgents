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
- **Git:** GitHub Biyocon/CustomAgents, arbejder direkte på `main` (verificér aktuel
  HEAD/sync med `git status -sb` — skriv ALDRIG aktuel HEAD-hash her, den rådner ved næste
  commit). Stabile milepæle: PR F-aktivering = `509ffa2d`; post-oprydning = `8f7d2903`.
- **Planlægningsdokumenter:** `PROJEKT_PLAN.md`, `systemkort.md`, `DEPS.md`, `AGENTS.md`
  — alle git-trackede. (`KØREPLAN.md` + `FORBEDRINGSNOTAT.md` er ARKIVERET 2026-07-11 til
  `docs/plans/arkiv/` — overhalet af den fuldførte ADR-roadmap A–F; historik, ikke aktiv plan.)

---

## Arkitektur-tilstand (AKTIVERET 2026-07-11 — roadmap A–F fuldført)

- **`.agents/` = CANONICAL source of truth** (ADR-multi-runtime Accepted 2026-07-09; se
  `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`). Eneste redigeringssted.
- **`.vscode/.codex/agents/` = GENERERET runtime** (PR F aktiveret 2026-07-11): registry +
  19 rolleagenter genereres af `.agents/scripts/generate-runtime.py`. Håndredigeres ALDRIG.
  Ændringer: redigér canonical → `--apply` → verificér `--check` (exit 0).
- Skills (79) i `.agents/skills/` (canonical); Brain: `.agents/brain/` canonical,
  `.vscode/.codex/Brain/` = KUN en genereret pointer (post-PR F-oprydning 2026-07-11;
  legacy-indholdet slettet, git-historik bevaret). Gate GODKENDT:
  `docs/qa/RELEASE-runtime-activation-gate.md` (inkl. rollback-plan + oprydnings-annotering).
- **Registry-landskab = 2** (efter oprydning 2026-07-11): `.agents/registry.yaml`=CANONICAL,
  `.vscode/.codex/agents/registry.yaml`=GENERERET. Rod-registry, tom scaffold og
  Export-Registry.ps1 er SLETTET (var deprecated; git-historik bevaret).

## ADR-roadmap-status (PR A–F)

| PR | Status | Indhold |
|---|---|---|
| A — ADR + repo-map | ✅ | Accepted 2026-07-09 |
| B — Canonical schema | ✅ | 5 skemaer + `validate-schemas.py`; canonical validerer **0 overtrædelser** |
| C — Adapter-plan | ✅ 2026-07-11 | 7 skema-konforme adaptere i `.agents/model-adapters/` (codex=active; claude-code/kimi/ollama/gemini/cursor/qwen-code=planned) |
| D — Export/generering | ✅ 2026-07-11 | `generate-runtime.py`: canonical → build-output + `--check` sync-drift |
| E — Memory-governance | ✅ 2026-07-11 | `docs/architecture/memory-governance.md`; runtime-Brain FROSSET; 3 artefakter landet |
| F — Runtime-aktivering | ✅ 2026-07-11 | `--apply` udført; `--check` exit 0; gate GODKENDT; #1 lukket. **ROADMAP FULDFØRT** |

> **Roadmap A–F bekræftet fuldført + uafhængigt verificeret 2026-07-11** (ikke bare påstået): `--check`
> = SYNC OK/exit 0 reproducerbart · `validate-schemas.py` = 0 overtrædelser (47 profiler + 79 skills + 7
> adaptere) · harness = 0 fejl/27 kendte advarsler · gate = GODKENDT · `docs/active/` tom. Post-verifikation
> rettet én stale hjælpetekst: `generate-runtime.py --check`-footeren sagde stadig "Drift er forventet indtil
> PR F" — nu betinget og korrekt (SYNC OK → drift-vagt-rolle; DRIFT → håndredigeret runtime/manglende `--apply`).
> Commit `817e3c31`.

## Ticket-status

- **ALLE tickets lukket** (#1–#13 → `docs/done/`; `docs/active/` er tom pr. 2026-07-11).
- #1 (runtime-modsigelsen) lukket ved PR F-aktiveringen; gaten
  `docs/qa/RELEASE-runtime-activation-gate.md` er GODKENDT med evidens.

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

- ~~Fence-regex-buggen~~ **FIXET 2026-07-11:** matchet i Sektion A brugte double-quoted `"``` + `text"`
  hvor backticks blev PowerShell-escapes (regex reelt `` `<TAB>ext ``) — fyrede altid. Nu single-quoted
  label + `[regex]::Escape`. Afsløring: kun 15/27 avatar-promptfiler HAR ```text-fence; **de 12
  residual-advarsler er ÆGTE** (12 filer bruger struktureret markdown-format uden fence — indholdsmæssigt
  fine, følger bare ikke fence-konventionen). Ny advarsels-baseline: 12 ægte (før: 27 falske).
  Evt. normalisering af de 12 filer er en separat indholdsbeslutning.
- ~~Role-vs-persona~~ **AFGJORT 2026-07-11: begge modeller er canonical.** 19 rolleagenter migreret til
  `.agents/agents/banedanmark/` (`agent_model: role`, roster-undtagne); runtime-kopien genereres.
  (De 29+1 dangling skill-refs er LØST samme dag: remap/`planned_skills`; --check har integritetsvagt.)
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

## Næste skridt (roadmappen er fuldført — alt herunder er valgfrit/nyt scope)

1. **Løbende disciplin:** nye agenter/skills laves i `.agents/`, aktiveres med
   `generate-runtime.py --apply`, verificeres med `--check` (exit 0). Genererede filer røres aldrig.
2. ~~Valgfri oprydning fra gaten~~ **UDFØRT 2026-07-11 på eksplicit ordre:** runtime-Brain erstattet
   af genereret pointer (--check-dækket); rod-registry + scaffold + Export-Registry.ps1 slettet.
   Tilbage af valgfrit: evt. flyt af `.codex` til rod (repo-map.md) — bevidst IKKE gjort
   (afhænger af hvor det eksterne Codex-værktøj leder; egen beslutning).
3. Valgfrit vedligehold: fix fence-regex-buggen (27 falske advarsler); opret `planned_skills`
   on-demand (30 refs venter). (KØREPLAN/FORBEDRINGSNOTAT ARKIVERET 2026-07-11 → `docs/plans/arkiv/`.)

## Noter

- Skriv på dansk i alle projektdokumenter, medmindre tekniske standarder kræver engelsk.
- Slet aldrig filer du ikke selv har oprettet. Commit ofte; én skribent ad gangen (OneDrive-lære).
- Efter HVER filredigering: verificér ren UTF-8 (`chr(0xFFFD) not in` …) — repoet har gentagen
  mojibake-historik, og flere agenter (inkl. AI) har selv introduceret encoding-fejl undervejs.
- Adapter-filen for Claude hedder `claude-code.md` — IKKE `claude.md` (Windows case-kollision med
  CLAUDE.md, som Claude Code auto-læser som instruktioner).
