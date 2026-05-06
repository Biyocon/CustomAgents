# 01 — Eksisterende harness-inventory og gap-analyse

**Formål:** Vise hvad der allerede findes i projektet, så system-promptens nye spec ikke implementeres destruktivt eller duplikerende.

---

## A. Eksisterende `.vscode/.codex/` (autoritativ runtime per ADR-0001)

### A.1 Rod
- `AGENTS.md` (1326 b) — peger på `.vscode/.codex/` som runtime-kerne
- `config.toml` (256 b)

### A.2 `.vscode/.codex/agents/`
- `AGENTS.md` (812 b) — agent-runtime-index
- `agent-roster.json` (18.970 b) — **25 agenter komplet defineret** med id, navn, rolle, kategori, avatar-sti, profile-sti, accent, skills-array, capabilities-array
- `role-template.md` (759 b) — frontmatter-baseret template med id/name/role/category/status/skills + System Prompt + Subskills + Acceptkriterier
- `banedanmark/interface-manager-banebyg.md` (1957 b) — **fuldt defineret Interface Manager** med 12 BBTR/BBE/BKP-skills bundet

### A.3 `.vscode/.codex/Brain/`
- `AGENTS.md` (991 b) — Brain-principper og læseorden
- `context.md` (1251 b) — domænebegreber, arbejdshypotese, afgrænsninger
- `operating-principles.md` (908 b) — Karpathy-regler + projektregler + Banedanmark-regler
- `source-map.md` (858 b) — aktiv runtime, adaptere, referencekataloger
- `adr/0001-agent-harness-structure.md` (1184 b) — **Accepted** beslutning: `.vscode/.codex/` er kerne, AGENTS.md er fælles, ingen klientnavnede aktive filer

### A.4 `.vscode/.codex/prompts/` (8 filer)
- `master-system.md` (3366 b)
- `subagent-builder.md` (936 b)
- `brief.md`, `respond.md`, `review-contract.md`, `triage-nda.md`, `vendor-check.md`, `verify.md`

### A.5 `.vscode/.codex/skills/` (~70+ skills allerede installeret)

**BBTR-suite (17 skills):** csm-tsi-compliance, dokumentstyring, fagpakkestruktur, faseopdelt-ydelser, forbedringsloop, indstilling-writer, ipm-konsistens, kvalitet-dod, leverance-mapping, presentation-builder, produktionssetup, raadgiver-udbud, risiko-myndighed, role-justification, tvaerfaglig-koordinering, webdesign

**BBE:** bbe-dokumenter-platform (8.234 b SKILL.md)

**BKP:** bdk-bkp-v17-data-model (8.015 b), bdk-bkp-v17-overview (5.180 b)

**BDK-suite (~30 skills):** ansoegning-om-midler-end-to-end, audit-findings, brand-governance, brand-preflight-leverance, brand-regler-anvendelse, forretningsprojektmodel-gates, gdpr-praksis, gevinststyring-realisering, haendelser-sikkerhedsbrister, legal-mapping, logo-asset-valg, lokalinstruktion-opslag, overvaagning-rapportering, portefoljekontor-governance, powerpoint-praesentationsskills, projektindstilling-og-finansiering, projektrapportering-frister, risk-profile, roller-kompetencer, ssb-styring, statens-it-projektmodel-compliance, styregruppearbejde, styringsdokumenter-skabeloner, tilsynsapp-leverance-operations, trace-processer, trafikale-blanketter, trafikale-regelinfo-aendringer, trafikale-regler-anvendelse, trafikcirkulaere-udkast

**Generelle skills (Mattpocock + andet):** caveman, design-an-interface, diagnose, edit-article, git-guardrails-claude-code, grill-me, grill-with-docs, improve-codebase-architecture, **karpathy-guidelines**, migrate-to-shoehorn, obsidian-vault, qa, request-refactor-plan, scaffold-exercises, **setup-matt-pocock-skills**, setup-pre-commit, shared-docx, shared-quality, **tdd**, **to-issues**, **to-prd**, triage, ubiquitous-language, write-a-skill, zoom-out

### A.6 `.vscode/archive/`
- `legacy-prompts/` — historisk version af alle 6 prompts
- `legacy-skills/` — codex-previous + root-skills (17 KB SKILL_BANEBYG_ENTERPRISE.md)
- `upstream-skills/skills/` — **fuld Anthropic upstream skills-repo med .git** (400+ skills)

### A.7 `.vscode/` rod
- `AGENTS.md` (1058 b) — separat fra `.vscode/.codex/AGENTS.md`
- `claude.md` (316 b)
- `Banedanmark logopakke 2021/` — officielle brandassets
- `excel-pq-symbols/`
- `hooks/`, `settings/`
- `qa-log.md`, `mcp-needs-auth-cache.json`, `stats-cache.json`, `.versions.json`

## B. Eksisterende `Avatar/`

- `0_avatar_generatio_prompt.txt` (5510 b) — **ALLEREDE konsolideret** med all 25 agenter + accent-farver + global style + batch output + single avatar template
- `1_Prompt_custom_12_avatars.md` (2765 b) — sandsynligvis ældre kilde, allerede inkorporeret
- `1_Prompt_custom_billede_avatars.txt` (498 b)
- `System_Prompt_Agent_Yunus_Udbudskonsulent.txt` (4042 b) — original .txt
- `agents/` (NY undermappe!) med `AGENTS.md` + 25 stk `System_Prompt_Agent_<id>.md` (3262–3871 bytes hver)
- 27 PNG-avatarer

## C. Eksisterende `Kombi/` — kun referencekatalog

14 unzipped repos: agency-agents-main, agentic-stack-master, andrej-karpathy-skills-main, caveman-main, claude-code-main, claude-mem-main, deer-flow-main, everything-claude-code-main, get-shit-done-main, graphify-6, oh-my-openagent-dev, planning-with-files-master, **skills-main (= mattpocock/skills)**, system_prompts_leaks-main + zip-arkiver. Plus 1 Banedanmark-tilbudsliste-Excel.

## D. Tomme/embryonic mapper
- `.vscode/.agents/` — tom (separat fra `.vscode/.codex/.agents/`)
- `My-project-template/` — tom
- `.scratch/` — tom
- `temp/`, `docs/` — formodet brugt løbende

---

## E. Konflikt mellem ny system-prompt og virkeligheden

| Spec siger | Virkelighed |
|------------|-------------|
| Opret `.agents/` i projektroden | `.vscode/.codex/` er allerede autoritativ runtime per ADR-0001 |
| Opret AGENTS.md i roden | Findes (1999 b), peger på `.vscode/.codex/` |
| Klon mattpocock/skills til `.agents/vendor/` | Allerede unzipped i `Kombi/skills-main` + installeret i `.vscode/.codex/skills/` via `setup-matt-pocock-skills` |
| Klon karpathy-skills til `.agents/vendor/` | Allerede unzipped i `Kombi/andrej-karpathy-skills-main`. Karpathy-guidelines installeret som skill |
| Opret `.agents/skills/karpathy-guidelines/` | Findes i `.vscode/.codex/skills/karpathy-guidelines/SKILL.md` (2518 b) |
| Opret `.agents/skills/banebyg/` med BBTR/BBE/BKP placeholders | 17 BBTR + 1 BBE + 2 BKP eksisterer som *fulde* skills (ikke placeholders!) |
| Opret `.agents/agents/interface-manager/` | Findes som `.vscode/.codex/agents/banedanmark/interface-manager-banebyg.md` med 12 bundne skills |
| Opret 17 Banedanmark-subagents | 25 agenter findes i agent-roster.json (overlap delvist; ikke alle er Banedanmark) |
| Opret `.agents/brain/` med context, glossary, etc. | Findes i `.vscode/.codex/Brain/` (mindre scope: ingen glossary.md, ingen open-questions.md) |
| Konsolidér `0_avatar_generatio_prompt.txt` med `1_Prompt_custom_12_avatars.md` | Allerede konsolideret — alle 25 agenter med accents listet |
| Opret én systemprompt pr. avatar (`System_Prompt_Agent_<Navn>_<Rolle>.txt`) | 25 stk findes som `.md` i `Avatar/agents/` (lidt anden navngivning, men dækkende) |

## F. Reelle huller (ægte arbejde der mangler)

1. **Ingen `reports/` med inventory + analyse** (kombi/avatar/open_source/tooling). Denne fil + `00_startup_check.md` er en start.
2. **Ingen scripts/** (audit-harness.ps1, validate-harness.ps1, install-skills.ps1, generate-agent-index.ps1)
3. **Ingen registry.yaml** som maskinlæsbar manifest (agent-roster.json findes, men intet kombineret manifest af agents+skills+brain+vendor+adapters)
4. **Ingen validation report**
5. **Ingen migration-plan til `C:\Users\HMDR`-promotion**
6. **Brain/ savner glossary.md og open-questions.md** (per spec)
7. **Hverken README_AGENT_HARNESS.md eller `.gitignore` i roden**
8. **Projekt er ikke under git** — bør initialiseres før strukturelle ændringer
9. **Avatar/agents/-prompts er ikke valideret mod skills i agent-roster.json** — kvalitets-pass ville være værdifuldt
10. **Ingen sammenhæng mellem 25 eksisterende agenter og spec'ens 17 Banedanmark-roller** — gap (mangler Projektleder, Projekteringsleder, Dokumentcontroller, Kvalitetsspecialist, Byggeleder, Kontraktmanager, Planlægningskoordinator, Sikkerhedskoordinator, Fagansvarlig Spor/Sikring/Kørestrøm/Tele, Miljøkoordinator, Ibrugtagning, Økonomi/Controller); overlap dækker Yunus-/William-/Sabina-/Mehtap-/Mohammad-/Joël-Udbudskonsulent, Hassan-Fagprojektleder, Hassan/Said-Anlægsingeniør, Abdisalam-Stærkstrøm. **Ekstra (ikke-Banedanmark) i roster:** Pædagog, Læge, Maler, Farmaceut, Socialrådgiver, Folkeskolelærer, Fodboldagenter (×2), Sales Specialist, Jobrådgiver, Produkt Manager, Data Engineer.

---

## G. Tre strategiske valg — afventer brugerens beslutning

### Strategi A — **Honorér eksisterende `.vscode/.codex/` (anbefalet)**
- Behold ADR-0001 og runtime-konvention.
- Udfør kun de **reelle huller** fra sektion F: rapporter, scripts, registry, README, gitignore, glossary/open-questions, manglende Banedanmark-subagenter, validation, migration-plan.
- Lavest risiko. Bevarer ~7 dages eksisterende arbejde. Får projektet til DoD per spec uden destruktion.

### Strategi B — **Parallel `.agents/`-skelet alongside `.vscode/.codex/`**
- Opret tom `.agents/`-struktur som "next iteration template", men hold `.vscode/.codex/` som faktisk runtime.
- Risiko: drift, dobbeltvedligehold, forvirring. Lav værdi — du har allerede en template (`My-project-template/`).

### Strategi C — **Migrér `.vscode/.codex/` → `.agents/`**
- Skriv ADR-0002 der ophæver ADR-0001.
- Flyt 70+ skills, 25 agenter, prompts, Brain, archive til ny placering.
- Opdater alle relative stier i agent-roster.json, source-map.md, ADR'er.
- Stort engangsarbejde, høj regressionrisiko (skill-discovery i Codex/Kimi kan bryde). Kun værd hvis `.agents/` har konkret fordel over `.vscode/.codex/` (har ingen identificeret).

---

## H. Min anbefaling

**Strategi A.** Begrundelse:
1. ADR-0001 er en bevidst, dokumenteret beslutning (Accepted), ikke en historisk artefakt.
2. Eksisterende AGENTS.md (root + `.vscode/.codex/`) opfylder allerede spec'ens model-agnostiske krav (Codex/Kimi/Qwen/Gemini bruger samme runtime).
3. ~70 skills, 25 agenter, 8 prompts og fuld Brain er allerede produktionsklar — ikke placeholders.
4. Reelle hullerne (rapporter, scripts, registry, validation, migration-plan) kan udføres uden at røre runtime.
5. Promotion til `C:\Users\HMDR\` bliver nemmere fra én konsistent runtime end fra to.

**Hvis du vælger A**, fortsætter jeg med:
- Fase 1: Kombi-inventory (`reports/analysis/kombi_analysis.md` + `inventory/kombi_inventory.json`)
- Fase 2: Avatar-inventory (`reports/analysis/avatar_analysis.md` + `inventory/avatar_inventory.json`) + verifikation af Avatar/agents/-kvalitet
- Fase 3: Open source + _tooling kort-skanning
- Fase 9-bis: Manglende Banedanmark-subagenter (ifølge gap i F.10) — tilføjes til agent-roster.json + nye Banedanmark/ profile-filer
- Fase 12-bis: registry.yaml som overordnet manifest oven på agent-roster.json
- Fase 13: 4 PowerShell scripts under `scripts/` (rod) eller `.vscode/.codex/scripts/`
- Fase 14: Validation report
- Fase 15: Final report + HMDR-globaliseringsplan
- README_AGENT_HARNESS.md i rod
- `.gitignore` + git init forslag

**Hvis du vælger B eller C**, beskriv venligst hvilken konkret fordel `.agents/`-omplaceringen giver, så jeg kan udføre migrationen med fuld backup og rollback-plan.
