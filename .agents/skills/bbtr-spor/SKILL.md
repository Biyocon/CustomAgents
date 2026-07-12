---
name: bbtr-spor
description: Supports track works (sporlaegning, sporjustering, svejsning, ballast) deliverables in BBTR/BaneByg projects with correct fagpost structure, banenorm references and inspection points. Use this skill when drafting or reviewing spor-related fagpakker, tilbudsposter or track supervision material.
---

# Sporarbejder

## Formål
At sikre fagligt konsistente leverancer for spordisciplinen i BaneByg-projekter — sporlægning, sporjustering, svejsning og ballastarbejder — med korrekt postnummerering, normreferencer og sporbare kontrolpunkter for fagtilsynet.

## Fremgangsmåde
1. Afgræns opgaven mod FP3 (Spor) i fagpostkataloget: 3.1 Forberedende arbejder, 3.2 Sporlægning, 3.3 Sporjustering, 3.4 Svejsning, 3.5 Ballast samt 3.X projektspecifikke arbejder. Se `references/fagpost-indhold.md` under **bbe-dokumenter-platform**. Ballastleverancer hører under FP4 — afklar snittet eksplicit.
2. Referér gældende standarder for spor: Banenorm BN2-4 (Spor) og BN2-19 (Ballast) i gældende version. Citér aldrig konkrete grænseværdier eller paragraffer uden opslag i den gældende norm.
3. Anvend forrangsreglerne ved modstrid mellem kilder (BaneByg projektspecifik > BaneByg standard > banenormer > SAB > AAB), jf. `references/standard-katalog.md`.
4. Strukturér fagpakke/ydelsesbeskrivelse efter **bbtr-fagpakkestruktur**; angiv pr. post ydelsesomfang, kravreference og afregningsenhed (fx m, m3).
5. Kortlæg tilsyns- og kontrolpunkter til BKP-strukturen via **bdk-bkp-v17-overview**: adskil entreprenørens egenkontrol (KP) fra tilsynets kontrol (TKP), og sikr sporbarhed pr. underpost.
6. Koordinér grænseflader: sporjustering ift. sikringsanlæg (bbtr-sikring, fx sporskifter og akseltællere), jord/afvanding (bbtr-anlaeg) og kørestrøm.
7. Ved fagtilsyn: dokumentér observationer og afvigelser struktureret, og sikr at "som udført"-dokumentation (kontrolmålinger, svejsedokumentation, følgesedler) afleveres efter Banedanmarks TekDok-krav.

## Referencer
- `.agents/skills/bbe-dokumenter-platform/references/fagpost-indhold.md` (FP3 Spor, FP4 Jord og ballast)
- `.agents/skills/bbe-dokumenter-platform/references/standard-katalog.md` (BN2-4, BN2-19, forrangsregler)
- Skill: bbtr-fagpakkestruktur, bdk-bkp-v17-overview, bbtr-leverance-mapping
- FB-PDF: "Fagansvarlig, Infrastruktur.pdf", "Fagansvarlig sik. udd. infrastruktur.pdf" (rollekontekst)

## Verifikationsstatus
FORELØBIG — indholdet skal verificeres mod Banedanmarks officielle kilder foer operationel/sikkerhedskritisk brug.
