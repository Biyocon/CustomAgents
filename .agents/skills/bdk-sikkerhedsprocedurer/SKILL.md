---
name: bdk-sikkerhedsprocedurer
description: Helps locate, interpret and apply Banedanmark railway safety procedures (SR/OR, ORS/ORF and supplementary safety rules). Use this skill when a task requires identifying which safety procedure applies, who holds the responsibility, and how compliance is documented.
---

# BDK Sikkerhedsprocedurer

## Formål
At støtte korrekt identifikation og anvendelse af Banedanmarks jernbanesikkerhedsprocedurer i en given situation — herunder hvilke regelværker (SR/OR, ORS/ORF, SSB, lokale instruktioner) der er relevante, hvem der har ansvar og beføjelser, og hvilken dokumentation der kræves.

## Fremgangsmåde
1. Afklar situationen: drift, anlægsarbejde, ibrugtagning eller undtagelsestilstand? Notér strækning/station og involverede roller.
2. Identificér relevant regelniveau:
   - trafikale regler og blanketter → brug **bdk-trafikale-blanketter** og **bdk-trafikale-regler-anvendelse**
   - supplerende sikkerhedsbestemmelser → brug **bdk-ssb-styring**
   - lokale instruktioner for strækning/station → brug **bdk-lokalinstruktion-opslag**
   - lov- og regelgrundlag bag procedurerne → brug **bdk-legal-mapping**
3. Kortlæg ansvar og beføjelser for de involverede funktioner via funktionsbeskrivelserne (FB-PDF); anvend **bdk-roller-kompetencer** til uddrag af ansvar, beføjelser og kompetencekrav.
4. Sammenfat hvilke proceduretrin situationen kræver, hvem der udfører dem, og hvilken dokumentation der skal foreligge. Citér kun proceduretrin, du kan spore til en konkret kilde — opfind aldrig paragraf- eller procedurenumre.
5. Ved tvivl eller konflikt mellem kilder: dokumentér konflikten eksplicit og anbefal eskalering til den ansvarlige sikkerhedsorganisation frem for at gætte.
6. Ved hændelser eller brud på procedurer: skift til **bdk-haendelser-sikkerhedsbrister** for klassifikation og indmelding.

## Referencer
- Skills: bdk-trafikale-blanketter, bdk-trafikale-regler-anvendelse, bdk-ssb-styring, bdk-lokalinstruktion-opslag, bdk-legal-mapping, bdk-roller-kompetencer, bdk-haendelser-sikkerhedsbrister
- FB-PDF: "Trafikleder Fjern.pdf", "Trafikleder S-bane.pdf", "Togleder S-bane.pdf", "Sikkerhedskoordinator.pdf", "S&I Manager CSM og Interoperabilitet.pdf" (Funktions- og stillingsbeskrivelser/FB/)
- Ingen dedikeret procedure-kildesamling i repoet endnu — regelværkerne (SR/OR, ORS/ORF) er ikke inkluderet som filer.

## Verifikationsstatus
FORELØBIG — indholdet skal verificeres mod Banedanmarks officielle kilder før operationel/sikkerhedskritisk brug.
