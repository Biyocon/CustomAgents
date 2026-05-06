# Domain Docs

## Layout

Dette projekt bruger et single-context layout med Brain som aktivt domænelag:

- `.vscode/.codex/Brain/context.md`
- `.vscode/.codex/Brain/operating-principles.md`
- `.vscode/.codex/Brain/source-map.md`
- `.vscode/.codex/Brain/adr/`

## For skills fra Matt Pocock

Når en skill forventer `CONTEXT.md` eller `docs/adr/`, skal agenten først læse Brain-filerne ovenfor. Hvis der senere oprettes root `CONTEXT.md`, skal den pege på Brain eller holdes synkron.

## Sprog

Brug projektets egne begreber:

- agent harness
- runtime-kerne
- adapterlag
- Brain
- subagent
- subskill
- BaneByg
- BBTR
- BBE
- BKP
