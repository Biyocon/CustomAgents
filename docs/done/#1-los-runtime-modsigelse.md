---
id: "#1"
title: "Løs runtime-modsigelsen mellem .vscode/.codex/ og .agents/"
fase: "A"
sprint: "A-1"
status: done
prioritet: "P0"
deps: []
blocks:
  - "#2"
  - "#3"
  - "#4"
  - "#6"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-11"
lukket: "2026-07-11"
---

---

## Hvad & Hvorfor

Repoet erklærer to forskellige lag som "den aktive runtime" i to forskellige,
lige autoritative filer. Indtil dette afgøres formelt, kan ingen agent eller
bruger med sikkerhed vide hvilket lag der skal redigeres, hvilket risikerer
duplikeret arbejde eller utilsigtet sletning af det lag der reelt er i brug.

**Vigtig nuance (tilføjet 2026-07-01, uafhængig QA-krydstjek + verificeret):**
`.vscode/.codex/scripts/invoke-agent.py` indlæser allerede agenter fra 3 kilder
(`Avatar/agents`, `.vscode/.codex/agents/banedanmark`, `.agents/agents`) — ved
selve brugen er runtimen altså de facto allerede hybrid. Det gør beslutningen
mindre risikabel end først antaget: der findes allerede et fungerende
læse-søm mellem lagene, blot ikke ét autoritativt registry/kildelag. Se
`docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` finding A-8.

---

## Done ser sådan ud

`docs/architecture/ADR-multi-runtime-agent-system.md` har status "Accepted" eller "Rejected"
— ikke "Proposed". (Rettelse 2026-07-09: teksten her henviste fejlagtigt til "ADR-0002", som
allerede havde status Accepted siden 2026-06-10 — det er ADR-multi-runtime-agent-system.md
der var den reelt uafklarede fil.)
README.md, AGENTS.md og runtime-status-filen siger alle det samme om hvilket
lag der er aktivt. En ny bruger kan læse `systemkort.md` og se ét ✅, ikke to ⚠️.

**Status 2026-07-09:** ADR'en er nu Accepted (se `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`).
De øvrige "Done"-kriterier (README/AGENTS.md/systemkort.md-konsistens) er endnu ikke opfyldt —
ticket forbliver `active` indtil de er gjort.

---

## Teknisk scope

- [x] Gennemfør sektion-for-sektion sammenligning af de 14 Banedanmark-agenter i `.vscode/.codex/agents/` vs. `.agents/agents/` — **opfyldt via role-vs-persona-migreringen 2026-07-11** (commit f0a92088): rigeste kilde pr. rolle identificeret (flade bd-*.md; undermappernes profile.md var afledte kopier), capabilities fra afledte skills.yaml foldet ind, alt normaliseret til agent-profile.schema.json, og `generate-runtime.py --check` verificerede efterfølgende indholdsmæssig ækvivalens (exit 0 efter aktivering)
- [x] Træf og dokumentér beslutningen med skriftlig begrundelse (2026-07-09, se ADR-0003)
- [x] Opdatér `docs/architecture/ADR-multi-runtime-agent-system.md` status (2026-07-09: Accepted)
- [x] Opdatér `README.md`, `AGENTS.md` (2026-07-09: runtime-status + banner opdateret til ADR Accepted / hybrid-tilstand). NB: valgte at opdatere de eksisterende filer i stedet for at tilføje ny `runtime-status-{{DATO}}.md`, da en ny dateret status-fil ville tilføje endnu en potentielt-divergerende kilde.
- [x] Opdatér `systemkort.md` Layer 2 (2026-07-09: Core-distinktion + Layer 2-tabel opdateret til ét ✅ = `.agents/` canonical)
- [x] Opdatér (ikke fjern — spørgsmålet om "hvornår" er stadig åbent) det tilsvarende spørgsmål i `.agents/brain/open-questions.md` (spørgsmål 7)
- [x] Kør `docs/qa/RELEASE-runtime-activation-gate.md` — **GODKENDT 2026-07-11** efter faktisk aktivering (PR F): agents-laget genereret fra canonical (`generate-runtime.py --apply`), `--check` = exit 0 (reproducerbart, 2 kørsler), loader-test 47 agenter, rollback-plan dokumenteret i gaten.

---

## Relevante filer

- `README.md` (linje 3-16, runtime-status-sektion)
- `AGENTS.md`
- `docs/agents/runtime-status-2026-06-12.md`
- `docs/architecture/ADR-multi-runtime-agent-system.md`
- `docs/agents/end-of-day-memory-2026-06-17.md`
- `.agents/brain/open-questions.md`
- `docs/plans/runtime-konsolidering-plan.md`
- `docs/audit/architecture-review-agents-vs-vscode.html` — visuel sammenligning + 4 konkrete integrationskandidater (canonical+genereret-adapter, registry-reconciliation, rolle-vs-persona-afklaring, Brain-tier-opdeling)

---

## Acceptkriterie

- [x] `docs/architecture/ADR-multi-runtime-agent-system.md` har status Accepted eller Rejected (Accepted, 2026-07-09)
- [x] Grep for ".vscode/.codex" og ".agents/" i README.md/AGENTS.md/systemkort.md giver konsistente, ikke-modstridende resultater (2026-07-09: alle tre siger nu ".agents/ = canonical, .vscode/.codex/ = transitional aktiv runtime, hybrid pga. skills-flytning")
- [x] `docs/qa/RELEASE-runtime-activation-gate.md` er udfyldt med "GODKENDT" (2026-07-11, efter faktisk PR F-aktivering)

**Status 2026-07-09:** Retningsbeslutningen + dokumentkonsistens er gjort. Ticket forbliver `active`
for de to resterende, aktiverings-afhængige punkter: (1) sektion-for-sektion agent-sammenligning
`.vscode/.codex/agents/` vs `.agents/agents/`, og (2) RELEASE-gaten (kræver selve aktiveringen).

**Status 2026-07-11 — LUKKET:** PR F gennemført på projektejerens eksplicitte aktiveringsordre.
`.vscode/.codex/agents/` (registry + 19 rolleagenter) genereres nu fra canonical `.agents/` af
`generate-runtime.py`; håndholdte runtime-filer afviklet (git-historik bevaret); README/AGENTS.md/
systemkort konsistente; gaten GODKENDT med evidens + rollback-plan. Runtime-modsigelsen findes ikke
længere: ét canonical lag, ét genereret runtime-lag.

---

## Blocker / noter

2026-07-01: Oprettet som del af ny PM-dokumentation efter fund af P0-modsigelsen
i `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` (finding A-1). Kræver en
menneskelig/projektejer-beslutning — kan ikke afgøres automatisk af en agent alene.

2026-07-09: Projektejer traf beslutningen efter 48-agent dybdeaudit
(`docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`): ADR-multi-runtime-agent-system.md
er Accepted, `.agents/` bliver canonical, `.vscode/.codex/` forbliver aktiv runtime indtil
PR B-F er gennemført. Se `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`.
Ticket forbliver `active` — README/AGENTS.md/systemkort.md-synkronisering og
RELEASE-runtime-activation-gate.md mangler stadig.
