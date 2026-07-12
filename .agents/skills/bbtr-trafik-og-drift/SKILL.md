---
name: bbtr-trafik-og-drift
description: Supports coordination of train operations, traffic management and operational roles in Banedanmark/BBTR contexts. Use this skill when analysing traffic management tasks, mapping operational responsibilities (Trafikleder/Togleder roles) or preparing operations-related deliverables that must respect railway safety boundaries.
---

# Trafik og drift

## Formål
At understøtte analyse og koordinering af opgaver inden for togdrift og trafikledelse i Banedanmark-kontekst: afgrænsning af ansvar og beføjelser for driftsroller (Trafikleder Fjern, Trafikleder S-bane, Togleder S-bane, Vagthavende trafikleder m.fl.), kobling til trafikale regelsæt og korrekt eskalering ved hændelser — uden at skillet selv udsteder driftsordrer eller sikkerhedskritiske beslutninger.

## Fremgangsmåde
1. Afklar hvilken driftsrolle og hvilket geografisk/organisatorisk område opgaven vedrører (fjernbane vs. S-bane, driftscenter, station).
2. Slå rollens ansvar, beføjelser og kompetencekrav op i den relevante funktionsbeskrivelse (FB-PDF) — brug skillet **bdk-roller-kompetencer** til struktureret uddrag af ansvar/beføjelser/opgaver pr. emne-id.
3. Identificér hvilket trafikalt regelsæt der er i spil (SR, ORS, ORF) via **bdk-trafikale-regler-anvendelse**, og relevante lokale instruktioner via **bdk-lokalinstruktion-opslag**.
4. Ved drifts- eller sikkerhedsrelaterede situationer: identificér korrekt blanket via **bdk-trafikale-blanketter**; ved hændelser eller sikkerhedsbrister følg klassifikation i **bdk-haendelser-sikkerhedsbrister** (FB'erne kræver at funktionen "indmelder hændelser" — emne C i fx Trafikleder Fjern).
5. Bemærk Tracé-koblingen: driftsroller arbejder efter processer i ledelsessystemet (fx TP-processer nævnt i FB'erne); brug **bdk-trace-processer** ved proces-spørgsmål.
6. Sammenfat leverancen med eksplicit markering af: (a) hvad der er dokumenteret i FB/regelkilder, (b) hvad der er antagelse, og (c) hvad der kræver afklaring hos driftsorganisationen. Giv aldrig operative anvisninger der ligner en driftsordre.

## Referencer
- FB-PDF: "Trafikleder Fjern.pdf", "Trafikleder S-bane.pdf", "Togleder S-bane.pdf", "Vagthavende trafikleder.pdf", "Assisterende Trafikleder.pdf", "Stationsbestyrer.pdf", "Den trafikale vagthavende i Trafikstyrin.pdf", "Driftssupport i Trafikstyring S-bane.pdf", "Tjenestefordeler Trafikstyring.pdf" (mappen Funktions- og stillingsbeskrivelser/FB/)
- Skills: bdk-roller-kompetencer, bdk-trafikale-regler-anvendelse, bdk-trafikale-blanketter, bdk-lokalinstruktion-opslag, bdk-haendelser-sikkerhedsbrister, bdk-trace-processer

## Verifikationsstatus
FORELØBIG — indholdet skal verificeres mod Banedanmarks officielle kilder foer operationel/sikkerhedskritisk brug.
