# Command: Kør Ralph-loop

> Iterativt arbejde med plan, udførelse, kontrol, forbedring
> Trigger: "Kør Ralph-loop" eller tilsvarende

---

## Formål

Udføre en kompleks opgave iterativt ved at arbejde i gentagne passager, verificere resultatet, gemme state og fortsætte med skærpet kontekst, indtil succeskriterierne er opfyldt.

## Trigger

- "Kør Ralph-loop"
- "Ralph-loop"
- "Iterér på denne opgave"

## Workflow

### Cyklus

1. **Forstå opgaven**
   - Gentag opgaven
   - Afklar antagelser

2. **Læs relevant kontekst**
   - `memory/user-profile.md`
   - `memory/preferences.md`
   - `memory/engineering-principles.md`
   - Relevante skills og agenter

3. **Identificér succeskriterier**
   - Hvad skal opnås?
   - Hvornår er opgaven færdig?

4. **Lav plan**
   - Trin-for-trin plan
   - Aktiver relevante komponenter

5. **Udfør første iteration**
   - Udfør planens første trin
   - Producer output

6. **Kontrollér resultat**
   - Verificér output
   - Tjek for fejl og mangler
   - Sammenlign med succeskriterier

7. **Find fejl, mangler og antagelser**
   - Identificér problemer
   - Notér forbedringspotentiale

8. **Forbedr output**
   - Ret fejl
   - Tilføj manglende information
   - Forbedr struktur og formulering

9. **Gem status**
   - Opdater `tasks/today.md`
   - Opdater `tasks/backlog.md`
   - Opdater `diary/YYYY-MM-DD.md`
   - Opdater `quality/qa-findings.md`

10. **Gentag**
    - Hvis succeskriterier ikke er opfyldt, gentag fra trin 5
    - Hvis stopkriterier er opfyldt, stop

### Stopkriterier

- Succeskriterier er opfyldt
- Der mangler kritiske input
- Der er konflikt mellem krav
- Der er risiko for forkert teknisk konklusion
- Opgaven kræver menneskelig beslutning
- Værktøj eller datagrundlag er utilstrækkeligt

### Ved stop

- Status
- Hvad der er gjort
- Hvad der mangler
- Hvad brugeren skal tage stilling til
- Anbefalet næste skridt

## Begrænsninger

- Må ikke køre uendelige loops
- Maksimalt antal iterationer bør angives
- Skal altid rapportere status ved stop
