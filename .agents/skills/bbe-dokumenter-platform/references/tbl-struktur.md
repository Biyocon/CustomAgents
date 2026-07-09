# TBL Struktur — Tilbudslisten

## Overblik

Tilbudslisten (TBL) er et Excel-dokument der genereres fra BaneByg-posterne og bruges til entreprenørens prisafgivelse.

## Fanestruktur

### Fagpost-faner
- Én fane per **valgt** fagpost
- Fane-navn: Fagpostnummer og -navn
- Sorteret numerisk (FP1, FP2, FP3, ...)

### CO2-aftryk fane
- Separat fane "CO2 aftryk"
- Indeholder: Valgte poster og underposter med samlede mængder
- Bruges til miljødokumentation

## Kolonnestruktur per fagpost-fane

| Kolonne | Indhold | Status |
|---------|---------|--------|
| A | Postnummer (X.Y.Z.Æ) | Låst |
| B | Postbeskrivelse | Låst |
| C | Enhed | Låst |
| D-H | Mængde per stadie | Låst |
| I | **Enhedspris** | **Redigerbar** |
| J | Sumpris (beregnet) | Låst (formel) |

## Feltregler

### Låste felter
Følgende felter er **låste** og kan ikke redigeres af tilbudsgiver:
- Postnummer
- Postbeskrivelse
- Enhed
- Mængder per stadie
- Sumposter (formelberegnet)

### Redigerbare felter
Kun **Enhedspris** (kolonne I) er redigerbar for tilbudsgiver.

### Sumformel
```
Sumpris = Enhedspris × Samlet mængde (alle stadier)
```

## Stadieinddeling

Mængder angives per stadie (typisk):
- Stadie 1: Forberedelse
- Stadie 2: Hovedudførelse
- Stadie 3: Afslutning
- (Projektafhængigt)

## Optioner/Tillægsposter

### Behandling
- Behandles som øvrige poster
- Placeres i separate sektioner
- Klar adskillelse i indholdsfortegnelse

### Nummerering
Optioner nummereres med -10 prefix (fx -10.1 for option under hovedpost 1).

## Filnavngivning

Standard navneformat:
```
Tilbudsliste_[Projektnr.]_[Projektnavn].xlsx
```

Eksempel:
```
Tilbudsliste_MTH-2024_Sporfornyelse_Skjern-Holstebro.xlsx
```

## Generering

### Preview-workflow
1. Gå til menupunkt "Udbud"
2. Find udbud i oversigten
3. Klik Excel-ikon i "Preview"-kolonnen
4. Dokument downloades lokalt
5. Verificer indhold

### Kvalitetskontrol ved preview
- [ ] Én fane per valgt fagpost?
- [ ] Korrekte poster, stadier, mængder?
- [ ] CO2-aftryk fane inkluderet?
- [ ] Enhedspriser redigerbare?
- [ ] Sumposter låste?
- [ ] Formler korrekte?

## Import-workflow

### Trin
1. Download tilbudsliste fra projektsite-mappen
2. Gå til BBE → Udbud
3. Klik upload-ikon i "Importer tilbudsliste"-kolonnen
4. Klik "Uploade Filer" → vælg tilbudsliste
5. Klik "Tilføj filer"
6. Angiv leverandør-initialer
7. Sæt flueben "Ændre status til afsluttet" (hvis relevant)
8. Klik "Upload fil(er)"

### Verificering
1. Klik "vis tilbudsliste"-ikon
2. Verificer række med leverandør-navn og link til fil

## Sammenhæng med YB

```
YB (Word)                    TBL (Excel)
─────────────────────────────────────────
Fagpost 3: Spor        →    Fane "3 Spor"
  3.1 Forbererende     →      Post 3.1
    3.1.1 Rydning      →        Post 3.1.1
Fagpost 4: Jord        →    Fane "4 Jord og ballast"
...
```

Direkte 1:1 korrespondance mellem YB-poster og TBL-poster.

## Kendte fejl og workarounds

### Fejl: Tillægsposter viser forkert HP-nummer
**Symptom:** -10 poster viser HP-nummer som "1" i stedet for fagpost-reference
**Workaround:** Verificer manuelt at fagpost-tilknytning er korrekt

### Fejl: Mængder kan ikke ændres i visse poster
**Symptom:** Mængdefelter reagerer ikke
**Workaround:** Kontroller at posten har enhedsangivelse; kun poster med enhed har mængdefelter
