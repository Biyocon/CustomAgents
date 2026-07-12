---
name: bbtr-anlaeg
description: Supports civil works (jord, afvanding, broer og konstruktioner) deliverables in BBTR/BaneByg projects, including fagpakke content, applicable standards and supervision points. Use this skill when drafting, reviewing or supervising anlaeg-related fagpakker, tilbudslister or control plans.
---

# Anlægsarbejder (jord, afvanding, broer og konstruktioner)

## Formål
At sikre fagligt konsistente leverancer for anlægsdisciplinen i BaneByg-projekter: jordarbejder, ballast, afvanding, adgangsveje samt broer og konstruktioner — med korrekt kobling til fagpostkataloget, regelgrundlaget og tilsynets kontrolpunkter.

## Fremgangsmåde
1. Afgræns opgavens anlægsomfang mod fagpostkataloget: FP4 (Jord og ballast), FP5 (Afvanding), FP7 (Overkørsler, overgange og adgangsveje) og FP12 (Broer og konstruktioner). Se `references/fagpost-indhold.md` under skillen **bbe-dokumenter-platform**.
2. Identificér gældende regelgrundlag pr. fagpost via standard-kataloget (AAB Beton/AAB Stål, relevante SAB'er, banenormer for afvanding) — se `references/standard-katalog.md` under **bbe-dokumenter-platform**. Anvend forrangsreglerne ved modstrid (BaneByg projektspecifik > BaneByg standard > BN > SAB > AAB).
3. Strukturér fagpakken efter standardstrukturen i **bbtr-fagpakkestruktur** (Ydelsesbeskrivelse, ATR, Bemanding, Bilag, Tværgående krav).
4. Beskriv poster og underposter med mængdeenhed og afregningsprincip; følg eksempelformatet fra fagpostkataloget (ydelsesomfang, kravreference, afregningsenhed).
5. Kortlæg kontrol- og tilsynspunkter til BKP-strukturen (fagpost → hovedpost → post → underpost) via **bdk-bkp-v17-overview**, så entreprenørkontrol (KP) og tilsynskontrol (TKP) er adskilt og sporbare.
6. Koordinér grænseflader til spor (bbtr-spor), sikring (bbtr-sikring) og miljø (bbtr-risiko-myndighed): afvanding/jordarbejder påvirker sporgeometri; jordhåndtering udløser miljøkrav.
7. Sikr aflevering af "som udført"-dokumentation efter Banedanmarks TekDok-krav (tegninger med røde rettelser, kontrolmålinger, certifikater og følgesedler).

## Referencer
- `.agents/skills/bbe-dokumenter-platform/references/fagpost-indhold.md` (FP4, FP5, FP7, FP12)
- `.agents/skills/bbe-dokumenter-platform/references/standard-katalog.md` (AAB/SAB/BN-katalog og forrangsregler)
- Skill: bbtr-fagpakkestruktur, bdk-bkp-v17-overview, bbtr-leverance-mapping
- FB-PDF: "Fagansvarlig, Infrastruktur.pdf", "Byggeleder, Infrastrukturprojekter.pdf" (rollekontekst)

## Verifikationsstatus
FORELØBIG — indholdet skal verificeres mod Banedanmarks officielle kilder foer operationel/sikkerhedskritisk brug.
