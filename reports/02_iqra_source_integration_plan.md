# 02 — Iqra-main som kanonisk kilde for agent-prompts

**Anledning:** Brugeren henviste til `Avatar/Iqra-main/` som kilde til agentbeskrivelser.

---

## A. Hvad er Iqra-main?

Et separat **Replit-baseret pnpm-monorepo** (`Iqra - Omni AI Workspace`) i React + Vite + Drizzle + OpenAI. Kun delvist relevant for vores harness — den interessante del er:

- `lib/agents/src/index.ts` (2651 linjer) — TypeScript-fil med:
  - `WorkspaceAgent`-interface med komplet Design DNA (avatar, accentColor, fallbackInitial, kind, scope, status m.m.)
  - `IQRA_AGENTS`-array med **30+ agent-definitioner**
  - **11 dedikerede rige `*_SYSTEM_PROMPT` konstanter** (linje 65–1176): Yunus, Sibgha, Abdi Asis, Ahmad El-Wali, Hassan Dahir, Mehtap, Joël, William, Ifrah, Mohammad, Sabina
  - Generic `agentPrompt(role, specialty, outputFocus)`-helper bruges for Abdul-* roster
- `attached_assets/avatars/2_Avatar_Agent_Ahmad_Sektionschef.png` — ekstra avatar ikke i hovedrosteren
- Resten (artifacts/, mockup-sandbox/, omni-ai/, Voice Mode docs) er Iqra-produktet selv — ikke relevant for vores harness.

## B. Kvalitetssammenligning (eksisterende vs Iqra source)

### Eksisterende `Avatar/agents/System_Prompt_Agent_yunus-udbudskonsulent.md`
- 118 linjer, frontmatter-bug (skills-array misindented under indrykning)
- Generic boilerplate: *"Du er Yunus, projektets agent for rollen **Udbudskonsulent**."*
- Tom mission: *"analysere udbudsmateriale, krav, tildelingskriterier og win themes med fokus på compliance og beslutningsværdi"*
- Auto-genereret af `temp/generate_agent_harness.py` ud fra `agent-roster.json`-felter
- Ingen domæneord (ABR18, AB18, forsyningsvirksomhedsdirektivet)
- Ingen procesopskrift (1.→6. step-flow)

### Iqra `YUNUS_SYSTEM_PROMPT` (linje 65–116 i index.ts)
- *"Du er Yunus, en digital udbudskonsulent hos Banedanmark i afdelingen Sourcing & Interface Management."*
- Specialiseret i ABR18, AB18, forsyningsvirksomhedsdirektivet, udbudsstrategi, kravopfyldelse, tildelingskriterier, evalueringsmodeller
- 9 konkrete rolleansvar
- 7-punkts personlighedsprofil
- 8-punkts kommunikationsstil
- 6-trins arbejdsflow ved upload af udbudsmateriale
- Specifikt afsnit om ABR18/AB18-håndtering
- Specifikt afsnit om Banedanmark-kontekst (sikkerhed, dokumentation, kontraktstyring)

**Konklusion:** Iqra-source er ~5× mere domænespecifik og brugbar som faktisk system prompt.

## C. Mapping: Iqra-ID → eksisterende roster-ID → handling

| Iqra ID | Iqra rolle | Eksisterende ID i roster | Action |
|---------|-----------|--------------------------|--------|
| yunus-udbudskonsulent | Udbudskonsulent | yunus-udbudskonsulent ✅ | **Replace prompt med Iqra source** |
| mohammad-abdel-latif-udbudskonsulent | Udbudskonsulent | mohammad-udbudskonsulent (kortere navn) | **Update ID + replace prompt** |
| mohammad-udbudskonsulent | Udbudskonsulent | (samme som ovenfor — to entries i Iqra) | **Skip duplikat eller merge** |
| william-udbudskonsulent | Udbudskonsulent | william-udbudskonsulent ✅ | **Replace prompt med Iqra source** |
| mehtap-udbudskonsulent-vare-og-tjenesteydelser | Udbudskonsulent | mehtap-udbudskonsulent (kortere ID) | **Update ID eller behold + replace prompt** |
| joel-mulongo-udbudsjurist | **Udbudsjurist** | joel-mulongo-udbudskonsulent (forkert rolle!) | **Update rolle + ID + replace prompt** |
| sabina-udbudskonsulent-chefkonsulent | Chefkonsulent | sabina-udbudskonsulent-chefkonsulent ✅ | **Replace prompt** |
| ifrah-farmaceut | Farmaceut | ifrah-farmaceut ✅ | **Replace prompt** |
| sibgha-finance-analytics-specialist | Finance Analytics Specialist | sibqah-finance-analytics-specialist (**ID-typo!**) | **Fix sibqah→sibgha + replace prompt** |
| abdi-asis | Technical Product Manager | abdi-asis-produkt-manager (lidt ander rolle/ID) | **Update ID + rolle + replace prompt** |
| ahmad-el-wali | **Head of Sourcing & Interface Management** | (ikke i roster!) | **Add — Banedanmark-relevant** |
| hassan-dahir | **Technical Interface & Product Owner** | (ikke i roster — Hassan-anlæg/-fagprojekt findes som anden person) | **Add — Banedanmark-relevant** |
| abdul-matin-byggeleder | **Byggeleder** | (ikke i roster) | **Add — matcher spec'ens Byggeleder/Tilsyn-krav** |
| abdul-raqib-tilsyn | **Tilsyn** | (ikke i roster) | **Add — matcher spec'ens Byggeleder/Tilsyn-krav** |
| omni-assistant, code-architect, research-analyst | (Iqra-product-agenter) | (ikke i roster) | **Skip — ikke Banedanmark-relevant** |
| abdi-malik, abdul-badi, abdul-qadir, abdul-khabir, abdul-hakim, abdul-musawwir, abdul-hasib, abdul-alim, abdul-wakil, abdul-bari | Team Leader, Ads/Automation/SEO/Product, Architect, Data Analyst, Deep Researcher, Project Manager, Design Manager | (ikke i roster) | **Optional — generelle digital-team-roller, kan tilføjes hvis det bredere harness skal dække digital-team-arbejde** |
| sql-master, content-writer, ux-auditor, my-research-bot, api-helper | (Iqra-test-agenter) | (ikke i roster) | **Skip — test-stubs** |

### Eksisterende roster-ID'er IKKE i Iqra
Skal beholdes uden Iqra-prompt-upgrade (forbliver Codex-genererede):
- the-game-elektriker, siamak-folkeskolelaerer, sharmarke-maler, shamso-socialraadgiver, said-anlaegsingenioer, qanac-laege, liban-sales-specialist, hassan-fagprojektleder, hassan-anlaegsingenioer, hamsa-afloebsingenioer, bojang-fodboldagent, bodjo-fodboldagent, bamse-paedagog, ali-jobraadgiver, abdullahi-data-engineer, abdisalam-staerkstroemsingenioer

## D. Specifikke ID-/datakorrektioner identificeret

| Felt | Nuværende | Korrekt (per Iqra) |
|------|-----------|--------------------|
| sibqah-... | typo | **sibgha-...** |
| joel-mulongo-udbudskonsulent (rolle) | Udbudskonsulent | **Udbudsjurist** |
| mohammad-udbudskonsulent (navn) | Mohammad | **Mohammad Abdel-latif** |
| abdi-asis-produkt-manager (rolle) | Produkt Manager | **Technical Product Manager** |
| Avatar/agents/AGENTS.md i Avatar/ | findes (443 b) | bør opdateres med ny mapping |

## E. Lokationsbeslutning for Iqra-main

Iqra-main er ~219 KB pnpm-lock + ~150 attached_assets billeder + Replit-konfig — det er ikke lille. Tre muligheder:

1. **Behold som referencemateriale** under `Avatar/Iqra-main/` (nuværende sted). **Tilføj READ_ONLY-marker** og henvis til den i `source-map.md` som autoritativ kilde for de 11 rige system prompts.
2. **Flyt til `Kombi/`** sammen med øvrige reference-repos (matcher Brain/source-map.md's konvention "Kombi er reference, ikke runtime").
3. **Ekstrahér kun `lib/agents/src/index.ts`** til et neutralt sted (`docs/iqra-source/agents.ts`) og slet resten. Mest pladsbesparende, men brugeren har ekstrahere zip'en bevidst — sletning er destruktivt.

**Anbefaling:** Mulighed 2 (flyt til `Kombi/`). Konsistent med eksisterende konvention. Frigør Avatar/-mappen til kun avatar-aktiver. Ikke-destruktivt (bare flytning).

## F. Foreslået revideret arbejdsplan (efter Strategi A + Iqra-integration)

### Stadig kun afventende sletninger/migreringer indtil bruger godkender:

**Block 1 — analyse + dokumentation (ingen runtime-ændring):**
1. `reports/analysis/kombi_analysis.md` + `reports/inventory/kombi_inventory.json` (Fase 1)
2. `reports/analysis/avatar_analysis.md` + `reports/inventory/avatar_inventory.json` (Fase 2)
3. `reports/analysis/iqra_main_analysis.md` (NY — dækker Iqra source detaljer)
4. `reports/analysis/open_source_summary.md` + `reports/analysis/tooling_summary.md` (Fase 3, kort)

**Block 2 — kvalitets-opgraderinger (kirurgiske ændringer i runtime):**
5. Backup `agent-roster.json` → `agent-roster.json.bak-2026-05-06`
6. Fix `sibqah → sibgha` ID i agent-roster.json + Avatar/agents/-fil + alle krydsreferencer
7. Fix `joel-mulongo-udbudskonsulent` rolle → `Udbudsjurist` + ID-justering hvis ønsket
8. Update `mohammad-udbudskonsulent` navn → `Mohammad Abdel-latif` (og dedupliker hvis mohammad-abdel-latif-* findes som separat)
9. Update `abdi-asis-produkt-manager` rolle → `Technical Product Manager`

**Block 3 — Iqra-prompt-integration (replace 11 thin prompts med rich):**
10. Backup hele `Avatar/agents/` → `Avatar/agents.bak-2026-05-06/`
11. Replace 11 system prompts: Yunus, Sibgha, Abdi Asis, Mehtap, Joël, William, Ifrah, Mohammad, Sabina, **+ NY Ahmad El-Wali, Hassan Dahir**
12. Behold de 16 øvrige Codex-genererede prompts (eller note dem til senere upgrade)

**Block 4 — Banedanmark-roster-udvidelse (per spec'ens 17 roller):**
13. Tilføj Iqra-baserede: ahmad-el-wali (Head of Sourcing & Interface Management), hassan-dahir (Technical Interface & Product Owner), abdul-matin-byggeleder, abdul-raqib-tilsyn
14. Identificer manglende fra spec: Projekteringsleder, Dokumentcontroller, Kvalitetsspecialist, Kontraktmanager, Planlægningskoordinator, Sikkerhedskoordinator, Fagansvarlig Spor/Sikring/Kørestrøm/Tele, Miljøkoordinator, Ibrugtagning, Økonomi/Controller — opret som **placeholder-profiler** i `.vscode/.codex/agents/banedanmark/` med klar status: draft + kildekrav-markering

**Block 5 — Manglende infrastruktur:**
15. `registry.yaml` (rod) som maskinlæsbart manifest oven på agent-roster.json
16. `README_AGENT_HARNESS.md` (rod)
17. `.gitignore` + `git init` (med bruger-godkendelse — ikke-trivielt fordi OneDrive sync interagerer med .git)
18. PowerShell scripts under `scripts/` (rod) eller `.vscode/.codex/scripts/`: audit-harness.ps1, validate-harness.ps1, install-skills.ps1, generate-agent-index.ps1
19. `.vscode/.codex/Brain/glossary.md` + `.vscode/.codex/Brain/open-questions.md` (per spec'ens Brain-udvidelse)
20. `reports/validation_report.md`
21. `reports/migration-plan/final_harness_report.md` med globaliseringsplan (HMDR-promotion-trin)

**Block 6 — Iqra-relokering:**
22. Flyt `Avatar/Iqra-main/` → `Kombi/Iqra-main/` med backup-note i `Brain/source-map.md`

## G. Beslutninger jeg har brug for fra dig

1. **Strategi A vs B vs C** (fra `01_existing_harness_inventory.md`) — bekræfter du **Strategi A**?
2. **Iqra-integration:** skal jeg replace de 11 thin prompts med Iqra source? **Ja/nej**?
3. **Banedanmark-udvidelse:** skal jeg tilføje Ahmad El-Wali, Hassan Dahir, Abdul Matin (Byggeleder), Abdul Raqib (Tilsyn) + placeholders for de øvrige 10 spec-listede roller? **Ja/nej**?
4. **ID-fixes:** sibqah→sibgha, joel-rolle, mohammad-navn, abdi-rolle — **må jeg fixe dem nu**?
5. **Iqra-flytning:** Avatar/Iqra-main → Kombi/Iqra-main? **Ja/nej**?
6. **git init:** vil du have git initialiseret i projektroden? Bemærk OneDrive-sync kan have edge-cases med .git-mappen.
7. **Fejlskabt mappe:** `C:\Users\Biyocon\Kvalifikationsordning Entreprenør\` (tom, jeg lavede den) — **slet, behold, eller flyt indhold ind i denne projektrod?** (Den er tom så ingen reel data går tabt ved sletning.)

Sig fx **"A + ja til alle + slet"** og jeg kører Block 1–6 sekventielt med backups undervejs.
