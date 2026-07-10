---
id: "#9"
title: "QA-sikkerhedsoprydning: vendor-gitlink og tracked API-nøgle-placeholder"
fase: "F"
sprint: "TBD"
status: done
prioritet: "P1"
deps: []
blocks: []
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-09"
lukket: "2026-07-09"
---

---

## Hvad & Hvorfor

`QA_2026-06-07_CustomAgents.md` identificerede (1) en defekt vendor-gitlink
uden tilhørende `.gitmodules`, og (2) en tracked temp-fil med en
API-nøgle-placeholder. Ingen bekræftet reel lækage, men praksis bør strammes
op før global promovering af harnesset til andre projekter.

---

## Done ser sådan ud

`git submodule status` fejler ikke. Ingen tracked fil indeholder
nøgle-lignende strenge (verificeret ved grep-mønster for typiske API-nøgle-formater).

---

## Teknisk scope (foreløbigt)

- [x] Identificér den specifikke vendor-gitlink-fejl og enten tilføj korrekt `.gitmodules` eller konvertér til almindeligt tracked indhold — **LØST 2026-07-09:** `.agents/vendor/mattpocock-skills/` er nu 115 almindelige trackede filer (committet `31f74fe8`), 0 gitlinks (mode 160000) i indeks, `git submodule status` tom, intet `.gitmodules` nødvendigt.
- [x] Find den specifikke temp-fil med API-nøgle-placeholder og fjern/erstat den — **LØST 2026-07-09:** `temp/codex-config-before-mcp-cleanup-20260509-133205.toml` (indeholdt `YOUR_API_KEY`-placeholder) blev slettet i temp/-oprydningen (commit `aa86dffc`).
- [x] Kør en grep-baseret sikkerhedsscan for lignende mønstre andre steder i repoet — **UDFØRT 2026-07-09:** scan over alle trackede filer for `sk-`, `AKIA`, `ghp_`, `xox*`, PRIVATE KEY-blokke. Eneste hit: `.vscode/archive/upstream-skills/skills/kubernetes-specialist/references/configuration.md` — bekræftet dokumentations-eksempler (`sk-1234567890abcdef`, trunkerede `...`-nøgler), ingen reelle secrets.

---

## Åbne spørgsmål før aktivering

- [x] Er den fundne "vendor-gitlink" faktisk en git submodule-reference? — Nej mere: konverteret til almindeligt tracked indhold 2026-07-09.
- [x] Præcis filsti for temp-filen med API-nøgle-placeholder — bekræftet (`temp/codex-config-before-mcp-cleanup-20260509-133205.toml`, jf. `QA_2026-06-07_CustomAgents.md` linje 161), nu slettet.

**Status 2026-07-09: alle punkter løst.** Begge oprindelige problemer blev utilsigtet fikset
under sessionens temp-oprydning og vendor-commit. Sikkerhedsscan bekræfter ingen reelle secrets.
Flyttet til `docs/done/`.

---

## Blocker / noter

2026-07-01: Ingen tekniske afhængigheder, men bør prioriteres hurtigt af
sikkerhedshensyn selvom den er sat som draft — flyt til `docs/active/` ved
næste sprint-planlægning.
