# Multi-Agent Audit 2026-07-12 — post-roadmap (A–F + Fase G + steps 1–10)

**Udført jf.:** `MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md` (koordinator + 4 workstreams A–D,
alle read-only, parallelle). **Evidensregel:** kun selvkørte checks og selvtalte tal; sandhedskildeorden
(aktive filer + faktisk indhold > dokumentation) håndhævet. **Sprog:** dansk.

---

## 1. Executive Summary

**Samlet sundhed: GRØN med kendte, dokumenterede forbehold.** Canonical→genereret-arkitekturen
holder verificerbart: begge gates (skema + sync) kørt med exit 0 af auditens egne agenter; alle
fire 47-agent-mængder (canonical registry, canonical profiler, genereret runtime, genererede
Claude-subagenter) er id-identiske; K-verifikationen fra domænemodningen holdt **8/8** påstande i
uafhængig stikprøve mod PDF-kilderne — inklusive de svære negative claims (tomme beføjelseskolonner).

**3 styrker:** (1) Dobbelt gating (pre-commit + CI) med semantiske vagter — registry-diff,
dangling-ref-vagt, dublet-genopstan, avatar-dedup, mojibake; begge verificeret grønne i auditen.
(2) Frontmatter-hygiejne 107/107 skills + 47/47 profiler, 0 skemafejl, 0 mojibake i canonical.
(3) Profilerne dokumenterer egne usikkerheder eksemplarisk (trunkerede PDF-felter, tolkninger,
indikative K-niveauer markeret ikke-bindende).

**3 risici (før denne audits rettelser):** (1) Runtime-prompten `master-system.md` prætenderede
stadig `.vscode/.codex/` som kilde til sandhed og blev aktivt indlæst via rod-AGENTS.md → **RETTET**.
(2) README_AGENT_HARNESS + README-tabeller + runtime-AGENTS.md bar modsigende arkitekturpåstande →
**RETTET**. (3) Generator-dækningshuller (prompts/, config.toml, agent-roster.json udenfor --check)
→ **DOKUMENTERET som bevidst håndvedligeholdt** i codex-adapteren (option b); roster krydstjekkes
fortsat af harness Sektion G.

**3 næste skridt:** (1) Batch-PR: trigger-sætning i 31 ældre skill-descriptions. (2) Næste
promoveringsrunde: examples/ (minimal registry+agent+skill) + parametrisér ROLE_CONTAINER i
skabelonens generator. (3) Afgør ~/.claude/skills-globalkopiens fremtid (tredje ustyret kopi med
encoding-korruption, uden for repo).

---

## 2. Metode

4 parallelle workstreams (A: Runtime/Arkitektur, B: Skills, C: Agenter/Domæne, D: QA/Drift/Risici),
alle read-only. **Checks faktisk kørt af auditen selv:** `generate-runtime.py --check` (exit 0,
begge adaptere), `validate-schemas.py` (exit 0, 0 overtrædelser), `py_compile`, git-forensik på
vendor/prompts/roster, programmatiske id-mængde-sammenligninger (json+yaml), pdftotext-genlæsning
af 3 FB-PDF'er (stikprøve), diff kurateret-vs-vendor, find/tælling af temp/reports/arkiv/skabelon.
**Ikke kørt:** audit-harness.ps1/Validate-Harness-Unified.ps1 (skriver rapport + roterer .bak —
brød read-only-kravet; vurderet statisk; kørt af hovedsessionen umiddelbart efter).
**Blokeringer:** ingen. pdftotext viser CP1252-artefakter for æ/ø/å men indholdet er entydigt.

---

## 3. Runtime & Arkitektur (Workstream A)

**Verifikationsstatus: VERIFIED** for canonical→genereret (exit 0-gates, GENERERET-headers,
core.hooksPath aktiv, CI identisk); registry-landskab bekræftet = 2 + gitignored build.
Vendor-isolation intakt (0 lokale ændringer; upstream pinnet b843cb5e; kurateret tdd-kopi
byte-identisk med vendor — bevidst 1:1-spejl).

Fund (alle håndteret i denne commit-serie, jf. §8): master-system.md stale sandhedspåstand
(HØJ→rettet); runtime-AGENTS.md stale (MELLEM→rettet); generator-dækningshul prompts/config/
roster (MELLEM→dokumenteret som bevidst håndvedligeholdt i codex.md, roster vagtes af Sektion G);
codex.md body-selvmodsigelse (LAV→rettet); roster-.bak i runtime-laget (LAV→slettet);
skills-README-placeholder (LAV→erstattet med kanonisk-kilde-pointer).

## 4. Skills & Frontmatter (Workstream B)

**Selvtalte metrics:** 107 skills (38 bbtr- + 37 bdk- + 2 øvrige domæne + 30 generelle); 28 nye
fra 2026-07-12, alle med FORELØBIG + `## Verifikationsstatus` + eksplicit trigger; name==dirname
107/107; referencer 86 tjekket, ingen reelle brud (9 bare-relative cross-skill-pointers har
korrekt fuld sti andetsteds i samme fil).

Fund: 31 ældre skills mangler trigger-sætning (MELLEM→**anbefalet batch-PR**, ikke udført her —
indholdsændring på tværs af verificerede skills hører i egen ændring); Verifikationsstatus-
boilerplate i de 28 nye kunne per-skill-specificeres (LAV→accepteret; kilderne står i body);
bbtr-webdesign 684 linjer >500-grænsen (LAV→anbefalet split, udestår); global ~/.claude/skills-kopi
korrupt/ustyret (LAV, **uden for repo**→anbefalet beslutning: generér fra canonical eller afinstallér).

## 5. Agenter & Domænesporbarhed (Workstream C)

**Selvtalte metrics:** 47 = 47 = 47 = 47 (registry/canonical/claude/build, id-identiske);
27 = 27 roster↔Avatar; 19 rolleagenter (16 active / 3 draft, konsistent på tværs af frontmatter/
registry/runtime-stikprøve). **K-verifikations-stikprøve: 8/8 påstande bekræftet** mod PDF'erne
(projektleder 4/4 inkl. de to eneste beføjelser; byggeleder-tilsyn 4/4 inkl. negativt claim om tom
beføjelseskolonne emne L). Draft/FORELØBIG præsenteres aldrig som verificeret.

Fund: genererede Claude-agenter droppede draft-status (MELLEM→**rettet**: generatoren propagerer
nu `[DRAFT — ikke fuldt verificeret]` i description; regenereret og verificeret); persona-status-
semantik udokumenteret (LAV→rettet: registry-headerkommentar); .bak-filer i canonical/genereret træ
(LAV→slettet); skabelon-YAML-afstand (INFO→rettet: skabelonen er re-baselinet, se §10).

## 6. QA, Drift & Risici (Workstream D)

**Verifikationsstatus: VERIFIED** for gates (exit-koder fanget separat), scripts (statisk + compile),
oprydningstilstand (temp 15 tracked + 2 tomme dirs→fjernet; docs/active 0; .bak-rotation cap=5
overholdt), global skabelon (24→26 filer efter CI-skeleton).

Fund håndteret: README_AGENT_HARNESS groft forældet (HØJ→omskrevet: canonical-regler + reelle
gates); README-tabeller selvmodsigende FORELØBIG (MELLEM→erstattet med kanonisk-kilde-pointers);
AGENTS.md dobbeltformat-beskrivelse (MELLEM→rettet); skabelon manglede CI-workflow-skeleton
(MELLEM→**tilføjet** github-workflows-skeleton/validate.yml). Dokumenteret/udskudt: skabelon-
examples + ROLE_CONTAINER-parametrisering (næste promoveringsrunde); logopakke-i-temp
(load-bearing asset, flyt anbefalet i egen ændring pga. 3 skill-referencer); hook validerer
working tree ikke staged index (accepteret risiko, CI er bagstopper); upinnede CI-deps (lav risiko).

---

## 7. Verifikationsstatus (samlet)

| Område | Status |
|---|---|
| Canonical→genereret sync (begge adaptere) | **Verified** (exit 0, uafhængigt kørt) |
| Skema-conformance (47+107+7) | **Verified** (0 overtrædelser, uafhængigt kørt) |
| Gating (hook + CI) | **Verified** (hook aktiv, CI-fil læst, samme vagter) |
| K-verifikation af rolleprofiler | **Verified i stikprøve** (2 af 5 profiler, 8/8 påstande); øvrige 3 dokumenteret af workflowet 2026-07-12 |
| Skill-kvalitet (nye 28) | **Verified** (struktur/trigger/verifikationsstatus 28/28) |
| Skill-kvalitet (79 ældre) | **Partially** (heuristik + stikprøver; 31 trigger-mangler flagget) |
| Vendor-isolation | **Verified** (git-forensik + diff-stikprøve) |
| Global skabelon | **Partially** (komplet for kernen; examples mangler bevidst) |

## 8. Prioriteret handlingsplan

**NU (udført i denne commit-serie):** master-system.md + runtime-AGENTS.md + README_AGENT_HARNESS +
README-tabeller + AGENTS.md-byggestatus rettet til post-F-sandhed · codex.md artefakt-dækning
præciseret + body-selvmodsigelser fjernet · draft-status propageres i genererede Claude-agenter ·
registry-status-semantik dokumenteret · 5 .bak-filer + 2 tomme temp-dirs fjernet · skills-README
afmanualiseret · CI-skeleton føjet til global skabelon · skabelonen (§10) re-baselinet.

**SNART:** trigger-batch for 31 ældre skills · bbtr-webdesign-split · ~/.claude/skills-beslutning ·
logopakke-flyt (med skill-ref-opdatering).

**SENERE:** examples/ + parametrisering i skabelonen (næste promoveringsrunde) · evt. roster+prompts
ind under generatoren · adfærds-testsuite (open-questions #5–6) · flere adapter-aktiveringer.

## 9. Bilag / evidensnoter

Fuld struktureret workstream-output (checks, evidens pr. fund med fil:linje, selvtalte metrics):
workflow-run `wf_c1b0d7a6-7fc` (4 agenter, 105 tool-kald, alle strukturerede resultater i
sessionens workflow-journal). Nøglekommandoer og exit-koder er citeret i §2–§6.
K-digest for domænemodningen: workflow-run `wf_8645d7cb-b25` (11 agenter, 143 tool-kald).

## 10. Opdateret skabelon

Leveret som opdatering af `MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md` i samme commit
(YAML re-baselinet til post-Fase-G-tilstanden; historik-note bevaret).
