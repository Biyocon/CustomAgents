---
name: bdk-bkp-v17-data-model
description: Ekspert-skill til forståelse, anvendelse og videreudvikling af BKP v17-datamodellen. Dækker felter, værdilister, hierarki, KPID-opbygning, roller, kontroltyper, statusser og sporbarhed mellem TKP, KP og BKP.
---

## Formål

Denne skill er den **autoritative reference** for **datamodellen i BKP v17**.

Den bruges til at:
- Forklare **hvad hvert felt betyder**
- Angive **tilladte værdier (enumerations)**
- Sikre **konsistent struktur og navngivning**
- Understøtte **digital implementering** (Excel, SharePoint, PowerApps)
- Sikre **sporbarhed, versionering og governance**

---

## Hvornår bruges denne skill

Brug denne skill når du:

- Designer eller ændrer BKP-datamodellen
- Opretter SharePoint-lister eller Excel-skabeloner
- Implementerer PowerApps / Power Automate
- Er i tvivl om:
  - gyldige værdier i et felt
  - forskel på felter (fx *Kontroltype* vs *Ansvarlig part*)
  - hvordan KPID skal opbygges
- Validerer datakvalitet og konsistens

---

## Overordnet datamodel

### Hierarkisk struktur

```
Fagpost
└── Hovedpost
    └── Post
        └── Underpost
            └── Kontrolpunkt (KP)
```

Hierarkiet er **obligatorisk** og må ikke springes over.

---

## Centrale entiteter

### 1. Fagpost
- Repræsenterer hovedfag (1–17)
- Eksempel: `3. Spor`, `5. Afvanding`

**Nøglefelter:**
- `Fagpost_Nummer` (1–17)
- `Fagpost_Navn`
- `Fagpost_Beskrivelse`

---

### 2. Hovedpost
- Underopdeling af fagpost
- Eksempel: `3.1 Sporarbejder`

**Nøglefelter:**
- `Hovedpost_Nummer` (X.Y)
- `Titel`
- `Beskrivelse`

---

### 3. Post
- Konkrete ydelser/arbejder
- Eksempel: `3.1.4 Spornedtagning`

**Nøglefelter:**
- `Post_Nummer` (X.Y.Z)
- `Titel`
- `Beskrivelse`

---

### 4. Underpost
- Detaljering/variation
- Eksempel: `3.1.4.1 Demontering af skinner`

**Nøglefelter:**
- `Underpost_Nummer` (X.Y.Z.Æ)
- `Beskrivelse`

---

### 5. Kontrolpunkt (KP)
Den centrale entitet i BKP.

---

### OBLIGATORISKE FELTER (skal udfyldes)

| Kolonne | Felt | Beskrivelse |
|---------|------|-------------|
| A | Projekt nr. | Projektidentifikation (fx FNSP0598) |
| B | KP fag | Vælg fra dropdown (Fagpost nr.) |
| C | Kontroltype | O / M / F / P / S |
| D | Løbenr. | 1-999 (unik inden for fag+type) |
| E | Ansvarlig part | E / T / B / I |
| I | Emne | Kort beskrivelse |
| J | Hvad skal kontrolleres | Detaljeret kontrolbeskrivelse |
| K | Hvordan skal det kontrolleres | Beskrivelse af metode |

---

### Indhold
| Felt | Beskrivelse |
|------|-------------|
| `Emne/Aktivitet` | Kort titel |
| `Hvad skal kontrolleres` | Kontrolbeskrivelse |
| `Hvordan kontrolleres` | Metode |
| `Acceptkriterium` | Hvornår er kontrollen OK |

---

### Kontrol
| Felt | Gyldige værdier |
|------|-----------------|
| `Kontroltype` | O, M, F, P, S |
| `Kontrolmetode` | Visuel, Måling, Test, Dokumentkontrol |
| `Prøvningsfrekvens` | Fx pr. leverance, pr. 100 m |

---

### Ansvar
| Felt | Gyldige værdier |
|------|-----------------|
| `Ansvarlig_Part` | E, BH, BL, FT |
| `Udfører` | E, BH, BL, FT, Ekstern |
| `Godkender` | BL, FT, Certificeret |

---

### Stop og sikkerhed
| Felt | Gyldige værdier |
|------|-----------------|
| `Stop_Aktivitet` | Ja / Nej |
| `CSM_Fare_ID` | Reference til Centralt Fareregister (OBLIGATORISK for stopaktiviteter) |

---

### Dokumentation
| Felt | Beskrivelse |
|------|-------------|
| `Krav_til_Dokumentation` | Protokoller, fotos, målinger |
| `Reference_til_Krav` | DS/EN, BN, ISO |

---

### Status og version
| Felt | Gyldige værdier |
|------|-----------------|
| `Status` | Udkast, Under review, Godkendt, Arkiveret |
| `Version` | Automatisk inkrement |
| `Senest_Opdateret` | Dato |

---

## KPID – struktur (AUTOMATISK GENERERET)

**Format:**
```
[Projekt]_[BB Post]_[Ansvarlig]_[Kontroltype]_[Løbenr.]
```

**Eksempel:**
- `FNSP0598_3.0_E_F_001` → Projekt FNSP0598, Fag 3.0, Entreprenør, Funktionskontrol, Løbenr. 1

**Regel**: Må aldrig redigeres manuelt!

---

## Faste værdilister (ENUMS)

### Kontroltype
| Kode | Betydning |
|------|-----------|
| O | Opstart |
| M | Modtagekontrol |
| F | Funktionskontrol |
| P | Proceskontrol |
| S | Slutkontrol |

---

### Ansvarlig part
| Kode | Betydning |
|------|-----------|
| E | Entreprenør |
| I | IKT-leder |
| B | Byggeleder |
| T | Tilsyn |

---

### Status
| Status | Betydning |
|--------|-----------|
| Udkast | Ikke klar |
| Under review | Afventer godkendelse |
| Godkendt | Klar til brug |
| Arkiveret | Historisk |

---

## Stadie (Lookup)

| Forkortelse | Navn/titel | Beskrivelse / Aktivitet |
|-------------|------------|-------------------------|
| 0 | uden sporspærring | Arbejder i sporet uden sporspærring eller udføres som forberedende arbejder. |
| 1 | med sporspærring | Sporspærring område 1 |
| 2 | med sporspærring | Sporspærring område 2 |
| ... | ... | ... |
| 15 | med sporspærring | Sporspærring område 15 |

---

## Tilsynsappen - Felter (Mark-registrering)

Disse felter skal udfyldes af tilsynet for hver enkelt lokalitet i projektet:

1. **Kontrolafsnit**: Angives som (km / st. / ovk) i km-orden.
2. **Spornummer**: Inkl. banens højre eller venstre side af sporet.
3. **Kommentar/bemærkning**: Tilsynets specifikke noter fra kontrollen.

---

## Sporbarhed (KRITISK)

Alle kontrolpunkter **skal** kunne spores til kilde:

| Felt | Formål |
|------|--------|
| `TKP_Kilde_Løbenr` | Reference til TKP |
| `UKP_Kilde_Reference` | Reference til KP |
| `Kilde_Dokument` | Oprindelig fil |

---

## Valideringsregler (skal håndhæves)

- `Kontroltype` er obligatorisk
- `Ansvarlig_Part` må ikke være tom
- `Acceptkriterium` skal være udfyldt
- `KP_ID` må aldrig redigeres manuelt
- Status = *Godkendt* kræver Godkender

---

## Datamodel kolonner (A-N)

Kontrolplanen har 14 kolonner i Excel/SharePoint:

| Kolonne | Feltnavn | Beskrivelse |
|---------|----------|-------------|
| A | `Underfag` | Fx "Jord", "Spor" |
| B | `KP_ID` | Unik ID efter mønster |
| C | `Relevant` | Projektrelevans |
| D | `Projektspecifik` | Tilpasninger |
| E | `KP_Fag` | Fx "Jord og Ballast" |
| F | `Løbenr` | Fx "O-1", "M-2" |
| G | `Emne` | Kort beskrivelse (<50 tegn) |
| H | `Kontrol_Hvordan` | Instruktioner (>200 tegn) |
| I | `Kontrol_Hvornaar` | Timing-krav |
| J | `Accept` | Acceptkriterier (KRITISK) |
| K | `Dokumentation` | Dokumentationskrav (>200 tegn) |
| L | `Stop_Aktivitet` | Ja / Nej / tom |
| M | `Bem` | Bemærkninger |

---

## Timing-Angivelser (eksempler)

Brug præcise timing-formuleringer:

- "3 uger inden opstart"
- "Ved arbejdets start"
- "Løbende under udførelsen"
- "Ved afslutning af delarbejde"
- "3 dage inden næste fase"
- "Ved endelig aflevering"

---

## Best Practices

### DO's
- Brug præcise, målbare acceptkriterier
- Referér til DS/EN standarder
- Angiv eksakte timing-krav
- Specificér dokumentationsformat
- Vurder stop-aktivitet konservativt
- Brug bullet points i lange tekster
- Hold emne kort (<50 tegn)

### DON'Ts
- Vage kriterier ("tilfredsstillende")
- Manglende timing
- Generiske dokumentationskrav
- For mange stop-aktiviteter
- Uoverskuelige tekstblokke
- Stavefejl
- Duplikerede KP ID'er

---

## Glossar

| Forkortelse | Betydning |
|-------------|-----------|
| BaneDanmark | Danmarks statslige jernbaneinfrastruktur |
| KP | Kontrolplan / Kontrolpunkt |
| CSM | Common Safety Method (EU) |
| BLII | Bærelag II |
| SGII | Slidlag II |
| ROV | Råden Over Vejen |

---

## Resultat

Denne skill sikrer at BKP v17:
- har **ensartet og robust datamodel**
- kan bruges direkte i **digitale systemer**
- understøtter **governance, audit og sporbarhed**
- kan videreudvikles uden databrud
