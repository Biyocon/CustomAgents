---
trigger: [bdk-gdpr, gdpr-praksis, persondata, databeskyttelse, samtykke, journalisering]
description: GDPR-efterlevelse i Banedanmark-projekter. FORELØBIG indtil juridiske retningslinjer er verificeret.
---

# BDK GDPR Praksis

## TL;DR

Brug denne skill når du håndterer personoplysninger i projektet.

**Hvad er aktivt:**
- Generelle GDPR-principper (lovlighed, rimelighed, gennemsigtighed)
- Databeskyttelse ved design og standardindstillinger
- Dataminimering

**Hvad er UKENDT / FORELØBIG:**
- Banedanmarks specifikke GDPR-politikker
- Specifikke systemers databehandleraftaler
- Journaliseringskrav for specifikke projekttyper
- Adgangsstyring på rollebasis

## Hurtig-reference

| Princip | Hvad det betyder | Praktisk anvendelse |
|---------|------------------|---------------------|
| Lovlighed | Behandling skal have retsgrundlag | Sørg for dokumenteret grundlag |
| Rimelighed | Kun nødvendige data | Del kun hvad der er nødvendigt |
| Gennemsigtighed | Informér registrerede | Fortrolighedserklæring |
| Dataminimering | Så lidt som muligt | Undgå unødvendige persondata |
| Opbevaringsbegrænsning | Slet når ikke længere nødvendigt | Definér sletteperioder |

## Detaljeret vejledning

### Scenarier

#### 1. Opbevaring af persondata
**FORELØBIG:**
- Opbevar kun nødvendige persondata
- Definér opbevaringsperioder
- Slet automatisk efter periode
- **KRÆVER VERIFICERING:** Banedanmarks specifikke opbevaringsregler

#### 2. Deling af persondata
**FORELØBIG:**
- Del kun med autoriserede parter
- Dokumentér delinger
- Brug sikre kanaler
- **KRÆVER VERIFICERING:** Specifikke godkendte kanaler

#### 3. Journalisering
**FORELØBIG:**
- Dokumentér behandlingsaktiviteter
- Før log over adgang og ændringer
- **KRÆVER VERIFICERING:** Banedanmarks journaliseringskrav

#### 4. Adgangsstyring
**FORELØBIG:**
- Rollebaseret adgang
- Mindst privilegium
- Regelmæssig re-certificering
- **KRÆVER VERIFICERING:** Specifik rollemodel

## Dybt reference

### Tvivlshåndtering

Hvis du er i tvivl om GDPR-konsekvenser:
1. Marker det som uafklaret
2. Dokumentér i Brain/open-questions.md
3. Eskaler til projektleder eller DPO
4. **Foretag ingen handling med persondata før afklaring**

### Forbudte handlinger

- Del persondata via usikre kanaler (f.eks. privat email)
- Opbevar persondata længere end nødvendigt
- Behandl persondata uden dokumenteret retsgrundlag
- Del persondata med tredjepart uden databehandleraftale

### Governance-tabel

| Aktivitet | Kræver afklaring | Ansvarlig | Status |
|-----------|------------------|-----------|--------|
| Opbevaringsperioder | Ja | DPO | FORELØBIG |
| Databehandleraftaler | Ja | DPO | FORELØBIG |
| Rollemodel | Ja | IT-sikkerhed | FORELØBIG |
| Journalisering | Ja | DPO | FORELØBIG |

### Kilder med status

| Kilde | Status | Bemærkning |
|-------|--------|------------|
| GDPR lovtekst | Kendt | Generel viden |
| Banedanmark GDPR-politik | UKENDT | Skal anmodes |
| Databehandleraftaler | UKENDT | Projektspecifik |
| DPO kontakt | UKENDT | Skal identificeres |
