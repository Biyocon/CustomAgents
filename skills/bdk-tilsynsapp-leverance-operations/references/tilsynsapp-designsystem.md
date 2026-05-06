# Tilsynsapp Designsystem v2.0 (observeret praksis + regler)

## Datagrundlag
- 32 PPTX med samlet 805 slides, 1410 billeder, 188 tabeller, 7 charts
- 10 DOCX med 287 afsnit og 18 tabeller
- 6 XLSX med 22 ark
- Komplet analyse: FULD_MASKINANALYSE_v2.md (1532 linjer)

## Font-profil (kvantitativt)

| Font | Runs | Andel | Vurdering |
|------|-----:|------:|-----------|
| Segoe UI | 611 | 57.4% | Primaer. Brug i alt nyt output. |
| Ink Free | 252 | 23.7% | Bevidst designvalg i traening. Tilladt der. Forbudt i governance. |
| +mj-lt | 93 | 8.7% | Theme-placeholder. Ignorer i analyse. |
| +mn-lt | 42 | 3.9% | Theme-placeholder. Ignorer i analyse. |
| Verdana | 40 | 3.8% | Legacy (Sikkerhedsdag-filer). Erstat i nyt output. |
| Arial | 16 | 1.5% | Import-stoej. Erstat altid. |
| Calibri | 6 | 0.6% | Word/Excel-import. Erstat altid. |
| Avenir Next LT Pro | 4 | 0.4% | Legacy (Sikkerhedsdag 2024). Erstat. |

### Font-regel
- **Nyt output:** Kun Segoe UI. Undtagelse: Ink Free i traeningsmoduler.
- **Reparation af eksisterende:** Erstat Arial/Calibri/Verdana/Times med Segoe UI.
- **Theme-placeholders (+mj-lt, +mn-lt):** PowerPoint loser disse automatisk — ignorer.

## Designretning pr. kategori

### Traening (258 slides i 5 moduler, 3 dage)
- Hoej visuel taethed, trinvis instruktion, skaermbillede-tungt
- Ink Free bruges som haandskrifts-element (tavle-aestetik)
- Billede-tabel-ratio: ~2:1 (mange screenshots, faa tabeller)
- Guldstandard: Modul 4 - App og dashboard.pptx (74 slides)

### Onboarding (36 slides, 7 diagrammer)
- Struktureret rolleintro, trin-for-trin, oevelser, supportkanaler
- Diagrammer for procesflow (7 stk — hoejest i portefoeljen)
- Guldstandard: Onboarding af nye superbrugere i Tilsynsappen.pptx

### Sikkerhed (134 slides fordelt paa 3 filer)
- Risiko, ansvar, haendelser, beslutninger, laering
- Stoerst fontdiversitet (5+ fonte) — primaer normaliseringskandidat
- Versioner: Sikkerhedsdag 2024 (48 sl) -> 2025 (67 sl) = aarlig vaekst

### Tavler-Logistik (skabeloner + bestillingsprocesser)
- Simple statusark med lav designkompleksitet
- Tabeldrevne (fravarsskemaer, aktionslister, stadie-registreringer)
- Ink Free bruges til haandskrevne felter i tavle-skabeloner

### Governance / Roller
- Tabeller for ansvar, beslutning og milepaele
- IPM og rolle-introduktioner med organisationsdiagrammer
- Krav: beslutningslog (hvem, hvad, hvornaar) paa alle governance-slides

### Data-Governance (Farelog, kontroller)
- Strukturerede regneark med data-validering
- KP_ID-format matcher BKP v17 (fx JA_P-10_H1039)
- Noegle-kolonner: KP_ID, Emne, Underfag, KP_Fag, Loebe nr, Stop-aktivitet, Aendret

### Tablet-Admin / drift
- Procesbeskrivelser i DOCX (bestilling, SIM, dymo, udlaan, indlevering)
- Komplet lifecycle-styring fra indkoeb til returnering
- Lav design-kompleksitet — indhold er vigtigt, ikke layout

### Roadmap / videreudvikling
- Gap-analyse, forslag, prioritering, implementeringstrin
- Tilsynsapp scope.pptx: 3-fase roadmap (2024-2025)
- Videreudvikling LDK: 61 slides med konkrete aendringsforslag

## Kvalitetsflags
1. **Ink Free:** Bevidst designvalg i traening, men inkonsistent (bruges i faa filer, ikke alle moduler)
2. **Duplikater:** 2 bekraeftede par — skaber risiko for divergerende versioner
3. **Taler-noter:** Kun 35/805 slides (4.3%) har noter — massiv underdekning
4. **MSG/DOCM:** 6 filer ikke maskinparsede — aldrig lav antagelser om indhold
5. **Sikkerhedsdag-filer:** Hoejest fontdiversitet — prioriter normaliseringen her

## Anbefalet normalisering
- Nyt indhold: Segoe UI standard + konsistent BDK-farvebrug
- Etabler en masterversion per emne (onboarding, modul, governance)
- Indfoer beslutningslog paa governance-slides (hvem, hvad, hvornaar)
- Tilfoej taler-noter til alle nye/opdaterede slides
- Fjern duplikater og opret entydig "master" reference
