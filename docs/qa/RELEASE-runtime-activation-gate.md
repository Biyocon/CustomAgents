# Aktiverings-verifikation: Runtime-konsolidering v1.0
**Dato:** 2026-07-11
**Branch/commit:** main; aktivering udført oven på `8103dfb3` (drift-oprydning); committes som PR F
**Verificeret af:** Claude (agent), på eksplicit aktiveringsordre fra projektejer ("fortsæt med PR F — aktivering godkendt", 2026-07-11)

> "Release" i dette projekt = den formelle aktivering af ÉN runtime som canonical
> (jf. Fase A i `KØREPLAN.md`). Denne fil kan IKKE erstattes af et script alene —
> manuel gennemgang af begge runtime-lags reelle indhold kræves, da tidligere
> validation_report-modsigelser netop opstod af at stole blindt på automatiserede tal.

**Bestå-kriterie:** Alle "Kritisk"-punkter skal være ✅ for at aktiveringen er godkendt.

---

## Overordnet status

| Kategori | Status | Note |
|---|---|---|
| ADR-0002 status opdateret (Accepted/Rejected) | ✅ | ADR-0002 Accepted 2026-06-10; retningen konkretiseret i ADR-multi-runtime (Accepted 2026-07-09, ADR-0003) |
| README/AGENTS.md/runtime-status-fil konsistente | ✅ | Alle opdateret 2026-07-11 til: `.agents/` = canonical, `.vscode/.codex/agents/` = GENERERET. Ingen tilbageværende modstrid |
| `registry.yaml` (rod) og `.agents/registry.yaml` reconcilieret eller tydeligt adskilt | ✅ | `.agents/registry.yaml` = CANONICAL; `.vscode/.codex/agents/registry.yaml` = GENERERET af generate-runtime.py; rod-registry + tom scaffold = FORMELT DEPRECATED (headers opdateret 2026-07-11) |
| Ét valideringsscript kører fejlfrit og giver reproducerbart resultat | ✅ | `generate-runtime.py --check`: to på hinanden følgende kørsler = exit 0 + 0 (SYNC OK). `validate-schemas.py` = 0 overtrædelser. `Validate-Harness-Unified.ps1` = 0 fejl / 27 kendte fence-advarsler |
| `systemkort.md` Layer 2 opdateret til ét ✅ | ✅ | Opdateret 2026-07-11: canonical + genereret runtime, ét entydigt ✅ |

**Aktiverings-beslutning:** ✅ **GODKENDT** (2026-07-11)

---

## Kritiske flows (manuel)

| # | Flow | Forventet | Faktisk | Status |
|---|---|---|---|---|
| 1 | Ny agent-session vælger runtime | Sessionen finder én entydig instruktionssti uden at skulle vælge mellem `.vscode/.codex/` og `.agents/` | Rod-`AGENTS.md` §Runtime status siger entydigt: `.agents/` = canonical (redigér her), `.vscode/.codex/agents/` = genereret (håndredigeres aldrig). README + systemkort siger det samme | ✅ |
| 2 | Registry-opslag | Et script/agent der læser "registry" får ét konsistent svar, ikke et som varierer efter hvilken fil der tilfældigt læses | Canonical og genereret runtime-registry er semantisk identiske (--check exit 0). Rod + scaffold bærer DEPRECATED-headers der peger på canonical | ✅ |
| 3 | Validerings-kørsel | Scriptet giver samme resultat ved to på hinanden følgende kørsler uden mellemliggende ændringer | `generate-runtime.py --check` kørt 2× i træk: exit 0 begge gange, identisk resultat | ✅ |

---

## Regressioner

| # | Feature | Status | Note |
|---|---|---|---|
| 1 | Eksisterende agent-profiler i det VALGTE runtime-lag forbliver læsbare/uændrede | ✅ | End-to-end-test af den faktiske loader `invoke-agent.py -l`: 47 agenter (27 Avatar-personaer + 19 rolleagenter + council-chairman), ingen dubletter; opslag pr. id verificeret (`bd-trafikleder`). Loaderen læser `*/profile.md` — præcis den genererede facon; de fjernede flade `bd-*.md` blev aldrig læst af den |
| 2 | Model-adaptere (`codex.md`, `kimi.md`, `qwen-code.md`, `gemini.md`) peger stadig korrekt efter beslutningen | ✅ | codex.md opdateret (registry_rendering = genereret). Øvrige adaptere er `planned` og peger på canonical — upåvirkede. Alle 7 adaptere validerer mod skema (0 overtrædelser) |

---

## Kendte issues

| Severity | Issue | Workaround | Plan |
|---|---|---|---|
| P2 | `.vscode/.codex/Brain/` er frosset legacy in-place (fysisk erstatning bevidst udskudt — laget læses stadig af runtimen og indeholder ingen unik varig viden efter PR E-landingen) | Frossen-banner + memory-governance-politik forhindrer håndredigering | Fysisk erstatning ved evt. senere `.codex`-rodflytning (åbent, ikke akut, jf. repo-map.md) |
| P3 | Rod-`registry.yaml` + `Export-Registry.ps1` + tom scaffold er DEPRECATED men ikke slettet | Headers gør status utvetydig | Kan slettes ved næste oprydning på eksplicit ordre |
| P3 | `planned_skills:` i profiler (30 refs) er intentioner uden skill-implementering | Adskilt fra operationelle `skills:`; --check har integritetsvagt | Oprettes on-demand når domænebehov opstår |

> Det oprindelige P1-issue ("36 agentmapper i `.agents/agents/` er ufuldstændige") er løst
> undervejs: alle 28 personaer har profile.md+skills.yaml, alle 19 rolleagenter har skema-konform
> profile.md (validate-schemas.py = 0 overtrædelser; audit-harness = 0 fejl).

---

## Rollback-plan (påkrævet, jf. ADR PR F)

Alt er git-tracked og aktiveringen er én commit-serie på `main`:
1. `git revert <PR F-commit>` genskaber den håndholdte runtime (flade bd-*.md, undermapper,
   gammel registry) og fjerner de genererede filer — ingen datatab, historik intakt.
2. Canonical `.agents/` er urørt af aktiveringen (kun læst), så en revert efterlader intet
   inkonsistent i canonical-laget.
3. Efter revert: `generate-runtime.py --check` vil igen rapportere den kendte drift (exit 1) —
   det er den forventede før-aktiverings-tilstand.

---

## Godkendelse

**Godkendt af:** Projektejer (eksplicit ordre 2026-07-11: "fortsæt med PR F — aktivering godkendt"); udført og evidensført af Claude
**Dato:** 2026-07-11
**Note:** Denne gate skal genkøres hvis en ny runtime-relateret ADR oprettes i fremtiden.
