# skills/

> Genbrugelige faglige evner og procedurer.
> Hver fil beskriver en specifik opgave, metode og output.

---

## Formål

Denne mappe indeholder **modulære faglige evner**, som agenten kan aktivere efter behov. En skill beskriver:

- Hvad opgaven går ud på
- Hvilke input der kræves
- Hvilken metode der anvendes
- Hvilket output der forventes
- Hvilke fejl der kan opstå

Skills adskiller sig fra commands ved at være **generelle metoder**, ikke specifikke workflows.

---

## Hvilke filer mappen indeholder

| Fil | Evne | Beskrivelse |
|-----|------|-------------|
| `load-list-generator.md` | Load list-generator | Opret struktureret load list fra input |
| `load-list-validator.md` | Load list-validering | Kontrollér datakvalitet og konsistens |
| `cable-sizing-assistant.md` | Kabeldimensionering | Beregning og validering af kabler |
| `transformer-sizing-assistant.md` | Transformerdimensionering | Beregning af transformerstørrelse |
| `switchboard-structure-designer.md` | Tavlestruktur | Design af tavlestruktur og forsyningshierarki |
| `sld-description-generator.md` | SLD-beskrivelse | Generér tekstbeskrivelse af SLD |
| `pump-motor-supply-assistant.md` | Pumpe-/motorforsyning | El-teknisk dimensionering af pumper/motorer |
| `excalidraw-flow-generator.md` | Excalidraw-flow | Generér flowdiagramstruktur til Excalidraw |
| `work-description-writer.md` | Arbejdsbeskrivelse | Udarbejd teknisk arbejdsbeskrivelse |
| `qa-reviewer.md` | QA-review | Udfør teknisk review af leverancer |
| `tender-list-generator.md` | Tilbudsliste | Udarbejd tilbudsliste med poster og mængder |
| `data-gap-analyzer.md` | Datamangel-analyse | Identificér manglende data og afklaringer |

---

## Hvordan agenten skal bruge mappen

1. Forstå brugerens opgave.
2. Identificér, hvilke skills der er relevante.
3. Læs den/de relevante skill-filer.
4. Følg skillens metode og struktur.
5. Angiv altid, hvilken skill der blev anvendt.

---

## Hvad der ikke må gemmes her

- Projekt-specifikke resultater
- Personfølsomme oplysninger
- Kontraktkritiske data
- Midlertidige beregninger uden kontekst

---

## Eksempel på brug

> Bruger: "Lav en load list for pumpeforsyningerne"
>
> Agent:
> 1. Aktiverer skill `load-list-generator.md`
> 2. Følger skillens struktur og kolonner
> 3. Anvender `pump-motor-supply-assistant.md` for el-teknisk input
> 4. Kombinerer resultaterne
> 5. Markerer antagelser og manglende data
