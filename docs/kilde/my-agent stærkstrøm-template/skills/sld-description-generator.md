# Skill: SLD Description Generator

> Generér tekstbeskrivelse af SLD (Single Line Diagram)
> Input: Tavlestruktur, komponenter, forbindelser
> Output: Struktureret tekstbeskrivelse egnet til dokumentation

---

## Formål

Generér en detaljeret, tekstbaseret beskrivelse af et SLD, der kan bruges som udkast til teknisk dokumentation, arbejdsbeskrivelser eller review.

## Input

- Tavlestruktur og -ID'er
- Komponentliste (afbrydere, sikringer, relæer, etc.)
- Forsyningsflow (hvad forsyner hvad)
- Målinger og signaler
- Beskyttelsesprincip

## Metode

1. **Beskriv forsyningstoppen**
   - Indgang: HV/MV/LV
   - Transformere
   - Hovedafbrydere

2. **Beskriv hver tavle**
   - ID og type
   - Indgangskomponenter
   - Fordelingsfelter
   - Udgange

3. **Beskriv beskyttelse**
   - Hovedbeskyttelse
   - Sekundærbeskyttelse
   - Selektivitetsprincip

4. **Beskriv målinger og signaler**
   - Strøm-, spændings-, effektmålere
   - Signaler til SCADA/BMS

5. **Beskriv redundans og nødforsyning**
   - Skifteovergang
   - Automatik

## Output

```markdown
## SLD-beskrivelse: [Tavle-ID]

### Forsyning
- Indgang: [spænding, type]
- Hovedtransformer: [størrelse, type]
- Hovedafbryder: [type, størrelse]

### Tavlestruktur
- [Felt 1]: [beskrivelse]
- [Felt 2]: [beskrivelse]

### Beskyttelse
- Hovedbeskyttelse: [type, indstilling]
- Selektivitet: [princip]

### Målinger og signaler
- [Måler 1]: [parameter, signaltype]

### Redundans/Nødforsyning
- [Beskrivelse]

### Åbne punkter
- [Punkt 1]
```

## Begrænsninger

- Tekstbeskrivelse — ikke tegning
- Kræver input om komponenter
- Skal markeres som udkast
