# tools/

> Scripts, beregningshjælpere, validering og automatisering.
> Hver undermappe indeholder værktøjer til et specifikt domæne.

---

## Formål

Denne mappe indeholder **aktive værktøjer**, som agenten kan bruge til at udføre beregninger, validere data, generere output og automatisere opgaver. Tools adskiller sig fra skills ved at være **eksekverbare**, ikke blot beskrivende.

---

## Hvilke filer mappen indeholder

| Mappe/Fil | Formål | Indhold |
|-----------|--------|---------|
| `python/` | Python-scripts | `load_list_tools.py`, `excel_validator.py`, `calculation_helpers.py` |
| `excel/` | Excel-hjælpere | Skabeloner, validering, makroer |
| `excel/schemas/` | Excel-skemaer | Kolonnedefinitioner, datavalidering |
| `excalidraw/` | Excalidraw-generering | Diagramskabeloner, eksportnoter |
| `excalidraw/templates/` | Excalidraw-templates | Genbrugelige diagramstrukturer |
| `cad/` | CAD-integration | Eksportnoter, importinstruktioner |

---

## Hvordan agenten skal bruge mappen

1. Identificér behov for automatiseret beregning eller validering.
2. Tjek om et relevant tool findes.
3. Brug tool'et aktivt — ikke som reference, men som hjælper.
4. Verificér resultatet.
5. Dokumentér, hvilket tool der blev brugt, og hvad resultatet var.

---

## Hvad der ikke må gemmes her

- Projekt-specifikke datafiler
- Personfølsomme oplysninger
- Kontraktkritiske data
- Store binære filer uden nødvendighed

---

## Eksempel på brug

> Agent skal validere en load list:
> 1. Kører `python/excel_validator.py` på inputfilen
> 2. Tjekker output for fejl og advarsler
> 3. Rapporterer valideringsresultatet til brugeren
> 4. Foreslår rettelser baseret på fejlene
