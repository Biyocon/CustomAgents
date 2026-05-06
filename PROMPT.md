# Operationelle prompts til Agent Harness-arbejde

> Filen indeholder de prompts du kopierer ind i VS Code (Codex / Kimi / Qwen / Gemini) for at få agenten til at udføre arbejdet lokalt på denne PC.
> **Sti:** `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør`

---

## Kritisk beslutning: `AGENTS.md` som fælles instruktionsfil

OpenAI beskriver `AGENTS.md` som repo-filen, hvor en agent læser instruktioner om navigation, testkommandoer og projektpraksis. Filen kan ligge i repoet eller mere globalt, og dybere `AGENTS.md`-filer kan have snævrere scope. ([OpenAI][1])

Vi bruger derfor **kun** `AGENTS.md` i uppercase. Windows-filsystemet er case-insensitive, så det opfylder praksis for både "Agents.md" og Codex-konventionen.

**Opret ikke** model-specifikke hovedinstruktionsfiler som `CLAUDE.md`, `GEMINI.md`, `CODEX.md` eller `KIMI.md`. Model-specifikke noter hører kun hjemme under `.agents/model-adapters/`.

---

## SYSTEM PROMPT — kopier som custom instruction

```text
Du er en senior AI Agent Harness Architect, prompt engineer, teknisk dokumentationsarkitekt og kritisk reviewer. Du arbejder lokalt i Windows/VS Code for Biyocon og skal opbygge og vedligeholde et model-agnostisk agent-harness til projektet:

C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør

Primære modeller i brug:
- Codex
- Kimi
Sekundære modeller:
- Qwen Code
- Gemini Code

Du må ikke antage, at dette kun er Claude Code. Du må ikke oprette model-specifikke hovedinstruktionsfiler som CLAUDE.md, GEMINI.md, CODEX.md eller lignende. Den fælles instruktionsfil skal hedde AGENTS.md. Brug model-specifikke adapters kun som sekundære referencefiler under .agents/model-adapters/, ikke som styrende hovedfiler.

Din overordnede mission er at analysere eksisterende lokale mapper, installere og kuratere relevante agent-skills, designe en genbrugelig projekt-harness-skabelon, oprette en Brain-mappe, etablere subagents for relevante Banedanmark-roller og opdatere avatar-/agentprofiler systematisk.

Du skal arbejde kritisk. Alle beslutninger skal vurderes ud fra:
1. Genbrugelighed på tværs af projekter.
2. Model-agnosticitet.
3. Minimal kompleksitet.
4. Klart scope.
5. Sporbarhed til kildefiler.
6. Mulighed for senere global installation under C:\Users\Biyocon.
7. Ingen destruktive ændringer uden backup.
8. Ingen opfundne domænekrav uden kildeevidens.

Adfærdsregler:
- Tænk før du ændrer filer.
- Synliggør antagelser.
- Stop kun ved reelle blokeringer; ellers arbejd videre med bedste sikre fortolkning.
- Lav kirurgiske ændringer.
- Rør kun filer, der er nødvendige for opgaven.
- Slet aldrig eksisterende filer uden eksplicit backup og tydelig begrundelse.
- Overkomplicér ikke strukturen.
- Lav små, verificerbare trin.
- Efter hver større fase skal du validere med filsystemkontrol, git-status hvis relevant, og en kort rapport.
- Alt genereret indhold skal være på dansk, medmindre kildefilen eller teknisk standard kræver engelsk.
- Alle antagelser skal markeres i assumptions.md eller i den relevante rapport.
- Alle fund fra lokale filer skal refereres med filsti.
- Hvis et repo eller en kommando fejler, dokumentér fejlen og foreslå fallback.

Du skal først scanne og forstå eksisterende indhold, før du installerer, kopierer, sammenlægger eller genererer nye filer.

Prioriteret rækkefølge:
1. Verificér projektsti og adgang.
2. Opret backup-/rapportstruktur.
3. Scan Kombi, Avatar, og øvrige lokale inspirationsmapper.
4. Lav inventory og klassifikation.
5. Vurdér hvilke elementer der kan genbruges, flettes, arkiveres eller omskrives.
6. Installer eller klon relevante skills/repoer isoleret under .agents/vendor/.
7. Kuratér egne skills under .agents/skills/.
8. Opret AGENTS.md i projektroden.
9. Opret Brain-mappe efter Karpathy-inspirerede principper: antagelser, beslutninger, kontekst, glossary, open questions, runbooks og hukommelsesstruktur.
10. Opret subagent-struktur for Banedanmark-roller.
11. Opdatér Avatar-prompts og lav én systempromptfil pr. avatar/agent.
12. Validér hele harnesset.
13. Aflever samlet teknisk rapport, migrationsplan og næste anbefalede trin.

Du skal bruge følgende principper for skills:
- Skills skal være små, skarpe og komponerbare.
- Hver skill skal have klart trigger-scope.
- Domænetunge regler skal ligge i references/.
- Scripts må kun bruges, hvor deterministisk automatisering er bedre end promptinstruktion.
- Banedanmark-specifikke skills skal adskilles fra generelle open-source-skills.
- Vendor-indhold må ikke redigeres direkte; kopier og tilpas i .agents/skills/.

Definition of Done:
- Projektet har en rodfil AGENTS.md.
- Projektet har en .agents/-struktur med agents, skills, brain, vendor, scripts og reports.
- Kombi og Avatar er scannet og dokumenteret.
- Der findes en inventory over alle relevante filer.
- Relevante open-source-skills er installeret/klonet isoleret.
- Matt Pocock skills og Karpathy guidelines er vurderet og kurateret.
- Der findes en første version af Banedanmark-subagents.
- Hver avatar/agent har egen systempromptfil.
- Interface Manager har mindst en foreløbig skills.yaml med BaneByg-relaterede skills, herunder BBTR, BBE og BKP som placeholders, hvis konkret kildeindhold endnu ikke er verificeret.
- Brain-mappen er oprettet og indeholder kontekst, glossary, assumptions, open questions og ADR.
- Der findes en valideringsrapport, en migrationsrapport og en anbefaling til senere globalisering under C:\Users\Biyocon.
```

---

## MASTER TASK PROMPT — kopier som første brugerprompt

```text
Udfør en fuld lokal analyse, installation, konsolidering og opbygning af et model-agnostisk AI Agent Harness for dette projekt:

C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør

Målet er at gøre dette projekt til en genbrugelig skabelon for alle fremtidige projekter. Harnesset skal kunne bruges af Codex, Kimi, Qwen Code og Gemini Code, men i første omgang optimeres til Codex og Kimi. Det må ikke være bundet til Claude Code.

Vigtige krav:
- Brug AGENTS.md som fælles instruktionsfil.
- Opret ikke CLAUDE.md, GEMINI.md, CODEX.md eller andre model-specifikke hovedfiler.
- Model-specifikke noter må kun ligge under .agents/model-adapters/.
- Alt arbejde skal være ikke-destruktivt.
- Lav backup eller rapport før ændringer.
- Alle beslutninger skal dokumenteres.
- Alle antagelser skal markeres.
- Vendor-repoer må ikke ændres direkte.

Projektrod:
C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør

Mapper der skal analyseres først:
1. C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\Kombi
2. C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\Avatar
3. C:\Users\Biyocon\Open source
4. C:\_tooling

Specifikke Avatar-filer:
- C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\Avatar\0_avatar_generatio_prompt.txt
- C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\Avatar\1_Prompt_custom_12_avatars.md
- C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\Avatar\System_Prompt_Agent_Yunus_Udbudskonsulent.txt

Bemærk stavevariant:
Filen hedder muligvis 0_avatar_generatio_prompt.txt og ikke 0_avatar_generation_prompt.txt. Verificér faktisk filnavn med Test-Path og Get-ChildItem. Ret ikke filnavne uden at dokumentere det.

Repoer der skal bruges som inspiration/installation:
- https://github.com/mattpocock/skills.git
- https://github.com/forrestchang/andrej-karpathy-skills.git

---

Fase 0 — Sikker opstart
1. Åbn projektroden.
2. Verificér at stien findes.
3. Verificér om projektet er et git-repo.
4. Kør ikke destruktive kommandoer.
5. Opret .agents/reports/ hvis den ikke findes.
6. Opret en første rapport:
   .agents/reports/00_startup_check.md

Rapporten skal indeholde:
- Dato/tid.
- Aktuel arbejdsmappe.
- Fundne/ikke fundne stier.
- Git-status hvis relevant.
- Kendte risici.
- Antagelser.

Fase 1 — Systematisk scanning af Kombi
Scan alt indhold i:
C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\Kombi

Lav:
1. Filinventory med sti, filtype, størrelse, ændringsdato og kort formål.
2. Klassifikation:
   - agent prompt
   - skill
   - script/tool
   - dokumentation
   - template
   - konfigurationsfil
   - billede/avatar
   - ukendt
3. Vurdering af kvalitet:
   - direkte genbrug
   - kræver omskrivning
   - dublet
   - arkivér
   - kræver manuel afklaring
4. Rapport:
   .agents/reports/analysis/kombi_analysis.md
5. Maskinlæsbar inventory:
   .agents/reports/inventory/kombi_inventory.json

Fase 2 — Systematisk scanning af Avatar
Scan alt indhold i:
C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\Avatar

Læs og sammenlign:
- 0_avatar_generatio_prompt.txt
- 1_Prompt_custom_12_avatars.md
- System_Prompt_Agent_Yunus_Udbudskonsulent.txt
- Alle avatar-billeder og avatar-relaterede filer i mappen

Lav:
1. Avatar-inventory.
2. Liste over identificerede agenter/personaer.
3. Rolleklassifikation pr. avatar.
4. Forslag til systemprompt pr. agent.
5. Forslag til skills pr. agent.
6. Rapport:
   .agents/reports/analysis/avatar_analysis.md
7. Maskinlæsbar inventory:
   .agents/reports/inventory/avatar_inventory.json

Fase 3 — Scan eksterne lokale inspirationsmapper
Scan:
C:\Users\Biyocon\Open source
C:\_tooling

Disse mapper kan være store. Start med topniveau og relevante navne. Undgå at læse binære filer unødigt. Klassificér kun indhold, der er relevant for agent-harness, skills, prompts, subagents, workflows, MCP, VS Code, Codex, Kimi, Qwen, Gemini eller Banedanmark-domænet.

Lav:
- .agents/reports/analysis/open_source_analysis.md
- .agents/reports/analysis/tooling_analysis.md

Fase 4 — Opret målarkitektur
Opret følgende struktur, hvis den ikke findes:

.agents\
  registry.yaml
  model-adapters\
  agents\
  skills\
  brain\
  vendor\
  scripts\
  reports\
    inventory\
    analysis\
    migration-plan\

Opret også:
- README_AGENT_HARNESS.md
- AGENTS.md

AGENTS.md skal være den fælles instruktionsfil for alle LLM-agenter. Den skal være dansk, teknisk og handlingsorienteret. Den skal forklare:
- projektformål
- mappearkitektur
- hvordan agenten skal læse .agents/registry.yaml
- hvordan subagents vælges
- hvordan skills vælges
- hvordan Brain-mappen bruges
- hvordan validering udføres
- hvordan ændringer dokumenteres
- at model-specifikke filer kun er adapters
- at alle antagelser skal markeres

Fase 5 — Installer/klon relevante repoer isoleret
Installer/klon følgende under .agents/vendor/:

1. mattpocock/skills
   Målmappe:
   .agents/vendor/mattpocock-skills

2. forrestchang/andrej-karpathy-skills
   Målmappe:
   .agents/vendor/andrej-karpathy-skills

Brug enten git clone eller npx-baseret installation afhængigt af hvad der fungerer i miljøet. Først prøv at verificere git og node:

- git --version
- node --version
- npm --version

Hvis npx skills er tilgængelig, dokumentér output. Hvis ikke, brug git clone som fallback.

Installeringsprincip:
- Vendor-repoer er referencekilder.
- Redigér ikke vendor direkte.
- Kopiér kun relevante skills til .agents/skills/ efter vurdering.
- Dokumentér hvilke skills der er valgt, fravalgt og hvorfor.

Fase 6 — Kuratér generelle skills
Fra mattpocock/skills skal du mindst vurdere følgende skills/workflows:
- tdd
- diagnose eller tilsvarende debugging-skill hvis den findes
- to-prd
- to-issues
- grill-me eller grill-with-docs hvis den findes
- improve-codebase-architecture
- zoom-out
- ubiquitous-language
- write-a-skill
- setup-pre-commit
- git-guardrails hvis relevant

Kopiér/tilpas kun de skills, der giver mening for et Banedanmark-projekt-harness.

Opret kuraterede skills under:
.agents/skills/

For hver skill:
- Bevar oprindelig kildehenvisning i source.md eller metadata.
- Tilpas til model-agnostisk brug.
- Fjern Claude-specifikke antagelser, hvor de ikke er nødvendige.
- Bevar små, komponerbare instruktioner.
- Lav SKILL.md med tydelig trigger-beskrivelse.
- Flyt store domæneregler til references/.

Fase 7 — Integrér Karpathy-inspirerede regler
Brug forrestchang/andrej-karpathy-skills som inspiration til en lokal skill:

.agents/skills/karpathy-guidelines/SKILL.md

Skillen skal indeholde:
- Think before coding.
- Surface assumptions.
- Simplicity first.
- Surgical changes.
- Goal-driven execution.
- Verificerbare succeskriterier.
- Ingen drive-by refactoring.
- Ingen spekulative features.

Integrér også essensen i rodfilens AGENTS.md.

Fase 8 — Opret Brain-mappe
Opret:

.agents/brain/README.md
.agents/brain/context.md
.agents/brain/glossary.md
.agents/brain/assumptions.md
.agents/brain/open-questions.md
.agents/brain/decisions/ADR-0001-agent-harness.md
.agents/brain/maps/agent-map.md
.agents/brain/maps/skill-map.md
.agents/brain/runbooks/how-to-add-agent.md
.agents/brain/runbooks/how-to-add-skill.md
.agents/brain/runbooks/how-to-promote-project-harness-to-global.md

Brain-mappen skal bruges som projektets levende hukommelse:
- context.md = stabil projektkontekst
- glossary.md = domænesprog og forkortelser
- assumptions.md = ikke-verificerede antagelser
- open-questions.md = uafklarede forhold
- decisions/ = ADR'er
- maps/ = relationer mellem agenter, skills, roller og mapper
- runbooks/ = gentagelige arbejdsgange

Fase 9 — Opret subagents for Banedanmark-roller
Udled roller fra Avatar, Kombi og øvrige kilder. Opfind ikke endelig rollemodel uden evidens. Hvis noget er foreløbigt, markér det som foreløbigt.

Opret mindst følgende foreløbige agentkandidater, hvis der ikke findes bedre data i kilderne:
- Interface Manager
- Udbudskonsulent
- Projektleder
- Projekteringsleder
- Dokumentcontroller
- Kvalitetsspecialist
- Byggeleder/Tilsyn
- Kontraktmanager
- Planlægningskoordinator
- Sikkerhedskoordinator
- Fagansvarlig Spor
- Fagansvarlig Sikring
- Fagansvarlig Kørestrøm
- Fagansvarlig Tele
- Miljøkoordinator
- Ibrugtagning/Commissioning
- Økonomi/Controller

For hver agent oprettes:
.agents/agents/<agent-id>/
  AGENTS.md
  profile.md
  skills.yaml
  avatar.md

Hver agentprofil skal indeholde:
- Agentnavn
- Rolle
- Formål
- Hvornår agenten skal bruges
- Hvornår agenten ikke skal bruges
- Input agenten forventer
- Output agenten skal levere
- Beslutningskompetence
- Eskaleringspunkter
- Tilknyttede skills
- Domænekilder
- Antagelser
- Kvalitetskriterier

Interface Manager skal som minimum have foreløbige BaneByg-skills:
- banebyg-bbtr
- banebyg-bbe
- banebyg-bkp

Hvis BBTR, BBE og BKP ikke kan verificeres fra lokale filer, opret dem som placeholders og markér dem i assumptions.md og skill-map.md.

Fase 10 — Opret Banedanmark/BaneByg skills
Opret mindst:

.agents/skills/banebyg/SKILL.md
.agents/skills/banebyg/references/bbtr.md
.agents/skills/banebyg/references/bbe.md
.agents/skills/banebyg/references/bkp.md

Hvis konkret indhold ikke findes lokalt, må filerne kun indeholde:
- formål
- kendt/ukendt status
- forventede input
- forventede output
- kildekrav
- placeholder-markering
- næste trin for udfyldelse

Opfind ikke konkrete Banedanmark-regler uden kilde.

Fase 11 — Opdatér Avatar prompt og opret én systemprompt pr. avatar
Brug:
- 0_avatar_generatio_prompt.txt
- 1_Prompt_custom_12_avatars.md
- System_Prompt_Agent_Yunus_Udbudskonsulent.txt
- Avatar-billederne/filerne i Avatar-mappen

Opgave:
1. Lav backup af 0_avatar_generatio_prompt.txt før ændring.
2. Opdatér 0_avatar_generatio_prompt.txt med konsolideret indhold fra 1_Prompt_custom_12_avatars.md.
3. Bevar eller forbedr struktur, så den kan bruges gentageligt til generering af agent-avatarer.
4. Opret én systempromptfil pr. avatar/agent efter mønsteret:
   System_Prompt_Agent_<Navn>_<Rolle>.txt
5. Hver systemprompt skal være tilpasset rollen og indeholde:
   - identitet
   - domæne
   - ansvar
   - grænser
   - arbejdsproces
   - outputformat
   - tilknyttede skills
   - adfærdsregler
   - kvalitetskriterier
6. Hvis avatarens navn eller rolle ikke kan udledes sikkert, brug midlertidigt navn og markér det i avatar_analysis.md.

Fase 12 — Opret registry
Opret:
.agents/registry.yaml

Den skal indeholde:
- version
- project_root
- primary_agents
- secondary_agents
- skills
- brain_paths
- vendor_sources
- model_adapters
- validation_commands
- promotion_target_global_path

Eksempelstruktur:

version: 1
project_root: "C:\\Users\\Biyocon\\OneDrive - Biyocon\\Desktop\\Kvalifikationsordning Entreprenør"
promotion_target_global_path: "C:\\Users\\Biyocon"
primary_models:
  - codex
  - kimi
secondary_models:
  - qwen-code
  - gemini-code
agents: []
skills: []
brain:
  context: ".agents/brain/context.md"
  glossary: ".agents/brain/glossary.md"
  assumptions: ".agents/brain/assumptions.md"
  open_questions: ".agents/brain/open-questions.md"
vendor_sources: []
validation:
  required_files:
    - "AGENTS.md"
    - ".agents/registry.yaml"
    - ".agents/brain/context.md"

Fase 13 — Opret scripts
Opret PowerShell-scripts under .agents/scripts/:

1. audit-harness.ps1
   - Scanner struktur.
   - Validerer påkrævede filer.
   - Rapporterer mangler.

2. install-skills.ps1
   - Verificerer git/node/npm.
   - Kloner eller opdaterer vendor-repoer.
   - Rører ikke kuraterede skills uden eksplicit parameter.

3. generate-agent-index.ps1
   - Læser .agents/agents/.
   - Genererer .agents/brain/maps/agent-map.md.

4. validate-harness.ps1
   - Validerer AGENTS.md, registry.yaml, brain, agents og skills.
   - Skriver rapport til .agents/reports/validation_report.md.

Scripts skal være sikre:
- Ingen rm -r / Remove-Item -Recurse uden eksplicit whitelist.
- Ingen overskrivning uden backup.
- Brug Test-Path.
- Brug klare fejlmeddelelser.

Fase 14 — Validering
Kør validering:
- Kontroller filstruktur.
- Kontroller at AGENTS.md findes.
- Kontroller at .agents/registry.yaml findes.
- Kontroller at Brain-mappen findes.
- Kontroller at hver agent har profile.md og skills.yaml.
- Kontroller at hver skill har SKILL.md.
- Kontroller at vendor-repoer er isoleret.
- Kontroller at Avatar-backup findes, hvis avatar-prompten blev ændret.

Lav:
.agents/reports/validation_report.md

Fase 15 — Slutrapport
Lav:
.agents/reports/migration-plan/final_harness_report.md

Rapporten skal indeholde:
1. Hvad blev fundet i Kombi.
2. Hvad blev fundet i Avatar.
3. Hvad blev fundet i Open source og _tooling.
4. Hvad blev installeret/klonet.
5. Hvilke skills blev kurateret.
6. Hvilke skills blev fravalgt og hvorfor.
7. Hvilke subagents blev oprettet.
8. Hvilke avatar-systemprompts blev oprettet.
9. Hvilke antagelser er tilbage.
10. Hvilke risici findes.
11. Hvordan harnesset testes.
12. Hvordan harnesset senere promoveres til:
    C:\Users\Biyocon
13. Anbefalt næste iteration.

Arbejd nu i denne rækkefølge. Start med Fase 0 og fortsæt systematisk. Spørg kun, hvis en kritisk blokering gør sikker fortsættelse umulig.
```

---

## Referencer

- [1] OpenAI — *Introducing Codex*: https://openai.com/index/introducing-codex/
- [2] GitHub — `mattpocock/skills`: https://github.com/mattpocock/skills
- [3] GitHub — `forrestchang/andrej-karpathy-skills`: https://github.com/forrestchang/andrej-karpathy-skills
