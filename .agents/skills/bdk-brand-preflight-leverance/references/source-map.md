# Kildekort - bdk-brand-preflight-leverance

## Primære kilder
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/*` — 6 digitale PNG
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/CMYK/*` — 6 print-PNG
- `Banedanmark logopakke 2021/Banedanmark Logo 2021/AI-filer/*` — 2 vektor-kilder

## Relaterede skill-kilder
- `../bdk-logo-asset-valg/references/logo-asset-analyse.md` — filanalyse med dimensioner og kvalitetsflags
- `../bdk-brand-governance/references/bdk-brand-designsystem.md` — brandregler

## Oprydningsrelevante stier (skal udelukkes fra leverancer)
```
Banedanmark logopakke 2021/__MACOSX/
Banedanmark logopakke 2021/__MACOSX/._BDK-Ny-Logopakke
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/._.DS_Store
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/AI-filer/._Logo-CMYK.ai
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/AI-filer/._Logo-RGB.ai
Banedanmark logopakke 2021/__MACOSX/BDK-Ny-Logopakke/RGB/._.DS_Store
Banedanmark logopakke 2021/Banedanmark Logo 2021/.DS_Store
Banedanmark logopakke 2021/Banedanmark Logo 2021/RGB/.DS_Store
```

## Kvalitetsflags
- **FLAG-001:** `RGB/Logo-RGB-2-dark.png` er 250x100 px (undersized, forventet 761x409)

## Script
- `scripts/logo_inventory.ps1` — scanner logopakke og returnerer fil, type, størrelse, dimensioner
- Brug: `powershell -File logo_inventory.ps1 -Root "sti/til/logopakke"`
