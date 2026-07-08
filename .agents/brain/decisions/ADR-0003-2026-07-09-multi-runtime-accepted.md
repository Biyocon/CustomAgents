# ADR-0003: docs/architecture/ADR-multi-runtime-agent-system.md er Accepted — supersederer ADR-0002 punkt 1

**Dato:** 2026-07-09
**Status:** Accepted
**Besluttet af:** Projektejer (Biyocon), efter 48-agent dybdeaudit (`docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`)

## Kontekst

`docs/architecture/ADR-multi-runtime-agent-system.md` (oprettet 2026-06-17) har stået som
"Proposed" i over tre uger. I samme periode har `.agents/brain/decisions/ADR-0002-2026-06-10-audit-dual-runtime-plan-review.md`
(Status: Accepted) fastholdt den modsatte retning: at `.vscode/.codex/` er og forbliver den
aktive autoritative runtime, og at `.agents/`-aktivering afventer en separat beslutning.

Denne modsigelse var selve kernen i det åbne P0-ticket `docs/active/#1-los-runtime-modsigelse.md`,
og blev bekræftet som uafklaret af den 48-agent dybdeaudit der blev kørt 2026-07-09.

## Beslutning

1. **`docs/architecture/ADR-multi-runtime-agent-system.md` er hermed formelt Accepted (2026-07-09).**
   Retningen er: `.agents/` skal modnes til canonical source of truth; `.vscode/.codex/` forbliver
   aktiv runtime midlertidigt og skal på sigt genereres/valideres fra `.agents/` (se ADR'en selv
   for fulde punkter 1-8 og PR-roadmap A-F).

2. **Dette superseder ADR-0002's punkt 1** ("`.vscode/.codex/` er den aktive autoritative runtime...
   Der skal træffes en eksplicit aktiveringsbeslutning... før `.agents/` må behandles som aktiv").
   ADR-0002's øvrige punkter (2-5: roadmap-filens pålidelighed, kildeindlæsning-prioritet, oprydning
   som forudsætning, den tilpassede audit-skabelon) forbliver gyldige og upåvirkede af denne ADR.

3. **Ingen migration er udført ved denne beslutning.** `.vscode/.codex/` er urørt og forbliver aktiv
   runtime, indtil PR B (canonical schema), PR C (adapter-plan), PR D (export/validation-scripts) og
   PR F (runtime-aktivering) er gennemført — jf. ADR-multi-runtime-agent-system.md's egen roadmap og
   dens eksplicitte "Non-goals"-sektion. Dette er en retningsbeslutning, ikke en udførelsesbeslutning.

## Konsekvenser

- `docs/active/#1-los-runtime-modsigelse.md`: checklistepunktet "Opdatér ADR-status" er nu opfyldt.
  Ticketens øvrige punkter (README.md/AGENTS.md/systemkort.md-konsistens, RELEASE-runtime-activation-gate.md)
  er **ikke** udført af denne ADR alene og forbliver åbne.
- `.agents/brain/open-questions.md` spørgsmål 7 ("Hvornår migreres `.vscode/.codex/` fuldt til `.agents/`?")
  er delvist besvaret (retningen er nu fast), men "hvornår" og de konkrete kriterier afventer stadig
  PR B-F — spørgsmålet lukkes derfor ikke, kun dets status-note opdateres.
- Fremtidigt oprydningsarbejde (registry-reconciliation, skills-konsolidering, rolle-vs-persona-afklaring)
  kan nu planlægges med en fast retning at arbejde imod, i stedet for at afvente en uafklaret ADR-status.

## Referencer

- `docs/architecture/ADR-multi-runtime-agent-system.md` (den accepterede ADR)
- `.agents/brain/decisions/ADR-0002-2026-06-10-audit-dual-runtime-plan-review.md` (delvist supersederet)
- `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md` (fund der udløste beslutningen)
- `docs/active/#1-los-runtime-modsigelse.md`
