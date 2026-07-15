---
name: bdk-brand-preflight-leverance
version: "1.0"
description: Gennemfør preflight af brand-assets før levering, inkl. farverum, filvalg, navngivning og oprydning af støjfiler. Brug når et brandmateriale er klar til eksport eller overdragelse, når leverancepakken skal sikres teknisk korrekt, eller når logo-filer skal indgå i en leverance.
metadata:
  owner: Biyocon
  created: 2026-02-25
  last_reviewed: 2026-02-25
---

# BDK Brand Preflight Leverance

## Hvornår skillen bruges
- Når et brandmateriale er klar til eksport/overdragelse.
- Når brugeren vil sikre teknisk korrekt leverancepakke.
- Når logo-filer skal inkluderes i en leverance.

## Autoritative kilder
1. **Banedanmark logopakke 2021** — officielle logofiler
2. **bdk-logo-asset-valg/references/logo-asset-analyse.md** — filanalyse med dimensioner og kvalitetsflags
3. **bdk-brand-governance/references/bdk-brand-designsystem.md** — brandregler

## Preflight-checkliste

### P1: Farverum/kanalmatch
| Check | Kriterium | Pass/Fail |
|-------|-----------|-----------|
| P1.1 | Digital leverance bruger kun RGB-filer | |
| P1.2 | Print leverance bruger kun CMYK-filer (eller AI-vektor) | |
| P1.3 | Ingen blanding af farverum i samme leverance | |

### P2: Filvalg
| Check | Kriterium | Pass/Fail |
|-------|-----------|-----------|
| P2.1 | Korrekt logo-variant valgt (2-dæk/1-dæk/krone) | |
| P2.2 | Korrekt dark/light variant matcher baggrund | |
| P2.3 | Tilstrækkelig opløsning til formålet | |
| P2.4 | Kvalitetsflags adresseret (jf. FLAG-001) | |

### P3: Navngivning og integritet
| Check | Kriterium | Pass/Fail |
|-------|-----------|-----------|
| P3.1 | Filnavne er uændrede fra officiel logopakke | |
| P3.2 | Filer er ikke resized, cropped eller resampled | |
| P3.3 | Ingen farvejustering er foretaget på logofiler | |

### P4: Oprydning
| Check | Kriterium | Pass/Fail |
|-------|-----------|-----------|
| P4.1 | Ingen `__MACOSX/` mapper i leverance | |
| P4.2 | Ingen `.DS_Store` filer i leverance | |
| P4.3 | Ingen `._*` resource fork-filer i leverance | |
| P4.4 | Kun relevante filer inkluderet (ikke hele logopakken) | |

### P5: Komplethed
| Check | Kriterium | Pass/Fail |
|-------|-----------|-----------|
| P5.1 | Alle nødvendige varianter inkluderet (dark + light hvis begge bruges) | |
| P5.2 | Vektor-kildefiler inkluderet ved produktion | |

## Kendte issues

| Flag | Beskrivelse | Workaround |
|------|-------------|-----------|
| FLAG-001 | `Logo-RGB-2-dark.png` er 250x100 px (for lavopløst) | Brug `Logo-RGB-2-light.png` på inverteret bg, eller rekvirér ny fil fra redaktion@bane.dk |

## Støjfiler i logopakken
Følgende filer/mapper eksisterer i logopakken men skal **aldrig** inkluderes i leverancer:

```
Banedanmark logopakke 2021/__MACOSX/                    (macOS metadata)
Banedanmark logopakke 2021/__MACOSX/._BDK-Ny-Logopakke
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/._.DS_Store
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/AI-filer/._Logo-CMYK.ai
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/AI-filer/._Logo-RGB.ai
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/RGB/._.DS_Store
Banedanmark logopakke 2021/Banedanmark Logo 2021/.DS_Store
Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/.DS_Store
```

## Arbejdsgang
1. Læs `bdk-logo-asset-valg/references/logo-asset-analyse.md`.
2. Kontrollér farverum/kanalmatch (P1).
3. Kontrollér filvalg og opløsning (P2).
4. Kontrollér navngivning og integritet (P3).
5. Fjern/udelad støjfiler (P4).
6. Verificér komplethed (P5).
7. Returnér samlet preflight-resultat.

## Outputformat
1. Leverancekontekst (kanal, formål, modtager)
2. Teknisk preflight (pass/fail pr. check med detaljer)
3. Oprydningspunkter (konkrete filer der skal fjernes)
4. Endelig pakkestruktur (hvad der leveres)
5. Kilder (repo-stier)

## Styringsregler
- Lever ALDRIG med platformstøjfiler.
- Markér hvis kun rasterfiler er tilgængelige hvor vektor er anbefalet.
- Ændr aldrig officielle logofiler (resize, crop, recolor).
- Ved kvalitetsflag: advisér bruger og eskalér til kommunikationsafdelingen.

## Script
- `scripts/logo_inventory.ps1` — scanner logopakken og returnerer fil, type, størrelse og dimensioner
- Brug: `powershell -File logo_inventory.ps1 -Root "sti/til/logopakke"`
