---
name: bbtr-sikring
description: Supports signalling (sikring) design and works deliverables in BBTR/BaneByg projects, aligning sikringsteknisk projektering with trafikal dokumentation and the FP10 fagpost structure. Use this skill when drafting, reviewing or quality-assuring sikring-related fagpakker, design deliverables or control points.
---

# Sikringsanlæg og sikringsteknisk projektering

## Formål
At sikre, at sikringsleverancer i BaneByg-projekter er konsistente med den trafikale dokumentation, følger fagpostkatalogets struktur for sikring, og at projekteringen kvalitetssikres før udførelse — jf. formålet i funktionsbeskrivelsen for Projekteringsleder, Sikring: korrekt ændret trafikal dokumentation, sikringsteknisk projektering i henhold hertil, og kvalitetssikring af projekteringen.

## Fremgangsmåde
1. Afklar først den trafikale forudsætning: er de trafikale forhold korrekt ændret/afspejlet i den trafikale dokumentation, før sikringsteknisk projektering påbegyndes? Uoverensstemmelser eskaleres — projektér aldrig mod forældet trafikal dokumentation.
2. Afgræns opgaven mod FP10 (Sikring) i fagpostkataloget: kabeldåser og fordelingshuse, akseltællere og FTGS, sporskifter, ATC/ATP, overkørsler og formeldere, signaler og skilte, kabler og ledninger, sikringsarbejder ifm. slutjustering samt øvrige sikringsarbejder. Bemærk at 10.7 og 10.9 er udgået. Se `references/fagpost-indhold.md` under **bbe-dokumenter-platform**.
3. Identificér gældende teknisk regelgrundlag (ATR) for sikring i projektets kontekst; citér aldrig konkrete regelparagraffer eller grænseværdier uden opslag i gældende kilde. Anvend forrangsreglerne fra `references/standard-katalog.md` ved modstrid.
4. Strukturér fagpakke/ydelsesbeskrivelse efter **bbtr-fagpakkestruktur** og sikr CSM/TSI-kobling via **bbtr-csm-tsi-compliance** for sikkerhedsrelaterede ændringer.
5. Planlæg kvalitetssikring af projekteringen: uafhængig kontrol af designleverancer, sporbarhed fra trafikal dokumentation til sikringsteknisk design, og dokumenteret godkendelse før udførelse.
6. Kortlæg kontrolpunkter til BKP-strukturen via **bdk-bkp-v17-overview**, inkl. grænseflader til spor (sporskifter, slutjustering — koordinér med bbtr-spor) og stærkstrøm/kørestrøm.
7. Ved ibrugtagning: sikr at dokumentation for kontrol, test og "som udført" afleveres efter Banedanmarks TekDok-krav, og at ændringer i trafikal dokumentation er lukket konsistent.

## Referencer
- FB-PDF: "Projekteringsleder, Sikring.pdf", "CSM-projekteringsleder.pdf", "Senior CSM-projekteringsleder.pdf"
- `.agents/skills/bbe-dokumenter-platform/references/fagpost-indhold.md` (FP10 Sikring)
- `.agents/skills/bbe-dokumenter-platform/references/standard-katalog.md` (forrangsregler)
- Skill: bbtr-fagpakkestruktur, bbtr-csm-tsi-compliance, bdk-bkp-v17-overview

## Verifikationsstatus
FORELØBIG — indholdet skal verificeres mod Banedanmarks officielle kilder foer operationel/sikkerhedskritisk brug.
