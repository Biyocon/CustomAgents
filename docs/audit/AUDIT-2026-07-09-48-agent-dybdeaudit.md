# Multi-Agent Dybdeaudit — Hele Harnessets Logik (48 agenter, ende-til-ende)

**Dato:** 2026-07-09
**Kørt via:** PROMPT_MULTI_AGENT_DEEP_AUDIT_48.md, workflow `wf_ac39a6e6-8e0`
**Fase udført:** Discovery → Deep-Audit → Rehearsal → Adversarial Verification (39 agenter). Implementering (Phase 4, 8 agenter) er **ikke** kørt — afventer godkendelse, jf. gate.
**Rå journal:** `subagents/workflows/wf_ac39a6e6-8e0/journal.jsonl` (session-lokal, ikke i repo)

> **OPDATERING (samme dag, 2026-07-09, senere):** Efter denne audit blev udført besluttede
> projektejer at gøre `.agents/` canonical (ADR-multi-runtime-agent-system.md → Accepted) og
> flyttede efterfølgende hele `.vscode/.codex/skills/`-indholdet permanent til `.agents/skills/`
> (commit `ff2e3907`). Skills-relaterede fund i denne rapport (74 vs. 34 skills-splittet,
> "40 BDK/BBTR-skills findes kun i .codex", 15 BOM-filer m.fl.) beskriver derfor tilstanden
> **før** flytningen — de fleste af de konkrete filfejl (mojibake, BOM) blev allerede rettet
> som del af Phase 4 samme dag og fulgte med til `.agents/skills/` i flytningen. Se
> `docs/architecture/registry-reconciliation.md` og `docs/active/#3-afklar-skill-antal.md`
> for den opdaterede status. Resten af rapporten (agent-roster, PM-system, ADR-modsigelser,
> script-triplikering) er upåvirket og fortsat gældende.

---

## 1. Executive Summary

**Sundhed: 45/100.** Harnesset er strukturelt intakt (alle validate-scripts kører exit 0, ingen filer mangler), men **governance er kørt løbet fra udførelse**: projektet har allerede diagnosticeret sig selv korrekt (ADR-0002, ADR-multi-runtime, tickets #1/#2/#11, AUDIT-2026-07-01) — problemet er at ingen af de besluttede handlinger er udført. 64 kritisk/høj-fund overlevede uafhængig adversarial afprøvning (5 skeptikere, 0 blev afvist).

**3 styrker:**
- Selv-diagnosen er præcis: repoets egne ADR'er, tickets og audit-rapporter navngiver næsten alle problemer denne audit også fandt. Det er ikke et blindt projekt.
- Ingen datatab: alle 3 validate/audit-scripts kører uden fejl (exit 0); kerne-strukturen (registries, agent-profiler, skills) er til stede og læsbar.
- Sikkerhedsregler overholdes i praksis — ingen secrets fundet, ingen destruktive handlinger udført under audit.

**3 kritiske risici:**
1. **Governance-beslutninger er ikke truffet.** ADR-multi-runtime-agent-system.md står "Proposed" i 3+ uger og modsiger direkte ADR-0002 ("Accepted") — ingen kan i dag sige med sikkerhed hvilken runtime der er sand, fordi selve beslutningsdokumentet aldrig blev lukket.
2. **Hele PM-systemet (KØREPLAN, PROJEKT_PLAN, FORBEDRINGSNOTAT, DEPS, docs/active, docs/audit, docs/drafts, docs/Task) er untracked i git** — samme sårbarhed som allerede forårsagede OneDrive-korruptionshændelsen 2026-07-02. Governance-laget der skal forhindre gentagelse er selv eksponeret for gentagelsen.
3. **Mindst 3 filer er byte-korrupte** (`\x08`-kontroltegn har erstattet bogstaver i `.agents/agents/{ahmad-el-wali,hamsa-afloebsingenioer,hassan-dahir}/profile.md`) og 6 SKILL.md-filer er dobbelt-UTF8-mojibake-korrupte (æ/å/ø → Ã¦/Ã¥/Ã¸), heriblandt GDPR- og legal-mapping-skills der bruges til reelle compliance-beslutninger.

**3 næste skridt:** se §9 Handlingsplan.

---

## 2. Metode

- **39 agenter kørt** (8 discovery + 16 deep-audit [correctness+consistency × 8 domæner] + 10 rehearsal + 5 adversarial), 0 fejl efter en schema-rettelse undervejs (se nedenfor), 1011 tool-kald, ~3,08M subagent-tokens, ~24 min samlet kørselstid.
- **1 teknisk fejl undervejs, rettet og genkørt:** første kørsel fejlede for alle 16 audit-agenter pga. en ugyldig JSON-schema-property-nøgle (`område`, indeholder æ/å — API'et kræver ASCII-nøgler). Rettet til `omraade`, genkørt med cache-genbrug af de 23 allerede lykkedes agenter (discovery + rehearsal + adversarial), kun de 16 audit-kald + den efterfølgende adversarial-syntese kørte live anden gang.
- **Checks der faktisk kørte** (ikke kun læst): `.agents/scripts/validate-harness.ps1`, `.agents/scripts/audit-harness.ps1`, `scripts/audit-harness.ps1`, `uv run python temp/verify_agent_harness.py` — alle exit 0. Fulde konsol-output er gengivet i rehearsal-fundene (§5).
- **Blokeringer:** PDF-tekstindlæsning i domain-source-traceability var mulig (agenten læste flere FB-PDF'er direkte), men kun stikprøve (11 af 213 profiler) — ikke udtømmende. Ingen andre blokeringer; alt planlagt evidensindsamling lykkedes.
- **Adversarial resultat:** 172 fund totalt, 64 klassificeret kritisk/høj og sendt til uafhængig modbevisning (5 skeptikere). **0 blev afvist** — alle 64 holdt til direkte filkontrol/kommando-genkørsel af en uafhængig agent. 108 fund er middel/lav (se §6 tabel).

---

## 3. Logik-flow-analyse (pr. domæne)

**Dual-runtime-sync:** 4 forskellige `registry.yaml`-filer med 3 uforenelige schemas og ingen synkroniseringsmekanisme. `project_root` er forældet i to af dem (peger stadig på det gamle projektnavn "Kvalifikationsordning Entreprenoer", ikke "Custom"). Agent-rostermodellen er splittet mellem rollebaseret (.codex/banedanmark) og personabaseret (.agents/agents) med ZERO overlap på de 14 Banedanmark-rolleagenter. Dette er allerede kendt og dokumenteret (open-questions.md Q7-Q8, registry-reconciliation.md) — men ikke udført.

**Skills-kvalitet:** 108 SKILL.md-filer auditeret. 23 har mindst én frontmatter-violation; 4 er selv-mærket FORELØBIG. 4 rodårsager: (1) 6 filer bruger legacy `trigger:`-schema uden `name:`-felt, (2) 1 fil har for-lang description (1202 tegn > 1024-grænse), (3) 1 fil er 683 linjer (over ~500-grænsen), (4) **15 filer har UTF-8 BOM**, og **6 af disse er også dobbelt-mojibake-korrupte** i selve brødteksten (ikke kun frontmatter) — heriblandt GDPR- og legal-mapping-skills.

**Agent-roster & profiler:** 3 parallelle agent-definitionssystemer. `agent-roster.json` (37 entries) er ikke opdateret siden 2026-05-06 og peger stadig på 10 arkiverede agenters filer der blev flyttet 2026-06-17 — samtidig mangler den nye `council-chairman`-agent helt. Banedanmark-rollerne har intern dobbeltformat (14 flade `bd-*.md`-filer sideløbende med 14 undermapper, delvist ikke-overlappende sæt).

**Domæne-sporbarhed:** Kildeaudittens egen metodenote siger eksplicit "PDF-indhold kunne ikke parses — kun filnavne" — men samme rapport kalder sin mapping-tabel "verificeret HIGH confidence". Direkte PDF-læsning afslørede mindst ét reelt fejlmatch (Ahmad El-Wali ↔ Administrerende direktør — vidt forskelligt ansvarsområde) samt 2 opdigtede rollenavne uden tilsvarende PDF-fil.

**Brain/hukommelse:** To Brain-kopier modsiger hinanden og begge er forældede — ingen nævner Claude eller Ollama selvom ADR-multi-runtime kræver 5 mål-runtimes. `.vscode/.codex/Brain/` (den erklærede aktive runtimes hukommelse) er frosset siden Initial_commit; kun `.agents/brain/` (den "ikke-aktive" kandidat) er reelt vedligeholdt.

**Scripts/validering:** 3 uafhængige "validate harness"-implementeringer tjekker forskellige, ikke-overlappende strukturer — kørsel af den forkerte giver en falsk-ren rapport for reel drift. Mindst 2 bekræftede silent no-ops (en regex der aldrig kan matche, en anden der grabber forkert felt).

**PM/Task-rapportering:** Hele "det nye PM-system" er untracked i git. Task #12 ("done") citerer 3 commit-SHA'er der er dangling (unreachable) efter en rebase — og #12's eget "done"-kriterium (ingen CRLF-advarsler) fejler igen ved direkte gentest.

**Registry/orkestrerings-drift:** Bekræftet som et allerede kendt P0-issue (docs/active/#2, blokeret af #1) — denne audit tilføjer nyt: 3 byte-korrupte profilfiler i `.agents/agents/` skygge-duplikat af `Avatar/agents/`, og et helt forældreløst tredje skills-træ i repo-roden (`skills/`, 35 undermapper) der ikke er nævnt i nogen AGENTS.md.

---

## 4. Ændringssporbarheds-tabel

| Besluttet ændring | Kilde | Status | Restgæld |
|---|---|---|---|
| ADR-0002: `.vscode/.codex/` er aktiv autoritativ runtime, `.agents/` afventer aktivering | 2026-06-10, Accepted | **Aldrig fulgt op** | Efterfølgende commits (bbb15592, 1ea48fba) tilføjer ny .agents-funktionalitet i strid med ADR'ens eget "frys ny funktionalitet"-krav |
| ADR-multi-runtime: `.agents/` skal blive canonical, `.codex/` bliver transitional | 2026-06-17, **Proposed** (aldrig lukket) | **Uafgjort** | Modsiger ADR-0002 direkte; ingen ADR-0003 forener dem |
| Ticket #1 (P0): afgør runtime-modsigelsen | 2026-07-01, active | **Uløst, blokerer #2/#3/#4/#6** | 8 dage gammel, ingen bevægelse |
| Ticket #11: ryd roster/registry-fejl (3 delpunkter) | 2026-07-01, active | **1 af 3 løst** (council-chairman-placering), 2 uløst (10 arkiverede roster-entries, Higgsfield-skills uregistreret) | Delvist gjort, ikke lukket/opdateret |
| Task #12: normalisér CRLF-støj | Lukket 2026-07-02 | **Regredieret** | Samme LF/CRLF-advarsel udløses igen for 42 filer ved test i dag; commit-SHA'er i "Resultat" er dangling efter rebase |
| Migration af 14 Banedanmark-rolleagenter til `.agents/agents/` | 2026-05-06, rapporteret "gennemført" | **Faktisk rullet tilbage** en måned senere (commit 7626c697) uden at rapporten er rettet | migration_analysis.md fremstår stadig som gældende |
| PDF-kildeindlæsning af FB/-indhold (ADR-0002 §3, "højeste prioritet") | 2026-06-10 | **Aldrig udført** | Ingen commit siden har rørt FB-indhold |

---

## 5. Rehearsal-resultater (faktisk kørt, ikke kun læst)

| Script | Kommando | Resultat |
|---|---|---|
| `.agents/scripts/validate-harness.ps1` | `& ".\.agents\scripts\validate-harness.ps1"` | Exit 0. OK:64, Advarsler:11, Fejl:0. 11 advarsler = roster/agent-mappe-drift (council-chairman mangler i roster; 9 arkiverede roster-entries mangler mappe) |
| `.agents/scripts/audit-harness.ps1` | samme, kaldt som underfase | Exit 0. OK:66, Advarsler:1 (109 .md-filer i vendor/) |
| `scripts/audit-harness.ps1` (legacy) | separat kørsel | Exit 0. Roster:37, Avatar:27, Skills:74, Banedanmark:15 — måler en helt anden struktur end .agents-varianten |
| `uv run python temp/verify_agent_harness.py` | separat kørsel | Exit 0, ingen traceback. Bekræftede 27-vs-37-mismatch; fandt at scriptets eget `bad_patterns`-check for kodeblok-markør er brudt (tolkes som backtick+TAB+"ext", ikke det tiltænkte mønster) |

**Sideeffekt observeret under kørsel:** en anden proces overskrev `validation_report.md` 18 sekunder efter agentens egen kørsel, uden at agenten selv kaldte scriptet igen — indikerer samtidig kørsel fra en anden session/terminal (git hooks og Task Scheduler blev tjekket og udelukket som kilde).

---

## 6. Fund

**172 fund totalt** (64 kritisk/høj, alle overlevede adversarial modbevisning; 108 middel/lav).

### Fordeling middel/lav pr. domæne

| Domæne | Antal |
|---|---|
| scripts-validation-tooling | 13 |
| agent-roster-profiles | 11 |
| skills-quality | 11 |
| brain-memory-system | 8 |
| dual-runtime-sync | 8 |
| pm-task-reporting | 8 |
| registry-orchestration-drift | 8 |
| domain-source-traceability | 6 |
| foreloebig-scan | 6 |
| frontmatter-name-dir-mismatch | 4 |
| registry-drift | 4 |
| audit-harness | 3 |
| brain-consistency | 3 |
| invoke-agent-list | 3 |
| verify-agent-harness-py | 3 |
| pm-task-staleness | 2 |
| skills-duplication | 2 |

### De 12 mest alvorlige (KRITISK), uddrag

1. **ADR-multi-runtime står "Proposed" i 3+ uger** og modsiger ADR-0002 direkte — rodårsagen til at intet andet kan afgøres. *(agent-roster-profiles/consistency)*
2. **`.vscode/.codex/Brain/` modsiger sig selv internt**: hævder stadig at være "eneste kilde til sandhed" i AGENTS.md/context.md, mens samme mappes session-history.md dokumenterer at autoriteten er vendt om. *(brain-memory-system/correctness)*
3. **open-questions.md's status-note er forældet** — citerer en 2026-06-10-konklusion som en uge senere blev omgjort af ADR-multi-runtime, uden opdatering. *(brain-consistency/rehearsal)*
4. **docs/active/ og docs/audit/ (P0-tickets + selve audit-rapporten dette bygger på) er 100% untracked i git** — samme sårbarhedsklasse som OneDrive-hændelsen 2026-07-02. *(brain-memory-system/consistency)*
5. **Hele PM-systemet er untracked** (KØREPLAN, PROJEKT_PLAN, FORBEDRINGSNOTAT, DEPS, systemkort, docs/active|audit|drafts|Task). *(pm-task-reporting/correctness + pm-task-staleness/rehearsal)*
6. **3 dangling commit-SHA'er citeret som "bevis" for #12's lukning** i 5 filer, 9 forekomster — historikken blev omskrevet, referencerne aldrig opdateret. *(pm-task-reporting/correctness)*
7. **#12's eget "done"-kriterium fejler igen ved direkte gentest** (42 filer udløser CRLF-advarsel i dag). *(pm-task-reporting/consistency)*
8. **Valideringstooling tjekker aldrig den erklærede autoritative runtime** (.vscode/.codex/) — kun kandidatlaget .agents/. *(dual-runtime-sync/correctness)*
9. **migration_analysis.md hævder stadig "migration gennemført"** for 14 agenter der blev fjernet igen en måned senere. *(dual-runtime-sync/consistency)*
10. **ADR-0002's eksplicitte "frys ny funktionalitet"-beslutning er ignoreret** — efterfølgende commits tilføjer ny, uafstemt .agents-funktionalitet. *(dual-runtime-sync/consistency)*
11. **Selvmodsigende sporbarhedsdokument**: audit-rapport erklærer sin metode filnavnsbaseret/uverificeret, men kalder egen tabel "verificeret HIGH confidence" — holder ikke ved faktisk PDF-læsning (Ahmad El-Wali-eksemplet). *(domain-source-traceability/correctness)*
12. **Hele governance-papirsporet for registry-reconciliation er untracked** — inkl. selve audit-rapporten fra 2026-07-01. *(registry-orchestration-drift/consistency)*

*Fuld liste med evidens for alle 64 kritisk/høj-fund ligger i workflow-journalen (`journal.jsonl`), struktureret pr. domæne/lens/id — kan ekstraheres på anmodning.*

---

## 7. Implementerede rettelser

**Ingen.** Phase 4 (implementering, 8 agenter i isolerede worktrees) er bevidst ikke kørt — prompten kræver eksplicit godkendelse af den prioriterede fund-liste før nogen kode/dokumentation ændres. Se §9 for forslag til hvad der bør godkendes.

---

## 8. Verifikationsstatus

| Område | Status |
|---|---|
| Dual-runtime & arkitektur | **Verificeret** — drift bekræftet direkte mod filsystem/git, matcher og udvider repoets egne dokumenter |
| Skills-kvalitet | **Verificeret** — alle 108 filer gennemgået, 23 violations bekræftet |
| Agent-roster & profiler | **Verificeret** — roster/mappe-krydstjek kørt direkte |
| Domæne-sporbarhed | **Delvist** — kun 11 af 213 profiler stikprøvekontrolleret mod faktisk PDF-indhold |
| Brain/hukommelse | **Verificeret** |
| Scripts/validering | **Verificeret** — alle 3 scripts faktisk kørt, ikke kun læst |
| PM/Task-rapportering | **Verificeret** (ét delfund markeret IKKE-VERIFICERET af agenten selv, se journal — omfanget af "hvor meget" er stadig helt untracked, ikke "om") |
| Registry/orkestrerings-drift | **Verificeret** |

---

## 9. Prioriteret handlingsplan

**Nu (P0, blokerer alt andet):**
1. Eskalér ticket `docs/active/#1-los-runtime-modsigelse.md` til reel beslutning: Accepted eller Rejected for ADR-multi-runtime-agent-system.md. Intet af det følgende kan gøres rigtigt før dette er afgjort.
2. `git add` + commit hele PM-systemet og docs/active|audit-lagene (efter secrets-scan) — samme sårbarhedsklasse som 2026-07-02-hændelsen er stadig åben.
3. `git add` + commit `.agents/agents/council-chairman/` og `.agents/skills/llm-council/` (uncommitted i 2+ uger, kan gå tabt permanent).

**Snart (P1, efter P0-beslutning):**
4. Fjern de 10 arkiverede agent-id'er fra `agent-roster.json` (ticket #11, delpunkt 1 — bekræftet stadig åbent).
5. Ret de 3 byte-korrupte `.agents/agents/*/profile.md`-filer (regenerér fra ren `Avatar/agents/`-kilde).
6. Ret de 6 dobbelt-mojibake-korrupte SKILL.md-filer (særligt GDPR/legal-mapping — bruges til reel compliance-vejledning).
7. Opdatér `#12`'s "Resultat"-sektion (og LESSON.md/CHANGELOG-referencer) til de faktiske main-SHA'er efter rebasen; genundersøg CRLF-regressionen.

**Senere (P2):**
8. Konsolidér de 3 parallelle validate-harness-implementeringer til én, eller dokumentér eksplicit hvilken der gælder for hvilken struktur.
9. Afklar skæbnen for det forældreløse rod-`skills/`-træ og `temp/`-legacy-indholdet.
10. Ret de 2 forkerte PDF-rollereferencer i `bd-kontraktmanager.md`/`bd-ibrugtagning.md`, og omkvalificér "verificeret HIGH confidence"-sektionen i AUDIT_2026-05-06_Banedanmark_Roles.md.

---

## 10. Bilag

- Workflow run-id: `wf_ac39a6e6-8e0` (kan genoptages med `resumeFromRunId` for post-processing uden gentagne agent-kald).
- Struktureret rå-ekstrakt (til videre analyse): session-scratchpad `surviving_critical.md`, `domain_summaries.md`, `rehearsal.md`.
- Agent-model: session-model (Sonnet 5), 39 agentkald, ~3,08M tokens, 1011 tool-kald, ~24 min.
- Denne rapport dækker Discovery/Audit/Rehearsal/Adversarial. Implementeringsfasen (Phase 4) afventer godkendelse af handlingsplanen i §9.
