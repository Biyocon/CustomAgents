# Aktiverings-verifikation: Runtime-konsolidering v1.0
**Dato:** {{UDFYLDES VED GENNEMFØRELSE}}
**Branch/commit:** {{UDFYLDES}}
**Verificeret af:** {{AGENT/PERSON}}

> "Release" i dette projekt = den formelle aktivering af ÉN runtime som canonical
> (jf. Fase A i `KØREPLAN.md`). Denne fil kan IKKE erstattes af et script alene —
> manuel gennemgang af begge runtime-lags reelle indhold kræves, da tidligere
> validation_report-modsigelser netop opstod af at stole blindt på automatiserede tal.

**Bestå-kriterie:** Alle "Kritisk"-punkter skal være ✅ for at aktiveringen er godkendt.

---

## Overordnet status

| Kategori | Status | Note |
|---|---|---|
| ADR-0002 status opdateret (Accepted/Rejected) | ⬜ | |
| README/AGENTS.md/runtime-status-fil konsistente | ⬜ | Ingen tilbageværende modstrid |
| `registry.yaml` (rod) og `.agents/registry.yaml` reconcilieret eller tydeligt adskilt | ⬜ | |
| Ét valideringsscript kører fejlfrit og giver reproducerbart resultat | ⬜ | |
| `systemkort.md` Layer 2 opdateret til ét ✅ | ⬜ | |

**Aktiverings-beslutning:** ⬜ GODKENDT | ⬜ AFVIST — afvent fix af: {{BLOKER}}

---

## Kritiske flows (manuel)

| # | Flow | Forventet | Faktisk | Status |
|---|---|---|---|---|
| 1 | Ny agent-session vælger runtime | Sessionen finder én entydig instruktionssti uden at skulle vælge mellem `.vscode/.codex/` og `.agents/` | | ⬜ |
| 2 | Registry-opslag | Et script/agent der læser "registry" får ét konsistent svar, ikke et som varierer efter hvilken fil der tilfældigt læses | | ⬜ |
| 3 | Validerings-kørsel | Scriptet giver samme resultat ved to på hinanden følgende kørsler uden mellemliggende ændringer | | ⬜ |

---

## Regressioner

| # | Feature | Status | Note |
|---|---|---|---|
| 1 | Eksisterende agent-profiler i det VALGTE runtime-lag forbliver læsbare/uændrede | ⬜ | |
| 2 | Model-adaptere (`codex.md`, `kimi.md`, `qwen-code.md`, `gemini-code.md`) peger stadig korrekt efter beslutningen | ⬜ | |

---

## Kendte issues

| Severity | Issue | Workaround | Plan |
|---|---|---|---|
| P1 | 36 agentmapper i `.agents/agents/` er ufuldstændige selv efter runtime-beslutning | Behandles som separat task (#6), blokerer ikke selve aktiveringen | Fase C i `KØREPLAN.md` |

---

## Godkendelse

**Godkendt af:** {{PERSON/AGENT}}
**Dato:** {{DATO}}
**Note:** Denne gate skal genkøres hvis en ny runtime-relateret ADR oprettes i fremtiden.
