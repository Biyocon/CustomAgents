---
trigger: [bdk-legal, legal-mapping, lovkrav, regelkrav, jernbanelov, csm, sikkerhedsdirektiv]
description: Kortlægning af lov- og regelkrav for jernbaneprojekter. FORELØBIG indtil juridiske kilder er verificeret.
---

# BDK Legal Mapping

## TL;DR

Brug denne skill når du skal identificere eller dokumentere lov- og regelkrav i jernbaneprojekter.

**Hvad er aktivt:**
- Generel struktur for lov-kortlægning
- Kendte lov-niveauer (EU, national, branche)
- Citationsregler

**Hvad er UKENDT / FORELØBIG:**
- Præcis liste over gældende love og regler
- Specifikke paragraffer for hver projekttype
- TSI-dokumenternes aktuelle versioner
- SSB-supplerende sikkerhedsbestemmelser

## Hurtig-reference

| Lov-lag | Eksempler | Status |
|---------|-----------|--------|
| EU | CSM-RA direktiv, TSI | Kendt koncept, ukendt versioner |
| National | Jernbaneloven, Bekendtgørelser | Delvist kendt |
| Branche | ORS, ORF, SR | Delvist kendt (eksisterer) |
| Lokal | Lokale instruktioner | UKENDT |

## Detaljeret vejledning

### Kortlægningsstruktur

For hvert krav:
1. **Kilde:** Lov, regel, standard, instruks
2. **Scope:** Hvad dækker det?
3. **Projektrelevans:** Er det relevant for dette projekt?
4. **Implementering:** Hvordan efterleves det?
5. **Ansvarlig:** Hvem sikrer overholdelse?
6. **Dokumentation:** Hvor er det dokumenteret?

### Citationsregler

- Referér altid til specifik paragraf/afsnit
- Brug officiel titel og årstal
- Inkluder versionsnummer hvis relevant
- Dokumentér hvornår referencen sidst er verificeret

### Konflikthåndtering

Hvis to regler modsiger hinanden:
1. Prioriter EU-lovgivning over national
2. Prioriter national over branche
3. Dokumentér konflikten i Brain/decisions/
4. Søg afklaring fra juridisk afdeling

## Dybt reference

### Kilder hierarki

```
EU-direktiver og forordninger
    ↓
National lovgivning (jernbaneloven)
    ↓
Bekendtgørelser og cirkulærer
    ↓
Branchestandarder (ORS, ORF, SR)
    ↓
Lokale instruktioner
```

### Usikkerheder med FORELØBIG-markering

| Usikkerhed | Konsekvens | Næste trin |
|------------|------------|------------|
| TSI-versioner | Forkert krav kan anvendes | Verificér mod Banedanmarks TSI-oversigt |
| SSB-indhold | Manglende kravsoverholdelse | Anmod om SSB-liste fra sikkerhedsafdeling |
| Lokale instruktioner | Lokale krav overset | Identificér lokale instruktioner pr. strækning |

### Workflow

1. Identificér projektets scope
2. Kortlæg relevante lov-lag
3. Verificér aktuelle versioner
4. Dokumentér i projektets regelmatrix
5. Opdater løbende ved ændringer

### Næste trin for at udfylde denne skill

1. Anmod om Banedanmarks regelmatrix
2. Indlæs gældende ORS/ORF/SR-versioner
3. Verificér TSI-dokumenter
4. Identificér SSB for projektet
5. Opdater med verificerede kilder
