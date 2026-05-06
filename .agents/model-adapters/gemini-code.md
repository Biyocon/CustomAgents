# Gemini Code Adapter

## Modelnavn
Gemini Code (Google / IDE-plugin)

## Kontekstindlæsning
- Læser `AGENTS.md` hvis filen findes i projektrod.
- Understøtter `.gemini/` mappe med `instructions.md` og custom rules.
- Har indbygget context-window på op til 1M tokens (afhængig af model).

## Kendte begrænsninger
- Lokal skill-arkitektur er ikke standardiseret; kræver manuel kopiering.
- Begrænset dansk sprogforståelse i ældre versioner.
- IDE-plugin giver ikke direkte adgang til filsystem-operationer som CLI-agenter.

## Anbefalede settings
```json
{
  "model": "gemini-2.5-pro",
  "temperature": 0.2,
  "max_tokens": 8192
}
```

## Links
- Projektets AGENTS.md: `../../AGENTS.md`
