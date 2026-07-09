---
name: shared-docx
description: Fælles projektskill for dokumentarbejde i Word- og Office-filer. Bruges når opgaven handler om .docx, dokumentstruktur, redigering, review, skabeloner eller dokumentgenerering i dette projekt.
---

# Shared Docx

Denne skill er projektets fælles indgang til dokumentarbejde.

## Brug denne skill når

- der arbejdes med `.docx`-filer
- der skal vælges dokumentworkflow eller skabelon
- der skal kvalitetssikres ændringer i dokumentstruktur, styles eller indhold

## Regler

- Brug projektets aktive runtime under `.vscode/.codex/`
- Brug kun arkiverede dokumentskills i `.vscode/archive/` som referencekilder
- Hold dokumentarbejde revisionsvenligt og sporbart
- Når scripts er nødvendige, brug `uv run` og læg nye scripts i `temp/`

## Standardworkflow

1. Bekræft hvilken fil og hvilket output der ønskes
2. Vurder om opgaven er redigering, review, skabelonarbejde eller generering
3. Brug projektets Banedanmark-skills hvis opgaven er domænespecifik
4. Verificér dokumentstruktur og ændringsresultat før aflevering
