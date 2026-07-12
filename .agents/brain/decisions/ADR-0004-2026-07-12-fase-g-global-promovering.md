# ADR-0004: Fase G — Promovering af harnesset til global skabelon

## Status

Accepted (udført 2026-07-12)

## Kontekst

Projektets erklærede slutmål (PROJEKT_PLAN §VISION, DEPS Fase G) var at promovere det
færdige harness til en global skabelon under brugerprofilen, så det kan genbruges i alle
fremtidige projekter. Forudsætningen — ADR-roadmap PR A–F fuldført og valideret — blev
opfyldt 2026-07-11.

To forhold krævede afvigelse fra den oprindelige runbook:

1. **Runbookens målsti `C:\Users\HMDR` var forældet** (gammel maskine). Registryens
   `promotion_target_global_path` peger på `C:\Users\Biyocon`.
2. **`C:\Users\Biyocon\.agents\` er OPTAGET**: den er brugerens delte Claude Code
   skills/plugin-hub med MasterBrain under `brain/` (junctions til vaults) og egen
   dokumenteret struktur (`STRUCTURE.md`). Naiv kørsel af runbookens kopieringstrin
   ville have overskrevet/blandet fremmed indhold (bl.a. `brain/README.md`) —
   i strid med aldrig-clobber- og entitets-isolationsreglerne.

## Beslutning

Promovér som **skabelon-undermappe** i hub'ens eget skabelonrum:

```
C:\Users\Biyocon\.agents\templates\customagents-harness\
```

- Additivt (ny mappe; eksistenstjek før skrivning — afbryder hvis den findes).
- Respekterer hub'ens egen konvention (`templates/` = genbrugelige skabelon-specs).
- **Kun generiske komponenter** (runbookens trin 2-skel): schema/ (5 JSON-skemaer),
  scripts/ (generate-runtime.py, validate-schemas.py, audit-harness.ps1),
  model-adapters/ (7 beskrivelser), brain-skeleton/ (README + runbooks),
  governance/ (memory-governance-politikken), githooks-skeleton/ (pre-commit-gaten),
  + skabelon-README med instantieringsguide.
- **Ikke promoveret** (projekt-/domænespecifikt): Banedanmark-agenter og -skills,
  personaer/Avatar, brain-indhold (context/glossary/assumptions/memory), registry-data.

## Konsekvenser

- Nye projekter instantieres fra skabelonen (guide i dens README) i stedet for at kopiere
  fra dette repo ad hoc.
- Skabelonen er envejs: opdateres ved at gentage promoveringen fra kilde-repoet;
  håndredigeres aldrig (kilde-repoet er sandheden).
- Runbooken `how-to-promote-project-harness-to-global.md` er opdateret med den faktiske
  målsti, kollisionstjekket og det udførte scope (HMDR-stien fjernet).
- Verifikation ved udførelse: 24 filer skrevet; kilde-repoets validatorer var grønne
  (0 skema-overtrædelser, --check exit 0, harness 0 fejl/0 advarsler) på commit `022f8ab0`.
