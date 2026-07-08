# Skill: Excalidraw Flow Generator

> Generér flowdiagramstruktur til Excalidraw
> Input: Systembeskrivelse, komponenter, forbindelser
> Output: Struktureret beskrivelse egnet til Excalidraw

---

## Formål

Generér en detaljeret struktur for tekniske flowdiagrammer, der kan implementeres i Excalidraw. Skillen adskiller flowtyper og beskriver objekter, forbindelser og labels.

## Input

- Systembeskrivelse
- Komponentliste med ID'er
- Forbindelser mellem komponenter
- Flowtyper (energi, signal, styrestrøm, forsyning)
- Ønsket layout

## Metode

1. **Definér flowtyper**
   - Energiflow (hovedforsyning)
   - Nødforsyning
   - UPS-forsyning
   - Signaler
   - Styrestrømme
   - Kommunikation

2. **Placér objekter**
   - Forsyningstop (transformer, generator)
   - Fordelingskomponenter (tavler, afbrydere)
   - Forbrugere (motorer, lys, varme)
   - Måleudstyr

3. **Definér forbindelser**
   - Linjetyper (fast, stiplet, farvet)
   - Retning (en- eller begge veje)
   - Labels (strøm, spænding, signaltype)

4. **Tilføj labels og noter**
   - Komponent-ID'er
   - Tekniske data
   - Bemærkninger

## Output

```markdown
## Excalidraw-flow: [Systemnavn]

### Objekter
| ID | Type | Label | X | Y | Bemærkning |
|---|---|---|---|---|---|

### Forbindelser
| Fra | Til | Type | Label | Farve | Bemærkning |
|---|---|---|---|---|---|

### Lag
- Lag 1: Energiflow
- Lag 2: Signaler
- Lag 3: Styrestrømme

### Farvekode
- Sort: Hovedforsyning
- Rød: Nødforsyning
- Blå: UPS
- Grøn: Signal

### Tegningsnoter
- [Note 1]
- [Note 2]
```

## Begrænsninger

- Tekstbeskrivelse — ikke selve tegningen
- Bruger skal implementere i Excalidraw manuelt
- Koordinater er vejledende
