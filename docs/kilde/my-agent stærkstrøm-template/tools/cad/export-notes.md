# CAD Export Notes

> Noter til eksport af data til CAD-systemer.

---

## Formål

Beskrive, hvordan tekniske data kan eksporteres fra agenten og importeres i AutoCAD eller MicroStation.

## Eksportformater

| Format | Brug | Bemærkning |
|--------|------|------------|
| CSV | Koordinater, komponentlister | |
| Excel | Tabeller, beregningsdata | |
| TXT | Tekstbeskrivelser | |

## Koordinater

- Format: `ID, X, Y, Beskrivelse`
- Enhed: mm (standard) eller m
- Referencet: Angiv nulpunkt

## Komponenter

- Format: `ID, Type, Størrelse, Bemærkning`
- Standardisér betegnelser
- Reference til komponentdatabase

## Begrænsninger

- Agenten genererer data — bruger importerer i CAD
- Koordinater er vejledende
- Skel mellem model og papirrum

---

*Afventer brugerinput*
