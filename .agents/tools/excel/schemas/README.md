# tools/excel/schemas/

> Standard kolonnedefinitioner til Excel-input/output.

## Load list schema

| Kolonne | Type | Påkrævet | Beskrivelse |
|---------|------|----------|-------------|
| Tag nr. | string | ja | Udstyrets tag-nummer |
| System | string | ja | Systemgruppe |
| Område | string | nej | Fysisk placering |
| Udstyrstype | string | ja | Type af udstyr |
| Beskrivelse | string | ja | Kort beskrivelse |
| Spænding | int | ja | V |
| Faser | string | ja | 1F / 3F |
| Installeret effekt | float | ja | kW |
| Beregnet strøm | float | nej | A |
