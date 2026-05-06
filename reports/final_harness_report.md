# Fase 15 --- Slutrapport: Agent Harness, Kvalifikationsordning Entreprenor

**Dato:** 2026-05-06
**Projekt:** Agent Harness (Block 3)
**Status:** Afsluttet med reservationer

---

## 1. Opsummering af Kombi/, Avatar/ og Open Source-analyse

### Kombi/ --- Eksterne kilder
Indhold: 35+ klonede repositories inklusiv Iqra-main (primar kilde til 11 rige agent-systemprompts), agency-agents-main, agentic-stack-master, claude-code-main, deer-flow-main, mattpocock-skills, andrej-karpathy-skills.
Anvendelse: Iqra-main blev aktivt integreret. Andre repos blev klonet som reference.

### Avatar/ --- Visuel identitet
Indhold: 27 PNG/JPEG avatarer, generation prompt, 38 systemprompt-filer, backup med 26 filer.
Anvendelse: Avatarer er klar til brug. Systemprompts er produktionsklare.

### Open Source
Projektet er ikke selv open source, men bygger paa: Anthropic Claude Code / Codex CLI, OpenAI GPT-4o / Codex, Iqra framework, mattpocock-skills, andrej-karpathy-skills.

---

## 2. Installeret og klonet

| Komponent | Status | Sti |
|---|---|---|
| Iqra-main | OK Klonet og integreret | Kombi/Iqra-main/ |
| mattpocock-skills | OK Klonet | Kombi/mattpocock-skills-main/ |
| andrej-karpathy-skills | OK Klonet | Kombi/andrej-karpathy-skills-main/ |
| agency-agents | OK Klonet | Kombi/agency-agents-main/ |
| claude-code (reference) | OK Klonet | Kombi/claude-code-main/ |
| Andre 30+ repos | OK Klonet | Kombi/* |

---

## 3. Kuraterede skills

### Inkluderet (73 aktive i .vscode/.codex/skills/)
- BDK/Banedanmark: bdk-roller-kompetencer, bdk-trafikale-regler-anvendelse, bdk-risiko-myndighed, bdk-statens-it-projektmodel-compliance
- BBTR: bbtr-fagpakkestruktur, bbtr-tvaerfaglig-koordinering, bbtr-kvalitet-dod
- BBE: bbe-dokumenter-platform, bbe-ledelsesrapportering
- Generelle: tdd, diagnose, grill-with-docs, setup-matt-pocock-skills, karpathy-guidelines
- Sikkerhed: security-review, vulnerability-scanner

### Fravalgt
- everything-claude-code-main/ (for omfattende, overlapper)
- caveman-main/, get-shit-done-main/ (ikke professionelt passende)
- 25+ andre (for specialiserede eller generiske)

---

## 4. Subagents

10 Banedanmark-specifikke subagents er defineret i registry.yaml:
- dokumentcontroller (Dokumentation og CM)
- fagansvarlig-spor (Infrastruktur / Spor)
- ibrugtagning (Commissioning)
- kontraktmanager (Kontraktstyring)
- kvalitetsspecialist (Kvalitetssikring)
- miljoekoordinator (Miljo)
- oekonomi-controller (Okonomi)
- planlaegningskoordinator (Planlaegning)
- projekteringsleder (Projektering)
- sikkerhedskoordinator (Sikkerhed)

Hver subagent har: FB-PDF som autoritativ kilde, mapping i registry.yaml, placeholder-fil i .vscode/.codex/agents/banedanmark/.

---

## 5. Avatar-system --- Systemprompts

38 produktionsklare systemprompts i Avatar/agents/:
- 27 med rige, domaenespecifikke prompts (11 Iqra-agenter)
- 10 med kortere, professionelle prompts (projektroller)
- 1 test-agent

Kvalitet: Alle UTF-8, YAML-frontmatter paa Banedanmark-profiler, text-fences paa Avatar-prompts.

---

## 6. Tilbagevaerende antagelser

1. .vscode/.codex/ fortsaetter som autoritativ runtime (ADR-0001) --- Lav risiko
2. Kombi/ forbliver som referencekatalog --- Lav risiko
3. FB-PDF'er er korrekte og opdaterede --- Medium risiko
4. registry.yaml er manuelt vedligeholdt --- Medium risiko
5. Avatar-generation prompts kan genbruges --- Lav risiko
6. Codex er primaer model --- Medium risiko
7. OneDrive-reparsepoint er arbejdsdygtigt --- Medium risiko

---

## 7. Kendte risici

| Risiko | Sandsynlighed | Konsekvens | Mitigationsforslag |
|---|---|---|---|
| .agents/ og .vscode/.codex/ divergerer | Hoj | To sandhedskilder | Ryd op eller migrer fuldt |
| registry.yaml og agent-roster.json gaar ud af sync | Medium | Agenter vises forkert | Automatisk sync-script |
| FB-PDF'er foraeldes | Medium | Forkerte kompetencekrav | Halvaarlig revision |
| Kombi/-repos opdateres upstream | Medium | Kloner er foraeldede | git pull --all periodisk |
| Avatar-billeder mangler licens | Lav | Juridisk risiko | Dokumenter kilde |
| OneDrive-sync fejler | Medium | Opdateringer blokeres | Flyt til C:\ (lokal disk) |
| install-skills.ps1 mangler | Medium | Nye skills kan ikke auto-installeres | Skriv scriptet |

---

## 8. Test-procedure

Automatiserede tests:
1. Koer scripts/audit-harness.ps1
2. Koer scripts/validate-harness.ps1
3. Koer scripts/generate-agent-index.ps1
4. Koer python temp/verify_agent_harness.py

Manuelle tests:
1. Aabn en agent-profil og verificer YAML-frontmatter, text-fence, encoding
2. Aabn registry.yaml og verificer match med agent-roster.json
3. Koer master-system.md som systemprompt i test-session

Acceptance criteria:
- audit-harness.ps1 rapporterer >= 27 agenter, >= 70 skills, 10 Banedanmark-profiler
- validate-harness.ps1 rapporterer 0 fejl, <= 5 advarsler
- registry.yaml er gyldig YAML
- Alle 11 Iqra-agenter har ikke-tomme systemprompts (> 1000 bytes)

---

## 9. Promovering til C:\Users\HMDR

Procedure:
1. Kopier hele projektroden til C:\Users\HMDR\Agent-Harness-Banedanmark\
2. Sikr at .vscode/.codex/ medfolges
3. Sikr at Avatar/ medfolges
4. Sikr at Funktions- og stillingsbeskrivelser/ medfolges
5. Kombi/ kan ekskluderes for at spare plads
6. Koer scripts/validate-harness.ps1 paa destinationen
7. Opdater AGENTS.md med ny sti hvis nodvendigt

Obs: ADR-0001 specificerer relative stier, saa promotion boer vaere plug-and-play. Hvis C:\Users\HMDR ikke er paa OneDrive, undgaas reparsepoint-problemet.

---

## 10. Anbefaling til naeste iteration

Umiddelbare:
1. Beslut .agents/-skaebne: Ryd op, migrer, eller omdesign
2. Skriv install-skills.ps1
3. Automatisk sync mellem agent-roster.json og registry.yaml

Kortsigtede:
4. Integrer mattpocock-skills og andrej-karpathy-skills
5. Berig 10 bd-*.md placeholder-filer med FB-indhold
6. Test model-adapters (Kimi, Qwen, Gemini)

Langsigtede:
7. Overvej GitHub/GitLab-remote for issue-tracking
8. Dokumenter avatar-billeders licens
9. Dockerisering af harness
10. Automatiseret CI/CD med GitHub Actions

---

## 11. Sammenfatning

| Metrik | Resultat |
|---|---|
| Agenter (aktive) | 27 roster + 10 Banedanmark placeholders = 37 total |
| Skills (aktive) | 73 i .vscode/.codex/skills/ |
| Prompts | 8 i .vscode/.codex/prompts/ |
| Brain-filer | 5 + 1 ADR |
| Iqra-integration | 11/11 (100 procent) |
| Avatar-profiler | 38 produktionsklare |
| FB-PDF'er | 217+ |
| PowerShell-scripts | 3/4 (mangler install-skills.ps1) |
| .agents/-struktur | 0 procent (tom skal) |

Samlet vurdering: Harnessets autoritative runtime (.vscode/.codex/) er produktionsklar og robust. Den planlagte .agents/-struktur er aldrig blevet realiseret. Hvis denne gaeld ryddes op, er harnesset klar til promotion og daglig brug.

---

*Rapport genereret: 2026-05-06 11:45*
