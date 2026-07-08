---
id: "#2"
title: "Reconciliér registry.yaml (rod) og .agents/registry.yaml"
fase: "A"
sprint: "A-2"
status: active
prioritet: "P0"
deps:
  - "#1"
blocks:
  - "#3"
  - "#6"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-01"
---

---

## Hvad & Hvorfor

To filer med samme navn (`registry.yaml`) og formål (central konfiguration)
eksisterer i repoet uden at være synkroniseret (241 vs. 223 linjer, næsten
uden overlap i skill-sæt). Dette er en klassisk kilde til stille fejl: en
opdatering i den ene fil har ingen effekt hvis et script/en agent læser den anden.

---

## Done ser sådan ud

Enten findes der kun én `registry.yaml` i hele repoet, eller de to filer har
tydeligt adskilte, selvforklarende navne (fx `registry.root.yaml` /
`registry.agents.yaml`) med en kommentar i toppen af hver der forklarer forholdet
til den anden.

---

## Teknisk scope

- [ ] Diff `registry.yaml` (rod) mod `.agents/registry.yaml` linje for linje
- [ ] Afgør, baseret på #1's runtime-beslutning, om reconciliation betyder merge eller omdøbning
- [ ] Opdatér `scripts/Export-Registry.ps1`, `scripts/generate-agent-index.ps1` (eller `.agents/scripts`-modstykker) til at pege på det/de korrekte fil(er)
- [ ] Kør validerings-scriptet og bekræft det læser det rigtige registry

---

## Relevante filer

- `registry.yaml`
- `.agents/registry.yaml`
- `docs/architecture/registry-reconciliation.md`
- `scripts/Export-Registry.ps1`
- `.agents/scripts/generate-agent-index.ps1`

---

## Acceptkriterie

- [ ] Kun ét registry-navn eksisterer, ELLER begge er omdøbt til at være utvetydige
- [ ] Alle scripts der læser registry kører fejlfrit efter ændringen
- [ ] `docs/architecture/registry-reconciliation.md`'s 10 uafklarede punkter er enten løst eller eksplicit nedskrevet som "afventer" med ny ejer/frist

---

## Blocker / noter

2026-07-01: Afventer #1 (runtime-beslutning), da valget af reconciliation-strategi
afhænger af hvilket lag der bliver canonical.
