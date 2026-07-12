# Skills-system

## Hvad er en skill?
En skill er en genanvendelig evne — en selvstændig mappe med en `SKILL.md`-fil, der indeholder
instruktioner, eksempler og referencemateriale.

## Struktur
```
.agents/skills/
├── <skill-navn>/
│   └── SKILL.md
```

## Sådan tilføjer du en ny skill
1. Opret mappen `.agents/skills/<skill-navn>/`
2. Skriv `SKILL.md` med YAML-frontmatter: `name:` (= mappenavn) og `description:` (engelsk,
   med eksplicit trigger — "Use this skill when …", max 1024 tegn) + dansk body
   (Formål, Fremgangsmåde, Referencer; ved tyndt kildegrundlag: `## Verifikationsstatus`).
3. Tilføj skill-id'et til `.agents/registry.yaml`s skills-liste.
4. Kør `validate-schemas.py` (0 overtrædelser) — gating-hooken håndhæver det ved commit.

## Aktive skills — én kanonisk kilde, ingen manuel liste her
Skill-oversigten vedligeholdes IKKE i dette dokument (en manuel tabel rådner). Kanoniske kilder:
- `.agents/registry.yaml` (skills-listen) og den genererede runtime-registry (rige entries)
- Harness-validatorens metrik-linje "Aktive skills" (`scripts/Validate-Harness-Unified.ps1`)

---
*Se projektets AGENTS.md for globale konventioner.*
