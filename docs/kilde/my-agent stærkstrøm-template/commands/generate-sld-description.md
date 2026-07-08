# Command: Lav SLD-beskrivelse

> Generér tekstbeskrivelse af SLD
> Trigger: "Lav SLD-beskrivelse" eller tilsvarende

---

## Formål

Generér en tekstbaseret beskrivelse af et SLD ved at aktivere skill `sld-description-generator.md`.

## Trigger

- "Lav SLD-beskrivelse"
- "Beskriv SLD"
- "Generér SLD-tekst"

## Workflow

1. **Modtag input**
   - Tavlestruktur
   - Komponentliste
   - Forsyningsflow

2. **Aktivér skill**
   - `skills/sld-description-generator.md`

3. **Generér beskrivelse**
   - Beskriv forsyningstop
   - Beskriv hver tavle
   - Beskriv beskyttelse
   - Beskriv målinger og signaler
   - Beskriv redundans

4. **Kontrollér konsistens**
   - Stemmer beskrivelse overens med load list?
   - Stemmer beskrivelse overens med tavlestruktur?

## Output

- Tekstbaseret SLD-beskrivelse
- Liste over åbne punkter
- Forslag til diagramnoter

## Begrænsninger

- Tekstbeskrivelse — ikke tegning
- Kræver input om komponenter
- Skal markeres som udkast
