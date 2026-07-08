# templates/

> Genbrugelige faglige skabeloner.
> Hver undermappe indeholder skabeloner til en specifik leverancetype.

---

## Formål

Denne mappe indeholder **standardiserede skabeloner**, der sikrer konsistens på tværs af projekter. Skabelonerne fungerer som udgangspunkt og tilpasses projektspecifikke krav.

---

## Hvilke filer mappen indeholder

| Mappe | Indhold |
|-------|---------|
| `load-lists/` | Load list-skabeloner med kolonnedefinitioner |
| `work-descriptions/` | Arbejdsbeskrivelsesskabeloner |
| `tender-lists/` | Tilbudslisteskabeloner med poststruktur |
| `qa/` | QA-tjeklister og review-skabeloner |
| `diagrams/` | Diagramskabeloner og symbolbeskrivelser |
| `calculations/` | Beregningsskabeloner og formelsamlinger |

---

## Hvordan agenten skal bruge mappen

1. Identificér, hvilken type leverance der skal produceres.
2. Find den relevante skabelon.
3. Tilpas skabelonen til projektets specifikke krav.
4. Marker alle tilpasninger og antagelser tydeligt.
5. Gem projektspecifikke versioner i projektets mappe, ikke her.

---

## Hvad der ikke må gemmes her

- Projekt-specifikke udgaver af skabeloner
- Færdige leverancer
- Personfølsomme oplysninger
- Kontraktkritiske data

---

## Eksempel på brug

> Agent skal lave en load list:
> 1. Henter skabelon fra `templates/load-lists/`
> 2. Tilpasser kolonner efter projektets behov
> 3. Udfylder med data
> 4. Gemmer projektspecifik version i projektets mappe
