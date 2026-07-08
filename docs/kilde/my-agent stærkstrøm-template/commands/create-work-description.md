# Command: Lav arbejdsbeskrivelse

> Udarbejd teknisk arbejdsbeskrivelse
> Trigger: "Lav arbejdsbeskrivelse" eller tilsvarende

---

## Formål

Generér en teknisk arbejdsbeskrivelse ved at aktivere skill `work-description-writer.md`.

## Trigger

- "Lav arbejdsbeskrivelse"
- "Opret arbejdsbeskrivelse"
- "Generér udbudstekst"

## Workflow

1. **Modtag input**
   - Opgave, omfang, forudsætninger
   - Grænseflader, krav

2. **Aktivér skill**
   - `skills/work-description-writer.md`

3. **Generér arbejdsbeskrivelse**
   - Formål
   - Omfang
   - Forudsætninger
   - Grænseflader
   - Udførelseskrav
   - Materialekrav
   - Dokumentationskrav
   - Test og idriftsættelse
   - Kvalitetssikring
   - Åbne punkter

4. **Review (valgfrit)**
   - `skills/qa-reviewer.md`

## Output

- Struktureret arbejdsbeskrivelse
- Liste over åbne punkter
- Afklaringsspørgsmål

## Begrænsninger

- Udkast — skal reviewes
- Kræver projektspecifikke input
- Skal markeres som foreløbig
