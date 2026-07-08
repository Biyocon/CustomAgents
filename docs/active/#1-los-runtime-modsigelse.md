---
id: "#1"
title: "Løs runtime-modsigelsen mellem .vscode/.codex/ og .agents/"
fase: "A"
sprint: "A-1"
status: active
prioritet: "P0"
deps: []
blocks:
  - "#2"
  - "#3"
  - "#4"
  - "#6"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-09"
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

- [ ] Gennemfør sektion-for-sektion sammenligning af de 14 Banedanmark-agenter i `.vscode/.codex/agents/` vs. `.agents/agents/` (se `docs/plans/runtime-konsolidering-plan.md`)
- [x] Træf og dokumentér beslutningen med skriftlig begrundelse (2026-07-09, se ADR-0003)
- [x] Opdatér `docs/architecture/ADR-multi-runtime-agent-system.md` status (2026-07-09: Accepted)
- [ ] Opdatér `README.md`, `AGENTS.md`, tilføj ny `docs/agents/runtime-status-{{DATO}}.md`
- [ ] Opdatér `systemkort.md` Layer 2
- [x] Opdatér (ikke fjern — spørgsmålet om "hvornår" er stadig åbent) det tilsvarende spørgsmål i `.agents/brain/open-questions.md` (spørgsmål 7)
- [ ] Kør `docs/qa/RELEASE-runtime-activation-gate.md`

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
- [ ] Grep for ".vscode/.codex" og ".agents/" i README.md/AGENTS.md/runtime-status-filerne giver konsistente, ikke-modstridende resultater
- [ ] `docs/qa/RELEASE-runtime-activation-gate.md` er udfyldt med "GODKENDT"

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
