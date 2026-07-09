---
name: bbe-dokumenter-platform
description: >
  Samlet skill til BaneByg Enterprise dokumenter og platformstyring. Dækker:
  (1) Ydelsesbeskrivelsen (YB/SABTAG) med to-kolonne format og 17 fagposter,
  (2) Tilbudslisten (TBL) Excel-generering med fagpost-faner og CO2-beregning,
  (3) Bilag og BKP-integration,
  (4) UI-design og videreudvikling fra Interface Manager-perspektiv,
  (5) Brugervejledninger til de 4 brugerroller,
  (6) Normer og standarder (AAB, SAB, Banenormer, TekDok).
  Brug ved arbejde med BBE-dokumenter, platformoptimering, brugerguides eller standardreferencer.
  For selve BKP-sammenskrivning: se separat bkp-v17-overview skill.
---

# BaneByg Enterprise — Dokumenter & Platform

Denne skill dækker BBE-platformens dokumenttyper, UI-drift og standardreferencer.

## 1. Ydelsesbeskrivelsen (YB/SABTAG)

### To-kolonne paradigmet
YB er opbygget med **standard tekst (venstre)** og **projektspecifik tekst (højre)**. Projektspecifik tekst har **forrang** — undtagelser til standard fremgår her.

### 17 Fagposter
| Nr | Fagpost | Formål |
|----|---------|--------|
| 1 | Indledning | Entreprisebeskrivelse, samtidige entrepriser, miljø, banenormer, kvalitetsstyring |
| 2 | Banebyg og tilbudslisten | Sammenhæng YB↔TBL, prissætning, enhedspriser |
| 3-14 | Fagspecifikke | Spor, Jord/ballast, Afvanding, Føringsveje, Overkørsler, Perroner, Kørestrøm, Sikring, Stærkstrøm, Broer, (Udgået), Håndtering/bortskaffelse |
| 15 | Administration | Arbejdsplads, styringsomkostninger |
| 16 | Ændringsydelser | Ikke i entreprisesum, aktiveres ved behov |
| 17 | 1-års justering | Option |

### Postbeskrivelsesformat
```
[X.Y.Z] [Postnavn] ([Enhed])

Ydelsen omfatter:
- [Hovedydelse]
- [Delydelse]

Krav til udførelse: [Standard-reference]
Krav til materialer: [Specifikation]
Dokumentation: [Aflevering]
Afregning: Posten afregnes i [enhed] efter faktisk udført arbejde.
```

### Kravhierarki
- Fagpost-krav gælder **alle underliggende** poster
- FP1 + FP2 generelle krav skal være indeholdt i alle øvrige fagposters enhedspriser
- Formuleringer som "Ydelsen omfatter", "Herunder", "Inklusiv" udgør **ingen begrænsning**

Se `references/fagpost-indhold.md` for detaljeret struktur per fagpost.

---

## 2. Tilbudslisten (TBL)

### Generering
- Preview-knap genererer Excel lokalt
- Én fane per valgt fagpost + "CO2 aftryk"-fane
- Navngivning: `Tilbudsliste_[Projektnr.]_[Projektnavn].xlsx`

### Feltregler
| Felt | Status |
|------|--------|
| Postnummer, beskrivelse, enhed | Låst |
| Mængde per stadie | Låst |
| **Enhedspris** | **Redigerbar** (tilbudsgiver) |
| Sumposter | Låst (formel) |

### Import-workflow
1. Download TBL fra projektsite
2. Upload i BBE med leverandørinitialer
3. Sæt flueben "Ændre status til afsluttet"
4. Verificer importeret liste via 'vis tilbudsliste'-ikon

### CO2-aftryk
Separat fane med valgte poster/underposter og samlede mængder.

Se `references/tbl-struktur.md` for feltdetaljer og formler.

---

## 3. Bilag & BKP-integration

### Bilag-struktur
- **Bilag 1.0**: Kvalitetskrav, dokumentationskrav
- **Bilag 1.1**: Kildefortegnelse (alle gældende kilder)
- **Fagpost-specifikke**: Fx Bilag 9.1 KP Kørestrøm

### Bilag i udbud
1. Vælg hovedpost med bilag → bilag kopieres til udbud
2. Åbn bilag, indsæt projektnavn/nr.
3. Sæt flueben "Er bilaget tilpasset til udbuddet?"

### BKP-grænseflade
Denne skill dækker **bilagshåndtering i BBE-platformen**.
For BKP-indhold og sammenskrivning: brug `bkp-v17-overview` skill.

---

## 4. UI-design & Videreudvikling

### Nuværende UI-paradigme (baseline)
```
┌─────────────────────────────────────────────────────┐
│ BANEDANMARK │ SharePoint │ Søg på dette websted    │
├─────────────────────────────────────────────────────┤
│ Banebyg  │  Banebyg  │  Papirkurv                  │
├─────────────────────────────────────────────────────┤
│ Poster │ Udbud │ Bilag │ Feedback │ Admin          │
├─────────────────────────────────────────────────────┤
│ Udbud: [Projektnavn]     │ Søg udbudspost │ Filter │
├──────────────────────────┼──────────────────────────┤
│ Vælg Standard post       │ Udbudsspecifik kommentar │
│ ☑ 1 Indledning (v.7)    │ [Kommentarfelt]          │
│   ▸ 1.1 Entreprise...   │                          │
│   ▸ 1.2 Samtidige...    │                          │
│ ☑ 2 Banebyg og TBL      │                          │
│ ...                      │                          │
└──────────────────────────┴──────────────────────────┘
```

### Designprincipper
- Konsistent layout, farver, typografi
- Tydelig visuel hierarki
- Minimalistisk, overskuelig
- Responsivt (desktop + mobile)
- Tilgængeligt

### Interface Manager opgaver
1. **Drift**: Daglig overvågning, bruger-support
2. **Vedligehold**: Fejlrettelse, performance
3. **Forbedring**: Feedback → Prioritering → Implementering → Test
4. **Dokumentation**: Screenshots ved alle ændringer

Se `references/ui-elementer.md` for skærmbillede-referencer (UIUX001-011).

---

## 5. Brugervejledninger

### Vejledningstyper per rolle
| Rolle | Guide | Perspektiv |
|-------|-------|------------|
| Ejer | Guide til ejer | Projektleder: oprettelse, postervalg, udtræk |
| Bruger | Guide til bruger | Projekteringsleder: indhold, mængder, review |
| Ekstern leverandør | Guide til ekstern | Rådgiver: begrænset adgang, kommentering |
| Admin | Adgangsstyring | De 4 brugergrupper og rettigheder |

### Step-by-step format
```
3.4 [Handlingsnavn]
    3.4.1 [Første trin]
    3.4.2 [Næste trin]
    3.4.3 [Forventet resultat]
    3.4.X Notér outcome og evt. ønsker til forbedringer
```

### Vedligeholdscyklus
- Funktionsændring = guide-opdatering
- Ny release = versioneret guide
- Løbende: bruger-feedback indarbejdes

Se `references/vejledning-skabelon.md` for template.

---

## 6. Normer & Standarder

### AAB (Almindelige Arbejdsbeskrivelser)
- AAB Stål, AAB Beton
- AAB-Montage-Bær, AAB-Montage-El
- Bilag til AAB Montage (reflekser, ledningskobler, bevægeligt opfang m.fl.)

### SAB (Supplerende Arbejdsbeskrivelser)
Aptering, Master, Galger, Rammer, Pæle, K-ophæng, El-komponenter, Betonlod, Betonreparation, Strømskinne, Jording, Typetegninger, Spærringer

### Banenormer (BN-serien)
| Norm | Område |
|------|--------|
| BN1-11, BN1-13 | Afvanding |
| BN1-18 | Kørestrøm |
| BN2-4 | Spor |
| BN2-19 | Ballast |
| BN1-215 | Kvalitet |

### Forrangsregler
1. Ved modstrid mellem SAB og BaneByg → **BaneByg har forrang**
2. Alle kilder i Bilag 1.1 gælder, også uden direkte henvisning
3. TekDok-krav: banedanmark.dk/teknisk-dokumentation

### Mængdeenheder (SAP)
Standardiserede ME-koder: M (meter), M2 (areal), M3 (volumen), KG, STK, D (dage), etc.

Se `references/standard-katalog.md` for komplet oversigt.

---

## Fremgangsmåde

### Ved YB-arbejde
1. Identificer fagpost (1-17)
2. Brug to-kolonne format: standard venstre, projektspecifik højre
3. Følg postbeskrivelsesformat med "Ydelsen omfatter..."
4. Reference til relevante bilag og standarder

### Ved TBL-generering/-review
1. Generer preview → tjek faner og CO2-fane
2. Verificer låste vs. redigerbare felter
3. Ved import: følg workflow med leverandørinitialer

### Ved UI-ændringer
1. Dokumenter nuværende tilstand (screenshot)
2. Beskriv ændring og rationale
3. Test i dev → Produktionsudrulning
4. Opdater UI-dokumentation

### Ved standardreference
1. Find relevant standard-kategori (AAB/SAB/BN)
2. Tjek forrangsregler
3. Henvis korrekt i postbeskrivelse
