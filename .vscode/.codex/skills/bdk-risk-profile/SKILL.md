---
name: bdk-risk-profile
description: Analyser Banedanmarks risikoprofil for jernbanesikkerhed, barrierer, risikoejeransvar og sammenhÃ¦ng til SRAC.
---

# BDK Risikoprofil

## HvornÃ¥r skillen bruges
- NÃ¥r brugeren spÃ¸rger til risikoprofil, risikoejer, barrierer eller SRAC-effekt i drift.
- NÃ¥r brugeren Ã¸nsker en struktureret vurdering af Ã¦ndringer til sikkerhedsbarrierer eller overvÃ¥gning.

## Arbejdsgang
1. LÃ¦s `references/source-map.md` for relevante kilder.
2. IdentificÃ©r det prÃ¦cise risikoobjekt:
   - fare/risiko
   - barrierekategori (sandsynlighed/konsekvens)
   - risikoejer
   - overvÃ¥gningskobling (indikator, audit, tilsyn, SRAC)
3. Ved Ã¦ndringer i barrierer/processer: rout til procesreferencer (`ST-5.1.3`, `IB-2.1.1`, `IB-2.1.2`) fÃ¸r anbefalinger.
4. Lever resultat med:
   - nuvÃ¦rende tilstand
   - effektvurdering
   - ejer og styringsspor
   - nÃ¸dvendig procesopfÃ¸lgning

## Outputformat
1. Konklusion
2. Kildegrundlag (repo-stier)
3. Vurdering (risiko, barrierer, ejer)
4. Procesreference
5. Usikkerheder

## Styringsregler
- Opfind ikke manglende procestrin.
- Skeln mellem krav og anbefaling.
- Ved ordlydsnÃ¦re juridiske spÃ¸rgsmÃ¥l: brug `K&S/Lovkrav og regler/*`.
