# projects/

> Aktive projekter.
> Hvert projekt placeres i en undermappe med projektnavn.

---

## Formål

Denne mappe indeholder **aktive projekter**, der er kopieret fra template'et og tilpasset specifikke projektbehov. Hvert projekt har sin egen struktur, men arver principper og skabeloner fra template'et.

---

## Struktur per projekt

```
projects/
└── [projektnavn]/
    ├── memory/
    │   └── ramboll-context.md
    ├── tasks/
    ├── diary/
    ├── quality/
    ├── docs/
    ├── data/
    ├── beregninger/
    ├── leverancer/
    └── README.md
```

---

## Hvordan agenten skal bruge mappen

1. Ved projektstart: kopier template til ny undermappe.
2. Tilpas `memory/ramboll-context.md` med projektspecifikke krav.
3. Opret projektets mappestruktur.
4. Brug template'ets skills, agents og commands i projektets kontekst.
5. Dokumentér alt i projektets `diary/` og `quality/`.

---

## Hvad der ikke må gemmes her

- Afsluttede projekter (arkiveres separat)
- Personfølsomme oplysninger
- Kontraktkritiske data
- Midlertidige filer

---

## Eksempel på brug

> Bruger starter nyt projekt:
> 1. Kopierer `Sharmake/` til `projects/IndustriXYZ/`
> 2. Tilpasser `projects/IndustriXYZ/memory/ramboll-context.md`
> 3. Tilføjer projektfiler i `projects/IndustriXYZ/data/`
> 4. Bruger kommandoen "Start nyt projekt" i projektets mappe
