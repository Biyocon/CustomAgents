# Qwen Code Adapter

## Modelnavn
Qwen Code (Alibaba Cloud / IDE-plugin)

## Kontekstindlæsning
- Læser `AGENTS.md` via IDE-workspace scanning ( VS Code / JetBrains ).
- Understøtter `.qwen/` mappe til lokale prompts og regler.
- Kan indlæse skills som Markdown-filer via plugin-indstillinger.

## Kendte begrænsninger
- Primært optimeret til kode-generering; mindre stærk i dansk sprog.
- Begrænset tooling i forhold til CLI-agenter (ingen direkte Shell-adgang).
- Kræver manuel synkronisering af skills mellem IDE-sessioner.

## Anbefalede settings
```json
{
  "model": "qwen-coder-32b",
  "temperature": 0.2,
  "max_tokens": 4096
}
```

## Links
- Projektets AGENTS.md: `../../AGENTS.md`
