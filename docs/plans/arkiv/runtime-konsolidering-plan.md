# Plan: Runtime-konsolidering (.vscode/.codex/ vs. .agents/)
**Oprettet:** 2026-07-01
**Ref:** `docs/done/#1-los-runtime-modsigelse.md` | `PROJEKT_PLAN.md` §DESIGN
**Status:** ARKIVERET (var: DESIGN)

> **⚠️ ARKIVERET 2026-07-11 — historisk dokument, vedligeholdes ikke.**
> Problemet blev løst via ADR-multi-runtime-roadmappen PR A–F (Accepted 2026-07-09,
> aktiveret 2026-07-11, gate GODKENDT, ticket #1 lukket). **Aktuel sandhed:**
> `primer.md` + `docs/architecture/ADR-multi-runtime-agent-system.md`.
> Bevaret som designhistorik; læs ikke som gældende plan.

> Skrevet FØR implementering, fordi denne beslutning påvirker langt flere end 3
> filer, introducerer en reel arkitekturændring (hvilket lag er "sandheden"), og
> har høj risiko for re-work hvis den træffes overfladisk.

---

## Problem der løses

Repoet har to lag der begge kan læses som "den aktive runtime": `.vscode/.codex/`
(erklæret aktiv i README/AGENTS.md/runtime-status-2026-06-12) og `.agents/`
(erklæret canonical target i ADR-0002, stadig Status: Proposed). Se
`PROJEKT_PLAN.md` §GAP og `systemkort.md` Layer 2.

---

## Løsningsdesign

### Tilgang

Træf beslutningen baseret på INDHOLD, ikke filantal. `.agents/` har færre men
tykkere agent-profiler (120–178 linjer) og en mere komplet Brain-struktur;
`.vscode/.codex/` har flere filer med indhold men tyndere profiler (16–79 linjer).
Anbefalingen er at gennemføre en sektion-for-sektion sammenligning af de 14
Banedanmark-kerneagenter i begge lag (ikke de 36 øvrige, endnu ufuldstændige,
personaer), og lade DEN sammenligning afgøre — ikke et førhåndsprincip om at
"nyest vinder" eller "flest filer vinder".

### Alternativer overvejet

| Alternativ | Fordele | Ulemper | Afvist fordi |
|---|---|---|---|
| Behold `.vscode/.codex/` som aktiv, arkivér `.agents/` | Mindst forstyrrelse nu | Kasserer `.agents/`'s rigere Brain-struktur og model-agnostiske design | Kun afvis hvis indholdssammenligning viser `.agents/` reelt er umodent |
| Aktivér `.agents/` som canonical med det samme | Matcher ADR-0002's intention | 36/37 agentmapper er ufuldstændige — ville aktivere et lag der ikke reelt er klar | Kun vælg denne hvis komplettering (Fase C) planlægges umiddelbart efter |
| Kør begge parallelt på ubestemt tid | Ingen tvungen beslutning nu | Er præcis den nuværende, dokumenterede fejltilstand | Afvist — det er problemet, ikke løsningen |

**Anbefalet valg:** Aktivér `.agents/` som canonical (matcher ADR-0002's
retning og dens rigere Brain/agent-struktur), BETINGET af at Fase C
(agentmappe-komplettering) sættes i gang samme dag som beslutningen, og at
`.vscode/.codex/` bevares uændret (ikke slettet) indtil Fase C er ✅ — som
sikkerhedsnet.

---

## Berørte filer

| Fil | Ændring | Note |
|---|---|---|
| `docs/architecture/ADR-multi-runtime-agent-system.md` | Modificér: status Proposed → Accepted (eller Rejected, hvis sammenligning viser andet) | |
| `README.md` | Modificér: "Aktiv runtime"-linjen og arkitektur-diagrammet | |
| `AGENTS.md` | Modificér: enhver reference til hvilket lag der er aktivt | |
| `docs/agents/runtime-status-2026-06-12.md` | Tilføj: ny status-fil `runtime-status-{{BESLUTNINGSDATO}}.md` der erstatter denne som "aktuel" | |
| `systemkort.md` | Modificér: Layer 2-tabel til ét ✅ | |
| `.agents/brain/open-questions.md` | Modificér: fjern spørgsmålet om hvornår migrering sker | |

---

## Rækkefølge for implementering

1. Gennemfør sektion-for-sektion sammenligning af de 14 Banedanmark-agenter i begge lag
2. Træf og dokumentér beslutningen (opdatér ADR-0002-status samme dag)
3. Opdatér README, AGENTS.md, runtime-status-fil i samme session (ingen tidsforskydning — det var netop tidsforskydningen der skabte den oprindelige modsigelse)
4. Kør `docs/qa/RELEASE-runtime-activation-gate.md` som formel verifikation
5. Start Fase C (agentmappe-komplettering) med det samme hvis `.agents/` blev valgt

---

## Risici

| Risiko | Sandsynlighed | Konsekvens | Afbødning |
|---|---|---|---|
| Beslutningen træffes uden reel indholdssammenligning (blot "nyeste ADR vinder") | Medium | Gentager den oprindelige fejl — overfladisk beslutning uden evidens | Krav om skriftlig sammenligningsnotat før ADR-status ændres |
| `.vscode/.codex/` slettes for tidligt | Lav (planen kræver bevaring til Fase C er done) | Datatab hvis `.agents/` viser sig ufuldstændig efter aktivering | Behold `.vscode/.codex/` uændret som sikkerhedsnet |
| Fase C (36 agentmapper) undervurderes i omfang | Medium | Aktivering af `.agents/` sker uden reel understøttende komplettering | Fase C er en selvstændig, sporet fase i `KØREPLAN.md` med egne acceptkriterier |

---

## Definition of done

- [ ] ADR-0002 har status Accepted eller Rejected, med skriftlig begrundelse
- [ ] Ingen fil i repoet modsiger en anden om hvilket lag der er aktivt
- [ ] `docs/qa/RELEASE-runtime-activation-gate.md` er udfyldt og GODKENDT
- [ ] `systemkort.md` Layer 2 viser ét ✅
