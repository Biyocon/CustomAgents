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
sidst_opdateret: "2026-07-01"
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

- [ ] Fjern de 10 arkiverede agent-entries fra `.vscode/.codex/agents/agent-roster.json`
- [ ] Flyt `council-chairman`-entry ud af arkiv-blokken i `.agents/registry.yaml`
- [ ] Tilføj de 4 Higgsfield-skills til det canonical registry
- [ ] Kør `validate-harness.ps1` igen og bekræft at "10 manglende systemprompt-filer"-fejlen forsvinder

---

## Relevante filer

- `.vscode/.codex/agents/agent-roster.json`
- `.agents/registry.yaml` (linje ~100-177, arkiv-blokken)
- `archive/avatarless-agents/`
- `.agents/skills/higgsfield-generate/`, `-marketplace-cards/`, `-product-photoshoot/`, `-soul-id/`

---

## Acceptkriterie

- [ ] `agent-roster.json` har 27 entries, ingen matcher `archive/avatarless-agents/`
- [ ] `council-chairman` har ikke `archived_reason`-felt og står uden for arkiv-blokken
- [ ] Alle 4 Higgsfield-skills har en registry-entry
- [ ] `validate-harness.ps1` kører uden "missing systemprompt"-fejl relateret til de 10 arkiverede agenter

---

## Blocker / noter

2026-07-01: Oprettet efter uafhængig QA-krydstjek (codex-agent) + direkte
verificering mod filsystemet. Se `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md`
findings A-5, A-6, A-7. Afventer #1 for at vide hvilket registry der er canonical
mål for Higgsfield-registreringen.
