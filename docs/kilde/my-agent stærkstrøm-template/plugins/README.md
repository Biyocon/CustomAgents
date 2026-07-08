# plugins/

> Integrationer og adapters til eksterne værktøjer og systemer.
> Hver fil beskriver, hvordan agenten interagerer med et specifikt værktøj.

---

## Formål

Denne mappe indeholder **beskrivelser af integrationer** til de værktøjer og systemer, som brugeren arbejder med dagligt. En plugin-fil beskriver:

- Hvad værktøjet gør
- Hvordan det bruges i workflowet
- Hvilke data der udveksles
- Kendte begrænsninger
- Hvordan agenten kan hjælpe med at forberede input eller fortolke output

---

## Hvilke filer mappen indeholder

| Fil | Værktøj | Formål |
|-----|---------|--------|
| `febdoc.md` | FEBDOC | Load list-håndtering og beregninger |
| `simaris.md` | Simaris | Kabel- og beskyttelsesberegninger |
| `autocad.md` | AutoCAD | Tegningsproduktion og -granskning |
| `microstation.md` | MicroStation | Tegningsproduktion og -granskning |
| `sharepoint.md` | SharePoint | Dokumenthåndtering og deling |
| `projectwise.md` | ProjectWise | Projektstyring og dokumentkontrol |
| `outlook.md` | Outlook | Kommunikation og møder |
| `teams.md` | Teams | Kommunikation og samarbejde |

---

## Hvordan agenten skal bruge mappen

1. Forstå, hvilke værktøjer brugeren arbejder med.
2. Læs den relevante plugin-fil for at forstå integrationen.
3. Hjælp med at forberede input, der er kompatibelt med værktøjet.
4. Hjælp med at fortolke output fra værktøjet.
5. Marker, hvis en opgave kræver manuel handling i værktøjet.

---

## Hvad der ikke må gemmes her

- Loginoplysninger eller API-nøgler
- Projekt-specifikke datafiler
- Personfølsomme oplysninger
- Kontraktkritiske data

---

## Eksempel på brug

> Bruger: "Jeg har en kabelberegning i Simaris"
>
> Agent:
> 1. Læser `plugins/simaris.md`
> 2. Forstår Simaris' inputkrav og outputformater
> 3. Hjælper med at strukturere inputdata korrekt
> 4. Forklarer, hvordan resultaterne skal fortolkes
> 5. Markerer, hvad der kræver manuel indtastning i Simaris
