# BBTR Komponentmønstre

## Oversigt over UI-komponenter i platformen

### 1. Sidetyper

| Type | Eksempler | Layout |
|------|-----------|--------|
| **Listeside** | Udbud-overblik, ATR-overblik, Bilag-overblik | Filter + søg + tabel |
| **Redigeringsside** | Poster-redigering, ATR-detalje | Sidebar + indhold |
| **Modal** | Rediger udbud, ATR Info, Opret bilag | Overlay med formular |
| **Forside** | Velkomst | Centreret tekst + info |

### 2. Listeside-mønster

```
[Sektionsnavn]
[Filter-dropdown]  [Søgefelt]  [Årsfilter]  [+ Opret knap]
─────────────────────────────────────────────────────────────
[Tabelheader med sortering og kolonne-filtre]
─────────────────────────────────────────────────────────────
[Rækker med data og handlingsikoner]
```

**Fælles træk:**
- Filter-dropdown øverst til venstre (fx "Mine aktive udbud")
- Søgefelt centreret
- Opret-knap øverst til højre
- Tabellen er den primære informationskomponent

### 3. Formular-mønster i modaler

**Label-placering:** Over feltet (ikke inline)
**Label-style:** Bold, hvid tekst på mørk baggrund
**Påkrævede felter:** Rød asterisk (*) efter label
**Info-ikon:** ⓘ efter label for felter med ekstra forklaring

**Sektionering:**
```
[Overskrift: "Stamdata"]
  [Felt 1]
  [Felt 2]
  ...
[Overskrift: "Deling"]
  [Felt N]
  ...
[Footer: Primær knap + Annuller]
```

### 4. Hierarki-mønster (Poster + Udbud-poster)

**Niveauer:**
1. Fagpost (øverste niveau, fed tekst)
2. Hovedpost (indrykket)
3. Post (indrykket yderligere)
4. Underpost (indrykket yderligere)

**Interaktion:**
- Klik på chevron → fold ud/ind
- Klik på postnavn → vælg/vis detaljer
- Checkbox til venstre → inkluder i udbud

### 5. Grupperet tabel-mønster (ATR & Bemanding)

```
▾ Gruppenavn (antal)
    > Element 1 | Kolonne2 | Kolonne3 | ...
    > Element 2 | ...
▾ Gruppenavn 2 (antal)
    > Element 3 | ...
```

**Interaktion:**
- Klik på gruppenavn → fold ud/ind
- Antal i parentes angiver antal elementer
- 🔒 ikon ved låste elementer

### 6. Handlingsikoner i tabeller

| Ikon | Handling | Kontekst |
|------|----------|----------|
| 📄 (side) | Rediger info | Udbud, ATR |
| ✏️ (blyant) | Rediger indhold | Poster, Bilag |
| 📋 (clipboard) | Tilføj/rediger poster | Udbud |
| 👁️ (øje) | Preview | Udbud, ATR |
| 📊 (graf) | Udtræk | Udbud |
| 💬 (boble) | Kommentarer | Udbud |
| 📎 (klips) | Vis bilag | Udbud |
| 🗑 (skrald) | Slet | Kategorier |
| ↑ (upload) | Upload fil | Bilag |

### 7. Mørk vs. lys kontekst

| Kontekst | Baggrund | Tekst | Eksempler |
|----------|----------|-------|-----------|
| **Header** | `#323232` | Hvid | Banedanmark-logo, sitenavn |
| **Navigation** | `#444444` | Hvid | Poster, Udbud, ATR, Bilag tabs |
| **Modaler** | `#4A4A4A` | Hvid labels, hvid/lys input | Rediger udbud, ATR Info |
| **Indhold** | `#FFFFFF` | `#323232` | Tabeller, forsider |
| **Footer** | `#333333` | Hvid/lys | Kontakt, Vejledning |
