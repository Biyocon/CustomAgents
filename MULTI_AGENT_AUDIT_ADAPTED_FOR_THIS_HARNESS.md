# Multi-Agent Dybdeanalyse — Tilpasset skabelon til dette Agent Harness (Kvalifikationsordning Entreprenør)

**Tilpasset version af MULTI_AGENT_AUDIT_TEMPLATE.md v4.0 specifikt til dette repo/projekt.**

**Dato for tilpasning:** 2026-06-07 (baseret på systematisk scan af hele kodebasen).

---

## Projektkonfiguration (udfyldt til dette projekt)

```yaml
projekt:
  navn: "Agent Harness — Kvalifikationsordning Entreprenør (Banedanmark)"
  sti: "C:\\Users\\Biyocon\\OneDrive - Biyocon\\Desktop\\Custom"
  version: "hybrid-dual-runtime (2026-06-07 snapshot på commit 7626c697...)"
  beskrivelse: "Model-agnostisk (men primært Codex/Kimi) agent-harness til Banedanmark-entreprenør-kvalifikationsordning. Indeholder specialiserede subagents for jernbanesikkerhedsroller, genbrugelige skills (BBTR/BBE/BKP + generelle engineering), persistent Brain, Avatar-system og registry-drevet orkestrering. Aktiv runtime: .vscode/.codex/. Fremtidig model-agnostisk lag: .agents/ (under validering, ikke aktiv)."

stack:
  sprog: "Ingen enkelt app — primært Markdown/Prompts/YAML + PowerShell + Python (validering/scripts) + JSON (rosters/registry)"
  framework: "Agent-harness (skills + agents + brain) med dual runtime (.vscode/.codex aktiv + .agents fremtidig)"
  runtime: "VS Code + Codex/Kimi (primær); kompatibel med Qwen Code + Gemini Code via adapters"
  database: "Ingen — filbaseret (Markdown, YAML, JSON, PDF-kilder). Brain = struktureret filsystem-hukommelse."
  test_framework: "PowerShell validation scripts + Python verify scripts + manuel frontmatter + struktur-checks (ingen unit tests i klassisk forstand)"
  build: "PowerShell scripts (validate-harness.ps1, audit-harness.ps1, generate-agent-index.ps1) + uv run Python + manuel kuratering"

dokumenter:
  primaer_status: "AGENTS.md (rod) + .vscode/.codex/AGENTS.md + README_AGENT_HARNESS.md + reports/validation_report.md"
  sessionshistorik: "reports/ (fase-rapporter, audits, inventories) + .agents/brain/memory/ + Task/ + temp/ (delvist)"
  arbejdsregler: "AGENTS.md (alle varianter) + .agents/brain/AGENTS.md + .vscode/.codex/AGENTS.md + DESIGN.md + PROMPT.md"
  styrende_kontekst: "AGENTS.md (uppercase, model-agnostisk) + .agents/brain/context.md + .vscode/.codex/Brain/context.md"
  plan_filer:
    - "reports/final_harness_report.md"
    - "reports/migration-plan/ (hvis findes)"
    - "Task/harness-roadmap.md"
    - "DESIGN.md (arkitekturplan)"
  sekundaer_produktinfo: "README.md + README_AGENT_HARNESS.md"

arkitektur:
  lagmodel: |
    Tre-lags model (vendor / kurateret / domæne) + dual runtime:

    - Vendor (read-only upstream):
      .agents/vendor/mattpocock-skills/
      .agents/vendor/andrej-karpathy-skills/

    - Kurateret (model-agnostiske skills):
      .agents/skills/ (29+ : tdd, diagnose, karpathy-guidelines, grill-*, to-prd, to-issues, banebyg m.fl.)
      .vscode/.codex/skills/ (større samling BBTR/BBDK-domæne + kuraterede)

    - Domæne (Banedanmark-specifikt):
      .agents/agents/ + .agents/brain/
      .vscode/.codex/agents/ (Avatar/IQRA + Banedanmark-roller) + .vscode/.codex/Brain/
      Funktions- og stillingsbeskrivelser/FB/ (213+ PDF'er — primær kilde til roller)

    - Aktiv runtime (ADR-0001): .vscode/.codex/ (prompts, skills, agents, Brain)
    - Fremtidig reference (under validering): .agents/ (struktur komplet, indhold delvist tomt/mirrored)
    - Kilder/reference: Avatar/, Kombi/ (Iqra m.fl.), temp/ (build-artefakter + gamle scripts), reports/

    Vigtigste graenser:
    - Vendor må ALDRIG redigeres direkte.
    - .vscode/.codex/ er single source of truth indtil eksplicit aktiveringsbeslutning for .agents/.
    - Domæne-skills der er FORELØBIG må ikke præsenteres som verificerede.

kendte_problemer:
  - "Dual runtime drift: .agents/ er scaffoldet men tom/mirrored; .vscode/.codex/ er autoritativ (valideringsrapport 2026-05-06)"
  - "Mange FORELØBIG/placeholder skills og agenter (banebyg, bdk-*, 4 Banedanmark-roller) — afventer kildeindlæsning fra PDF'er og Funktionsbeskrivelser"
  - "23+ avatar-systemprompts mangler eller er delvist opdateret (dokumenteret i reports/inventory/)"
  - "temp/ indeholder gamle rosters, build-scripts og dubletter — skal ryddes eller flyttes til reports/ som audit-artefakter"
  - "Ingen aktiv git i nogle views — øget risiko ved strukturelle ændringer"
  - "Rod-skills/ og Task/ indeholder ældre/parallelle kopier af skills og audit-logs"
  - "Funktions- og stillingsbeskrivelser/FB/ (213+ PDF'er) er primær domænekilde men ikke fuldt struktureret ind i skills/brain"

nylige_aendringer:
  - "Phase 1-15 build af .agents/ struktur (komplet scaffold, delvist tomt)"
  - "ADR-0001: .vscode/.codex/ erklæret autoritativ indtil validering + eksplicit aktivering"
  - "Valideringsrapport 2026-05-06: dokumenterer dual-struktur problem og anbefaler oprydning/migration"
  - "Avatar inventory + Iqra-integration (11/11 prompts verificeret)"
  - "Registry.yaml i flere placeringer (rod, .vscode/.codex/agents/, .agents/) — risiko for drift"

checks:
  typecheck: "N/A (ingen kompileret app); brug i stedet struktur-checks"
  test: "powershell ./.agents/scripts/validate-harness.ps1 (eller .vscode/.codex/scripts); uv run python temp/verify_agent_harness.py; python .vscode/.codex/scripts/invoke-agent.py -l"
  lint: "Grep-baseret: navn/dir match på SKILL.md (grep '^name:' + directory name); PowerShell script-kvalitet; manuel <500 linjer check på SKILL.md"
  migration_verifikation: "Tæl filer i .agents/ vs .vscode/.codex/; sammenlign registry.yaml indhold; tjek FORELØBIG markeringer i skills"
  route_scan: "N/A (intet web framework); scan i stedet: .agents/skills/**/SKILL.md, .vscode/.codex/skills/**/SKILL.md, .agents/agents/**/profile.md + skills.yaml, Funktions- og stillingsbeskrivelser/FB/*.pdf"
  structure_audit: "powershell ./.agents/scripts/audit-harness.ps1 eller tilsvarende; tjek for dubletter mellem .vscode/.codex/ og .agents/"
  frontmatter_compliance: "For hver SKILL.md: navn == parent dir (lowercase, hyphen), description 1-1024 chars med trigger, ingen -- i navn"
  source_ingestion_status: "Gennemgå alle skills med 'FORELØBIG' eller 'placeholder' mod Funktions- og stillingsbeskrivelser/FB/ og Kombi/"
```

---

## Formål (tilpasset)

Foretag en dybdegående, evidensbaseret analyse af **dette specifikke agent-harness-projekt** med fokus på:

1. Dual-runtime sundhed (.vscode/.codex/ som aktiv sandhed vs .agents/ som fremtidig model-agnostisk lag)
2. Skill-kvalitet og frontmatter-overholdelse på tværs af 70+ skills (herunder FORELØBIG-domæneskills)
3. Agent-roster og profil-kvalitet (Avatar/IQRA vs Banedanmark-roller, DRAFT/FORELØBIG status)
4. Kilde-til-domæne sporbarhed (Funktionsbeskrivelser PDF'er → agents/skills/brain)
5. Vendor-isolation, duplication/drift, temp/ og legacy-artefakter
6. Forberedelse til global promovering (C:\Users\... profil)

---

## Ufravigelige krav (samme som original + projektspecifikke)

- Arbejd **evidensbaseret** mod faktiske filer (kodebase = prompts + Markdown + YAML + JSON + PDF-kilder + scripts).
- Brug **Sandhedskildereglen** strengt: runtime-filer + AGENTS.md-familien + valideringsrapporter > plan-filer.
- Dokumentér eksplicit:
  - Hvilke workstreams blev brugt.
  - Hvilke checks der faktisk kunne køres (PowerShell/Python vs manglende miljø).
  - Hvor FORELØBIG/placeholders blokerede fuld verifikation.
- **Aldrig** præsenter FORELØBIG skills/agents som verificerede.

---

## Agentstruktur (tilpasset dette harness)

**Koordinator** + 4 workstreams (anbefalet pga. projektets størrelse og hybrid-natur):

- **Workstream A — Dual-Runtime & Arkitektur** (fokus: .vscode/.codex/ vs .agents/, tre-lags model, duplication, vendor isolation)
- **Workstream B — Skills & Frontmatter** (fokus: name/dir match, description-kvalitet, FORELØBIG-markeringer, <500 linjer, duplication mellem .vscode/.codex/skills/ og .agents/skills/)
- **Workstream C — Agenter & Domænekilder** (fokus: roster vs profiler vs Avatar vs Banedanmark-roller, DRAFT/FORELØBIG, sporbarhed til Funktions- og stillingsbeskrivelser/FB/*.pdf og Kombi/)
- **Workstream D — QA, Drift & Risici** (krydstjek, temp/ oprydning, scripts-sundhed, promoveringsrisici, kendte problemer fra valideringsrapporter)

Hvis subagents ikke er tilgængelige: udfør sekventielt med samme rolleopdeling og eksplicit syntese.

---

## Sandhedskilderegel (projektspecifik)

1. **Aktiv runtime-filer** (.vscode/.codex/AGENTS.md, registry.yaml, skills/**/SKILL.md, agents/**, Brain/*) — højest prioritet.
2. **Rod-AGENTS.md + README_AGENT_HARNESS.md + DESIGN.md** — styrende kontekst.
3. **Reports/validation_report.md + fase-rapporter + audits/** — bedste kilde til kendt tilstand og tidligere beslutninger.
4. **.agents/brain/context.md + assumptions.md + open-questions.md** — projektets levende hukommelse.
5. **Funktions- og stillingsbeskrivelser/FB/*.pdf + Kombi/** — primære domænekilder (skal krydstjekkes mod agents/skills).
6. **Plan-filer og temp/** — kun til selektiv verifikation. Aldrig som primaer status.

Ved konflikt: **aktive runtime-filer + faktisk indhold > dokumentation**.

---

## Auditprotokol (tilpasset)

**Phase 1 — Discovery (allerede delvist udført i denne session)**
- Kortlæg dual runtime + tre-lags model.
- Identificér FORELØBIG hotspots og kilde-gaps (Funktions-PDF'er).
- Lav inventory af skills (frontmatter), agenter (status), scripts, temp/, reports/.

**Phase 2 — Targeted verification**
- Kør tilgængelige checks (validate-harness.ps1, Python verify, grep for name/dir match, FORELØBIG strings).
- Verificér stikprøver af skills (navn == dir, description med trigger, ingen --, længde).
- Verificér stikprøver af agenter mod PDF-kilder og roster.
- Tjek duplication mellem .vscode/.codex/ og .agents/.
- Marker blokeringer (f.eks. manglende PDF-tekst-ekstraktion).

**Phase 3 — Synthesis + Tilpasning af skabelon**
- Konsolider fund.
- Udfyld denne tilpassede skabelon fuldt ud.
- Lever både audit-rapport (Executive + fund) **og** den tilpassede MULTI_AGENT_AUDIT_TEMPLATE.md.

---

## Konkrete delmål (tilpasset)

**A. Dual-Runtime & Arkitektur**
- Verificér at .vscode/.codex/ er dokumenteret og behandlet som autoritativ (ADR-0001).
- Find alle steder hvor .agents/ og .vscode/.codex/ er ude af sync.
- Vurder vendor-isolation (må ikke redigeres direkte).
- Vurder tre-lags modellens overholdelse i praksis.

**B. Skills-kvalitet & Compliance**
- Tæl og klassificér alle SKILL.md (total, FORELØBIG, domæne vs generelle).
- Find alle skills hvor `name:` != parent directory name.
- Find skills uden klar trigger i description.
- Vurder om FORELØBIG-skills har tilstrækkelig "hvad er ukendt / næste trin" dokumentation.
- Tjek duplication mellem de two skills-træer.

**C. Agenter & Domæne-sporbarhed**
- Sammenlign agent-roster (JSON), .vscode/.codex/agents/banedanmark/, .agents/agents/, Avatar/agents/.
- Tjek hvor mange Banedanmark-roller der er DRAFT vs FORELØBIG vs aktive.
- Verificér stikprøver af profile.md + skills.yaml mod faktiske Funktionsbeskrivelser PDF'er.
- Vurder om Avatar/IQRA-agenter er korrekt adskilt fra Banedanmark-roller.

**D. Drift, vedligeholdelse & risici**
- Vurder scripts (PowerShell + Python) for sikkerhed og dækning.
- Klassificér temp/ indhold (nødvendigt build-artefakt vs junk).
- Vurder rapporter/ som audit-historik vs støj.
- Identificér blokeringer for global promovering.

---

## Outputformat (samme som original + tilføjet "Tilpasning af skabelon")

1. **Executive Summary** (sundhed, 3 styrker, 3 risici, 3 næste skridt)
2. **Metode** (workstreams brugt, checks der faktisk kørtes, blokeringer)
3. **Dual-Runtime & Arkitektur-analyse**
4. **Skills-kvalitet & Frontmatter-analyse** (inkl. tabel over FORELØBIG)
5. **Agenter & Domæne-sporbarhed**
6. **Drift, vedligeholdelse & Risici** (inkl. temp/, scripts, duplication)
7. **Verifikationsstatus** (Verified / Partially / Not verified per område)
8. **Prioriteret handlingsplan** (Nu / Snart / Senere)
9. **Bilag / evidensnoter**
10. **Den fuldt tilpassede MULTI_AGENT_AUDIT_TEMPLATE.md** (med udfyldt YAML + justerede workstreams/checks/output til dette harness)

Sprog: **dansk** (medmindre teknisk term kræver engelsk).

---

## Stilkriterier (samme som original)

Skriv præcist, professionelt, uden fyld. Vær tydelig om fakta vs vurdering. Konklusioner skal være direkte brugbare som beslutningsgrundlag for næste fase af harnesset (rydning, migration, kildeindlæsning, global promovering).

---

**Denne fil (MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md) er den tilpassede skabelon klar til brug på dette specifikke repo.**

Den kan nu bruges som "levende audit-skabelon" for fremtidige dybde-audits af harnesset.

---

*Tilpasning udført efter systematisk gennemgang af rod-filer, begge runtimes, skills-træer, agenter, Brain, rapporter, scripts, Funktionsbeskrivelser og kendte issues fra eksisterende valideringsrapporter.*