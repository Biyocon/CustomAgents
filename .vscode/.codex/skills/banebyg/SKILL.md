---
trigger: [banebyg, bbe, bkp, bbtr, banedanmark-byggeri, jernbane-kontrolplan, tilsynsapp, ydelsesbeskrivelse, tilbudsliste]
description: Domæne-specifik skill for BaneByg-platformen. Dækker BBE, BKP, BBTR, YB og TBL med placeholder-references indtil kilde-dokumenter er indlæst.
---

# BaneByg

## TL;DR

Brug denne skill når du arbejder med Banedanmarks byggeplatform: BaneByg Enterprise (BBE), Brutto Kontrolplan (BKP v17), fagpakker, ydelsesbeskrivelser, tilbuds- og regningslister, eller Tilsynsappen.

**Hvad er kendt:**
- BBE er en webbaseret platform til projektstyring af jernbaneprojekter
- BBTR (BaneByg Teknisk Rådgivning) er rådgiver-ydelsesbeskrivelser med fagpakkestruktur
- BKP v17 er en datamodel til kontrolplaner (TKP, KP, BKP)
- Tilsynsappen bruges til tilsyn og dokumentation i felten

**Hvad er UKENDT (placeholder):**
- Præcis datamodel for BBE
- Fuld indhold af BKP v17 felter og værdilister
- API-specifikationer
- Præcis workflow for YB/TBL

## Hurtig-reference

| Koncept | Forklaring | Status |
|---------|------------|--------|
| BBE | BaneByg Enterprise — webplatform | Kendt koncept, ukendt detaljer |
| BBTR | BaneByg Teknisk Rådgivning — rådgiver-ydelser | Delvist kendt (fagpakkestruktur) |
| BKP | Brutto Kontrolplan — TKP/KP/BKP hierarki | Kendt model, ukendt felter |
| YB | Ydelsesbeskrivelse | Placeholder |
| TBL | Tilbuds- og Regningsliste | Placeholder |
| Tilsynsappen | Mobile tilsynsværktøj | Kendt koncept |

## Detaljeret vejledning

### Arbejdsgange

1. **Udbud og kontrakt:** BBTR-ydelsesbeskrivelse → fagpakkestruktur → tilbudsrunde → kontrakt
2. **Projektudførelse:** BBE-kontrolplan → TKP → KP → BKP → tilsyn via Tilsynsappen
3. **Dokumentation:** Leverancer kædes til dokument- og tegningslister

### Referencefiler

Se undermapper i `.agents/skills/banebyg/references/`:
- `bbe.md` — BaneByg Enterprise
- `bkp.md` — Brutto Kontrolplan v17
- `bbtr.md` — BaneByg Teknisk Rådgivning

Alle er markeret som **FORELØBIG** indtil kilde-dokumenter er indlæst.

### Relaterede skills

- `bbtr-fagpakkestruktur`
- `bbtr-dokumentstyring`
- `bbtr-leverance-mapping`
- `bbtr-kvalitet-dod`
- `bdk-brand-governance`

## Dybt reference

### Glossar

- **TKP** (Total Kontrolplan): Overordnet kontrolplan
- **KP** (Kontrolplan): Delplan
- **BKP** (Brutto Kontrolplan): Detaljeret kontrolplan med punkter
- **IPM** (Integrated Project Model): Integreret projektmodel
- **DoD** (Definition of Done): Udførelseskriterier
- **ATR** (Afleveringstidspunkt / Accepttestrapport): Afhængigt af kontekst

### Næste trin for at udfylde denne skill

1. Indlæs kilde-dokumenter fra Banedanmark (BBE spec, BKP v17, BBTR vejledning)
2. Opdater reference-filer med faktisk indhold
3. Tilføj felt-mapping og API-beskrivelser
4. Verificér workflows med domæneeksperter
