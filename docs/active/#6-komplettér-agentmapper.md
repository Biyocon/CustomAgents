---
id: "#6"
title: "Komplettér de 36 ufuldstændige mapper i .agents/agents/"
fase: "C"
sprint: "C-2"
status: active
prioritet: "P1"
deps:
  - "#1"
  - "#2"
blocks:
  - "#10"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-01"
---

---

## Hvad & Hvorfor

**Korrigeret 2026-07-01 (direkte verificeret):** 0 af 28 mapper i `.agents/agents/`
har den fulde filpakke (profile.md + skills.yaml + AGENTS.md + avatar.md) —
alle 28 har præcis profile.md+skills.yaml (2/4), ingen har AGENTS.md eller
avatar.md. (Tidligere stod her "1 af 37", som var en sammenblanding af
mappeantallet i `.agents/agents/` (28) og entry-antallet i
`.vscode/.codex/agents/agent-roster.json` (37) — rettet efter uafhængig
QA-krydstjek.) Hvis `.agents/` vælges som canonical runtime i #1, er dette den
største resterende strukturelle mangel.

---

## Done ser sådan ud

Hver af de 28 mapper i `.agents/agents/` har alle fire filer, med reelt indhold
(ikke placeholder-tekst) hentet fra tilsvarende kildemateriale i `Avatar/` og
`Funktions- og stillingsbeskrivelser/`.

---

## Teknisk scope

- [ ] Lav en komplet liste over de 36 mapper og hvilke af de 4 filer der mangler i hver
- [ ] Prioritér de 14 Banedanmark-kerneagenter først (4 er allerede FORELØBIG, se separat håndtering i README's egen liste), derefter de resterende IQRA-avatar-personaer
- [ ] For hver mappe: udled profile.md/skills.yaml/AGENTS.md/avatar.md fra `Avatar/System_Prompt_Agent_*.txt` og `.agents/brain/maps/agent-map.md`
- [ ] Opdatér `.agents/brain/maps/agent-map.md` løbende

---

## Relevante filer

- `.agents/agents/*` (36 mapper)
- `Avatar/` (kildemateriale til systemprompts)
- `.agents/brain/maps/agent-map.md`
- `.agents/schema/agent-profile.schema.json` (valideringsskema for hvad en komplet profil skal indeholde)

---

## Acceptkriterie

- [ ] Alle 37 mapper har profile.md + skills.yaml + AGENTS.md + avatar.md
- [ ] `.agents/scripts/validate-harness.ps1` rapporterer 0 mapper med manglende filer
- [ ] Ingen fil indeholder uudfyldte `{{PLACEHOLDER}}`-markører

---

## Blocker / noter

2026-07-01: Stor batch-task — overvej at splitte i mindre tickets per
agent-gruppe (fx "IQRA udbudskonsulenter", "teknik-roller", "sundhed/rådgivning")
hvis den viser sig for stor til én sprint. Afventer #1 og #2.
