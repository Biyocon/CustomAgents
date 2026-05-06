---
name: bdk-tilsynsapp-leverance-operations
version: "2.0"
description: Analyserer og producerer Tilsynsappen-relaterede leverancer (traening, governance, drift, onboarding, workshop) med fil-for-fil sporbarhed. Brug ved opgaver i 14_Tilsynsappen, isaer ved PPTX/XLSX konsolidering, statusmateriale og AI-stoettet dokumentproduktion.
metadata:
  owner: Biyocon
  created: 2026-02-26
  last_reviewed: 2026-02-26
---

# bdk-tilsynsapp-leverance-operations v2.0

## Autoritative kilder
1. **Primaer:** Filer i 14_Tilsynsappen (86 kildefiler, maskinanalyseret)
2. **Dybdeanalyse:** FULD_MASKINANALYSE_v2.md (1532 linjer, fil-for-fil med slide-titler, indhold, tabeller, fonte)
3. **BKP-kobling:** bkp-v17-data-model.skill + bkp-v17-overview.skill (ved integrationsspoergsmaal)
4. **Proces:** create_skills_process.md (Fase 0-8)

## Hvornaar skillen bruges
- Fil-for-fil analyse, konsolidering eller forbedring af Tilsynsapp-materiale
- Workshops/decks med governance, onboarding eller app-driftsindhold
- Udtraek af moenstre, kvalitetsflags og anbefalinger fra heterogene filer
- BKP-integration: naar Tilsynsapp-data skal valideres mod BKP v17 datamodel
- Traeningsmateriale: naar moduler skal opdateres, konsolideres eller udvides

## Portefoeljeoverblik (v2.0 kvantitativt)

| Type | Antal | Slides/Ark | Tekst |
|------|------:|----------:|-------|
| PPTX | 32 | 805 slides | 209.246 tegn (~42k ord) |
| DOCX | 10 | 287 afsnit | 21.831 tegn (~4.4k ord) |
| XLSX | 6 | 22 ark | strukturerede data |
| PDF | 30 | ~60 sider | primaert InDesign magnet-filer |
| MSG | 5 | — | eSIM-mails (ikke maskinparset) |
| Andre | 3 | — | TIF, PNG, DOCM |

### Font-profil
- Segoe UI: 57.4% (primaer)
- Ink Free: 23.7% (bevidst designvalg i traeningsmateriale)
- +mj-lt/+mn-lt: 12.6% (theme-placeholders, ikke reelle fonte)
- Verdana: 3.8% (legacy i Sikkerhedsdag-filer)
- Arial: 1.5% (import-stoej)
- Calibri: 0.6% (Word/Excel-import)

### Kategorier (10 domaener)
| Kategori | Antal | Noeglefiler |
|----------|------:|-------------|
| Tablet-Admin | 14 | iPad overblik.xlsx, SIM-kort.xlsx, udlaan-processer |
| Tavler-Logistik | 7 | Skabeloner_byggechef/fagbyggeleder/sikkerhed.pptx |
| Overlevering | 7 | OpEx-sidemandsoplaring, Bestillingsoverblik |
| Traening | 7 | Dag 1-3 moduler (258 slides i 5 moduler) |
| Sikkerhed | 3 | Ro-Rg Sikkerhedsdag 2024+2025, Arbejdsmiljo |
| Onboarding | 2 | Superbruger-onboarding (36 slides, 7 diagrammer) |
| Roadmap | 2 | Tilsynsapp scope, videreudvikling LDK |
| Data-Governance | 2 | Farelog Ro-Rg, Projektspecifikke kontroller |
| Governance-Roller | 2 | IPM_Ulla, Intro til rollen som lev+digi |
| Andet | 2 | Oevelser, App til lokalisering |

### Guldstandarder (reference-filer)
1. **Modul 4 - App og dashboard.pptx** — 74 slides, mest komplet traeningsmodul, hoej billedtaethed
2. **Onboarding af nye superbrugere i Tilsynsappen.pptx** — 36 slides, 7 diagrammer, struktureret rolleintro
3. **Tilsynsapp og tavle process.pptx** — 11 slides, Brutto KP-kobling, operativ overbliksstruktur

### Bekraeftede duplikater
- `Onboarding af nye superbrugere i Tilsynsappen.pptx` = `...(1).pptx` (identiske, 14710 KB)
- `Modul 4 - App og dashboard.pptx` (rod) = Traeningsmateriale/Dag 2 version (identiske)

## BKP v17-kobling
- **Farelog Ro-Rg:** 9 ark, 45 data-valideringer, 86 formler — direkte link til BKP v17 datamodel
- **Projektspecifikke kontroller:** KP_ID-format matcher BKP v17 (fx `JA_P-10_H1039`)
- **Noegle-kolonner:** KP_ID, Emne, Underfag, KP_Fag, Loebe nr, Stop-aktivitet, Aendret
- **Tilsynsapp og tavle process:** Brutto KP-begreb kobler til BKP kontrolplan

## Arbejdsgang
1. Konsulter FULD_MASKINANALYSE_v2.md for kvantitative fakta og fil-detaljer
2. Brug references/source-map.md for hurtig fil-opslag
3. Koer scripts/analyze_tilsynsapp.ps1 ved nye filer
4. Brug references/tilsynsapp-designsystem.md + references/pptx-arketyper.md til at forme output
5. Koer QA-checkliste foer aflevering
6. Opdater qa-log.md og memory.md med laering

## Strategi
- **Reparativ** for nyt output: reducer fontstoej, skaerp struktur, klar rolle-/beslutningslogik
- **Konserverende** kun ved eksplicit oenske om legacy-match
- **Ink Free:** Bevar i traeningsmateriale (bevidst designvalg), erstat i governance-materiale
- **+mj-lt/+mn-lt:** Ignorer (theme-placeholders, ikke reelle fonte)

## Fast QA-checkliste
- [ ] Fakta stemmer med FULD_MASKINANALYSE_v2.md og source-map
- [ ] Relevante filer citeret med tydelig anvendelse
- [ ] Ingen ubegrundede antagelser om MSG/DOCM-indhold
- [ ] Governance-outputs har ansvar + tid + beslutning
- [ ] Ved BKP-kobling: begreber/kolonner valideret mod BKP v17 sandhedskilder
- [ ] Font-compliance: kun Segoe UI i nyt output (Ink Free tilladt i traening)
- [ ] Duplikater: henvis kun til masterversioner, aldrig til (1)-varianter
- [ ] Kategorisering: output matcher en af de 10 identificerede kategorier

## Kvalitetsflags (kendte risici)
1. Ink Free: bevidst designvalg i traening, men inkonsistent (bruges i faa filer, ikke alle moduler)
2. Duplikater: 2 bekraeftede par — skaber risiko for divergerende versioner
3. Taler-noter: kun 35/805 slides (4.3%) har noter — massiv underdekning
4. MSG/DOCM: 6 filer ikke maskinparsede — aldrig lav antagelser om indhold
5. Sikkerhedsdag-filer: hoejest fontdiversitet — prioriter normaliseringen her
