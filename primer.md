# Primer

Omskriv denne fil helt ved slutningen af hver session. Læs den først ved
sessionsstart. Dette er kondensatet — hold det kort, konkret og aktuelt. En
forældet primer lyver, og en lyvende primer er værre end ingen.

## Hukommelsessystem — læserækkefølge ved sessionsstart

1. `primer.md` (denne fil)
2. `.agents/brain/context.md` (stabil domænekontekst)
3. `.agents/brain/open-questions.md` og `.agents/brain/assumptions.md`
4. `AGENTS.md` (eneste fælles instruktionsfil — IKKE `CLAUDE.md`/`GEMINI.md`/`CODEX.md`/`KIMI.md` som hovedfil, jf. projektets egen regel)

Anvend `.agents/brain/assumptions.md` og `open-questions.md` som varige
driftsregler før kode/dokumenter rettes.

---

## Projekt

- **Navn:** AgentSkills — Custom AI Agent Harness — model-agnostisk, genbrugelig
  AI-agent-infrastruktur til projektstyring, udviklet med Banedanmark som domæne.
- **Rod:** `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom`
- **Stack:** Markdown-baserede agent-profiler/skills + YAML-registries +
  PowerShell-automatisering. Ingen traditionel applikationskode.
- **Git:** Tracked repo, snapshot-branch `snapshot/local-pc-2026-06-07` (auditmarkør,
  ikke backup af ignored/temp/vendor-filer)
- **Planlægningsdokumenter:** `KØREPLAN.md`, `PROJEKT_PLAN.md`, `systemkort.md`,
  `FORBEDRINGSNOTAT.md`, `DEPS.md`, `AGENTS.md`

---

## Nuværende fokus (2026-07-02)

- Løse P0-modsigelsen om hvilken runtime der er aktiv: `.vscode/.codex/`
  (README/AGENTS.md, 2026-06-12) vs. `.agents/` (ADR-0002 "Proposed", 2026-06-17)
- Reconciliere de to divergerende `registry.yaml`-filer (rod vs. `.agents/`)
- **Lukket siden sidst:** Natlig filkorruptions-hændelse (5 filer) + `.gitattributes`-
  regression (tabt LFS-regel) — begge genoprettet og verificeret. 3 nye commits:
  `1ea48fba`, `2be73f02`, `c6a68cce`. Se `LESSON.md` og `docs/drafts/#12`/`#13`.

## Verificeret denne session

> Kun ting faktisk bekræftet (dokument på disk + krydstjekket mod mindst én anden kilde).

- `.vscode/.codex/` har 272 filer med reelt indhold; agent-profiler 16–79 linjer
- `.agents/` har 329 filer; agent-profiler 120–178 linjer; kun 1 af 37 agentmapper
  har fuld filpakke (profile.md+skills.yaml+AGENTS.md+avatar.md)
- Avatar-mappen indeholder faktisk 27 systemprompts — README's "23 mangler" er forældet
- To modstridende `validation_report.md`-versioner findes (2026-05-06: 3 PASS/2
  PARTIAL/4 FAIL; nyere i `.agents/reports/`: 69 OK/0 fejl) uden forklaring på forskellen
- **(2026-07-01, uafhængig QA)** `invoke-agent.py` læser allerede fra 3 kilder — runtime er de facto hybrid. 10 arkiverede agenter optræder stadig i aktiv roster. `council-chairman` fejlplaceret som arkiveret. 4 Higgsfield-skills uregistreret. 0 af 28 `.agents/agents/`-mapper har fuld filpakke (rettet fra "1 af 37")

## Statusoverblik

| Emne | Status | Resumé |
|---|---|---|
| Runtime-beslutning | ⬜ | Skal træffes — se `docs/active/#1-los-runtime-modsigelse.md` |
| Registry-reconciliation | ⬜ | Se `docs/active/#2-reconciliér-registry.md` |
| Skill-antal | ⬜ | Modstridende tal (29/73/33/188) — se `docs/active/#3-afklar-skill-antal.md` |
| 4 FORELØBIG subagenter | ⬜ | udbudskonsulent, projektleder, byggeleder-tilsyn, interface-manager |
| 28 ufuldstændige agentmapper (0/28 komplette) | ⬜ | Se `docs/active/#6-komplettér-agentmapper.md` |
| Roster/registry-fejl (arkiv-mismatch, council-chairman, Higgsfield) | ⬜ | Se `docs/active/#11-ryd-op-i-roster-og-registry-fejl.md` |
| QA-sikkerhedsfund | ⬜ | Vendor-gitlink uden `.gitmodules`, tracked API-nøgle-placeholder |
| CRLF-støj (~180 falske "M") | ✅ | Lukket via `#12` — `.gitattributes` + renormalize, commits `2be73f02`/`c6a68cce` |
| Filkorruptions-hændelse (5 filer) | ✅ | Genoprettet og committet (`1ea48fba`) — rodårsag stadig åben, se `#13` |

## Vigtige filer

- `systemkort.md` — autoritativ arkitektur, viser den uafklarede runtime-modstrid
- `FORBEDRINGSNOTAT.md` — dyb kritik + roadmap
- `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` — konsolideret fund-liste
- `docs/architecture/ADR-multi-runtime-agent-system.md` — status: Proposed

## Blokerings

- Runtime-beslutningen (#1) blokerer stort set alt andet strukturelt arbejde —
  se `DEPS.md` for fuld graf.

## Næste skridt

1. Gennemfør `docs/active/#1-los-runtime-modsigelse.md`
2. Gennemfør `docs/active/#2-reconciliér-registry.md`
3. Kør et samlet valideringsscript og lås metrikkerne (#3, #4)

## Noter

- Skriv på dansk i alle projektdokumenter, medmindre tekniske standarder kræver engelsk (projektregel, jf. `README.md`).
- Slet aldrig filer du ikke selv har oprettet.
