---
name: bdk-ansoegning-om-midler-end-to-end
description: Gennemfør en komplet ansøgning om midler til Porteføljekontoret fra projektidé til indstillingspakke, gate-parathed og indsendelsesplan.
---

# BDK Ansøgning om Midler End-to-End

## Hvornår skillen bruges
- Når målet er at ansøge om midler hos Porteføljekontoret.
- Når brugeren vil have en samlet arbejdsgang fra idé til indsendelsesklar pakke.
- Når brugeren vil sikre formalia, gate-parathed og realistisk behandlingsforløb.

## Arbejdsgang
1. Læs `references/source-map.md`.
2. Afgræns ansøgningsscope:
   - projekttype og forretningsbegrundelse
   - IT-involvering og compliancebehov
   - forventet finansieringsbehov
3. Vælg og saml nødvendig dokumentpakke:
   - Projektindstilling (Del 1, Del 2, Del 3 ved behov)
   - Projektgrundlag (fuld/light)
   - risikolog, gevinstgrundlag, styregruppeaftale, tids-/milepælsplan efter relevans
4. Kør formalia- og gate-check:
   - obligatoriske dokumenter til aktuel fase/gate
   - centrale kvalitetskriterier
   - datagab der blokerer behandling
5. Planlæg indsendelse:
   - ansøgningsvindue (typisk 1.-15. i måneden, juli undtaget)
   - forventet behandlingstid (med/uden IT)
   - næste beslutningsfora
6. Returnér indsendelsesklar status (`Klar`/`Ikke klar`) med konkrete lukkehandlinger.

## Samspil med støtteskills
- Brug `bdk-forretningsprojektmodel-gates` til fase/gate-kriterier.
- Brug `bdk-projektindstilling-og-finansiering` til selve indstillingsmaterialet.
- Brug `bdk-styringsdokumenter-skabeloner` til skabelonvalg og dokumentpakke.
- Brug `bdk-statens-it-projektmodel-compliance` ved IT-scope/tærskelvurdering.
- Brug `bdk-projektrapportering-frister` til tids- og rapporteringsplan.
- Brug `bdk-gevinststyring-realisering` og `bdk-styregruppearbejde` ved behov.

## Outputformat
1. Ansøgningsafgrænsning
2. Krævet dokumentpakke (obligatorisk/anbefalet)
3. Formalia- og gate-check (Klar/Ikke klar)
4. Indsendelses- og behandlingsplan
5. Åbne punkter før indsendelse
6. Kilder (repo-stier)

## Styringsregler
- Skillen må ikke foregive formel godkendelse.
- Skeln altid mellem krav fra Banedanmarks forretningsprojektmodel og Statens IT-projektmodel.
- Ved manglende økonomi-/scopeoplysninger: returnér konkrete afklaringsspørgsmål før konklusion.
- Ved tvivl om versionsgyldighed: markér behov for verifikation mod nyeste dokumentudgave.
