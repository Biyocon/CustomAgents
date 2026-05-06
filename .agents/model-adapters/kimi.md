# Kimi Adapter

## Modelnavn
Kimi Code CLI (Moonshot AI)

## Kontekstindlæsning
- Læser `AGENTS.md` i projektrod og undermapper rekursivt.
- Bruger skills-systemet under `.claude/skills/` eller projekt-specifikke skills.
- Understøtter native `Shell`, `ReadFile`, `WriteFile`, `StrReplaceFile` m.m.

## Kendte begrænsninger
- Kontekstvinduet er stort (~2M tokens), men long-context reasoning kan være langsommere.
- Skills skal følge Anthropic/Claude-formatet for bedste kompatibilitet.
- Har ikke indbygget git-integration; skal bruge Shell.

## Anbefalede settings
```json
{
  "model": "kimi-k1.5",
  "temperature": 0.3,
  "max_tokens": 8192
}
```

## Links
- Projektets AGENTS.md: `../../AGENTS.md`
- Skills: `.agents/skills/`
