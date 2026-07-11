---
id: "#8"
title: "Ret avatar-systemprompt-optælling i README/AGENTS.md"
fase: "C"
sprint: "TBD"
status: done
prioritet: "P2"
deps: []
blocks: []
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-10"
lukket: "2026-07-10"
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

- [x] Optæl `Avatar/agents/` præcist (2026-07-10): **27 systemprompt-filer** + **27 avatar-billeder** i `Avatar/`.
- [x] Sammenlign mod roster: agent-roster.json har 27 entries, **alle med avatar-felt** — perfekt 1:1-match.
- [x] Ret tallet i README.md + AGENTS.md ("Kendte mangler"-tabellerne); de 3 nu-løste rækker (avatar-tal, 4 FORELØBIG-agenter=#5, 6 skills=#7) markeret ✅.

---

## Åbne spørgsmål før aktivering

- [x] Er der personaer i roster uden systemprompt? **Nej** — 27 roster-entries ↔ 27 systemprompts ↔ 27 avatar-billeder, 1:1. Intet ægte hul under det forkerte tal. De 10 avatarløse blev arkiveret (PR #14), ikke efterladt som mangler.

**Status 2026-07-10: alle punkter opfyldt.** Klar til `docs/done/`.

---

## Blocker / noter

2026-07-01: Lav kompleksitet, isoleret — kan flyttes til `docs/active/` og
lukkes hurtigt, uafhængigt af runtime-beslutningen.
