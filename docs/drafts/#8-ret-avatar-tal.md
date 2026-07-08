---
id: "#8"
title: "Ret avatar-systemprompt-optælling i README/AGENTS.md"
fase: "C"
sprint: "TBD"
status: draft
prioritet: "P2"
deps: []
blocks: []
oprettet: "2026-07-01"
---

---

## Hvad & Hvorfor

README/AGENTS.md's "Kendte mangler"-tabel siger "23 avatar-systemprompts
mangler". Faktisk optælling af `Avatar/agents/` viser 26 eksisterende
systemprompts. Tallet er forældet, ikke et reelt arbejdshul.

---

## Done ser sådan ud

README/AGENTS.md's "Kendte mangler"-tabel matcher en faktisk, dateret optælling.

---

## Teknisk scope (foreløbigt)

- [ ] Optæl `Avatar/agents/` (eller tilsvarende sti) præcist
- [ ] Sammenlign mod den fulde liste af 26+ personaer nævnt i README's agent-roster
- [ ] Ret tallet og fjern eventuelle nu-irrelevante opgaver fra "Kendte mangler"

---

## Åbne spørgsmål før aktivering

- [ ] Er der personaer i roster-listen der reelt IKKE har en systemprompt (dvs. er der et ægte, mindre hul under det forkerte tal)?

---

## Blocker / noter

2026-07-01: Lav kompleksitet, isoleret — kan flyttes til `docs/active/` og
lukkes hurtigt, uafhængigt af runtime-beslutningen.
