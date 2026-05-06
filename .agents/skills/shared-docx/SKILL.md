---
trigger: [shared-docx, word, dokument, office, docx, skriv-dokument, rediger-dokument]
description: Håndtering af Word-dokumenter (.docx) i projektet. Workflow til oprettelse, redigering og versionsstyring.
---

# Shared DOCX

## TL;DR

Brug denne skill når du arbejder med Word-dokumenter i projektet.

**Hvad er aktivt:**
- Oprettelse af nye Word-dokumenter fra skabeloner
- Redigering af eksisterende dokumenter
- Metadata- og versionsstyring
- Integration med domænespecifikke krav (BBTR, BDK)

**Hvad er passivt:**
- Automatisk konvertering fra Word til andre formater
- Mail-merge funktionalitet

## Hurtig-reference

| Handling | Værktøj | Note |
|----------|---------|------|
| Opret nyt | python-docx / mammoth | Foretræk strukturerede skabeloner |
| Rediger | python-docx | Bevar styles og metadata |
| Læs | python-docx / textract | Udtræk tekst til analyse |
| Metadata | python-docx | Dokumentér version, dato, forfatter |

## Detaljeret vejledning

### Workflow

1. **Oprettelse:**
   - Brug domænespecifik skabelon hvis tilgængelig
   - Indsæt metadata-blok: Dato, Version, Forfatter, Projekt
   - Anvend styles konsekvent

2. **Redigering:**
   - Bevar eksisterende styles
   - Tilføj kommentarer for større ændringer
   - Opdatér version og dato i metadata

3. **Revisionsvenligt arbejde:**
   - Brug Track Changes hvis muligt
   - Dokumentér ændringer i revisionslog
   - Bevar tidligere versioner

### Domæne-integration

- **BBTR-dokumenter:** Brug fagpakkestruktur, inkluder ATR-sektion
- **BDK-dokumenter:** Følg Banedanmarks designguide for farver og logo
- **Styringsdokumenter:** Brug standard-skabeloner fra Banedanmark

## Dybt reference

### Filnavngivning

Format: `<Projekt>_<Type>_<Emne>_v<Version>_<Dato>.docx`

Eksempel: `BYC2025_BBTR_Spor_v01_20250606.docx`

### Metadata-blok

Indsæt i dokumentets første sektion:
```
Dato: YYYY-MM-DD
Version: NN
Forfatter: <Navn>
Projekt: <Projektkode>
Godkendt af: <Navn>
```

### Sikkerhed

- Del aldrig dokumenter med personoplysninger ukrypteret
- Følg GDPR-praksis for behandling af persondata
- Brug Banedanmarks godkendte delingskanaler
