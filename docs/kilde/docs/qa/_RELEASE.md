# Release Verifikation: {{PROJEKTNAVN}} v{{VERSION}}
**Dato:** {{DATO}}
**Branch/commit:** {{BRANCH}} @ {{COMMIT-HASH}}
**Verificeret af:** {{AGENT/PERSON}}

<!--
HVORNÅR UDFYLDES DENNE FIL:
  - Inden en version merges til main
  - Inden en deploy til produktion
  - Kan IKKE erstattes af CI-resultater alene — manuel verifikation kræves for UX-flows

BESTÅ-KRITERIE: Alle "Kritisk"-punkter skal være ✅ for at release er godkendt.
P1-fejl skal have en workaround beskrevet. P2-fejl blokerer ikke release.
-->

---

## Overordnet status

| Kategori | Status | Note |
|----------|--------|------|
| Build | ⬜ | `npm run build` |
| TypeCheck | ⬜ | `tsc --noEmit` |
| Test suite | ⬜ | `npm test` — N/N tests |
| Kritiske flows | ⬜ | Manuel gennemgang (se nedenfor) |
| Regressions | ⬜ | Sammenlign med forrige release |

**Release-beslutning:** ⬜ GODKENDT | ⬜ AFVIST — afvent fix af: {{BLOKER}}

---

## Build & Typecheck

| # | Check | Kommando | Resultat | Status |
|---|-------|----------|----------|--------|
| 1 | TypeScript clean | `tsc --noEmit` | {{OUTPUT}} | ⬜ |
| 2 | Build | `npm run build` | {{OUTPUT}} | ⬜ |
| 3 | Test suite | `npm test` | {{N}}/{{N}} pass | ⬜ |

---

## Kritiske brugerflows (manuel)

<!--
Test disse flows manuelt — én per row.
"Forventet" beskrives INDEN test. "Faktisk" udfyldes UNDER test.
-->

| # | Flow | Forventet | Faktisk | Status |
|---|------|-----------|---------|--------|
| 1 | {{PRIMÆR HAPPY PATH}} | {{HVAD SKAL SKE}} | {{HVAD SKETE}} | ⬜ |
| 2 | {{FEJLHÅNDTERING}} | {{HVAD SKAL SKE}} | {{HVAD SKETE}} | ⬜ |
| 3 | {{EDGE CASE}} | {{HVAD SKAL SKE}} | {{HVAD SKETE}} | ⬜ |

---

## Regressions

<!--
Test features fra forrige release der IKKE er ændret i denne version.
Formål: fang utilsigtede sideeffekter.
-->

| # | Feature | Status | Note |
|---|---------|--------|------|
| 1 | {{EKSISTERENDE FEATURE}} | ⬜ | |
| 2 | {{EKSISTERENDE FEATURE}} | ⬜ | |

---

## Kendte issues

| Severity | Issue | Workaround | Plan |
|----------|-------|------------|------|
| P1 | {{ISSUE}} | {{WORKAROUND}} | Fix i v{{NÆSTE}} |
| P2 | {{ISSUE}} | {{WORKAROUND}} | Backlog |

---

## Godkendelse

**Godkendt af:** {{PERSON/AGENT}}
**Dato:** {{DATO}}
**Note:** {{EVENTUELLE FORBEHOLD}}
