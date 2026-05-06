# Agent Harness — Roadmap & Åbne Opgaver

> Oprettet: 2026-05-06  
> Projekt: `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør`  
> Repo: https://github.com/Biyocon/CustomAgents

---

## ✅ Færdigt

| # | Opgave | Status | Dato |
|---|--------|--------|------|
| 1 | Sikker opstart — scan eksisterende struktur og git-status | ✅ Done | 2026-05-06 |
| 2 | Installer mattpocock/skills under `.agents/vendor/` | ✅ Done | 2026-05-06 |
| 3 | Installer andrej-karpathy-skills under `.agents/vendor/` | ✅ Done | 2026-05-06 |
| 4 | Scan Avatar-map og identificer agenter/personaer | ✅ Done | 2026-05-06 |
| 5 | Scan Open source og _tooling (topniveau) | ✅ Done | 2026-05-06 |
| 6 | Opdatere README.md med fuld kontekst og vision | ✅ Done | 2026-05-06 |
| 7 | Opdatere DESIGN.md med arkitektur og prompts | ✅ Done | 2026-05-06 |
| 8 | Opdatere PROMPT.md med systemprompt og master task prompt | ✅ Done | 2026-05-06 |
| 9 | Oprette Brain-mappe (context, glossary, assumptions, open-questions, ADR, maps, runbooks) | ✅ Done | 2026-05-06 |
| 10 | Oprette 14 Banedanmark-subagents under `.agents/agents/` | ✅ Done | 2026-05-06 |
| 11 | Kuratere 29 skills under `.agents/skills/` | ✅ Done | 2026-05-06 |
| 12 | Oprette `.agents/registry.yaml` | ✅ Done | 2026-05-06 |
| 13 | Oprette 4 PowerShell-scripts (audit, install, generate-index, validate) | ✅ Done | 2026-05-06 |
| 14 | Kombi-indhold repræsenteret i README.md via GitHub-henvisninger | ✅ Done | 2026-05-06 |

---

## ⏳ Åbne opgaver

### Fase 6 — Avatar-prompts og systemprompts

| # | Opgave | Status | Noter |
|---|--------|--------|-------|
| 15 | **Opdatere `0_avatar_generatio_prompt.txt`** — konsolider indhold fra `1_Prompt_custom_12_avatars.md` | ⏳ Pending | Lav backup før ændring |
| 16 | **Oprette systemprompt-filer** for alle 26+ IQRA-avatarer (`System_Prompt_Agent_<Navn>_<Rolle>.txt`) | ⏳ Pending | Tilpasse efter mønster fra Yunus-prompten |

**Identificerede avatarer der mangler systemprompts:**

| # | Navn | Rolle | Accent |
|---|------|-------|--------|
| 1 | Abdi Asis | Technical Product Manager | violet |
| 2 | Abdisalam | Stærkstrømsingeniør | gold |
| 3 | Abdullahi | Data Engineer | green |
| 4 | Ahmad | Sektionschef / Strategic Engineering Leader | emerald |
| 5 | Ali | Jobrådgiver | sky |
| 6 | Bamse | Pædagog | amber |
| 7 | Bodjo | Fodboldagent | forest |
| 8 | Bojang | Fodboldagent | lime |
| 9 | Hamsa | Afløbsingeniør | aqua |
| 10 | Hassan | Anlægsingeniør | brown |
| 11 | Hassan | Fagprojektleder | bluegray |
| 12 | Ifrah | Farmaceut | mint |
| 13 | Joël Mulongo | Udbudskonsulent / Udbudsjurist | indigo |
| 14 | Liban | Sales Specialist | orange |
| 15 | Mehtap | Udbudskonsulent | rose |
| 16 | Mohammad | Udbudskonsulent | cyan |
| 17 | Qanac | Læge | green |
| 18 | Sabina | Udbudskonsulent / Chefkonsulent | magenta |
| 19 | Said | Anlægsingeniør | steel |
| 20 | Shamso | Socialrådgiver | purple |
| 21 | Sharmarke | Maler | coral |
| 22 | Siamak | Folkeskolelærer | teal |
| 23 | Sibqah | Finance Analytics Specialist | emerald |
| 24 | The Game | Elektriker | yellow |
| 25 | William | Udbudskonsulent | navy |
| 26 | Yunus | Udbudskonsulent | blue |

---

### Fase 7 — Færdiggøre 4 FORELØBIGE agenter

| # | Agent | Status | Mangler |
|---|-------|--------|---------|
| 27 | `udbudskonsulent` | ⏳ FORELØBIG | `profile.md`, `skills.yaml`, fuld agentprofil |
| 28 | `projektleder` | ⏳ FORELØBIG | `profile.md`, `skills.yaml`, fuld agentprofil |
| 29 | `byggeleder-tilsyn` | ⏳ FORELØBIG | `profile.md`, `skills.yaml`, fuld agentprofil |
| 30 | `interface-manager` | ⏳ FORELØBIG | `profile.md`, `skills.yaml`, BaneByg-skills (BBTR, BBE, BKP) |

---

### Fase 8 — Udfylde 6 FORELØBIGE domæne-skills

| # | Skill | Status | Mangler |
|---|-------|--------|---------|
| 31 | `banebyg` | ⏳ FORELØBIG | Konkret indhold til `references/bbtr.md`, `references/bbe.md`, `references/bkp.md` |
| 32 | `bdk-brand-governance` | ⏳ FORELØBIG | Designguide-indhold til logo, farver, typografi |
| 33 | `bdk-gdpr-praksis` | ⏳ FORELØBIG | Juridiske retningslinjer for GDPR i jernbaneprojekter |
| 34 | `bdk-legal-mapping` | ⏳ FORELØBIG | Lov- og regelkrav for jernbaneprojekter |
| 35 | `shared-docx` | ⏳ FORELØBIG | Workflow til Word-dokumenter |
| 36 | `shared-quality` | ⏳ FORELØBIG | Kvalitetskriterier for leverancer |

> **Regel:** Opfind ikke konkrete Banedanmark-regler uden kilde. Placeholders skal markeres tydeligt i `assumptions.md` og `skill-map.md`.

---

### Fase 9 — Validering og slutrapport

| # | Opgave | Status |
|---|--------|--------|
| 37 | Kør `.agents/scripts/validate-harness.ps1` | ⏳ Pending |
| 38 | Lav `.agents/reports/validation_report.md` | ⏳ Pending |
| 39 | Lav `.agents/reports/migration-plan/final_harness_report.md` | ⏳ Pending |
| 40 | Dokumentér antagelser, risici og anbefalinger til global promovering (`C:\Users\Biyocon`) | ⏳ Pending |

---

## Kendte antagelser

- `Kombi/` findes ikke lokalt — indholdet er repræsenteret via GitHub-henvisninger i README.md.
- 23 avatarer mangler individuelle systemprompt-filer.
- 4 agenter er FORELØBIG og afventer kilde-materiale.
- 6 domæne-skills er FORELØBIG og afventer kilde-dokumenter.
- `.vscode/.codex/` bevares som aktiv runtime indtil `.agents/` er fuldt valideret.

---

## Næste beslutning

Hvilken fase skal igangsættes først?

- **A)** Fase 6 — Avatar-prompts og systemprompts (26+ filer)
- **B)** Fase 7 — Færdiggøre 4 FORELØBIGE agenter
- **C)** Fase 8 — Udfylde 6 FORELØBIGE domæne-skills
- **D)** Fase 9 — Køre validering og lave slutrapport
