# Arkitektur-Audit: {{PROJEKTNAVN}}
**Dato:** {{DATO}}
**Scope:** `{{STI/DER/AUDITERES}}`
**Udført af:** {{AGENT/PERSON}}
**Trigger:** {{PERIODISK | POST-MILESTONE | INCIDENT | ANMODNING}}

<!--
HVORNÅR KØRES EN AUDIT:
  - Ved afslutning af en større fase (se LESSON.md)
  - Når test-coverage falder under tærskel
  - Når en P0-fejl opdages i produktion
  - Kvartalsvis som forebyggelse

PRIORITETER:
  P0 = Kritisk — blokerer release / ødelægger data / sikkerhedsrisiko
  P1 = Høj — skal fixes inden næste sprint
  P2 = Medium — fix inden næste fase
  P3 = Lav — backlog

FINDINGS REGISTRERES OGSÅ I: docs/active/ som tasks (for P0+P1)
-->

---

## Executive Summary

**Samlet vurdering:** {{GOD | ACCEPTABEL | KRITISK}}

| Severity | Antal | Åbne | Løst i denne audit |
|----------|-------|------|---------------------|
| P0 | {{N}} | {{N}} | {{N}} |
| P1 | {{N}} | {{N}} | {{N}} |
| P2 | {{N}} | {{N}} | {{N}} |
| P3 | {{N}} | {{N}} | {{N}} |

**Blokerer release:** {{JA — se P0-findings | NEJ}}

---

## Workstream A — Arkitektur & Struktur

| ID | Finding | Fil:Linje | Severity | Status |
|----|---------|-----------|----------|--------|
| A-1 | {{FINDING}} | `{{fil.ts:N}}` | P{{0-3}} | ÅBEN |
| A-2 | {{FINDING}} | `{{fil.ts:N}}` | P{{0-3}} | LØST |

**Konklusion:** {{KORT VURDERING AF ARKITEKTUR-SUNDHED}}

---

## Workstream B — Kodekvalitet & Test

| ID | Finding | Fil:Linje | Severity | Status |
|----|---------|-----------|----------|--------|
| B-1 | {{FINDING}} | `{{fil.ts:N}}` | P{{0-3}} | ÅBEN |

**Test-coverage:** {{N}}%
**Typefejl:** {{N}}
**Filer over 500 LOC:** {{N}} (liste: `{{filer}}`)

**Konklusion:** {{KORT VURDERING}}

---

## Workstream C — Sikkerhed & Konfiguration

| ID | Finding | Fil:Linje | Severity | Status |
|----|---------|-----------|----------|--------|
| C-1 | {{FINDING}} | `{{fil.ts:N}}` | P{{0-3}} | ÅBEN |

**Konklusion:** {{KORT VURDERING AF SIKKERHEDSPROFIL}}

---

## Workstream D — QA & Kryds-verifikation

<!--
Verificér findings fra A-C — fjern falske positiver, deduplicér, prioritér.
-->

| ID | Original finding | Verificeret | Konklusion |
|----|-----------------|-------------|------------|
| A-1 | {{FINDING}} | {{JA/NEJ}} | {{REEL / FALSK POSITIV}} |

---

## Handlingsplan

| Finding | Task oprettet | Ansvarlig | Frist |
|---------|--------------|-----------|-------|
| {{P0-FINDING}} | `docs/active/#N-titel.md` | {{PERSON/AGENT}} | {{DATO}} |
| {{P1-FINDING}} | `docs/drafts/#N-titel.md` | {{PERSON/AGENT}} | Næste sprint |

---

## Gates

<!--
Alle gates SKAL være ✅ for at audit er komplet.
-->

- [ ] P0-findings har tasks i docs/active/
- [ ] P1-findings har tasks i docs/drafts/
- [ ] Executive summary er udfyldt
- [ ] CHANGELOG.md har entry for denne audit
- [ ] Næste audit-dato er aftalt: {{DATO}}
