# Design & arkitektur — Agent Harness

> Denne fil dokumenterer den overordnede arkitektur, designbeslutninger og bedste praksis for agent-harnesset i projektet.
> **Sti:** `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør`

---

## Kritisk beslutning: `AGENTS.md` som fælles instruktionsfil

OpenAI beskriver `AGENTS.md` som repo-filen, hvor en agent læser instruktioner om navigation, testkommandoer og projektpraksis. Filen kan ligge i repoet eller mere globalt, og dybere `AGENTS.md`-filer kan have snævrere scope. ([OpenAI][1])

Vi bruger derfor **kun** `AGENTS.md` i uppercase. Windows-filsystemet er case-insensitive, så det opfylder praksis for både "Agents.md" og Codex-konventionen.

**Opret ikke** model-specifikke hovedinstruktionsfiler som `CLAUDE.md`, `GEMINI.md`, `CODEX.md` eller `KIMI.md`. Model-specifikke noter hører kun hjemme under `.agents/model-adapters/`.

---

## Anbefalet projektarkitektur

```text
Kvalifikationsordning Entreprenør\
│
├─ AGENTS.md
├─ PROMPT.md
├─ DESIGN.md
├─ README_AGENT_HARNESS.md
├─ README.md
│
├─ .agents\
│  ├─ registry.yaml
│  ├─ model-adapters\
│  │  ├─ codex.md
│  │  ├─ kimi.md
│  │  ├─ qwen-code.md
│  │  └─ gemini-code.md
│  │
│  ├─ agents\
│  │  ├─ interface-manager\
│  │  │  ├─ AGENTS.md
│  │  │  ├─ profile.md
│  │  │  ├─ avatar.md
│  │  │  └─ skills.yaml
│  │  ├─ udbudskonsulent\
│  │  ├─ projektleder\
│  │  ├─ dokumentcontroller\
│  │  ├─ kvalitetsspecialist\
│  │  ├─ byggeleder\
│  │  └─ ...
│  │
│  ├─ skills\
│  │  ├─ banebyg\
│  │  │  ├─ SKILL.md
│  │  │  └─ references\
│  │  │     ├─ bbtr.md
│  │  │     ├─ bbe.md
│  │  │     └─ bkp.md
│  │  ├─ karpathy-guidelines\
│  │  ├─ tdd\
│  │  ├─ to-prd\
│  │  ├─ to-issues\
│  │  ├─ grill-me\
│  │  └─ improve-codebase-architecture\
│  │
│  ├─ brain\
│  │  ├─ README.md
│  │  ├─ context.md
│  │  ├─ glossary.md
│  │  ├─ assumptions.md
│  │  ├─ open-questions.md
│  │  ├─ decisions\
│  │  │  └─ ADR-0001-agent-harness.md
│  │  ├─ maps\
│  │  ├─ memory\
│  │  └─ runbooks\
│  │
│  ├─ vendor\
│  │  ├─ mattpocock-skills\
│  │  └─ andrej-karpathy-skills\
│  │
│  ├─ scripts\
│  │  ├─ audit-harness.ps1
│  │  ├─ install-skills.ps1
│  │  ├─ generate-agent-index.ps1
│  │  └─ validate-harness.ps1
│  │
│  └─ reports\
│     ├─ inventory\
│     ├─ analysis\
│     └─ migration-plan\
│
├─ .vscode\
│  └─ .codex\
│     ├─ prompts\
│     ├─ skills\
│     ├─ agents\
│     └─ Brain\
│
├─ Kombi\
└─ Avatar\
```

---

## De tre lag — hvorfor adskillelse er vigtig

Den vigtigste arkitekturbeslutning er at holde eksterne repoer under `.agents/vendor/` og **aldrig** ændre dem direkte. Din egen kuraterede, projektspecifikke version skal ligge under `.agents/skills/`, `.agents/agents/` og `.agents/brain/`. Så kan du senere kopiere harnesset til `C:\Users\Biyocon` som global baseline uden at blande rå open-source-indhold, lokale projektregler og Banedanmark-specifik viden sammen.

| Lag | Sti | Formål | Retningslinje |
|-----|-----|--------|---------------|
| **Vendor** | `.agents/vendor/` | Rå open-source-kilder | Læs-only. Opdateres via `git pull`. Kopiér aldrig direkte ind i projektet. |
| **Kurateret** | `.agents/skills/` | Udvalgte og tilpassede skills | Små, skarpe, model-agnostiske. Kildehenvisning bevares. |
| **Domæne** | `.agents/agents/` + `.agents/brain/` | Banedanmark-specifik viden og roller | Bygget på evidens fra lokale filer. Placeholders markeres tydeligt. |

---

## Principper for skills

- Skills skal være **små, skarpe og komponerbare**.
- Hver skill skal have **klart trigger-scope** — hvornår aktiveres den?
- Domænetunge regler skal ligge i `references/`, ikke i selve `SKILL.md`.
- Scripts må kun bruges, hvor deterministisk automatisering er bedre end promptinstruktion.
- Banedanmark-specifikke skills skal adskilles fra generelle open-source-skills.
- Vendor-indhold må ikke redigeres direkte; kopier og tilpas i `.agents/skills/`.

---

## Brain-mappens formål

Brain-mappen (`.agents/brain/`) er projektets levende hukommelse:

| Fil | Formål |
|-----|--------|
| `context.md` | Stabil projektkontekst — læs ved opstart af komplekse opgaver |
| `glossary.md` | Domænesprog og forkortelser — læs når du møder ukendte begreber |
| `assumptions.md` | Ikke-verificerede antagelser — tjek før du træffer beslutninger |
| `open-questions.md` | Uafklarede forhold — tilføj nye spørgsmål under arbejdet |
| `decisions/` | Architecture Decision Records (ADR) — læs før arkitekturændringer |
| `maps/` | Relationer mellem agenter, skills, roller og mapper |
| `runbooks/` | Gentagelige arbejdsgange — følg ved vedligeholdelse |
| `memory/` | Øvrig persistent kontekst |

---

## Vurdering af open-source kilder

### `mattpocock/skills`

Relevant, fordi repoet selv beskriver skills som små, tilpasningsvenlige og komponerbare. README'en angiver installation via `npx skills@latest add mattpocock/skills`. Repoet understreger, at skills er lavet til at virke med flere modeller — ikke kun Claude. ([GitHub][2])

**Anbefaling:** Brug repoet som referencekilde. Vurder følgende skills/workflows til kuratering:
- `tdd` — test-driven development
- `diagnose` — systematisk debugging
- `to-prd` — opret Product Requirement Document
- `to-issues` — opret issues fra plan
- `grill-me` / `grill-with-docs` — stresstest planer
- `improve-codebase-architecture` — arkitekturforbedring
- `zoom-out` — bred kontekstforståelse
- `ubiquitous-language` — DDD-glossary
- `write-a-skill` — skill-forfatteri
- `setup-pre-commit` — commit-hooks
- `git-guardrails` — git-sikkerhed

Kopiér/tilpas **kun** de skills, der giver mening for et projekt-harness. Fjern Claude-specifikke antagelser hvor muligt.

### `forrestchang/andrej-karpathy-skills`

Relevant som adfærds-harness: antagelser skal synliggøres, løsninger skal være simple, ændringer skal være kirurgiske, og opgaver skal have verificerbare succeskriterier. ([GitHub][3])

**Anbefaling:** Omskriv `CLAUDE.md`-principperne til en lokal skill under `.agents/skills/karpathy-guidelines/SKILL.md` og integrér essensen i rodfilens `AGENTS.md`. På den måde bevares de stærke principper uden at låse projektet til Claude-navngivning.

---

## Faseplan (overblik)

| Fase | Navn | Output |
|------|------|--------|
| 0 | Sikker opstart | `.agents/reports/00_startup_check.md` |
| 1 | Scanning af Kombi | `.agents/reports/analysis/kombi_analysis.md` + `kombi_inventory.json` |
| 2 | Scanning af Avatar | `.agents/reports/analysis/avatar_analysis.md` + `avatar_inventory.json` |
| 3 | Scan eksterne inspirationsmapper | `open_source_analysis.md` + `tooling_analysis.md` |
| 4 | Målarkitektur | `AGENTS.md`, `README_AGENT_HARNESS.md`, mappestruktur |
| 5 | Installer/klon vendor-repoer | `.agents/vendor/mattpocock-skills`, `.agents/vendor/andrej-karpathy-skills` |
| 6 | Kuratér generelle skills | `.agents/skills/<skill>/SKILL.md` |
| 7 | Integrér Karpathy-regler | `.agents/skills/karpathy-guidelines/SKILL.md` |
| 8 | Opret Brain-mappe | `.agents/brain/*.md`, ADR, maps, runbooks |
| 9 | Opret subagents | `.agents/agents/<agent-id>/` |
| 10 | Opret BaneByg skills | `.agents/skills/banebyg/` med placeholders |
| 11 | Opdatér Avatar prompts | `System_Prompt_Agent_<Navn>_<Rolle>.txt` |
| 12 | Opret registry | `.agents/registry.yaml` |
| 13 | Opret scripts | `.agents/scripts/*.ps1` |
| 14 | Validering | `.agents/reports/validation_report.md` |
| 15 | Slutrapport | `.agents/reports/migration-plan/final_harness_report.md` |

---

## Definition of Done

- [ ] Projektet har en rodfil `AGENTS.md`.
- [ ] Projektet har en `.agents/`-struktur med `agents/`, `skills/`, `brain/`, `vendor/`, `scripts/` og `reports/`.
- [ ] `Kombi/` og `Avatar/` er scannet og dokumenteret.
- [ ] Der findes en inventory over alle relevante filer.
- [ ] Relevante open-source-skills er installeret/klonet isoleret under `vendor/`.
- [ ] Matt Pocock skills og Karpathy guidelines er vurderet og kurateret.
- [ ] Der findes en første version af Banedanmark-subagents.
- [ ] Hver avatar/agent har egen systempromptfil.
- [ ] Interface Manager har mindst en foreløbig `skills.yaml` med BaneByg-relaterede skills, herunder BBTR, BBE og BKP som placeholders, hvis konkret kildeindhold endnu ikke er verificeret.
- [ ] Brain-mappen er oprettet og indeholder `context.md`, `glossary.md`, `assumptions.md`, `open-questions.md` og mindst én ADR.
- [ ] Der findes en valideringsrapport, en migrationsrapport og en anbefaling til senere globalisering under `C:\Users\Biyocon`.

---

## Referencer

- [1] OpenAI — *Introducing Codex*: https://openai.com/index/introducing-codex/
- [2] GitHub — `mattpocock/skills`: https://github.com/mattpocock/skills
- [3] GitHub — `forrestchang/andrej-karpathy-skills`: https://github.com/forrestchang/andrej-karpathy-skills
