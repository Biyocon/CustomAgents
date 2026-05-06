# Brain

`Brain` er projektets fælles hukommelses- og beslutningslag for agent-harnesset.

## Principper

- `AGENTS.md` er fælles instruktion for alle LLM-klienter.
- `.vscode/.codex/` er lokal kilde til sandhed.
- Karpathy-principperne bruges som basisadfærd: tænk før handling, hold løsningen simpel, ændr kirurgisk, verificér mod succeskriterier.
- Brain må indeholde projektviden, begreber, beslutninger og mønstre.
- Brain må ikke indeholde adgangskoder, tokens, personfølsomme oplysninger eller fortroligt materiale uden klar hjemmel.

## Læsning

Ved komplekse opgaver læses i denne rækkefølge:
1. Root `AGENTS.md`
2. `.vscode/.codex/AGENTS.md`
3. `.vscode/.codex/Brain/context.md`
4. Relevant agentprofil
5. Relevante skills

## Skrivning

Gem varig projektviden her:
- `context.md` for domænesprog og begreber
- `operating-principles.md` for arbejdsregler
- `source-map.md` for kildetyper og referenceplacering
- `adr/` for beslutninger
