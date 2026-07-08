# Command: Lav tilbudsliste

> Udarbejd tilbudsliste
> Trigger: "Lav tilbudsliste" eller tilsvarende

---

## Formål

Generér en tilbudsliste ved at aktivere skill `tender-list-generator.md`.

## Trigger

- "Lav tilbudsliste"
- "Opret tilbudsliste"
- "Generér mængdeudtræk"

## Workflow

1. **Modtag input**
   - Projektomfang
   - Load list, tavlestruktur, kabeloversigt

2. **Aktivér skill**
   - `skills/tender-list-generator.md`

3. **Generér tilbudsliste**
   - Strukturér poster
   - Beskriv ydelser
   - Angiv enheder og mængder
   - Identificér grænseflader
   - Foreslå optioner og forbehold

4. **Review (valgfrit)**
   - `skills/qa-reviewer.md`
   - `agents/quantity-tender-engineer.md`

## Output

- Struktureret tilbudsliste
- Grænsefladeanalyse
- Optioner og forbehold
- Tjekliste for entreprenørtilbud

## Begrænsninger

- Mængder baseret på input — skal verificeres
- Skel mellem leverandør- og entreprenøransvar
- Skal markeres som foreløbig
