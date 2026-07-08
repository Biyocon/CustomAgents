# Plan: {{FEATURE-NAVN}}
**Oprettet:** {{DATO}}
**Ref:** `docs/drafts/#N-titel.md` | `docs/PRD.md §{{SEKTION}}`
**Status:** DESIGN | GODKENDT | IMPLEMENTERET

<!--
DENNE FIL BRUGES TIL: Tekniske designs for komplekse features.
PLACERING: docs/plans/feature-navn.md
HVORNÅR: Skrives inden implementering starter for tasks der:
  - Påvirker mere end 3 filer
  - Introducerer ny arkitektur eller datamodel
  - Har høj risiko for re-work
  
Skrives ÉN GANG, læses FØR implementering starter.
Opdateres IKKE under implementering — brug task-ticket til løbende noter.
Markér "IMPLEMENTERET" i status når done.
-->

---

## Problem der løses

{{HVAD LØSER DENNE FEATURE — link til PRD-sektion}}

---

## Løsningsdesign

### Tilgang

{{BESKRIV DEN VALGTE TILGANG I 3-5 SÆTNINGER}}

### Alternativer overvejet

| Alternativ | Fordele | Ulemper | Afvist fordi |
|------------|---------|---------|--------------|
| {{ALT A}} | {{FORDELE}} | {{ULEMPER}} | {{ÅRSAG}} |
| {{ALT B}} | {{FORDELE}} | {{ULEMPER}} | {{ÅRSAG}} |

---

## Datamodel / API-kontrakt

<!--
Vis kun hvad der ÆNDRES eller TILFØJES — ikke hele eksisterende model.
-->

```typescript
// {{EKSEMPEL}}
interface {{NyType}} {
  {{FELT}}: {{TYPE}};
}
```

---

## Berørte filer

| Fil | Ændring | Note |
|-----|---------|------|
| `{{STI/TIL/FIL.ts}}` | {{TILFØJ/MODIFICER/SLET}} | {{HVORFOR}} |

---

## Rækkefølge for implementering

1. {{FØRSTE SKRIDT}}
2. {{ANDET SKRIDT}}
3. {{TREDJE SKRIDT}}

---

## Risici

| Risiko | Sandsynlighed | Konsekvens | Afbødning |
|--------|--------------|------------|-----------|
| {{RISIKO}} | Høj/Medium/Lav | {{KONSEKVENS}} | {{HANDLING}} |

---

## Definition of done

- [ ] {{TESTBAR BETINGELSE}}
- [ ] `tsc --noEmit` clean
- [ ] {{N}} nye tests, alle grønne
