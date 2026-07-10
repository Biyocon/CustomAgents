---
id: "#11"
title: "Fjern arkiverede agenter fra aktiv roster + ret council-chairman + registrér Higgsfield-skills"
fase: "A"
sprint: "A-2"
status: active
prioritet: "P1"
deps:
  - "#1"
blocks:
  - "#3"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-09"
---

---

## Hvad & Hvorfor

Uafhængig QA (codex-agent, 2026-07-01) fandt tre konkrete, verificerede fejl der
gør at `validate-harness.ps1` fejler og at agent-/skill-tal ikke matcher
virkeligheden:

1. 10 agenter i `archive/avatarless-agents/` optræder stadig som aktive entries
   i `.vscode/.codex/agents/agent-roster.json` (bekræftet: alle 10 id'er findes,
   1 forekomst hver, ud af rosterens 37 total).
2. `council-chairman` er listet i arkiv-blokken i `.agents/registry.yaml`, selvom
   mappen `.agents/agents/council-chairman/` findes aktivt.
3. 4 Higgsfield-skills findes i `.agents/skills/` men i ingen af de 4 registries.

---

## Done ser sådan ud

`agent-roster.json` indeholder kun reelt aktive agenter (27, ikke 37).
`council-chairman` er listet som aktiv, ikke arkiveret, i `.agents/registry.yaml`.
De 4 Higgsfield-skills er registreret i det canonical registry (afgjort af #1/#2).

---

## Teknisk scope

- [x] Fjern de 10 arkiverede agent-entries fra `.vscode/.codex/agents/agent-roster.json` (2026-07-09, commit `8da1883c`; roster 37 → 27)
- [x] Flyt `council-chairman`-entry ud af arkiv-blokken i `.agents/registry.yaml` (allerede korrekt placeret siden commit `1ea48fba`; verificeret)
- [x] Tilføj de 4 Higgsfield-skills til det canonical registry (2026-07-09; hele `skills[]` re-genereret til 79 entries fra `.agents/skills/`, inkl. alle 4 higgsfield-*)
- [x] Kør `validate-harness.ps1` igen og bekræft at "10 manglende systemprompt-filer"-fejlen forsvinder (Fejl: 0 efter roster-oprydning)

---

## Relevante filer

- `.vscode/.codex/agents/agent-roster.json`
- `.agents/registry.yaml` (linje ~100-177, arkiv-blokken)
- `archive/avatarless-agents/`
- `.agents/skills/higgsfield-generate/`, `-marketplace-cards/`, `-product-photoshoot/`, `-soul-id/`

---

## Acceptkriterie

- [x] `agent-roster.json` har 27 entries, ingen matcher `archive/avatarless-agents/`
- [x] `council-chairman` har ikke `archived_reason`-felt og står uden for arkiv-blokken
- [x] Alle 4 Higgsfield-skills har en registry-entry
- [x] `validate-harness.ps1` kører uden "missing systemprompt"-fejl relateret til de 10 arkiverede agenter

**Status 2026-07-09: alle scope-punkter og acceptkriterier opfyldt.** Klar til at flytte til
`docs/done/` (afventer at done/-mappen oprettes, jf. docs/drafts/#12-diskussionen). Bemærk separat,
IKKE-blokerende forhold uden for denne tickets scope: `council-chairman` mangler i `agent-roster.json`
(er en avatarløs meta-agent — Avatar-baseret roster passer dårligt; se open-questions/næste session).

---

## Blocker / noter

2026-07-01: Oprettet efter uafhængig QA-krydstjek (codex-agent) + direkte
verificering mod filsystemet. Se `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md`
findings A-5, A-6, A-7. Afventer #1 for at vide hvilket registry der er canonical
mål for Higgsfield-registreringen.
