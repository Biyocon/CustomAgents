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
sidst_opdateret: "2026-07-09"
---

---

## Hvad & Hvorfor

Skill-antallet rapporteres som 29 (README/AGENTS.md), 73 vs. 33
(`docs/architecture/registry-reconciliation.md`), og 188 ved faktisk
filoptælling (plus 1101 arkiverede). Ingen af disse tal er verificeret som
"det rigtige". Så længe dette er uafklaret, kan intet "X skills implementeret"-
udsagn i dokumentationen tages for pålydende.

**Status 2026-07-09:** Selve tvetydigheden (`.codex` vs `.agents` som to
adskilte skill-sæt) er løst — projektejer flyttede hele `.vscode/.codex/skills/`
ind i `.agents/skills/` (permanent). Der er nu kun ét reelt skill-sæt at tælle:
`.agents/skills/` = **79 skills** (verificeret ved direkte filoptælling,
`ls -d .agents/skills/*/ | wc -l`, 2026-07-09). Se
`docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md` og commit `ff2e3907`.
Den tekniske del af scopet nedenfor (lås tallet til ét scripts output) er
**ikke** udført endnu — kun selve datakilde-tvetydigheden er væk.

---

## Done ser sådan ud

Ét script udskriver ét tal for "antal aktive, kuraterede skills" — og alle
dokumenter (README, AGENTS.md) refererer til scriptets outputdato i stedet for
at hardkode et tal.

---

## Teknisk scope

- [x] Definér præcist hvad der tæller som "en skill" (2026-07-09: kun `.agents/skills/` — `.codex/skills/` er tømt, kun `banebyg` tilbage bevidst)
- [ ] Skriv/opdatér `scripts/Validate-Harness-Unified.ps1` (afløste `Validate-AgentHarness.ps1`/`validate-harness.ps1`, se ticket-historik) til at tælle og udskrive antallet i ét samlet resume-tal (i dag: individuelle OK/WARN-linjer pr. skill, ikke ét total-tal)
- [ ] Opdatér README.md og AGENTS.md til at referere scriptets output i stedet for et hardkodet tal
- [x] Fjern eller markér som "historisk" det modstridende tal i `docs/architecture/registry-reconciliation.md` (2026-07-09)

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
