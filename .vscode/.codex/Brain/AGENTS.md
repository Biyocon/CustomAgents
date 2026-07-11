# Brain

> **FROSSET (PR E, 2026-07-11):** Dette runtime-Brain er transitional legacy og må IKKE længere
> bruges til at gemme varig viden. Canonical hukommelse er `.agents/brain/`; politik:
> `docs/architecture/memory-governance.md`. Unikke artefakter herfra er landet i canonical.
> Laget læses fortsat af den aktive runtime, men erstattes/genereres ved PR F.

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
