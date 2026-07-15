---
name: bdk-lokalinstruktion-opslag
description: Find og afgræns relevante lokale instruktioner for strækning/station og kobling til ORS/ORF-regler. Brug når lokal instruktion for en station eller strækning skal findes, eller når det skal afklares om instruktionen læses i ORS- eller ORF-kontekst.
---

# BDK Lokalinstruktion Opslag

## Hvornår skillen bruges
- Når brugeren vil finde lokal instruktion for en station eller strækning.
- Når brugeren vil vide om instruktionen skal læses i ORS- eller ORF-kontekst.

## Arbejdsgang
1. Læs `references/source-map.md`.
2. Identificér geografi (station, strækning, område).
3. Søg relevante lokale instruktioner i ORF/ORS-kilder.
4. Returnér matchliste med prioritet og evt. tvetydigheder.
5. Peg på næste dokumenttrin (fx supplerende regler eller TC).

## Outputformat
1. Søgte kriterier
2. Matchende lokale instruktioner
3. Regelsætstilknytning (ORS/ORF)
4. Manglende/uklare match
5. Kilder (repo-stier)

## Styringsregler
- Ved flere plausible matches: vis alle med kort begrundelse.
- Markér hvis lokale instruktioner kun findes i ZIP og ikke udpakket mappe.

