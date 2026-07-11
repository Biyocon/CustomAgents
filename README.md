# AgentSkills — Custom AI Agent Harness

## Projektstyrings-dokumentation (tilføjet 2026-07-01, opdateret 2026-07-11)

> **Runtime-aktiveringen er GENNEMFØRT (2026-07-11, PR F):** `.agents/` er canonical source
> of truth, og `.vscode/.codex/agents/` (registry + rolleagenter) **genereres** nu fra canonical
> af `.agents/scripts/generate-runtime.py`. ADR-roadmappen PR A–F er fuldført; gaten
> `docs/qa/RELEASE-runtime-activation-gate.md` er GODKENDT. Dobbeltvedligehold er afviklet:
> redigér altid `.agents/`, aldrig genererede runtime-filer. Sync verificeres med
> `generate-runtime.py --check` (exit 0). Brain: `.agents/brain/` er canonical;
> `.vscode/.codex/Brain/` er frosset legacy (se `docs/architecture/memory-governance.md`).

Nyt PM-system, læs i denne rækkefølge:

Nyt PM-system, læs i denne rækkefølge:

1. `primer.md` — kort statuskondensat, læses ved hver sessionsstart
2. `systemkort.md` — autoritativ arkitektur inkl. runtime-status (modstriden er afgjort 2026-07-09)
3. `FORBEDRINGSNOTAT.md` — dyb kritik + samlet roadmap
4. `KØREPLAN.md` — faseopdelt implementeringsplan (Fase A–G)
5. `PROJEKT_PLAN.md` — idébank, designbeslutninger, ønskeliste
6. `DEPS.md` — afhængigheder og kritisk sti mellem tasks
7. `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` — konsolideret fund-liste
8. `docs/active/`, `docs/drafts/`, `docs/done/` — sporede opgaver med acceptkriterier
9. `docs/qa/RELEASE-runtime-activation-gate.md` — gate før runtime-beslutning aktiveres
10. `docs/plans/runtime-konsolidering-plan.md` — løsningsdesign for P0-modstriden
11. `LESSON.md`, `CHANGELOG.md` — retrospektiv og ændringslog for selve PM-systemet

---

## Runtime Status (opdateret: 2026-07-09)

Se `docs/agents/runtime-status-2026-06-12.md` for den historiske konsoliderede runtime-status. Ældre QA- og valideringsrapporter er historiske snapshots, ikke aktiveringsbeslutninger.

**Canonical source of truth:** `.agents/` (besluttet 2026-07-09, ADR-multi-runtime-agent-system.md = Accepted)

**Aktiv runtime (transitional):** `.vscode/.codex/` — for agenter/registry/Brain, indtil generatorer (PR B–F) findes.

**Bemærk hybrid-tilstand:** Skills er allerede flyttet til `.agents/skills/` (permanent, 2026-07-09), så skill-laget er canonical nu. Agenter, roster, registry og Brain kører fortsat fra `.vscode/.codex/` indtil den formelle aktivering (jf. `docs/qa/RELEASE-runtime-activation-gate.md`). `.agents/`-strukturen skal modnes til fuldt canonical via PR B–F; røres agenter/registry/Brain manuelt før da, mistes sync-garantien.

**Snapshot-branch:** `snapshot/local-pc-2026-06-07` er en auditmarkør for tracked Git-state på commit `7626c697afd6b5950cb976b62ee67d97bf35f0ed`. Den er ikke en backup af lokale ignored/temp/vendor-filer uden for normal Git-tracking.

**Vendor-status:** `.agents/vendor/mattpocock-skills` er almindeligt tracked vendored copy, ikke submodule. Bevar vendor-indhold som read-only upstream-reference og opdater kun i et separat vendor-PR.

> **Model-agnostisk, genbrugelig agent-harness til professionelle VS Code-projekter.**
> Udviklet med udgangspunkt i jernbane- og entreprenørkompetencer (Banedanmark), men strukturen er generisk og skal kunne tilpasses ethvert domæne og genbruges i alle fremtidige projekter.

---

## Vision

Dette projekt er tænkt som **paradigme og skabelon** for alle kommende projekter. Uanset hvilken LLM der anvendes — Codex, Kimi, Qwen Code eller Gemini Code — skal alle pege mod samme opsætning, samme skills og samme brain-kontekst.

**Primære modeller:** Codex + Kimi (VS Code)  
**Sekundære modeller:** Qwen Code, Gemini Code  
**Fælles instruktionsfil:** `AGENTS.md` (aldrig `CLAUDE.md`, `GEMINI.md`, `CODEX.md` eller `KIMI.md` som hovedfil)  
**Model-specifikke adapters:** `.agents/model-adapters/`

---

## Kritisk arkitekturprincip: De tre lag

For at undgå at rode rå open-source-indhold, lokale projektregler og domænespecifik viden sammen, adskiller vi alt i tre lag:

| Lag | Sti | Formål | Retningslinje |
|-----|-----|--------|---------------|
| **Vendor** | `.agents/vendor/` | Rå open-source-kilder | Læs-only. Opdateres via `git pull`. Kopiér aldrig direkte ind i projektet. |
| **Kurateret** | `.agents/skills/` | Udvalgte og tilpassede skills | Små, skarpe, model-agnostiske. Kildehenvisning bevares. |
| **Domæne** | `.agents/agents/` + `.agents/brain/` | Banedanmark-specifik viden og roller | Bygget på evidens fra lokale filer. Placeholders markeres tydeligt. |

### Vendor-kilder

```bash
# Matt Pocock skills — engineering workflows, TDD, PRD, issue-slicing, debugging
# Status: tracked vendored copy under .agents/vendor/mattpocock-skills

# Andrej Karpathy skills — adfærdsregler: antagelser, enkelhed, kirurgiske ændringer
git clone https://github.com/forrestchang/andrej-karpathy-skills.git .agents/vendor/andrej-karpathy-skills
```

> **Status:** `andrej-karpathy-skills` og `mattpocock-skills` er tilgængelige som almindeligt tracked vendor-indhold. Behandl dem som read-only upstream-reference; kopier og tilpas i `.agents/skills/` i stedet for at redigere vendor direkte.

---

## Hvad er dette?

En komplet runtime til AI-assisteret projektstyring med:

- **Specialiserede subagents** for hver fagrolle i Banedanmark (Interface Manager, Udbudskonsulent, Projektleder, Byggeleder, Kvalitetsspecialist, osv.)
- **Genbrugelige skills** — små, komponerbare evner med klart trigger-scope
- **Persistent Brain** — kontekst, glossary, antagelser, åbne spørgsmål, ADR'er, runbooks
- **Avatar-system** — visuelle profiler med systemprompts til hver agent
- **Registry** — central konfigurationsfil der binder det hele sammen
- **Valideringsscripts** — PowerShell-automatisering til audit og vedligeholdelse

---

## Arkitektur

```text
Kvalifikationsordning Entreprenør\
│
├─ AGENTS.md                    # Fælles instruktionsfil for ALLE LLM'er
├─ PROMPT.md                    # Operationelle prompts til Codex/Kimi i VS Code
├─ DESIGN.md                    # Arkitektur, designbeslutninger og bedste praksis
├─ README.md                    # Denne fil
├─ README_AGENT_HARNESS.md      # Harness-specifik dokumentation
│
├─ .agents\
│  ├─ registry.yaml             # Central konfiguration (agenter, skills, brain-paths)
│  ├─ model-adapters\
│  │  ├─ codex.md               # Codex-specifikke noter (adapter, ikke hovedfil)
│  │  ├─ kimi.md                # Kimi-specifikke noter
│  │  ├─ qwen-code.md           # Qwen Code-specifikke noter
│  │  └─ gemini-code.md         # Gemini Code-specifikke noter
│  │
│  ├─ agents\                   # Banedanmark-subagents (14+ agenter)
│  │  ├─ interface-manager\
│  │  ├─ udbudskonsulent\
│  │  ├─ projektleder\
│  │  ├─ projekteringsleder\
│  │  ├─ dokumentcontroller\
│  │  ├─ kvalitetsspecialist\
│  │  ├─ byggeleder-tilsyn\
│  │  ├─ kontraktmanager\
│  │  ├─ planlaegningskoordinator\
│  │  ├─ sikkerhedskoordinator\
│  │  ├─ fagansvarlig-spor\
│  │  ├─ miljoekoordinator\
│  │  ├─ ibrugtagning\
│  │  └─ oekonomi-controller\
│  │
│  ├─ skills\                   # kuraterede skills (kør validate-scriptet for aktuelt antal)
│  │  ├─ karpathy-guidelines\   # Think before coding, simplicity, surgical changes
│  │  ├─ tdd\                   # Test-driven development
│  │  ├─ diagnose\              # Systematisk debugging
│  │  ├─ to-prd\                # Product Requirement Document
│  │  ├─ to-issues\             # Opdel plan i issues
│  │  ├─ grill-me\              # Stresstest planer
│  │  ├─ zoom-out\              # Bred kontekstforståelse
│  │  ├─ ubiquitous-language\   # DDD-glossary
│  │  ├─ banebyg\               # BBTR, BBE, BKP (Banedanmark-specifik)
│  │  ├─ bdk-brand-governance\  # Banedanmark brand-regler
│  │  ├─ bdk-gdpr-praksis\      # GDPR i jernbaneprojekter
│  │  ├─ bdk-legal-mapping\     # Lov- og regelkrav
│  │  ├─ shared-docx\           # Word-dokumenthåndtering
│  │  ├─ shared-quality\        # Kvalitetssikring
│  │  └─ ...
│  │
│  ├─ brain\                    # Projektets levende hukommelse
│  │  ├─ context.md             # Stabil projektkontekst
│  │  ├─ glossary.md            # Domænesprog og forkortelser
│  │  ├─ assumptions.md         # Ikke-verificerede antagelser
│  │  ├─ open-questions.md      # Uafklarede forhold
│  │  ├─ decisions/             # Architecture Decision Records (ADR)
│  │  ├─ maps/                  # Agent-map, skill-map
│  │  ├─ memory/                # Øvrig persistent kontekst
│  │  └─ runbooks/              # Driftsguides
│  │
│  ├─ vendor\                   # Rå open-source-kilder (read-only)
│  │  ├─ mattpocock-skills/
│  │  └─ andrej-karpathy-skills/
│  │
│  ├─ scripts\                  # PowerShell-automatisering
│  │  ├─ audit-harness.ps1
│  │  ├─ install-skills.ps1
│  │  ├─ generate-agent-index.ps1
│  │  └─ validate-harness.ps1
│  │
│  └─ reports\                  # Analyser, audits, validering
│     ├─ inventory/
│     ├─ analysis/
│     └─ migration-plan/
│
├─ .vscode\.codex\              # Aktiv runtime (indtil .agents/ promoveres)
│  ├─ prompts/
│  ├─ skills/
│  ├─ agents/
│  └─ Brain/
│
├─ Avatar\                      # 26+ avatarer + systemprompts
│  ├─ 0_avatar_generatio_prompt.txt
│  ├─ 1_Prompt_custom_12_avatars.md
│  ├─ System_Prompt_Agent_Yunus_Udbudskonsulent.txt
│  └─ 2_Avatar_Agent_*.png
│
├─ Funktions- og stillingsbeskrivelser/   # Rollebeskrivelser og kompetencekrav
├─ docs/                         # Dokumentation og ADR'er
├─ reports/                      # Projektrapporter
├─ scripts/                      # PowerShell-scripts (projektspecifikke)
├─ skills/                       # Domain-skills (ældre struktur)
├─ Task/                         # Opgavesporing og audit-logs
└─ temp/                         # Midlertidige scripts og verifikation
```

---

## Hurtig start

1. **Læs** `AGENTS.md` for at forstå projektets regler og struktur.
2. **Læs** `docs/agents/runtime-status-2026-06-12.md` for aktuel runtime-status.
3. **Læs** `.vscode/.codex/Brain/context.md` for domæneforståelse ved komplekse opgaver.
4. **Vælg agent** via `.vscode/.codex/scripts/invoke-agent.ps1 -l` eller `.vscode/.codex/agents/registry.yaml`.
5. **Indlæs** agentens aktive profil og relevante skills fra `.vscode/.codex/`.

Brug kun `.\.agents\scripts\validate-harness.ps1` ved arbejde med den fremtidige/reference-runtime.

---

## Agent-roster

### Banedanmark-subagents (14 profiler)

| Agent | Rolle | Status |
|-------|-------|--------|
| Interface Manager | Integration, grænseflader, BaneByg | FORELØBIG |
| Udbudskonsulent | Udbud, tilbud, kontrakt | FORELØBIG |
| Projektleder | Overordnet projektstyring | FORELØBIG |
| Projekteringsleder | Projektering og design | DRAFT |
| Dokumentcontroller | Dokumentstyring og kontrol | DRAFT |
| Kvalitetsspecialist | Kvalitetssikring og -kontrol | DRAFT |
| Byggeleder/Tilsyn | Udførelse og tilsyn | FORELØBIG |
| Kontraktmanager | Kontraktadministration | DRAFT |
| Planlægningskoordinator | Tids- og ressourceplanlægning | DRAFT |
| Sikkerhedskoordinator | Arbejdsmiljø og sikkerhed | DRAFT |
| Fagansvarlig Spor | Spor og anlæg | DRAFT |
| Miljøkoordinator | Miljø og bæredygtighed | DRAFT |
| Ibrugtagning | Commissioning og idriftsættelse | DRAFT |
| Økonomi/Controller | Økonomi, budget, controlling | DRAFT |

### IQRA-agentfamilie (26+ avatarer)

Avatar-mappen indeholder visuelle profiler og systemprompts for 26+ agenter med forskellige roller:
- **Udbudskonsulenter:** Yunus, William, Mohammad, Mehtap, Sabina (Chefkonsulent), Joël Mulongo (Udbudsjurist)
- **Teknik:** Abdisalam (Stærkstrøm), Hassan (Anlæg), Said (Anlæg), Hamsa (Afløbsingeniør), The Game (Elektriker)
- **Ledelse:** Ahmad (Sektionschef), Hassan (Fagprojektleder), Abdi Asis (Technical Product Manager)
- **Sundhed:** Qanac (Læge), Ifrah (Farmaceut)
- **Rådgivning:** Shamso (Socialrådgiver), Ali (Jobrådgiver)
- **Salg:** Liban (Sales Specialist)
- **Pædagogik:** Bamse (Pædagog), Siamak (Folkeskolelærer)
- **Data:** Abdullahi (Data Engineer)
- **Sport:** Bojang, Bodjo (Fodboldagenter)

Se `Avatar/` for alle billeder og `.agents/brain/maps/agent-map.md` for relationer.

---

## Skills-bibliotek

> Aktuelt antal skills: kør `scripts/Validate-Harness-Unified.ps1` og se metrik-linjen
> "Aktive skills" (kanonisk kilde, jf. `docs/active/#3-afklar-skill-antal.md`). Tabellen
> nedenfor er en kurateret oversigt over udvalgte skills, ikke en komplet optælling.

### Generelle engineering-skills (fra mattpocock/skills, kurateret)

| Skill | Trigger | Formål |
|-------|---------|--------|
| `tdd` | "byg feature med tests", "red-green-refactor" | Test-driven development |
| `diagnose` | "debug this", "noget er i stykker" | Systematisk fejlfinding |
| `to-prd` | "skriv PRD", "spec fra kontekst" | Product Requirement Document |
| `to-issues` | "opdel i tickets", "plan til issues" | Issue-slicing |
| `grill-me` | "grill mig", "stresstest plan" | Kritisk planvurdering |
| `zoom-out` | "se det store billede", "arkitektur" | Bred kontekstforståelse |
| `ubiquitous-language` | "domænesprog", "glossary", "DDD" | Ordliste og begrebsafklaring |
| `improve-codebase-architecture` | "forbedr arkitektur", "refactor" | Arkitekturforbedring |
| `setup-pre-commit` | "pre-commit hooks", "husky" | Commit-sikkerhed |
| `git-guardrails-claude-code` | "block push", "git safety" | Git-sikkerhed |
| `karpathy-guidelines` | *altid aktiv* | Think before coding, simplicity, surgical changes |

### Domænespecifikke skills (Banedanmark)

| Skill | Domæne | Status |
|-------|--------|--------|
| `banebyg` | BBTR, BBE, BKP | FORELØBIG (placeholder) |
| `bdk-brand-governance` | Logo, farver, typografi | FORELØBIG |
| `bdk-gdpr-praksis` | GDPR i jernbaneprojekter | FORELØBIG |
| `bdk-legal-mapping` | Lov- og regelkrav | FORELØBIG |
| `shared-docx` | Word-dokumenter | FORELØBIG |
| `shared-quality` | Kvalitetssikring | FORELØBIG |

---

## Brain-mappe — projektets levende hukommelse

Brain-mappen følger Karpathy-inspirerede principper fra `andrej-karpathy-skills`:

| Fil | Formål | Hvornår læses |
|-----|--------|---------------|
| `context.md` | Stabil projektkontekst | Ved opstart af komplekse opgaver |
| `glossary.md` | Domænesprog og forkortelser | Når ukendte begreber mødes |
| `assumptions.md` | Ikke-verificerede antagelser | Før beslutninger træffes |
| `open-questions.md` | Uafklarede forhold | Løbende — tilføj nye under arbejdet |
| `decisions/ADR-*.md` | Arkitekturbeslutninger | Før arkitekturændringer |
| `maps/agent-map.md` | Agent-relationer og roller | Ved valg af agent |
| `maps/skill-map.md` | Skill-trigger-scope | Ved valg af skill |
| `runbooks/*.md` | Driftsguides | Ved standardopgaver |

---

## Karpathy-inspirerede adfærdsregler

Alle agenter i dette harness skal følge disse principper (integreret i `AGENTS.md` og `karpathy-guidelines` skill):

1. **Think Before Coding** — State assumptions explicitly. Stop when confused. Ask rather than guess.
2. **Simplicity First** — Minimum code that solves the problem. Nothing speculative.
3. **Surgical Changes** — Touch only what you must. Don't refactor things that aren't broken.
4. **Goal-Driven Execution** — Define success criteria. Loop until verified.
5. **Verificerbare succeskriterier** — Hver opgave skal have klare, tjekbare mål.
6. **Ingen drive-by refactoring** — Rør kun det der er nødvendigt for opgaven.
7. **Ingen spekulative features** — Byg ikke noget der ikke er efterspurgt.

---

## Validering Af `.agents`

Kør kun dette script, når du arbejder med den fremtidige/reference-runtime i `.agents/`:

```powershell
.\.agents\scripts\validate-harness.ps1
```

Scriptet kontrollerer `.agents/`-strukturen:
- `AGENTS.md` findes
- `.agents/registry.yaml` er valid
- Brain-mappen er komplet
- Hver agent har `profile.md` og `skills.yaml`
- Hver skill har `SKILL.md`
- Vendor-repoer er isoleret

---

## Kendte mangler og næste trin

| Manglende element | Status | Næste handling |
|-------------------|--------|----------------|
| ~~23 avatar-systemprompts~~ | ✅ 2026-07-10 (#8) | Forældet tal: 27 systemprompts + 27 avatar-billeder findes, 1:1-match med roster. 10 avatarløse arkiveret (PR #14). Intet hul. |
| ~~4 agenter er FORELØBIG~~ | ✅ 2026-07-10 (#5) | `udbudskonsulent`, `projektleder`, `byggeleder-tilsyn`, `interface-manager` komplettéret fra FB-PDF'er (draft, 86–101 linjer) |
| ~~6 domæne-skills er FORELØBIG~~ | ✅ 2026-07-10 (#7) | 5 fik indhold via skills-flytning; `banebyg` omskrevet til router-skill |
| Kombi-map scan | ⏳ | `Kombi/` findes ikke i nuværende repo — skal importeres eller scannes fra alternativ sti |
| Global promovering | ⏳ | Flyt færdigt harness til `C:\Users\Biyocon` som skabelon |

---

## Principper for skills

- Skills skal være **små, skarpe og komponerbare**.
- Hver skill skal have **klart trigger-scope**.
- Domænetunge regler skal ligge i `references/`.
- Scripts må kun bruges, hvor deterministisk automatisering er bedre end promptinstruktion.
- Banedanmark-specifikke skills skal adskilles fra generelle open-source-skills.
- Vendor-indhold må **ikke** redigeres direkte; kopier og tilpas i `.agents/skills/`.

---

## Regler

- Behandl `AGENTS.md` som **eneste fælles instruktionsfil** for alle LLM'er.
- Behandl `.vscode/.codex/` som den **eneste lokale kilde til sandhed** for aktiv drift (indtil `.agents/` promoveres).
- Brug ikke `.vscode/archive/` som aktiv runtime uden bevidst reaktivering.
- Slet aldrig filer du ikke selv har oprettet.
- Opdater `source-map.md` ved nye kilder.
- Skriv på dansk, medmindre tekniske standarder kræver engelsk.

---

## Licens

Intern projektstruktur — tilpass og genbrug efter behov.

---

## Referencer

- [OpenAI — Introducing Codex](https://openai.com/index/introducing-codex/)
- [GitHub — mattpocock/skills](https://github.com/mattpocock/skills)
- [GitHub — forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)