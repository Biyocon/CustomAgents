# Codex Adapter

## Modelnavn
OpenAI Codex (CLI / IDE-integration)

## Kontekstindlæsning
- Læser `AGENTS.md` automatisk ved opstart, hvis filen findes i projektrod eller `.vscode/.codex/`.
- CLI-varianten (`codex`) bruger `--system-prompt` eller indbygget projektkontekst fra `CLAUDE.md` / `AGENTS.md`.
- Forstår YAML-frontmatter i agent-filer og skill-aktivering via `SKILL.md`.

## Kendte begrænsninger
- Har ikke direkte adgang til lokale skills-systemer (Kræver manuel kopiering af prompts).
- CLI-output kan være mere verborøst end andre modeller.
- Begrænset til OpenAI's model-familie (GPT-4o / o1 / o3).

## Anbefalede settings
```json
{
  "model": "gpt-4o",
  "temperature": 0.2,
  "max_tokens": 4096
}
```

## Links
- Projektets AGENTS.md: `../../AGENTS.md`
- Aktiv runtime: `.vscode/.codex/`
