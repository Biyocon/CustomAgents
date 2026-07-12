# Primer

Omskriv denne fil helt ved slutningen af hver session. Læs den først ved
sessionsstart. Dette er kondensatet — hold det kort, konkret og aktuelt. En
forældet primer lyver, og en lyvende primer er værre end ingen.

## Hukommelsessystem — læserækkefølge ved sessionsstart

1. `primer.md` (denne fil)
2. `.agents/brain/context.md` (stabil domænekontekst)
3. `.agents/brain/open-questions.md` og `.agents/brain/assumptions.md`
4. `AGENTS.md` (eneste fælles instruktionsfil — IKKE `CLAUDE.md`/`GEMINI.md`/`CODEX.md`/`KIMI.md` som hovedfil)

---

## Projekt

- **Navn:** AgentSkills — Custom AI Agent Harness — model-agnostisk, genbrugelig
  AI-agent-infrastruktur til projektstyring, udviklet med Banedanmark som domæne.
- **Rod:** `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom`
- **Stack:** Markdown-baserede agent-profiler/skills + YAML-registries + Python-generator/
  validering + PowerShell-harness-audit. Ingen traditionel applikationskode.
- **Git:** GitHub Biyocon/CustomAgents, arbejder direkte på `main` (verificér aktuel HEAD/sync
  med `git status -sb` — skriv ALDRIG aktuel HEAD-hash her). Stabile milepæle: PR F-aktivering
  = `509ffa2d`; steps 1–10 + audit = commit-serien `cd37bb7d`→`5053444d` (2026-07-12).
- **Planlægningsdokumenter:** `PROJEKT_PLAN.md`, `systemkort.md`, `DEPS.md`, `AGENTS.md`.
  (KØREPLAN/FORBEDRINGSNOTAT/runtime-konsolidering-plan er arkiveret i `docs/plans/arkiv/`.)

---

## Arkitektur-tilstand (ALT FULDFØRT pr. 2026-07-12)

- **`.agents/` = CANONICAL source of truth** — eneste redigeringssted. 47 agenter
  (28 personaer + 19 BDK-rolleagenter), **107 skills**, 7 adaptere, brain. 0 skema-overtrædelser.
- **Genererede lag** (håndredigeres ALDRIG): `.vscode/.codex/agents/` + Brain-pointer (codex)
  og `.claude/agents/` 47 subagenter (claude-code, aktiveret 2026-07-12 — draft-status
  propageres i description). Arbejdsregel: redigér canonical → `generate-runtime.py --apply`
  → bekræft `--check` exit 0.
- **GATING:** `.githooks/pre-commit` (aktivér: `git config core.hooksPath .githooks`;
  nødudgang SKIP_HARNESS_GATE=1) + CI `.github/workflows/validate.yml` kører skema- +
  sync-vagt på hver commit/push.
- Registry-landskab = 2 (canonical + genereret). Memory-klasser: `docs/architecture/memory-governance.md`.
- **Fase G UDFØRT** (ADR-0004): generisk skabelon i `C:\Users\Biyocon\.agents\templates\customagents-harness\`
  (26 filer inkl. CI-skeleton; ~\.agents-roden er MasterBrain — kopiér ALDRIG direkte dertil).

## Status-tavle

| Milepæl | Status |
|---|---|
| ADR-roadmap PR A–F | ✅ fuldført + aktiveret 2026-07-11 (gate GODKENDT, ticket #1 lukket) |
| Steps 1–10 (sandhedsgæld→Fase G) | ✅ 2026-07-12 |
| MULTI_AGENT_AUDIT (4 workstreams) | ✅ 2026-07-12 — `docs/audit/AUDIT-2026-07-12-multi-agent-audit-post-roadmap.md`; skabelonen re-baselinet |
| Harness-validering | ✅ HELT GRØN: 0 fejl, 0 advarsler (alle sektioner A–H) |
| K-verifikation mod FB-PDF'er | ✅ 5 rolleprofiler (24 rettelser; uafhængig stikprøve holdt 8/8); 3 opgraderet til active |
| planned_skills | ✅ alle 28 oprettet (FORELØBIG m. Verifikationsstatus-sektion); 0 refs venter |
| Tickets | ✅ alle #1–#13 lukket; `docs/active/` tom |

## Kendte forhold (accepteret/åbent pr. 2026-07-12)

- 28 nye domæneskills er FORELØBIG indtil krydstjek mod Banedanmarks officielle kilder;
  interface-manager + udbudskonsulent + interface-manager-banebyg er draft (dokumenterede forbehold).
- 31 ældre skill-descriptions mangler trigger-sætning (batch-PR anbefalet, audit §8).
- `~/.claude/skills`-globalkopien er tredje ustyret kopi med encoding-korruption (UDEN for repo;
  beslutning udestår: generér fra canonical eller afinstallér).
- Logopakken bor i `temp/` men er load-bearing for 3 brand-skills (flyt anbefalet, egen ændring).
- `.codex`-rodflytning udskudt (kræver ekstern verifikation af Codex-søgesti; repo-map.md).
- Skabelonen mangler examples/ + ROLE_CONTAINER-parametrisering (næste promoveringsrunde).
- bbtr-webdesign er 684 linjer (>500-grænsen; split anbefalet).

## Vigtige filer

- `docs/audit/AUDIT-2026-07-12-multi-agent-audit-post-roadmap.md` — seneste audit (alle fund + plan)
- `docs/architecture/ADR-multi-runtime-agent-system.md` (roadmap ✅) + `registry-reconciliation.md`
  + `memory-governance.md` + `repo-map.md`
- `.agents/brain/decisions/ADR-0004-2026-07-12-fase-g-global-promovering.md`
- `docs/qa/RELEASE-runtime-activation-gate.md` — GODKENDT, inkl. rollback-plan
- `MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md` — re-baselinet audit-skabelon

## Næste skridt (alt er valgfrit/nyt scope — intet blokerer)

1. **Løbende disciplin:** nye agenter/skills i `.agents/` → `--apply` → `--check` exit 0.
   Gaten fanger drift automatisk.
2. Audit §8 "SNART": trigger-batch (31 skills) · bbtr-webdesign-split · ~/.claude/skills-beslutning
   · logopakke-flyt.
3. Nyt scope ved behov: flere adapter-aktiveringer (kimi/gemini/ollama) · adfærds-testsuite
   (open-questions #5–6) · orkestrator-beslutning (#2) · verifikation af de 28 FORELØBIG-skills.

## Noter

- Skriv på dansk i alle projektdokumenter, medmindre tekniske standarder kræver engelsk.
- Slet aldrig filer du ikke selv har oprettet. Commit ofte; **én skrivende session ad gangen**
  (OneDrive-lære + near-miss 2026-07-11: tjek `git status` for fremmede uncommittede ændringer
  FØR første skriv).
- Efter HVER filredigering: verificér ren UTF-8 (`chr(0xFFFD) not in` …) — gentagen mojibake-historik.
- Adapter-filen for Claude hedder `claude-code.md` — IKKE `claude.md` (Windows case-kollision med
  CLAUDE.md). pdftotext virker til FB-PDF'erne.
