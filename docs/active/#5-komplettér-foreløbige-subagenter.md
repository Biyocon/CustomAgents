---
id: "#5"
title: "Komplettér de 4 FORELØBIG Banedanmark-subagenter"
fase: "C"
sprint: "C-1"
status: active
prioritet: "P1"
deps:
  - "#1"
blocks:
  - "#10"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-01"
---

---

## Hvad & Hvorfor

Udbudskonsulent, Projektleder, Byggeleder/Tilsyn og Interface Manager er
markeret FORELØBIG med 16–22 linjers profiler og "Ingen source .md fundet".
Disse er 4 af de 14 kerne-Banedanmark-roller — deres ufuldstændighed er en
synlig kvalitetsbrist i harnessets primære værditilbud.

---

## Done ser sådan ud

Alle 4 roller har en profile.md på niveau med de øvrige 10 DRAFT-roller
(fyldigt kildemateriale, ikke placeholder), og status opgraderes fra FORELØBIG
til mindst DRAFT.

---

## Teknisk scope

- [ ] Identificér eller indsaml kildemateriale for hver af de 4 roller (jf. `Funktions- og stillingsbeskrivelser/`)
- [ ] Skriv profile.md + skills.yaml i det canonical runtime-lag (afgjort af #1)
- [ ] Opdatér `README.md`s agent-roster-tabel med ny status

---

## Relevante filer

- `.agents/agents/udbudskonsulent/`, `.agents/agents/projektleder/`, `.agents/agents/byggeleder-tilsyn/`, `.agents/agents/interface-manager/` (eller `.vscode/.codex/agents/`-modstykker, afhængigt af #1)
- `Funktions- og stillingsbeskrivelser/`
- `README.md` (agent-roster-tabellen)

---

## Acceptkriterie

- [ ] Alle 4 roller har profile.md > 60 linjer med reelt, sporbart kildemateriale
- [ ] Ingen af de 4 er længere markeret FORELØBIG i README.md
- [ ] `.agents/schema/agent-profile.schema.json`-validering består for alle 4

---

## Blocker / noter

2026-07-01: Kan køre parallelt med #6, men afventer #1 for at vide hvilket
runtime-lag der skal redigeres.
