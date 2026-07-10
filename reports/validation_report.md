# Fase 14 --- Strukturvalideringsrapport

> **⚠️ HISTORISK / SUPERSEDED (markeret 2026-07-09).** Denne rapport er fra 2026-05-06
> og måler den daværende struktur under det gamle ADR-0001-regime (`.vscode/.codex/`
> som eneste autoritative runtime). Den er **ikke gældende**. Den aktuelle, kanoniske
> valideringsrapport er `.agents/reports/validation_report.md`, auto-genereret af
> `scripts/Validate-Harness-Unified.ps1`. Forskellen skyldes at (a) runtime-retningen
> er ændret (ADR-multi-runtime Accepted 2026-07-09, `.agents/` canonical), og (b) de tre
> tidligere validate-scripts er konsolideret til ét med udvidet check-scope (Sektion A–H).
> Bevaret som historik, jf. `docs/active/#4-reconciliér-validation-report.md`.

**Dato:** 2026-05-06
**Projekt:** Agent Harness --- Kvalifikationsordning Entreprenør
**Valideringsramme:** ADR-0001 (`.vscode/.codex/` som autoritativ runtime) + `.agents/`-specifikation fra blok 3

---

## 1. Kritisk konstatering

Der findes **to parallelle strukturer** i dette projekt:

| | Autoritativ runtime (ADR-0001) | Embryonisk `.agents/`-struktur |
|---|---|---|
| **Placering** | `.vscode/.codex/` | `.agents/` |
| **Status** | Fuldt fungerende, aktiv i produktion | Tom --- oprettet men aldrig fyldt |
| **Agenter** | 27 roster + 10 Banedanmark placeholders | 0 |
| **Skills** | 73 aktive | 0 |
| **Brain** | 5 filer + ADR | Undermapper uden spec-filer |
| **Scripts** | 3 af 4 PowerShell-scripts | 0 |

**Konsekvens:** Fase 14's valideringskrav --- designet til at tjekke `.agents/`-strukturen --- kan ikke bestås for den tomme `.agents/`-mappe. Men den EKSTERNE `.vscode/.codex/`-struktur, som ADR-0001 fastslår som autoritativ, består til gengæld næsten alle tjek. Denne rapport dokumenterer begge niveauer.

---

## 2. `.agents/`-struktur --- Checkresultater

| # | Krav | Status | Bemærkning |
|---|---|---|---|
| 1 | `AGENTS.md` i rod | PASS | Findes (1999 bytes). Peger korrekt på `.vscode/.codex/`. |
| 2 | `.agents/registry.yaml` | **FAIL** | `registry.yaml` findes i rod OG i `.vscode/.codex/agents/`, men IKKE under `.agents/`. |
| 3 | `.agents/brain/` med spec-filer | **PARTIAL** | Mappen findes med 4 undermapper. Mangler README.md, context.md, glossary.md, assumptions.md, open-questions.md. |
| 4 | `.agents/agents/` med profile.md+skills.yaml | **FAIL** | Mappen findes men er HELT TOM. Ingen agenter migreret. |
| 5 | `.agents/skills/` med SKILL.md | **FAIL** | Mappen findes men er HELT TOM. Ingen skills migreret. |
| 6 | `.agents/vendor/` med eksterne skills | **FAIL** | Mappen findes men er HELT TOM. |
| 7 | `.agents/scripts/` med 4 PowerShell-scripts | **FAIL** | Mappen findes men er HELT TOM. Ingen scripts migreret. |
| 8 | Avatar-backup | PASS | `Avatar/agents.bak-2026-05-06/` findes med 26 filer. |
| 9 | `.agents/reports/` med Fase 0-3 rapporter | **PARTIAL** | Kun `00_startup_check.md` findes her. Fase 1-3 rapporter ligger i `reports/` (rod-niveau). |

**Score:** 3 PASS / 2 PARTIAL / 4 FAIL (af 9)

---

## 3. Autoritativ runtime --- Checkresultater

| # | Komponent | Status | Bemærkning |
|---|---|---|---|
| 10 | `registry.yaml` | PASS | Findes i `.vscode/.codex/agents/`. ~37 agenter, 44+ skills, 8+ kategorier. |
| 11 | `agent-roster.json` | PASS | 27 aktive agenter. Ingen orphan-filer. |
| 12 | `agents/banedanmark/` | PASS | 10 placeholder-filer + interface-manager-banebyg.md. |
| 13 | `skills/` | PASS | 73 aktive skills inkl. bdk-*, bbtr-*, bbe-*, karpathy-guidelines, tdd, diagnose. |
| 14 | `prompts/` | PASS | 8 prompts: master-system.md, subagent-builder.md, review-contract.md, vendor-check.md, m.fl. |
| 15 | `Brain/` | PASS | context.md, operating-principles.md, source-map.md, glossary.md, open-questions.md, adr/0001-agent-harness-structure.md |
| 16 | `config.toml` | PASS | Findes. |
| 17 | `Avatar/agents/` | PASS | 38 agentprofiler. Alle i UTF-8. |
| 18 | `README_AGENT_HARNESS.md` | PASS | Beskriver aktiv runtime korrekt. |
| 19 | `.gitignore` | PASS | Dækker Python-build-artefakter. |
| 20 | `scripts/` (rod) | **PARTIAL** | 3 scripts findes. Mangler install-skills.ps1. |
| 21 | `temp/verify_agent_harness.py` | PASS | Findes. |
| 22 | `Kombi/` (reference) | PASS | Iqra-main + mange eksterne repos. |

**Score:** 10 PASS / 1 PARTIAL / 0 FAIL (af 11)

---

## 4. Iqra-integration --- Verifikation

11/11 Iqra-agenter verificeret med rige system prompts fra Kombi/Iqra-main/.

---

## 5. Subagent-mapping til Funktionsbeskrivelser

`registry.yaml` mapper 10 Banedanmark-subagents til Funktionsbeskrivelser/FB/*.pdf. 217+ PDF'er understotter subagent-kataloget.

---

## 6. Valideringskonklusion

### Passerer
- Autoritativ runtime er fuldt fungerende med 73 skills, 38 agenter, 8 prompts, 5 Brain-filer og komplet ADR-dokumentation.
- Iqra-integration er 100 procent komplet.
- Subagent-mapping er korrekt konfigureret.
- Avatar-system er robust med backup og generation prompts.

### Fejler
- `.agents/`-strukturen er en tom skal.
- `.agents/registry.yaml` mangler.
- `.agents/agents/`, `.agents/skills/`, `.agents/vendor/`, `.agents/scripts/` er alle tomme.
- `install-skills.ps1` mangler.

### Arsag til fejl
I blok 3-sessionen blev `.agents/`-mapperne oprettet men aldrig fyldt. ADR-0001 var allerede accepteret, og den autoritative runtime (`.vscode/.codex/`) blev aktivt vedligeholdt. `.agents/`-strukturen blev dermed overflodiggjort.

### Anbefaling
1. Ryd op: Slet tom `.agents/`-struktur og anerkend `.vscode/.codex/` som eneste autoritativ runtime.
2. Migrer: Kopier alle aktive filer fra `.vscode/.codex/` til `.agents/`.
3. Omdesign: Lad `.agents/` vaere en tynd orchestrator-klient der peger paa `.vscode/.codex/`.

---

*Rapport genereret: 2026-05-06 11:40*
