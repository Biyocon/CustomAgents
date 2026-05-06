# UI Elementer — BaneByg Enterprise

## Skærmbillede-referencer

| Fil | Indhold |
|-----|---------|
| UIUX001.png | Hovednavigation og postoversigt |
| UIUX002.png | Udbudsoversigt med preview-kolonner |
| UIUX003.png | Postervalg med to-kolonne visning |
| UIUX004.png | Bilagshåndtering |
| UIUX005.png | Mængdeangivelse per stadie |
| UIUX006.png | Admin-funktioner |
| UIUX007.png | Søgning og filtrering |
| UIUX008.png | Ekstern leverandør-visning |
| UIUX009.png | Feedback & Forespørgsler |
| UIUX010.png | Udtræk-workflow |
| UIUX011.png | Import tilbudsliste |

## Navigationsmenu

### Topmenu
```
┌────────────────────────────────────────────────────────────┐
│ ⚜ BANEDANMARK │ SharePoint │ [Søg på dette websted    ] │
└────────────────────────────────────────────────────────────┘
```

### Primær navigation
```
┌─────────────────────────────────────────────────────┐
│ ⚜ Banebyg  │  Banebyg  │  Papirkurv               │
└─────────────────────────────────────────────────────┘
```

### Sekundær navigation (funktionsmenu)
```
┌────────────────────────────────────────────────────────────────────────┐
│ 📋 Poster │ 📁 Udbud │ 📎 Bilag │ 💬 Feedback & Forespørgsler │ ⚙ Admin │
└────────────────────────────────────────────────────────────────────────┘
```

## Postervisning (to-kolonne)

### Layout
```
┌──────────────────────────────┬────────────────────────────────┐
│ Vælg Standard post           │ Udbudsspecifik kommentar       │
├──────────────────────────────┼────────────────────────────────┤
│ ▼ ☑ 1 Indledning (v.7)      │ [Fritekst kommentarfelt]       │
│     📝 Standard tekst...     │                                │
│   ▸ ☑ 1.1 Entreprisebe...   │                                │
│   ▸ ☑ 1.2 Samtidige...      │                                │
│   ▸ ☑ 1.3 Miljø (v.12)      │                                │
│ ▼ ☑ 2 Banebyg og TBL (v.3)  │                                │
│ ▸ ☐ 3 Spor (v.8)            │                                │
│ ▸ ☐ 4 Jord og ballast (v.7) │                                │
│ ...                          │                                │
└──────────────────────────────┴────────────────────────────────┘
```

### Elementer
- **Expand/collapse (▼/▸):** Vis/skjul underposter
- **Checkbox (☑/☐):** Vælg/fravælg post til udbud
- **Versionsnummer (v.X):** Postens aktuelle version
- **Redigeringsikon (📝):** Åbn post til redigering (kun for ejere)

## Udbudsoversigt

### Kolonner
```
┌──────────┬────────────┬─────────┬─────────────┬──────────────────┐
│ Navn     │ Projektnr. │ Status  │ Preview     │ Importer TBL     │
├──────────┼────────────┼─────────┼─────────────┼──────────────────┤
│ Udbud A  │ MTH-2024   │ Aktiv   │ [PDF][XLS]  │ [↑]              │
│ Udbud B  │ SKH-2025   │ Afslut. │ [PDF][XLS]  │ [👁]             │
└──────────┴────────────┴─────────┴─────────────┴──────────────────┘
```

### Ikoner
- **PDF-ikon:** Generer preview af udbudsdokument
- **Excel-ikon:** Generer preview af tilbudsliste
- **Upload-ikon (↑):** Importer tilbudsliste
- **Vis-ikon (👁):** Se importerede tilbudslister

## Bilagshåndtering

### Bilagstabel
```
┌─────────────────┬───────────────────┬──────────────────────┐
│ Bilagsnavn      │ Senest redigeret  │ Er bilaget tilpasset?│
├─────────────────┼───────────────────┼──────────────────────┤
│ Bilag 9.1 KP... │ 2024-01-15        │ ☐                    │
└─────────────────┴───────────────────┴──────────────────────┘
```

## Kontaktinformation (bundsektion)

```
┌───────────────────────────────────┬────────────────────────────────────┐
│ Kontaktinformation                │ Vejledning                         │
├───────────────────────────────────┼────────────────────────────────────┤
│ SharePoint/dokumenthåndtering:    │ Guide til ejer                     │
│ ask@bane.dk                       │ Guide til bruger                   │
│                                   │ Guide til ekstern leverandør       │
│ Værktøjet Banebyg:                │ Adgangsstyring                     │
│ mowj@bane.dk (Marc Owen Jalksø)   │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

## Designprincipper

### Farver
- **Primær:** Banedanmark teal (#006B6B approx.)
- **Sekundær:** Hvid baggrund
- **Accent:** Grå til inaktive elementer

### Typografi
- Klar, læsbar skrifttype
- Hierarkisk størrelse (overskrifter > brødtekst)
- Konsistent linjehøjde

### Layout
- Fast venstre-kolonne (posthierarki)
- Responsiv højre-kolonne (kontekstafhængig)
- Tydelig visuel adskillelse mellem sektioner

## Brugerroller og UI-adgang

| Element | Admin | Ejer | Bruger | Ekstern |
|---------|-------|------|--------|---------|
| Poster (læs) | ✓ | ✓ | ✓ | ✓ |
| Poster (rediger) | ✓ | ✓ | ✗ | ✗ |
| Udbud (opret) | ✓ | ✓ | ✗ | ✗ |
| Udbud (tilføj poster) | ✓ | ✓ | ✓ | ✗ |
| Kommentarer | ✓ | ✓ | ✓ | ✓ |
| Preview | ✓ | ✓ | ✓ | ✓ |
| Udtræk | ✓ | ✓ | ✗ | ✗ |
| Import TBL | ✓ | ✓ | ✗ | ✗ |
| Admin-funktioner | ✓ | ✗ | ✗ | ✗ |

## Interface Manager vedligeholdelses-checklist

### Ved UI-ændring
- [ ] Screenshot af "før"-tilstand
- [ ] Dokumenter ændring og rationale
- [ ] Test i dev-miljø
- [ ] Brugertest med repræsentativ bruger
- [ ] Screenshot af "efter"-tilstand
- [ ] Opdater denne dokumentation
- [ ] Kommuniker ændring til brugere

### Periodisk review
- [ ] Er alle links funktionelle?
- [ ] Er kontaktinformation opdateret?
- [ ] Er vejledninger tilgængelige?
- [ ] Fungerer responsivt design?
