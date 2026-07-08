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
sidst_opdateret: "2026-07-01"
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

Én fil (ADR-0002) har status "Accepted" eller "Rejected" — ikke "Proposed".
README.md, AGENTS.md og runtime-status-filen siger alle det samme om hvilket
lag der er aktivt. En ny bruger kan læse `systemkort.md` og se ét ✅, ikke to ⚠️.

---

## Teknisk scope

- [ ] Gennemfør sektion-for-sektion sammenligning af de 14 Banedanmark-agenter i `.vscode/.codex/agents/` vs. `.agents/agents/` (se `docs/plans/runtime-konsolidering-plan.md`)
- [ ] Træf og dokumentér beslutningen med skriftlig begrundelse
- [ ] Opdatér `docs/architecture/ADR-multi-runtime-agent-system.md` status
- [ ] Opdatér `README.md`, `AGENTS.md`, tilføj ny `docs/agents/runtime-status-{{DATO}}.md`
- [ ] Opdatér `systemkort.md` Layer 2
- [ ] Fjern det tilsvarende åbne spørgsmål fra `.agents/brain/open-questions.md`
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

- [ ] `docs/architecture/ADR-multi-runtime-agent-system.md` har status Accepted eller Rejected
- [ ] Grep for ".vscode/.codex" og ".agents/" i README.md/AGENTS.md/runtime-status-filerne giver konsistente, ikke-modstridende resultater
- [ ] `docs/qa/RELEASE-runtime-activation-gate.md` er udfyldt med "GODKENDT"

---

## Blocker / noter

2026-07-01: Oprettet som del af ny PM-dokumentation efter fund af P0-modsigelsen
i `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` (finding A-1). Kræver en
menneskelig/projektejer-beslutning — kan ikke afgøres automatisk af en agent alene.
