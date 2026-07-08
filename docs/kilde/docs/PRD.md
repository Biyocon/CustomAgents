# PRD: {{PROJEKTNAVN}}
**Version:** 1.0
**Oprettet:** {{DATO}}
**Opdateret:** {{DATO}}
**Status:** DRAFT
**Ref:** `docs/KØREPLAN.md` | `docs/DEPS.md`

<!--
STATUS-værdier: DRAFT → AKTIV → FROSSEN → ARKIVERET
Frys kun PRD med eksplicit beslutning — skriv begrundelse i CHANGELOG.md.
Opdater version-nr. (1.0 → 1.1) ved enhver ændring til §1-§5.
-->

---

## §1 Problem

<!--
Max 3 sætninger. Beskriv problemet fra brugerens perspektiv.
Undgå løsningssprog her — kun smertepunktet.
Eksempel: "Arkitekter bruger 10-20 timer per projekt på manuelle specifikationer..."
-->

{{BESKRIV PROBLEMET HER}}

**Hvem har problemet:** {{PERSONA-GRUPPE}}
**Hyppighed:** {{DAGLIGT | UGENTLIGT | PER PROJEKT}}
**Nuværende workaround:** {{HVAD GØR BRUGEREN I DAG}}

---

## §2 Løsning

<!--
Max 5 sætninger. Hvad bygger vi, og hvordan løser det §1-problemet?
Ingen tech-detaljer her — det hører til §5.
-->

{{BESKRIV LØSNINGEN HER}}

**Kerneværdi:** {{ÉN SÆTNING: Hvad giver vi brugeren som ikke fandtes før}}

---

## §3 Personas

<!--
Minimum 1 persona, maksimum 4. Brug rigtige navne for at gøre dem levende.
Betalingsvilje er vigtig — den styrer hvilke P0/P1/P2-features der prioriteres.
-->

| Persona | Rolle | Smertepunkt | Mål med produktet | Betalingsvilje |
|---------|-------|-------------|-------------------|----------------|
| {{NAVN}} | {{STILLING/ROLLE}} | {{KONKRET FRUSTRATION}} | {{HVAD VIL DE OPNÅ}} | {{DKK/USD pr. md}} |

---

## §4 Features

<!--
Sorter efter bruger-impact, ikke teknisk kompleksitet.
P0 = MVP (ingen lancering uden dette)
P1 = Vigtig (v1.x inden for 3 måneder)
P2 = Ønskelig (fremtidig version)

Hvert punkt SKAL have et målbart acceptkriterie.
Undgå vage termer: "hurtig" → "p99 < 200ms", "nem" → "ny bruger færdig på < 5 min".
-->

### P0 — Kritisk (MVP)

| Feature | Beskrivelse | Acceptkriterie |
|---------|-------------|----------------|
| {{FEATURE-NAVN}} | {{1 SÆTNING}} | {{MÅLBAR BETINGELSE}} |

### P1 — Vigtig (v1)

| Feature | Beskrivelse | Acceptkriterie |
|---------|-------------|----------------|
| {{FEATURE-NAVN}} | {{1 SÆTNING}} | {{MÅLBAR BETINGELSE}} |

### P2 — Ønskelig (v2+)

| Feature | Beskrivelse | Note |
|---------|-------------|------|
| {{FEATURE-NAVN}} | {{1 SÆTNING}} | {{HVORFOR UDSKUDT}} |

---

## §5 Tech Stack

<!--
Skriv begrundelsen for hvert valg — ikke bare navnet.
Begrundelsen er vigtig når stacken skal revideres senere.
-->

| Lag | Teknologi | Begrundelse |
|-----|-----------|-------------|
| Frontend | {{FRAMEWORK}} | {{HVORFOR}} |
| Backend | {{FRAMEWORK}} | {{HVORFOR}} |
| Database | {{DB}} | {{HVORFOR}} |
| Auth | {{LØSNING}} | {{HVORFOR}} |
| Hosting | {{PLATFORM}} | {{HVORFOR}} |
| Test | {{FRAMEWORK}} | {{HVORFOR}} |

---

## §6 Successmetrikker

<!--
Konkrete tal med deadline. Ingen metrik uden måleenhed + dato.
"Brugerbase vokser" er ikke en metrik. "100 MAU inden 2026-09-01" er det.
-->

| Metrik | Målværdi | Deadline | Målemethod |
|--------|----------|----------|------------|
| {{METRIK-NAVN}} | {{KONKRET TAL}} | {{DATO}} | {{HVORDAN MÅLES DET}} |

---

## §7 Out of scope

<!--
Det du EKSPLICIT vælger fra i denne version. Lige så vigtig som §4.
Skriv det ned så du ikke diskuterer det igen ved hvert sprint.
-->

- **Ikke i denne version:** {{HVAD BYGGER VI IKKE}}
- **Ikke i denne version:** {{HVAD BYGGER VI IKKE}}
- **Muligvis fremtid:** {{HVAD KAN KOMME SENERE}}

---

## §8 Åbne spørgsmål

<!--
Ting der BLOKERER en beslutning. Ikke idéer eller ønsker — det hører i §4/§7.
Fjern et punkt når beslutningen er taget (dokumentér i CHANGELOG.md).
-->

| Spørgsmål | Ansvarlig | Frist | Status |
|-----------|-----------|-------|--------|
| {{SPØRGSMÅL}} | {{PERSON/AGENT}} | {{DATO}} | ÅBEN |

---

## Ændringshistorik

<!--
Log ALLE ændringer til PRD her + opdater CHANGELOG.md med impact.
Format: [dato] v1.x — hvad ændret og hvorfor
-->

| Dato | Version | Ændring | Årsag |
|------|---------|---------|-------|
| {{DATO}} | 1.0 | Initial version | — |
