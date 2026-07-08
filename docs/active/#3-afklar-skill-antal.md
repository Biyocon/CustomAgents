---
id: "#3"
title: "Afklar det reelle skill-antal og lås metrikken til ét script"
fase: "B"
sprint: "B-1"
status: active
prioritet: "P0"
deps:
  - "#1"
  - "#2"
blocks: []
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-01"
---

---

## Hvad & Hvorfor

Skill-antallet rapporteres som 29 (README/AGENTS.md), 73 vs. 33
(`docs/architecture/registry-reconciliation.md`), og 188 ved faktisk
filoptælling (plus 1101 arkiverede). Ingen af disse tal er verificeret som
"det rigtige". Så længe dette er uafklaret, kan intet "X skills implementeret"-
udsagn i dokumentationen tages for pålydende.

---

## Done ser sådan ud

Ét script udskriver ét tal for "antal aktive, kuraterede skills" — og alle
dokumenter (README, AGENTS.md) refererer til scriptets outputdato i stedet for
at hardkode et tal.

---

## Teknisk scope

- [ ] Definér præcist hvad der tæller som "en skill" (kun `.agents/skills/` og/eller `.vscode/.codex/skills/` efter #1's beslutning? Kun kurateret lag, ikke vendor/arkiv?)
- [ ] Skriv/opdatér `scripts/Validate-AgentHarness.ps1` eller `.agents/scripts/validate-harness.ps1` til at tælle og udskrive antallet
- [ ] Opdatér README.md og AGENTS.md til at referere scriptets output i stedet for et hardkodet tal
- [ ] Fjern eller markér som "historisk" det modstridende tal i `docs/architecture/registry-reconciliation.md`

---

## Relevante filer

- `README.md` (skill-tabel-sektionen)
- `AGENTS.md`
- `docs/architecture/registry-reconciliation.md`
- `.agents/skills/`, `.vscode/.codex/skills/`

---

## Acceptkriterie

- [ ] Scriptet giver samme tal ved to på hinanden følgende kørsler
- [ ] README/AGENTS.md indeholder ikke længere et hardkodet skill-antal, men en reference til "kør [script] for aktuelt antal"
- [ ] `docs/architecture/registry-reconciliation.md` har ingen tilbageværende modstridende tal uden forklaring

---

## Blocker / noter

2026-07-01: Afventer #1 og #2, da definitionen af "en skill" afhænger af hvilket
runtime-lag der er canonical og hvilket registry der er autoritativt.
