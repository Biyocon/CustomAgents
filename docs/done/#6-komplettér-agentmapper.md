---
id: "#6"
title: "Komplettér de 36 ufuldstændige mapper i .agents/agents/"
fase: "C"
sprint: "C-2"
status: done
prioritet: "P1"
deps:
  - "#1"
  - "#2"
blocks:
  - "#10"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-10"
lukket: "2026-07-10"
---

> **RE-SCOPE + LUKKET 2026-07-10 (projektejer-beslutning).** Den oprindelige acceptkriterie
> "alle mapper har profile.md + skills.yaml + AGENTS.md + avatar.md" (4-fil-mønster) er **forladt**,
> fordi den modsiger den senere canonical schema (`.agents/schema/agent-profile.schema.json`), som
> eksplicit konsoliderer alt — inkl. system prompt — i **profile.md** og markerer separate filer som
> target-deprecated. Alle 28 persona-mapper har allerede den komplette 2-fil-kontrakt (profile.md +
> skills.yaml), 0 `{{PLACEHOLDER}}`-markører, og avatar-reference i profile.md-frontmatter. At tilføje
> 56 separate AGENTS.md/avatar.md-filer ville duplikere eksisterende info og bevæge sig VÆK fra det
> canonical mål. Se re-scopet acceptkriterie nedenfor.

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

## Teknisk scope (re-scopet 2026-07-10)

- [x] Inventar af `.agents/agents/` (2026-07-10): 28 mapper, **alle** med profile.md + skills.yaml; 0 med det gamle 4-fil-mønster; 0 med `{{PLACEHOLDER}}`; alle 28 har `avatar:` i profile.md-frontmatter.
- [x] Beslutning: 2-fil-kontrakten (profile.md + skills.yaml) er den komplette persona-kontrakt. 4-fil-mønsteret (AGENTS.md + avatar.md) forlades — det modsiger canonical schema, der konsoliderer i profile.md.
- [x] De 4 FORELØBIG Banedanmark-rolleagenter (som dette ticket henviste til som "kerneagenter") er komplettéret separat i ticket #5 (i role-laget `.vscode/.codex/agents/banedanmark/`).
- [ ] ~~Generér AGENTS.md/avatar.md for hver mappe~~ — droppet, se re-scope-note øverst.

---

## Relevante filer

- `.agents/agents/*` (36 mapper)
- `Avatar/` (kildemateriale til systemprompts)
- `.agents/brain/maps/agent-map.md`
- `.agents/schema/agent-profile.schema.json` (valideringsskema for hvad en komplet profil skal indeholde)

---

## Acceptkriterie (re-scopet 2026-07-10)

- [x] ~~Alle 37 mapper har profile.md + skills.yaml + AGENTS.md + avatar.md~~ **Erstattet:** alle 28 persona-mapper har den komplette 2-fil-kontrakt (profile.md + skills.yaml) jf. canonical schema-retningen; avatar-info er i profile.md-frontmatter.
- [x] Validate-Harness-Unified.ps1 (Sektion E/G) rapporterer 0 mapper med manglende filer (mod 2-fil-kontrakten)
- [x] Ingen fil i `.agents/agents/` indeholder uudfyldte `{{PLACEHOLDER}}`-markører (verificeret: 0)

**Status 2026-07-10: lukket via re-scope.** Persona-laget er komplet mod den canonical kontrakt.
En eventuel fremtidig ændring af fil-mønsteret afhænger af den uafklarede role-vs-persona-beslutning
(PR D/F) — ikke af dette ticket. Klar til `docs/done/`.

---

## Blocker / noter

2026-07-01: Stor batch-task — overvej at splitte i mindre tickets per
agent-gruppe (fx "IQRA udbudskonsulenter", "teknik-roller", "sundhed/rådgivning")
hvis den viser sig for stor til én sprint. Afventer #1 og #2.
