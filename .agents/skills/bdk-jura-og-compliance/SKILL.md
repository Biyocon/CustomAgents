---
name: bdk-jura-og-compliance
description: Supports legal and compliance screening of contracts, tenders and project decisions in Banedanmark, mapping obligations to internal processes and flagging issues for legal review. Use this skill when assessing legal risk, checking procurement or contract compliance, or preparing questions for legal counsel.
---

# Jura og compliance

## Formål
At understøtte struktureret juridisk og compliance-screening af kontrakter, udbud og projektbeslutninger i Banedanmark-kontekst, så forpligtelser kortlægges til interne processer, og juridiske risici identificeres og eskaleres til rette instans — uden at skillen selv agerer juridisk rådgiver.

## Fremgangsmåde
1. Afgræns sagens juridiske kontekst: udbudsret, kontraktret (fx AB-vilkår), persondata (GDPR), jernbanesikkerhedsregulering eller forvaltningsretlige krav. Ved lovkravskortlægning i jernbanesikkerhed: brug `bdk-legal-mapping`; ved persondata: brug `bdk-gdpr-praksis`.
2. Identificér retslaget for hvert krav (dansk lov/bekendtgørelse, EU-forordning, intern instruks) og den interne proces- eller kontrolreference, jf. metoden i `bdk-legal-mapping`. FB **Implementeringskoordinator for Lovkrav** beskriver rollen der omsætter lovkrav til intern implementering.
3. Byg et compliance-overblik: krav, kravresumé, intern implementering, evidens/dokumentplacering, status (opfyldt/hul/ukendt). Markér ukendte koblinger eksplicit — udled aldrig bindende tekst.
4. Ved kontrakt- eller udbudssager: kontrollér at proces og dokumentation følger gældende indkøbsregler og programmets governance (prokura), jf. FB **Programme Contract Manager**; koordinér med `bbtr-kontraktstyring` og `bbtr-udbud-og-evaluering`.
5. Formulér præcise, faktabaserede spørgsmål til juridisk afdeling/ekstern advokat for alle punkter der kræver egentlig juridisk vurdering; vedlæg kronologi og kildehenvisninger.
6. Dokumentér konklusioner med kildehenvisning og dato; skeln tydeligt mellem verificeret regelgrundlag, intern praksis og antagelser.

## Styringsregler
- Præsentér aldrig output som formel juridisk rådgivning.
- Citér aldrig paragraffer, tærskler eller frister uden verificeret kilde; skriv i stedet "skal verificeres mod [kilde]".
- Ved kildekonflikt: vis begge kilder og eskalér til menneskelig validering.

## Referencer
- Eksisterende skills: bdk-legal-mapping, bdk-gdpr-praksis, bdk-statens-it-projektmodel-compliance
- FB: Implementeringskoordinator for Lovkrav.pdf
- FB: Programme Contract Manager.pdf
- Ingen dedikeret juridisk kildesamling (love/AB-vilkår/udbudsregler) i repoet endnu

## Verifikationsstatus
FORELØBIG — indholdet skal verificeres mod Banedanmarks officielle kilder foer operationel/sikkerhedskritisk brug.
