# Køreplan: {{PROJEKTNAVN}}
**Oprettet:** {{DATO}}
**Opdateret:** {{DATO}}
**Ref:** `docs/PRD.md` | `docs/DEPS.md`

<!--
HÅRDT LOFT: Denne fil må IKKE overskride 200 linjer.
Detaljer hører til i docs/active/, docs/drafts/ og docs/plans/.
Når en fase er done: marker ✅ + dato + commit-hash. Arkivér ikke — behold historikken.
-->

---

## Overblik

| Fase | Navn | Status | Sprints | Gate |
|------|------|--------|---------|------|
| A | {{FASE-NAVN}} | ⬜ PLANLAGT | A-1 til A-N | {{HVAD SKAL VÆRE DONE}} |
| B | {{FASE-NAVN}} | ⬜ PLANLAGT | B-1 til B-N | {{HVAD SKAL VÆRE DONE}} |
| C | {{FASE-NAVN}} | ⬜ PLANLAGT | C-1 til C-N | {{HVAD SKAL VÆRE DONE}} |

<!--
Status-ikoner:
⬜ PLANLAGT   — ikke startet
⏳ AKTIV      — i gang nu
⚠️ DEFERRED   — udskudt, angiv årsag
✅ KOMPLET    — done, verificeret dato + commit
-->

---

## Fase A — {{FASE-A-NAVN}}

**Mål:** {{ÉN SÆTNING: Hvad opnår vi i denne fase}}
**Blokkeret af:** _(ingen — første fase)_
**Blokerer:** Fase B

| Sprint | Opgave | Status | Acceptkriterie |
|--------|--------|--------|----------------|
| A-1 | {{OPGAVE}} | ⬜ | {{MÅLBAR BETINGELSE}} |
| A-2 | {{OPGAVE}} | ⬜ | {{MÅLBAR BETINGELSE}} |
| A-3 | {{OPGAVE}} | ⬜ | {{MÅLBAR BETINGELSE}} |

**Fase-gate:** {{HVAD SKAL VÆRE DONE FOR AT STARTE FASE B}}

---

## Fase B — {{FASE-B-NAVN}}

**Mål:** {{ÉN SÆTNING}}
**Blokkeret af:** Fase A komplet
**Blokerer:** Fase C

| Sprint | Opgave | Status | Acceptkriterie |
|--------|--------|--------|----------------|
| B-1 | {{OPGAVE}} | ⬜ | {{MÅLBAR BETINGELSE}} |
| B-2 | {{OPGAVE}} | ⬜ | {{MÅLBAR BETINGELSE}} |

**Fase-gate:** {{HVAD SKAL VÆRE DONE FOR AT STARTE FASE C}}

---

## Fase C — {{FASE-C-NAVN}}

**Mål:** {{ÉN SÆTNING}}
**Blokkeret af:** Fase B komplet

| Sprint | Opgave | Status | Acceptkriterie |
|--------|--------|--------|----------------|
| C-1 | {{OPGAVE}} | ⬜ | {{MÅLBAR BETINGELSE}} |

**Fase-gate:** {{DEFINITION OF DONE FOR DETTE PROJEKT}}

---

<!--
Tilføj flere faser (D, E, ...) ved at kopiere et fase-blok herover.
Behold 200-linje-loftet: når en fase fyldes ud i detaljer, flyttes detaljerne til docs/plans/.
-->

---

## Deferred

<!--
Ting der er besluttet UDSKUDT med eksplicit begrundelse.
Flyttes IKKE til §7 i PRD — det er to separate lister.
PRD §7 = "bygger vi aldrig i denne version"
Deferred her = "bygger vi, men ikke nu"
-->

| Punkt | Årsag | Revurderes |
|-------|-------|------------|
| {{PUNKT}} | {{ÅRSAG}} | {{DATO ELLER FASE} |

---

## Arkiv

<!--
Sprints/faser der er slettet med begrundelse (ikke bare done — done beholdes ovenfor).
Eksempel: "Sprint A-4 arkiveret 2026-04-04: BuildSpring fjernet fra aktivt scope"
-->

_(ingen endnu)_
