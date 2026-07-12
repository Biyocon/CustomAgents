# Multi-Agent Dybdeanalyse — Tilpasset skabelon til dette Agent Harness (Kvalifikationsordning Entreprenør)

**Tilpasset version af MULTI_AGENT_AUDIT_TEMPLATE.md v4.0 specifikt til dette repo/projekt.**

**Dato for tilpasning:** 2026-06-07; **re-baselinet 2026-07-12** efter fuldført ADR-roadmap A–F +
Fase G (audit: `docs/audit/AUDIT-2026-07-12-multi-agent-audit-post-roadmap.md`). Den oprindelige
2026-06-07-YAML beskrev dual-runtime-tilstanden og er erstattet nedenfor; git-historik bevarer den.

---

## Projektkonfiguration (udfyldt til dette projekt)

```yaml
projekt:
  navn: "Agent Harness — Kvalifikationsordning Entreprenør (Banedanmark)"
  sti: "C:\\Users\\Biyocon\\OneDrive - Biyocon\\Desktop\\Custom"
  version: "canonical-genereret (re-baselinet 2026-07-12 efter ADR-roadmap A–F + Fase G)"
  beskrivelse: "Model-agnostisk agent-harness til Banedanmark-entreprenør-kvalifikationsordning. CANONICAL lag: .agents/ (47 agenter = 28 personaer + 19 rolleagenter; 107 skills; 7 adaptere; brain). Runtime-lag GENERERES af .agents/scripts/generate-runtime.py: .vscode/.codex/agents/ + Brain-pointer (codex-adapter) og .claude/agents/ 47 subagenter (claude-code-adapter). Gating: pre-commit + CI kører skema- og sync-vagt. Fase G: generisk skabelon promoveret til ~\\.agents\\templates\\customagents-harness."

stack:
  sprog: "Markdown/Prompts/YAML + Python (generator/validering) + PowerShell (harness-audit) + JSON (roster)"
  framework: "Agent-harness: canonical .agents/ -> genererede runtime-lag pr. adapter (codex + claude-code aktive; kimi/ollama/gemini/cursor/qwen-code planned)"
  runtime: "VS Code + Codex (primær), Claude Code (aktiveret 2026-07-12); Kimi/Qwen/Gemini via AGENTS.md"
  database: "Ingen — filbaseret. Memory-klasser: CANONICAL (.agents/brain/) / RUNTIME-LOKAL (genereret pointer) / SNAPSHOT (memory/diary/reports), jf. docs/architecture/memory-governance.md"
  test_framework: "validate-schemas.py (JSON Schema, gating) + generate-runtime.py --check (sync-vagt, gating) + Validate-Harness-Unified.ps1 (Sektion A–H). Adfærds-testsuite er fortsat åbent spørgsmål (brain/open-questions #5–6)"
  build: "uv run python .agents/scripts/generate-runtime.py (--apply/--check); .githooks/pre-commit + .github/workflows/validate.yml"

dokumenter:
  primaer_status: "primer.md (sessionsstart-kondensat) + systemkort.md (autoritativ arkitektur) + AGENTS.md (rod)"
  sessionshistorik: ".agents/brain/memory/ (append-only snapshots) + docs/audit/ + docs/done/ (13 lukkede tickets)"
  arbejdsregler: "AGENTS.md (rod) + .agents/brain/ + docs/architecture/memory-governance.md"
  styrende_kontekst: "primer.md + .agents/brain/context.md + docs/architecture/ADR-multi-runtime-agent-system.md (Accepted, roadmap A–F ✅)"
  plan_filer:
    - "PROJEKT_PLAN.md (idébank) + DEPS.md (afhængigheder)"
    - "docs/plans/arkiv/ (KØREPLAN, FORBEDRINGSNOTAT, runtime-konsolidering — historik)"
  sekundaer_produktinfo: "README.md + README_AGENT_HARNESS.md"

arkitektur:
  lagmodel: |
    Tre-lags model (vendor / kurateret / domæne) + canonical->genereret:

    - Vendor (read-only upstream, pinnet): .agents/vendor/{mattpocock,andrej-karpathy}-skills/
    - Kurateret: .agents/skills/ (107; eneste skill-lag; runtime har kun bevidst banebyg-leftover)
    - Domæne: .agents/agents/ (28 personaer + banedanmark/ 19 rolleagenter) + .agents/brain/
      + Funktions- og stillingsbeskrivelser/FB/ (213+ PDF'er — primær kilde; K-verifikation
      udført for 5 rolleprofiler 2026-07-12 via pdftotext)

    - CANONICAL: .agents/ (ADR Accepted 2026-07-09; aktiveret PR F 2026-07-11, gate GODKENDT)
    - GENERERET: .vscode/.codex/agents/ + Brain-pointer + .claude/agents/ (--check = drift-vagt)
    - Haandvedligeholdt runtime-eget (bevidst, udenfor --check): .vscode/.codex/prompts/,
      config.toml, agent-roster.json (vagtes af harness Sektion G)

    Vigtigste graenser:
    - Vendor maa ALDRIG redigeres direkte.
    - Genererede filer haandredigeres ALDRIG; rediger canonical -> --apply -> --check exit 0.
    - FORELØBIG/draft maa ikke praesenteres som verificeret (28 nye skills baerer
      Verifikationsstatus-sektion; 3 rolleagenter er draft med dokumenterede forbehold).

kendte_problemer:
  - "31 aeldre skill-descriptions mangler eksplicit trigger (batch-PR anbefalet, audit 2026-07-12)"
  - "28 nye domæneskills er FORELØBIG indtil krydstjek mod Banedanmarks officielle kilder"
  - "Global ~/.claude/skills-kopi er tredje ustyret kopi med encoding-korruption (uden for repo; beslutning udestaar)"
  - "Skabelonen mangler examples/ + parametrisering af ROLE_CONTAINER (naeste promoveringsrunde)"
  - "Logopakken bor i temp/ men er load-bearing for 3 brand-skills (flyt anbefalet)"
  - ".codex-rodflytning besluttet udskudt (kraever ekstern verifikation af Codex-soegesti)"

nylige_aendringer:
  - "2026-07-11: ADR-roadmap A–F FULDFØRT — generator, memory-governance, AKTIVERING (gate GODKENDT, ticket #1 lukket); post-oprydning (Brain-pointer, registry 4->2)"
  - "2026-07-12: steps 1–10 — sandhedsoprydning, gating (hook+CI), persona-lag paa target-kontrakt (fence/fold-in/dedup-vagt), claude-code aktiveret (47 subagenter), domænemodning (K-verifikation 5 profiler + 28 skills), Fase G-promovering (ADR-0004)"
  - "2026-07-12: multi-agent audit (denne skabelon re-baselinet; rapport i docs/audit/)"

checks:
  typecheck: "N/A; strukturchecks via validate-schemas.py (gating)"
  test: "uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py; uv run --with pyyaml python .agents/scripts/generate-runtime.py --check; powershell scripts/Validate-Harness-Unified.ps1; python .vscode/.codex/scripts/invoke-agent.py -l"
  lint: "validate-schemas.py haandhaever name==dir + description 1-1024; <500 linjer paa SKILL.md er manuel stikproeve (kendt undtagelse: bbtr-webdesign)"
  migration_verifikation: "generate-runtime.py --check (semantisk registry-diff + profil-diff + Brain-pointer + avatar-dedup + skills-leftover + dangling-ref-vagt), exit 0 = i sync"
  route_scan: "scan: .agents/skills/**/SKILL.md, .agents/agents/**/profile.md, .agents/model-adapters/*.md, FB/*.pdf"
  structure_audit: "powershell .agents/scripts/audit-harness.ps1 (koeres via Validate-Harness-Unified Sektion E)"
  frontmatter_compliance: "haandhaeves af validate-schemas.py (gating siden 2026-07-12)"
  source_ingestion_status: "Gennemgaa skills/profiler med FORELØBIG/Verifikationsstatus mod FB/*.pdf (pdftotext virker; Kombi/ findes ikke i repoet)"
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