---
name: banebyg
trigger: [banebyg, bbe, bkp, bbtr, banedanmark-byggeri, jernbane-kontrolplan, tilsynsapp, ydelsesbeskrivelse, tilbudsliste]
description: Router/index-skill for BaneByg-platformen (BBE, BKP v17, BBTR, YB, TBL, Tilsynsappen). Dirigerer til de dedikerede detalje-skills. Brug når brugeren arbejder med Banedanmarks byggeplatform og skal finde det rette fagområde.
---

# BaneByg

## TL;DR

Brug denne skill som **indgang/router** når du arbejder med Banedanmarks byggeplatform: BaneByg Enterprise
(BBE), Brutto Kontrolplan (BKP v17), fagpakker (BBTR), ydelsesbeskrivelser, tilbuds- og regningslister,
eller Tilsynsappen. De detaljerede fagområder har nu **dedikerede skills** (se Hurtig-reference nedenfor);
denne skill giver overblikket og dirigerer til dem.

## Hurtig-reference (koncept → dedikeret skill)

| Koncept | Forklaring | Detalje-skill |
|---------|------------|---------------|
| BBE | BaneByg Enterprise — SharePoint/PowerApps-platform til BKP-håndtering | `bbe-dokumenter-platform` |
| BKP v17 | Brutto Kontrolplan — datamodel (TKP/KP/BKP-hierarki, felter, værdilister) | `bdk-bkp-v17-data-model`, `bdk-bkp-v17-overview` |
| BBTR | BaneByg Teknisk Rådgivning — rådgiver-ydelser med fagpakkestruktur | `bbtr-fagpakkestruktur`, `bbtr-raadgiver-udbud`, `bbtr-leverance-mapping` |
| Dokumentstyring | Dokument-/leverancestyring i BBE | `bbtr-dokumentstyring`, `bbtr-kvalitet-dod` |
| Tilsynsappen | Mobilt tilsynsværktøj i felten | `bdk-tilsynsapp-leverance-operations` |
| YB / TBL | Ydelsesbeskrivelse / Tilbuds- og Regningsliste | Dækkes via BBTR-skills ovenfor |

## Arbejdsgange (overblik)

1. **Udbud og kontrakt:** BBTR-ydelsesbeskrivelse → fagpakkestruktur → tilbudsrunde → kontrakt
   (detaljer: `bbtr-fagpakkestruktur`, `bbtr-raadgiver-udbud`).
2. **Projektudførelse:** BBE-kontrolplan → TKP → KP → BKP → tilsyn via Tilsynsappen
   (detaljer: `bdk-bkp-v17-overview`, `bdk-tilsynsapp-leverance-operations`).
3. **Dokumentation:** Leverancer kædes til dokument- og tegningslister
   (detaljer: `bbtr-dokumentstyring`, `bbe-dokumenter-platform`).

## Glossar

- **TKP** (Total Kontrolplan): overordnet kontrolplan.
- **KP** (Kontrolplan): delplan.
- **BKP** (Brutto Kontrolplan): detaljeret kontrolplan med punkter — se `bdk-bkp-v17-data-model`.
- **IPM** (Integrated Project Model): integreret projektmodel — se `bbtr-ipm-konsistens`.
- **DoD** (Definition of Done): udførelseskriterier — se `bbtr-kvalitet-dod`.
- **BBE** (BaneByg Enterprise): SharePoint/PowerApps-platformen — se `bbe-dokumenter-platform`.

## Relaterede skills

- `bbe-dokumenter-platform`
- `bdk-bkp-v17-data-model`
- `bdk-bkp-v17-overview`
- `bbtr-fagpakkestruktur`
- `bbtr-dokumentstyring`
- `bbtr-leverance-mapping`
- `bbtr-kvalitet-dod`
- `bdk-tilsynsapp-leverance-operations`

## Referencer og kildestatus

Undermapper i `references/` (`bbe.md`, `bkp.md`, `bbtr.md`) indeholder korte oversigter. For **fuldt,
verificeret domæneindhold** brug de dedikerede detalje-skills ovenfor — de har erstattet de tidligere
placeholder-referencer i denne skill. Yderligere teknisk BBE-arkitektur (SharePoint/PowerApps) findes i
`.vscode/archive/legacy-skills/root-skills/SKILL_BANEBYG_ENTERPRISE.md` (arkiv, ikke-verificeret).

> Konkrete felt-/API-/værdiliste-detaljer skal fortsat verificeres mod officielle Banedanmark-kilder
> (BBE-spec, BKP v17-definition) før operationel/sikkerhedskritisk brug.
