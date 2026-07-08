# Command: Lav load list

> Generér komplet load list fra input
> Trigger: "Lav load list" eller tilsvarende

---

## Formål

Generér en komplet, struktureret load list ved at aktivere skill `load-list-generator.md` og eventuelt `load-list-validator.md`.

## Trigger

- "Lav load list"
- "Generér load list"
- "Opret forbrugsoversigt"

## Workflow

1. **Modtag input**
   - Rå belastningsdata
   - Projektkontekst

2. **Aktivér skill**
   - `skills/load-list-generator.md`

3. **Generér load list**
   - Følg skillens metode
   - Beregn strømme
   - Marker antagelser

4. **Validér (valgfrit)**
   - `skills/load-list-validator.md`
   - Tjek for fejl og mangler

5. **Lever output**
   - Markdown-tabel
   - Liste over manglende data
   - QA-punkter

## Output

- Struktureret load list (markdown-tabel)
- Manglende data
- QA-punkter
- Næste handlinger
- Forslag til dagbogsnotat

## Begrænsninger

- Kræver inputdata
- Må ikke gætte på effekter
- Skal markeres som foreløbig, indtil verificeret
