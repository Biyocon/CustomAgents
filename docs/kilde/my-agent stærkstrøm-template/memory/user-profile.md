# Brugerprofil

> Oprettet: 2026-05-10
> Status: Under onboarding — afventer brugerinput

---

## 1. Rolle og afdeling

- **Rolle:** Senior rådgiver, el-ingeniør
- **Afdeling:** Energiafdelingen
- **Fokus:** Industri

## 2. Typiske projekttyper

- Industrianlæg og procesbygninger
- Datacentre

## 3. Hyppigste opgaver

- Load lists og belastningsoversigter
- Dimensionering af forsyninger og transformere
- Tavlestruktur og SLD'er
- Kabeldimensionering og beskyttelse
- Arbejdsbeskrivelser og udbudsmateriale
- Tilbuds- og mængdeudtræk
- QA-review af kollegers leverancer
- Kundemøder og afklaringer
- Tegningsgranskning
- (Samtlige opgaver nævnt i spørgsmålet)

## 4. Foretrukne værktøjer

### Beregning
- Excel
- VS Code
- FEBDOC
- Simaris

### Tegning
- AutoCAD
- MicroStation

### Dokumentation
- Word
- Acroplot
- SharePoint
- ProjectWise

### Kommunikation
- Teams
- Outlook

### Data
- Python
- Interne databaser

### Diagrammer
- Excalidraw
- Visio

## 5. Foretrukne outputformater

- **Tekst:** Strukturerede afsnit
- **Tabeller:** Markdown-tabeller (klar til Excel-kopiering)
- **Beregninger:** Trin-for-trin med formelvisning + reference
- **Diagrammer:** Tekstbeskrivelse + Excalidraw-struktur
- **Dokumenter:** Klip-klar tekst til Word
- **Lister:** Prioriterede

## 6. Standarder og normgrundlag

### Danske lavspændingsinstallationer
- DS/HD 60364-serien
- Installationsbekendtgørelsen (BEK 1082)
- Elsikkerhedsloven

### Mellemspænding
- DS/EN 61936
- IEC 62271

### Transformere
- DS/EN 60076
- IEC 60076
- DS/EN 50522

### Kabler
- DS/EN 50525
- IEC 60502

### Datacentre
- EN 50600
- TIA-942
- Uptime Institute

### Sikkerhed
- ATEX-direktivet
- Maskindirektivet
- EMC-direktivet
- CE-mærkning

### Bygningsreglementet
- BR18/BR20
- Energikrav

### El-tavler
- DS/EN 61439-serien

### Rambøll-interne
- Projektstandarder
- QA-procedurer

## 7. Load list-struktur

Bruger standardstrukturen fra masterprompten:
Tag nr., System, Område, Udstyrstype, Beskrivelse, Forsyning fra, Tavle, Spænding, Faser, Installeret effekt, Driftseffekt, Samtidighedsfaktor, cos φ, Virkningsgrad, Beregnet strøm, Startstrøm, Driftstype, Kritikalitet, Backup/nødstrøm, Kabelreference, Beskyttelse, Datakilde, Status, Kommentar, Åben action.

## 8. Typiske Rambøll-skabeloner

- Load list / forbrugsoversigt (ikke tilgængelig — skal udarbejdes)
- Tavlespecifikation (nej)
- Kabeloversigt (nej)
- SLD-skabelon (nej)
- Arbejdsbeskrivelse (nej)
- Udbudsmateriale (nej)
- Tilbudsliste (nej)
- QA-tjekliste (nej)
- Mængdeudtræk (nej)

**Note:** Bruger har ikke adgang til Rambøll-standardskabeloner. Alle skabeloner skal udarbejdes fra bunden baseret på faglig praksis.

## 9. Kvalitetskrav

### Non-negotiables

1. **Beregninger:** Alle beregninger skal vises med mellemtrin
2. **Forudsætninger:** Altid dokumenteret
3. **QA-tjekliste:** Ja — plus QA-procedure og QA-skema med granskningskommentar, aktioner mm.
4. **Review:**
   - Agent reviewer skal dokumentere granskning direkte i dokumenter med track changes, initialer (AGR), dato
   - Kollega skal reviewe godkendt/oprettet materiale (mellem agent og bruger)
5. **Mangelliste:** Altid
6. **Åbne punkter:** Altid med ejer og deadline

## 10. Foretrukne sprog og formuleringer

- **Til kunder:** "Rambøll anbefaler…"
- **Internt:** Direkte formulering
- **Stemme:** Aktiv (ikke passiv)
- **Sprog:** Rent dansk
- **Standardfraser:**
  - "I henhold til DS/HD 60364…"
  - "Beregningen er udført med følgende forudsætninger…"
- **Tone:** Professionel og konservativ

## 11. Nuværende projekter

*Udfyldes senere, når dette repo bruges som skabelon til konkrete projekter.*

## 12. Største tidsrøvere

- Manuelle Excel-opdateringer og kopiering mellem ark
- Manglende datagrundlag og efterfølgende afklaringer
- Gentegning og omstrukturering af diagrammer
- Review af kollegers leverancer med manglende sporbarhed
- Dokumentation og formatering til udbud
- Kommunikation med kunder og entreprenører
- Ventetid på svar fra andre fag

**Ikke en tidsrøver:** Tilbudslistearbejde og mængdeudtræk

## 13. Ønsker til automatisering

### Top-3

1. **Excel:**
   - Auto-generere load lists
   - Konsolidere data
   - Validering af input

2. **Datagrundlag:**
   - Datamangel-lister
   - Strukturerede afklaringsspørgsmål

3. **Diagrammer:**
   - Auto-generere SLD-beskrivelser
   - Tavlestruktur
   - Flowdiagrammer

## 14. Tilladte mapper og filer

- Nuværende repo (`c:\Users\Biyocon\OneDrive - Biyocon\Desktop\Sharmake`) bruges som **master template**
- Bruger kopierer eller opretter nyt repo fra denne skabelon for hvert nyt projekt
- Agent må oprette filer og mapper i template-repoet
- Projekt-specifikke filer tilføjes efter behov, når template tages i brug

## 15. Hvad må IKKE gemmes i memory

### Aldrig gem uden eksplicit tilladelse

- **Personfølsomme oplysninger:** CPR-numre, persondata
- **Kontraktkritiske data:** Tidsfrister, økonomi, risici

### Bemærk
- Fortrolige projektdetaljer (kundenavne, effekter, priser) må gemmes, hvis bruger eksplicit beder om det
- Agent skal altid spørge, hvis i tvivl om sensitivitet
