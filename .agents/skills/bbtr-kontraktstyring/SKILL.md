---
name: bbtr-kontraktstyring
description: Supports contract administration in BBTR/BaneByg projects, including change orders, supplier follow-up, claims handling and contract close-out. Use this skill when setting up, monitoring or closing contracts, handling contract changes, or preparing escalation and dispute material.
---

# Kontraktstyring

## Formål
At sikre struktureret opsætning, overvågning og lukning af kontrakter i BBTR/BaneByg-projekter, herunder korrekt håndtering af ændringsordrer, leverandøropfølgning og erstatnings-/tvistsager, i overensstemmelse med Banedanmarks processer (Tracé) og gældende indkøbsregler.

## Fremgangsmåde
1. Afklar kontraktens kontekst: projekt- eller programniveau, kontrakttype (rådgiver/entreprenør/drift & vedligehold) og hvem der er kontraktholder/aftaleansvarlig. Brug funktionsbeskrivelserne for **Contract Manager, Project Level**, **Programme Contract Manager** og **Kontraktholder** til at placere ansvar og beføjelser korrekt.
2. Etablér kontraktgrundlaget: kontraktdokumenter, ydelsesbeskrivelser, tidsplan, betalingsplan og økonomisk ramme. Kortlæg leverancer mod kontraktkrav (se `bbtr-leverance-mapping`).
3. Opsæt løbende kontraktovervågning: milepæle, leverandørdeltagelse som aftalt, økonomisk forbrug mod ramme og kvalitet af leverancer. Dokumentér afvigelser skriftligt og med dato.
4. Håndtér ændringer via formel ændringsanmodning (Change Request): vurdér kvalitet og omkostningsestimat, kontrollér overensstemmelse med gældende indkøbsregler, og sikr godkendelse på korrekt prokuraniveau jf. programmets governance (jf. FB for Programme Contract Manager).
5. Ved uenighed, krav eller erstatningssag: saml faktagrundlag og korrespondance kronologisk, skeln mellem fakta og vurderinger, og inddrag juridisk rådgivning tidligt (se `bdk-jura-og-compliance` og FB **Erstatningssagsbehandler**).
6. Ved kontraktafslutning: verificér at alle leverancer er modtaget og kvitteret, at økonomien er afstemt (koordinér med `bbtr-oekonomi-og-budget`), og at lessons learned opsamles i forbedringsloopet (`bbtr-forbedringsloop`).
7. Dokumentér alle kontraktbeslutninger sporbart efter dokumentstyringsstandarderne (`bbtr-dokumentstyring`).

## Referencer
- FB: Contract Manager, Project Level.pdf
- FB: Programme Contract Manager.pdf
- FB: Kontraktholder.pdf
- FB: Aftaleansvarlig.pdf
- FB: Erstatningssagsbehandler.pdf
- Eksisterende skills: bbtr-leverance-mapping, bbtr-dokumentstyring, bbtr-forbedringsloop

## Verifikationsstatus
FORELØBIG — indholdet skal verificeres mod Banedanmarks officielle kilder foer operationel/sikkerhedskritisk brug.
