---
name: bbtr-webdesign
description: >
  Web design skill for BaneByg Teknisk Rådgivning (BBTR) platformen.
  Dækker: (1) Banedanmarks officielle designguide (farver, typografi, logo),
  (2) UI-komponentbibliotek for alle 4 platformsektioner (Poster, Udbud, ATR & Bemanding, Bilag),
  (3) Formularer og modale vinduer, (4) Navigationsmønstre og filtrering,
  (5) Rollebaseret UI (Ejer, Bruger, Ekstern, Admin),
  (6) Responsivt design og tilgængelighed,
  (7) SharePoint-integration og tekniske constraints.
  Brug denne skill ved al frontend-udvikling, UI-redesign, komponent-oprettelse,
  prototyping eller style-guide arbejde for BBTR-platformen.
---

# BBTR WebDesign Skill

Denne skill er den autoritative kilde til al web- og UI-design for **BaneByg Teknisk Rådgivning** (BBTR) platformen — Banedanmarks interne SharePoint-baserede værktøj til udarbejdelse af udbudsmateriale for teknisk rådgivning i sektionen Anlæg.

---

## 1. Banedanmarks Designsystem (Officielt)

### 1.1 Logo

Banedanmarks logo består af **bomærke (krone) + navnetræk**.

| Variant | Brug |
|---------|------|
| Logo 2-dæk (stacked) | **Primært** — bomærke over navnetræk |
| Logo 1-dæk (inline) | Sekundært — bomærke ved siden af navnetræk |
| Bomærke alene | Kun hvor "Banedanmark" fremgår tydeligt i nærheden |

**Farvevarianter:**
- Positiv (grå): CMYK 66-59-55-47 / RGB 50-50-50 / HEX `#323232`
- Negativ (hvid): RGB 255-255-255 / HEX `#FFFFFF`

**Regler:**
- Logo må ALDRIG gengives i andre farver uden tilladelse fra kommunikationsafdelingen
- Respektafstand baseret på bomærkets dimensioner (se designguide s.3)
- Altid på baggrund med tydelig kontrast

### 1.2 Farvepalette

#### Primære farver
| Navn | CMYK | RGB | HEX | Brug |
|------|------|-----|-----|------|
| **Petrol-grøn** | 100-30-60-60 | 0-78-81 | `#004E51` | Primær brand. Dominerer i grafikker og UI |
| **Koks-grå** | 0-0-0-85 | 50-50-50 | `#323232` | Primær tekst og logo |

#### Sekundære farver
| Navn | CMYK | RGB | HEX | Brug |
|------|------|-----|-----|------|
| **Sol-gul** | 0-0-80-0 | 255-255-102 | `#FFFF66` | Blikfang, advarsel |
| **Blush-rosa** | 0-40-10-0 | 255-200-200 | `#FFC8C8` | Blikfang, sekundær accent |
| **Mint-grøn** | 65-0-45-0 | 67-255-200 | `#43FFC8` | Blikfang, Det 5. element |

#### Farvejusterede udgaver
Alle 5 farver kan bruges i **50%** og **20%** varianter. Ved grafikker brydes farverne yderligere op efter behov.

#### CSS Custom Properties (anbefalet)
```css
:root {
  /* Primære */
  --bdk-petrol: #004E51;
  --bdk-petrol-50: #80A7A8;
  --bdk-petrol-20: #CCE0E0;
  --bdk-koks: #323232;
  --bdk-koks-50: #999999;
  --bdk-koks-20: #D6D6D6;

  /* Sekundære */
  --bdk-gul: #FFFF66;
  --bdk-gul-50: #FFFFB3;
  --bdk-gul-20: #FFFFE0;
  --bdk-rosa: #FFC8C8;
  --bdk-rosa-50: #FFE4E4;
  --bdk-rosa-20: #FFF3F3;
  --bdk-mint: #43FFC8;
  --bdk-mint-50: #A1FFE3;
  --bdk-mint-20: #D9FFF3;

  /* Semantiske */
  --bdk-bg-primary: #FFFFFF;
  --bdk-bg-secondary: #F5F5F5;
  --bdk-bg-dark: var(--bdk-koks);
  --bdk-text-primary: var(--bdk-koks);
  --bdk-text-on-dark: #FFFFFF;
  --bdk-border: #E0E0E0;
  --bdk-border-focus: var(--bdk-petrol);
  --bdk-status-aktiv: #2D8A3E;
  --bdk-status-inaktiv: #B0B0B0;
  --bdk-status-udgaaet: #C0392B;
  --bdk-link: var(--bdk-petrol);
  --bdk-link-hover: #003638;
}
```

#### Farve-hierarki i grafikker
Petrol-grøn dominerer → efterfulgt af varianter af petrol → dernæst sekundære farver i rækkefølge. Ved få datapunkter: brug **flere** farver, ikke kun petrol-varianter.

### 1.3 Typografi

| Font | Snit | Brug |
|------|------|------|
| **Noir No1** | Light, Regular, Demibold, Bold | Forbeholdt grafikere (print, præsentationer) |
| **Segoe UI** | Regular, Bold | **Daglig brug** — UI, dokumenter, web |
| **Banedanmark** (Det 5. element) | Regular | Forbeholdt grafikere (dekoration) |

**BBTR-platformens typografi:**
```css
:root {
  --bdk-font-primary: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --bdk-font-size-xs: 0.75rem;   /* 12px */
  --bdk-font-size-sm: 0.875rem;  /* 14px */
  --bdk-font-size-base: 1rem;    /* 16px */
  --bdk-font-size-lg: 1.125rem;  /* 18px */
  --bdk-font-size-xl: 1.5rem;    /* 24px */
  --bdk-font-size-2xl: 2rem;     /* 32px */
  --bdk-font-weight-normal: 400;
  --bdk-font-weight-semibold: 600;
  --bdk-font-weight-bold: 700;
  --bdk-line-height-tight: 1.25;
  --bdk-line-height-normal: 1.5;
}
```

### 1.4 Spacing & Grid
```css
:root {
  --bdk-space-xs: 4px;
  --bdk-space-sm: 8px;
  --bdk-space-md: 16px;
  --bdk-space-lg: 24px;
  --bdk-space-xl: 32px;
  --bdk-space-2xl: 48px;
  --bdk-radius-sm: 2px;
  --bdk-radius-md: 4px;
  --bdk-radius-lg: 8px;
  --bdk-shadow-sm: 0 1px 2px rgba(0,0,0,0.08);
  --bdk-shadow-md: 0 4px 12px rgba(0,0,0,0.12);
  --bdk-shadow-lg: 0 8px 24px rgba(0,0,0,0.16);
}
```

---

## 2. Platform-arkitektur & Navigation

### 2.1 Overordnet struktur

BBTR-platformen er en **SharePoint-baseret webapplikation** med 4 hovedsektioner:

```
┌──────────────────────────────────────────────────────────────────┐
│  🏛️ Banedanmark-logo  │  Banebyg Teknisk Rådgivning            │
│  Hjem  │  Papirkurv  │  Rediger                                  │
├──────────────────────────────────────────────────────────────────┤
│  📄 Poster │ 📋 Udbud │ 👥 ATR & Bemanding │ 📎 Bilag          │
│                     │ ✍️ Feedback & Forespørgsler │ 📊 Eksempel │
│                     │ ⚙️ Admin ▾                                │
├──────────────────────────────────────────────────────────────────┤
│                    [Sektionsindhold]                              │
├──────────────────────────────────────────────────────────────────┤
│  Kontakt Information          │  Vejledning                      │
│  Banebyg@bane.dk              │  Guide til Ejer                  │
│  ask@bane.dk                  │  Guide til Bruger                │
│                               │  Guide til ATR & Bemanding       │
│                               │  Adgangsstyring                  │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Navigationshierarki

**Primær navigation** (vandret tab-bar):
- Poster (kun Admin)
- Udbud
- ATR & Bemanding
- Bilag

**Sekundær navigation** (højre side):
- Feedback & Forespørgsler
- Eksempeludtræk (dropdown)
- Admin (dropdown): Adgangsstyring, Rediger forside, Indstillinger, ATR og Bemandingsindstillinger

### 2.3 Forside (Hjem)
Velkomstside med:
- Overskrift: "Velkommen til Banebyg Teknisk Rådgivning"
- Beskrivelse af platformens formål
- Oversigt over de 4 sektioner med korte beskrivelser
- Bemærkning: *"Poster" og "Bilag" kan kun tilgås af administratorer*
- Footer med kontaktinformation og vejledningslinks

---

## 3. Sektions-specifikke UI-mønstre

### 3.1 Poster (kun Admin)

**Formål:** Administrere fagposter, hovedposter, poster og underposter — de byggesten der bruges til udbudsmateriale.

**Layout:**
```
┌──────────────────────┬─────────────────────────────────────────┐
│  Venstre panel       │  Indholdsområde                        │
│  (Post-hierarki)     │                                         │
│                      │  [Postnavn] ● Aktiv                    │
│  1 Generelle ydelser │  Version: 6.0                          │
│  2 Banebyg           │  Post type: Fagpost                    │
│  3 Spor              │  Nr: [1]    Navn: [Generelle ydelser]  │
│  4 Banens underbygn. │                                         │
│  5 Afvanding         │  Beskrivelse:                          │
│  6 Føringsveje       │  ┌─────────────────────────────────┐   │
│  7 Veje              │  │ [Rich text editor]              │   │
│  8 Perroner          │  │ B I U ≡ ☰ 🔗 📷              │   │
│  9 Kørestrøm         │  └─────────────────────────────────┘   │
│  10 Sikring (UDGÅET) │                                         │
│  11 Stærkstrøm       │  Bilag: + Tilføj bilag                │
│  12 Konstruktioner   │  ☑ Tillad udbudsspecifik post          │
│  13 Miljø            │  ☐ Tillad ikke udbudsspecifikke komm.  │
│  14 Arealer          │  ☐ Standardteksten kan tilpasses       │
│  15-18 XXX (UDGÅET)  │  ☑ ATR-skema påkrævet                 │
│  19 Banebyg          │  ☐ Inkludér post per default           │
│  20-25 Fasespecifikke│                                         │
│                      │  [Gem ændringer] [Annuller]            │
└──────────────────────┴─────────────────────────────────────────┘
```

**Post-typer (dropdown):**
- Fagpost
- Hovedpost
- Post
- Underpost

**Post-hierarki (venstre panel):**
- Nummerede fagposter (1-25) med indrykning for underposter
- Udgåede poster markeret med "(UDGÅET)"
- Ekspanderbare/sammenfoldelige noder med `>`-chevron

**Opret ny post:**
- Modal/inline med: Post type dropdown, Aktiv toggle, Nr, Navn felter
- Gem/Annuller knapper

### 3.2 Udbud

**Formål:** Oprette og redigere udbudsmateriale baseret på poster.

**Overbliksside:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Udbud                                                            │
│  [Mine aktive udbud ▾]  [🔍 Søg på projektnavn eller nr.]  [År ▾] │  [+ Nyt udbud]│
├──────────────────────────────────────────────────────────────────┤
│  ☐ │ Projektnr. og navn │ Rev. │ Beskrivelse │ Dato │ Status    │
│    │ Rediger │ Tilføj/rediger │ Preview │ Udtræk │ Kommentarer │
│    │ Version │ Bilag                                             │
├──────────────────────────────────────────────────────────────────┤
│  ☐ │ 001 Skabelon        │ 1.0 │ Skabelon    │ 19-01-2026 │ Aktiv│
│  ☐ │ NFSP0592 Aalborg... │ 1.0 │ Fagpakke... │ 06-02-2026 │ Aktiv│
│  ...                                                              │
└──────────────────────────────────────────────────────────────────┘
```

**Filtertyper:**
- Mine aktive udbud (default)
- Aktive udbud
- Inaktive udbud
- Alle udbud

**Rediger udbud (modal):**
```
Stamdata:
  Projektnr. *    │ Projektnavn *
  Beskrivelse
  Offentliggørelsesdato *
  Status *         [Aktiv ▾]
  Fase *           [Detail ▾]     Fasevalg: Afgrænsningsfase, Detail
  Link til projekt site * ⓘ
Deling:
  Eksterne rådgivere ⓘ
  Fremhæv udbud for ⓘ
  [Gem ændringer] [Annuller]
```

**Udbud postervisning:**
```
┌──────────────────────────────────┬───────────────────────────────┐
│  Vælg Standard post              │  Udbudsspecifik kommentar     │
│  ☑ 1 Generelle ydelser (v.5)   │  [Kommentarfelt]    💬 0     │
│    Se/hent basistekst ✍️         │                              │
│  ☑ 1.0 Digitalt samarbejde (v.5)│                              │
│  ☑ 1.1 Projektstyring (v.6)    │                              │
│  ...                             │                              │
│  ☑ 2 Banebyg (v.6)             │                              │
│  ...                             │                              │
└──────────────────────────────────┴───────────────────────────────┘
```

### 3.3 ATR & Bemanding

**Formål:** Administrere Anvendt Teknisk Regelgrundlag og bemandingsplaner.

**Overbliksside:**
```
┌──────────────────────────────────────────────────────────────────┐
│  ATR & Bemanding                                                  │
│  [Aktive ATR ▾]  [🔍 Søg på udbud eller ATR-nr.]  [År ▾]        │
├──────────────────────────────────────────────────────────────────┤
│  ▾ │ ATR navn og nr. │ Kontrakt │ Udbud-Fagpost │ Start │ Slut  │
│    │ Status │ Rediger ATR info │ Udfyld ATR-skema │ Preview ATR  │
│    │ Preview Bemandingsplan │ Version │ Import historik           │
├──────────────────────────────────────────────────────────────────┤
│  ▾ Hassan Teste Projekt (11)                                      │
│  ▾ Kapacitetsudvidelse... (4)                                     │
│  ▾ Aalborg-Frederikshavn (Udbud af 3 delkontrakter) (3)          │
│    > Stærkstrøm 2110.02 🔒 │ ATR Stærkstrøm │ Aktiv │ 3.0      │
│    > Kørestrøm 2090.02 🔒  │ ATR Kørestrøm  │ Aktiv │ 4.0      │
│    > Banens underbygning... │ ATR Banens...   │ Aktiv │ 7.0      │
└──────────────────────────────────────────────────────────────────┘
```

**Filtertyper:**
- Se mine ATR'er
- Aktive ATR (default)
- Inaktive ATR
- Alle ATR

**ATR Info (modal/side) — del 1 (Stamdata):**
```
Stamdata:
  Relateret Udbud    [readonly]
  Revisionsnr.       [readonly/editable]
  Ydelsen             [text]
  Status *            [Aktiv ▾]
  ATR nummer          [text]
  Kontrakt *          [text]
  Kontrakt-nr.        [text]
  Start dato *        [datepicker]
  Estimeret slut dato * [datepicker]
  Udbudsform *        [Normal ▾]
```

**ATR Info — del 2:**
```
  Ændringsydelse      [toggle: Nej]
  Loft                [dropdown]
  BDK Projektleder    [text]
  BDK Ledelsesrepræsentant [text]
  Godkendt af         [text]
  Rådgiver repræsentant [text]
  Eksterne rådgivere ⓘ [text]
  [Gem ændringer] [Annuller]
```

**ATR Detalje-side:**
```
┌──────────────────────────────┬──────────────────────────────────┐
│  ← Tilbage                   │  Nedbrud af timeforbrug          │
│  [Udbudsnavn]                │  [→ Importér timenedbrud]        │
│  [Ydelsesnavn] - [ATR-nr.]  │                                   │
│  [Rediger]                   │                                   │
│  Start: XX  Est. slut: XX   │                                   │
│                              │                                   │
│  Overordnet beskrivelse      │                                   │
│  [textarea]                  │                                   │
│                              │                                   │
│  Omfang af ydelsen           │                                   │
│  [textarea]                  │                                   │
│                              │                                   │
│  Ressourcer                  │                                   │
│  [textarea]                  │                                   │
│                              │                                   │
│  Kategorier                  │                                   │
│  [Kategori 1 ▾] 🗑          │                                   │
│  [Kategori 2 ▾] 🗑          │                                   │
│  + Tilføj kategori           │                                   │
└──────────────────────────────┴──────────────────────────────────┘
```

### 3.4 Bilag (kun Admin)

**Formål:** Uploade og administrere bilag knyttet til poster.

**Overbliksside:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Bilag                  [🔍 Søg på bilag]    [+ Tilføj bilag]    │
├──────────────────────────────────────────────────────────────────┤
│  Id↑ │ Navn [Filter ▾]  │ Version [▾] │ Aktiv [▾] │             │
│      │ Bilag relateret til poster [Filter ▾] │ Rediger           │
├──────────────────────────────────────────────────────────────────┤
│  42  │ Bilag 8 Timeliste (Skabelon)     │ 1.0 │ ☑ │ Projektstyring │ ✏️│
│  43  │ Bilag 7 Teknisk Forespørgsel     │ 1.0 │ ☑ │ Tekniske foresp│ ✏️│
│  79  │ Dokumentationsplaner.xlsx         │ 1.0 │ ☑ │ Som udført-dok│ ✏️│
│  ...                                                              │
└──────────────────────────────────────────────────────────────────┘
```

**Opret bilag (modal):**
```
Opret bilag                              ×
Vælg bilag:
  [↑ Upload fil]
Aktiv:
  ○ Aktiv [toggle]
  [Opret bilag] [Annuller]
```

---

## 4. Komponentbibliotek

### 4.1 Knapstile

| Type | Eksempel | Brug |
|------|----------|------|
| **Primær** | `[Gem ændringer]` | Hovedhandling — mørk bg, hvid tekst |
| **Sekundær** | `[Annuller]` | Afbryd/lukk — border, transparent bg |
| **Tilføj** | `[+ Nyt udbud]` `[+ Tilføj bilag]` | Opret ny — med + ikon |
| **Link** | `Se/hent basistekst` | Inline navigering |
| **Ikon** | ✏️ 🗑 📋 | Toolbar-handlinger |

```css
/* Primær knap */
.bdk-btn-primary {
  background-color: var(--bdk-petrol);
  color: #fff;
  border: none;
  padding: var(--bdk-space-sm) var(--bdk-space-lg);
  font-family: var(--bdk-font-primary);
  font-size: var(--bdk-font-size-sm);
  font-weight: var(--bdk-font-weight-semibold);
  border-radius: var(--bdk-radius-sm);
  cursor: pointer;
}
.bdk-btn-primary:hover {
  background-color: #003638;
}

/* Sekundær knap */
.bdk-btn-secondary {
  background-color: transparent;
  color: var(--bdk-koks);
  border: 1px solid var(--bdk-border);
  padding: var(--bdk-space-sm) var(--bdk-space-lg);
  border-radius: var(--bdk-radius-sm);
  cursor: pointer;
}
```

### 4.2 Formularelementer

**Tekstfelter:**
- Label ovenfor i **bold** (`font-weight: 600`)
- Påkrævede felter markeret med rød asterisk `*`
- Info-ikon `ⓘ` med tooltip for felter der kræver forklaring
- Mørk baggrund (#4A4A4A) med hvid tekst i nuværende design

**Dropdowns:**
- Chevron (`▾`) til højre
- Ensartet styling med tekstfelter

**Datovælger:**
- Kalender-ikon til højre
- Format: `Day Mon DD YYYY` (fx "Thu Feb 26 2026")

**Toggle switch:**
- Til/fra med label (fx "Aktiv", "Nej")
- Petrol-grøn når aktiv

**Checkbox:**
- Standard checkbox med label
- Brugt til post-inkludering og indstillinger

### 4.3 Tabeller

Alle tabelvisninger følger dette mønster:
```
┌──────────────────────────────────────────────────┐
│  [Kolonne1 ↑] │ [Kolonne2] │ [Kolonne3] │ ...   │
│  [Filter ▾]   │ [Filter ▾] │ [Filter ▾] │       │
├──────────────────────────────────────────────────┤
│  Data row 1                                       │
│  Data row 2 (alternating subtle bg)               │
│  ...                                              │
└──────────────────────────────────────────────────┘
```

- Sorterbar kolonne markeret med `↑` / `↓`
- Filterbare kolonner med dropdown-filtre
- Ikoner for handlinger (rediger, preview, download)
- Grupperede rækker med ekspanderbare sections (ATR-visning)

### 4.4 Modale vinduer

```
┌─────────────────────────────────────────┐
│  [Titel]                            ×   │
│─────────────────────────────────────────│
│                                         │
│  [Formularindhold]                      │
│                                         │
│─────────────────────────────────────────│
│               [Primær knap] [Annuller]  │
└─────────────────────────────────────────┘
```

- Mørk baggrund (#4A4A4A / #333) med hvid tekst
- Lukkeikon (×) øverst til højre
- Footer med handlingsknapper

### 4.5 Søge- og filtereringskomponenter

**Søgefelter:**
- `🔍` ikon til venstre
- Placeholder-tekst: "Søg på [kontekst]"
- Tilgængelig i alle sektioner

**Dropdown-filtre:**
- Kontekstafhængige filtervalg per sektion
- "Mine aktive..." som default
- "Alle..." altid tilgængeligt

**År-filter:**
- Separat dropdown: "Vælg år"

### 4.6 Hierarkisk trævisning (Poster)

```
▾  1 Generelle ydelser
    1.0 Digitalt samarbejde mellem leverandør og bygherre
    1.1 Projektstyring
    1.2 Modtagerkontrol
  ▾ 1.3 Dispensationer
      1.3.1 XXX (UDGÅET)
      1.3.2 XXX (UDGÅET)
    1.7 Tekniske forespørgsler
    ...
    1.X Projektspecifikke arbejder ifm. Indledning
```

- Chevron `▾`/`>` for fold/unfold
- Indrykning for underniveauer
- "(UDGÅET)" markering for udgåede poster
- "(NYT)" markering for nye poster

### 4.7 Statusbadges

| Status | Farve | Brug |
|--------|-------|------|
| Aktiv | Grøn / standard text | Aktive poster, udbud, ATR |
| Inaktiv | Grå | Deaktiverede elementer |
| UDGÅET | Rød/grå med tekst | Fjernede poster |
| NYT | Grøn med tekst | Nyligt tilføjede poster |

### 4.8 Rich Text Editor

Bruges i Poster-sektionen til beskrivelsesfelter:
- Toolbar: **B** *I* U | Alignment | Lister | Link | Billede
- Standard formatting-værktøjer

---

## 5. Rollebaseret UI

### 5.1 De 4 brugerroller

| Rolle | Adgang | Primære sektioner |
|-------|--------|-------------------|
| **Ejer** (Projektleder) | Fuld | Poster, Udbud, ATR, Bilag, Admin |
| **Bruger** (Projekteringsleder) | Begrænset | Udbud, ATR & Bemanding |
| **Ekstern leverandør** | Meget begrænset | Delt udbud (kommentering) |
| **Admin** | Fuld + konfiguration | Alt inkl. Admin-menu |

### 5.2 Synlighedsregler

- **Poster** og **Bilag** tabs: Kun synlige for Admin
- **Admin**-dropdown: Kun synlige for Admin
- Udbud med deling: Synlige for specificerede eksterne rådgivere
- "Fremhæv udbud for": Kontrollerer hvilke brugere der ser udbuddet fremhævet

---

## 6. Tekniske Constraints

### 6.1 SharePoint-integration
- Platformen kører som SharePoint webpart/tilpasset side
- URL-mønster: `bane.sharepoint.com/sites/[site]/...`
- SharePoint navigation (Hjem, Papirkurv, Rediger) er synlig
- "Følger ikke" / "Webstedsadgang" i SharePoint header

### 6.2 Responsivitet
- Desktop-first design (primær brug)
- Tabeller skal håndtere scroll horisontalt
- Modale vinduer skal tilpasses viewport
- Minimum supporteret bredde: 1024px (typisk SharePoint)

### 6.3 Tilgængelighed
- Alle formularfelter skal have tilknyttede labels
- Fokus-rækkefølge i modale vinduer
- Farvekontrast iht. WCAG 2.1 AA
- Keyboard-navigation for alle interaktive elementer
- `aria-labels` for ikonknapper

---

## 7. Designprincipper for BBTR

1. **Konsistens**: Ens UI-mønstre i alle 4 sektioner
2. **Overskuelighed**: Minimalt visuelt støj — fokus på indhold
3. **Hierarki**: Tydelig visuel rangorden (poster > underposter, primær > sekundær handling)
4. **Effektivitet**: Færrest mulige klik for rutineopgaver
5. **Sporbarhed**: Versionnumre og ændringshistorik altid synlig
6. **Kontekstbevidsthed**: Filtre husker brugerens sidste valg

---

## 8. Footer-konventioner

Alle sider indeholder en footer med:
```
┌─────────────────────────────────┬──────────────────────────────────┐
│  Kontakt Information            │  Vejledning                      │
│  Banebyg@bane.dk                │  Guide til Ejer                  │
│  ask@bane.dk (SharePoint)       │  Guide til bruger                │
│  Gælder interne + eksterne      │  Guide til ATR & Bemanding       │
│                                 │  Adgangsstyring                  │
└─────────────────────────────────┴──────────────────────────────────┘
```

Bemærk: Guideslinks er pt. markeret "*Link virker ikke*" — skal opdateres.

---

## 9. Fremgangsmåde ved UI-opgaver

### Ved ny komponent/side
1. Konsulter dette skill for eksisterende mønstre
2. Brug Banedanmarks farvesystem og typografi
3. Følg eksisterende modal/formular-paradigmer
4. Test med alle 4 brugerroller
5. Dokumenter med screenshots

### Ved redesign/forbedring
1. Dokumenter nuværende tilstand (screenshot fra `/mnt/project/`)
2. Beskriv ændring med rationale
3. Oprethold konsistens med eksisterende sektioner
4. Opdater dette skill hvis nye mønstre indføres

### Ved prototyping
1. Brug HTML/CSS med BDK-variablerne defineret i sektion 1
2. Segoe UI som font
3. Mørk header/modaler, lys indholdsarea
4. Følg eksisterende layout-mønstrene i billederne

---

## 10. Billedreferencer (Projektfiler)

| Fil | Viser |
|-----|-------|
| `00_Forside.png` / `00_Forside_med_visning_af_FP1.png` | Forsiden/velkomst |
| `0_forside.png` | Poster-oversigt |
| `0__Opret_ny_post_feature.png` / `01__Opret_ny_post_feature.png` | Opret ny post |
| `0__FP2_BaneByg_Poster.png` | Poster-hierarki detalje |
| `1_Generelle_ydelser.png` | Generelle ydelser post-redigering |
| `1__Udbud_overblik.png` | Udbud-oversigtsside |
| `1__Udbud_filtere_udbud.png` | Udbud-filtervalg |
| `1__Udbud_Rediger_udbud.png` | Rediger udbud (modal) |
| `1__Udbud_Rediger_udbud__Fase.png` | Fase-dropdown |
| `1__Udbud_Rediger_udbud__Status.png` | Status-dropdown |
| `1__Udbud_Tilføjrediger_poster.png` | Udbud poster-visning |
| `2__ATR__bemanding_overblik.png` | ATR & Bemanding oversigt |
| `2__ATR__bemanding_Filtere_ATR.png` | ATR filter-dropdown |
| `2__ATR__bemanding_Rediger_ATR.png` | ATR detalje-side |
| `2__ATR__bemanding_Rediger_ATR_info_del1.png` | ATR Info del 1 |
| `2__ATR__bemanding_Rediger_ATR_info_del2.png` | ATR Info del 2 |
| `2__ATR__bemanding_Bilag.png` | ATR med bilag |
| `3__Bilag_Overblik.png` | Bilag-oversigt |
| `3__Bilag_Tilføj_bilag.png` | Tilføj bilag (modal) |
| `admin.png` | Admin-dropdown menu |
| `BDK_Designguide_Nyt_logo_2021.pdf` | Banedanmarks officielle designguide |

Alle billeder er tilgængelige i `/mnt/project/` og kan bruges som reference ved UI-arbejde.
