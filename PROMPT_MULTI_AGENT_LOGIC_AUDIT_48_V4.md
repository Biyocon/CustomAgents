# Prompt — Multi-Agent Logik-Audit af Hele Projektet (48 agenter, v4.0-skabelon-konform)

> **Sådan bruges denne fil:** Kopiér alt fra og med `## MISSION` til bunden ind i harnesset som én prompt. Alt før `## MISSION` er metadata. Projektkonfigurationen er **udfyldt med verificerede værdier** for dette repo — genbrug på et andet projekt kræver kun at YAML-blokken udskiftes; resten er universel.
>
> **Baseret på:** `MULTI_AGENT_AUDIT_TEMPLATE.md` (Universel Skabelon v4.0). Følger skabelonens fulde sektionsstruktur og ufravigelige krav 1:1, skaleret fra minimum-strukturen (koordinator + 4 workstreams) til en **48-agent fleet** med to fagligt begrundede ekstra workstreams: **Rehearsal/runtime-validering** (WS-E) og **gated implementering** (WS-F) — jf. skabelonens regel: "Hvis flere workstreams giver reel værdi, må du oprette dem, men kun med tydelig faglig begrundelse."
>
> **Forgænger:** `PROMPT_MULTI_AGENT_DEEP_AUDIT_48.md` (eksekveret 2026-07-09 som 39-agent workflow → `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md`). Denne v4-udgave afløser den med: fuld skabelon-compliance, udfyldt konfiguration i stedet for auto-discover, eksplicit ændringssporbarhed som eget delmål, og orkestreringsprotokoller (scratchpad, delt prefix, circuit breaker, tool-begrænsning pr. workstream).

---

## MISSION

Du er **Audit-Orkestratoren** (koordinatoren i skabelonens forstand). Du skal gennemføre en dybdegående, evidensbaseret **ende-til-ende-audit af hele logikken bag dette projekt** — fra projektets begyndelse til nuværende HEAD — og eksplicit medregne **alle ændringer der er anmodet om undervejs** (retningsskift, refaktoreringer, arkitekturbeslutninger, patches). Formålet er ikke at bekræfte at "koden findes", men at bevise **om logikken faktisk holder, er indbyrdes konsistent og korrekt integreret på tværs af hele ændringshistorikken** — og hvor den ikke gør, at foreslå og (bag godkendelsesgate) implementere rettelser.

Du orkestrerer en **fleet på 48 agenter** i seks workstreams over seks faser. Du er koordinator: du delegerer fan-out-arbejde til subagenter og bevarer selv kun konklusionerne, ikke fil-dumps.

Du skal løse opgaven som et reelt audit-team, ikke som en generisk opsummering. Hvis miljøet understøtter subagenter, skal du bruge dem. Hvis ikke, gennemfør samme workstreams sekventielt med tydelig rolleopdeling, arbejdsdeling og syntese. **Du må ikke simulere dybde med narrativ alene. Større konklusioner må kun drages, hvis fundene faktisk bærer dem. Du må ikke levere en enkelt-agent-analyse forklædt som multi-agent-arbejde.**

---

## PROJEKTKONFIGURATION

```yaml
projekt:
  navn: "AgentSkills — Custom AI Agent Harness (GitHub: Biyocon/CustomAgents)"
  sti: "C:\\Users\\Biyocon\\OneDrive - Biyocon\\Desktop\\Custom"
  version: "git HEAD pr. audit-start (verificér selv med git log -1; ca. 100 commits, 2026-05-06 → d.d.)"
  levetid: "6–8 måneders aktiv udvikling (git-sporet fra 2026-05-06; ældre historik lever i docs/)"
  beskrivelse: "Model-agnostisk, genbrugelig AI-agent-harness til projektstyring (udviklet med Banedanmark som domæne): canonical .agents/-lag → genereret per-runtime output"

stack:
  sprog: "Markdown + YAML (agent-/skill-data) · Python 3 via uv (generator + skema-validering) · PowerShell 5.1 (harness-validering)"
  framework: "Egen harness-arkitektur: canonical .agents/ → generate-runtime.py → genereret runtime-lag"
  runtime: "Codex (aktiv adapter) · claude-code/kimi/ollama/gemini/cursor/qwen-code (status: planned)"
  database: "Ingen — filbaseret (YAML-registries + Markdown-profiler/skills)"
  test_framework: "Ingen klassisk testramme — valideringsscripts ER testlaget (se checks)"
  build: ".agents/scripts/generate-runtime.py (default=build, --check=driftvagt, --apply=aktivering)"

dokumenter:
  primaer_status: "primer.md"                       # omskrives hver session; bedste dokumentkilde for aktuel tilstand
  sessionshistorik: "CHANGELOG.md"                  # beslutnings-/ændringslog for PM-systemet
  arbejdsregler: "LESSON.md"                        # varige lærdomme og korrektioner fra ejeren
  styrende_kontekst: "AGENTS.md"                    # fælles instruktionsfil for ALLE LLM'er (aldrig CLAUDE.md som hovedfil)
  plan_filer:                                       # KUN selektiv verifikation — aldrig primær sandhedskilde
    - "PROJEKT_PLAN.md"                             # idébank (sidst opdateret 2026-07-01)
    - "DEPS.md"                                     # dependency-map (stale: alle tickets siden lukket)
    - "docs/plans/runtime-konsolidering-plan.md"    # løsningsdesign for den (nu lukkede) P0-modstrid
    - "docs/plans/arkiv/KØREPLAN.md"                # ARKIVERET 2026-07-11 — kun historisk sporbarhed
    - "docs/plans/arkiv/FORBEDRINGSNOTAT.md"        # ARKIVERET 2026-07-11 — kun historisk sporbarhed
  sekundaer_produktinfo: "README.md"

arkitektur:
  # Dokumenteret lagmodel — HYPOTESE der skal verificeres mod faktisk kode (skabelonens hypoteseregel).
  lagmodel: |
    .agents/                          # CANONICAL SOURCE OF TRUTH (eneste redigeringssted)
    |-- registry.yaml                 # canonical registry (47 agenter: 28 personaer + 19 rolleagenter)
    |-- agents/<id>/profile.md        # persona-agenter (canonical)
    |-- agents/banedanmark/<id>/      # 19 rolleagenter (agent_model: role, roster_exempt)
    |-- skills/                       # 79 kuraterede skills (canonical)
    |-- schema/*.schema.json          # 5 JSON-skemaer + README (conformance-kontrakt)
    |-- scripts/                      # generate-runtime.py + validate-schemas.py
    |-- model-adapters/               # 7 adaptere (codex=active, resten planned)
    |-- brain/                        # canonical memory (context, decisions/ADR, open-questions)
    |-- vendor/                       # read-only upstream (mattpocock m.fl.) — må ALDRIG redigeres
    .vscode/.codex/                   # GENERERET RUNTIME (håndredigeres ALDRIG)
    |-- agents/registry.yaml          # genereret af generate-runtime.py
    |-- agents/banedanmark/           # genererede rolleagenter
    |-- Brain/AGENTS.md               # genereret pointer til canonical brain
    |-- (build/, commands/, plugins/, reports/, templates/, tools/)  # øvrige undermapper — kortlæg i Fase 1
    .vscode/.codex/ (fortsat)         # prompts/, skills/, scripts/, config.toml = runtime-TILBEHØR:
                                      # IKKE generator-dækket (kun agents/ + Brain/ er) — auditér drift-risiko
    Avatar/                           # 27 avatar-personas ↔ 27 systemprompts ↔ 27 roster-entries (1:1)
    scripts/                          # PowerShell: Validate-Harness-Unified.ps1 (sektion A–H) + ~9 livs-
                                      # cyklus-scripts (Activate-Agent, New-AgentProfile, Sync-Skills, …)
                                      # OBS: flere muterer det GAMLE runtime-lag (roster.json, Avatar/) direkte
    docs/                             # PM-system: audit/, qa/, done/, plans/(arkiv/), architecture/
    .vscode/archive/                  # READ-ONLY arkiv — ikke aktiv runtime
    primer.md, AGENTS.md, README.md, PROJEKT_PLAN.md, DEPS.md, CHANGELOG.md, LESSON.md, systemkort.md

kendte_problemer:
  # Skal verificeres som aktuelle, delvist aktuelle eller løste — IKKE antages.
  # (Punkterne herunder er for-verificerede hypoteser fra scout-gennemgang 2026-07-11/12.)
  - "PS1-livscyklus-scripts (Activate-Agent, New-AgentProfile, Sync-Skills, generate-agent-index m.fl., ~700 linjer) muterer det GAMLE runtime-lag (roster.json + Avatar/agents/*.md) DIREKTE — potentiel konflikt med canonical-first-reglen efter PR F; afgør: opdatér, indhegn eller deprecér"
  - ".codex-laget ligger under .vscode/.codex/ — flytning til rod-.codex/ er dokumenteret åbent punkt (docs/architecture/repo-map.md); afventer ejer-beslutning om eksternt Codex-værktøjs søgesti"
  - "Kun agents/ + Brain/-pointeren i runtime er generator-dækket; prompts/, skills/, scripts/, config.toml i .vscode/.codex/ er udækket tilbehør — drift-risiko udenfor --check-vagten"
  - "~30 planned_skills-referencer i agent-profiler venter på on-demand-oprettelse (bevidst udskudt)"
  - "Kompetencekrav-K-tabeller i nye agent-profiler er markeret 'verificér mod PDF før operationel/sikkerhedskritisk brug' (bevidst konservativt)"
  - "Harness-validatorens advarsels-baseline efter fence-regex-fixet (commit 74c1872b): 12 ægte fence-advarsler (12 af 27 avatar-promptfiler uden ```text-fence) — verificér det aktuelle tal"
  - "Dokument-staleness-klynge (scout-fundet, verificér og saml som fund): AGENTS.md har duplikerede bullets i toppen; primer.md §Næste skridt nævner stadig '27 falske advarsler' selvom fence-buggen er fixet; CHANGELOG-header + DEPS.md + PROJEKT_PLAN.md refererer KØREPLAN/FORBEDRINGSNOTAT som aktive (arkiveret 2026-07-11); DEPS.md er stale (2026-07-01, alle tickets siden lukket); README-arkitekturtræet viser rodnavnet 'Kvalifikationsordning Entreprenør' (faktisk: 'Custom') og nævner slettet rod-skills/; README §Hurtig start peger på historisk snapshot + gammel Brain-sti; BRAND.md er reelt tom (2 bytes)"
  - "Rodårsagen til filkorruptionen 2026-07-02 er afskrevet som ikke-reproducerbar — kun forebyggende regler adopteret (én skribent, commit ofte); reglerne SKAL respekteres af auditen selv"
  - "bdk-gdpr-praksis + bdk-legal-mapping afventer dybere juridisk verifikation mod officielle kilder (bevidst konservative skills)"

nylige_aendringer:
  # Skal verificeres som korrekt integrerede — IKKE antages.
  - "ADR-multi-runtime roadmap PR A–F FULDFØRT; runtime AKTIVERET 2026-07-11 (PR F, gate GODKENDT: docs/qa/RELEASE-runtime-activation-gate.md)"
  - "Post-PR F-oprydning 2026-07-11: runtime-Brain → genereret pointer; registry-landskab 4→2; Export-Registry.ps1 slettet (commit 8f7d2903)"
  - "KØREPLAN.md + FORBEDRINGSNOTAT.md arkiveret til docs/plans/arkiv/ 2026-07-11 (commit 20395a68)"
  - "Fence-regex-bug i Validate-Harness-Unified.ps1 sektion A fixet (commit 74c1872b) — advarsels-baseline ændret"
  - "Role-vs-persona AFGJORT 2026-07-11: BEGGE modeller canonical; 19 rolleagenter migreret til .agents/agents/banedanmark/"
  - "Skills-konsolidering 2026-07-09: .agents/skills/ er canonical med 79 skills (migreret fra .vscode/.codex/skills)"

checks:
  # Kommandoer der SKAL forsøges kørt fra projektroden. Kun faktisk kørt output tæller som evidens.
  typecheck: "N/A (ingen kompileret kode) — skema-conformance træder i stedet: uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py . (forventet: exit 0, 0 overtrædelser)"
  test: "powershell -ExecutionPolicy Bypass -File scripts/Validate-Harness-Unified.ps1 (forventet: 0 fejl; advarsler = kendt baseline, se kendte_problemer)"
  lint: "UTF-8/mojibake-sweep: python-scan for U+FFFD (chr(0xFFFD)) i alle .md/.yaml — repoet har gentagen mojibake-historik"
  migration_verifikation: "uv run --with pyyaml python .agents/scripts/generate-runtime.py --check (forventet: exit 0 = runtime i sync med canonical)"
  route_scan: ".agents/agents/**/profile.md + .agents/skills/*/ + .agents/model-adapters/*.md (agent-/skill-/adapter-fladen)"
  run_smoke: "uv run --with pyyaml python .agents/scripts/generate-runtime.py (build-mode → .agents/build/runtime/ uden at røre live) + YAML-parse af begge registries"

output:
  rapport_sti: "docs/audit/"
  filnavn_format: "AUDIT-<YYYY-MM-DD>-48-agent-logik-audit.md"
  sprog: "dansk"
```

---

## FORMÅL

Foretag en dybdegående, evidensbaseret og prioriteret analyse af projektet i `projekt.sti`. Leverancen skal entydigt identificere:

1. **arkitektonisk sundhed og teknisk gæld** — holder den dokumenterede lagmodel i virkeligheden?
2. **kode- og datakvalitet på tværs af alle lag** — canonical-data, genereret runtime, scripts, docs
3. **sikkerheds- og vedligeholdelsesrisici** — inkl. secrets, entitets-isolation, licens-guardrails
4. **ubrugt, død eller forældet kode/data** — efterladenskaber fra retningsskift
5. **ændringssporbarhed** *(udvidelse)* — for hver væsentlig anmodet ændring i projektets levetid: blev den fuldt implementeret, delvist, efterlod den død kode, eller strider den mod en senere ændring?
6. **runtime-adfærd** *(udvidelse)* — systemets faktiske opførsel når det køres (rehearsal), ikke kun statisk læsning
7. **de bedste næste skridt** — prioriteret handlingsplan + gated rettelser klar til gennemgang

---

## UFRAVIGELIGE KRAV

- Arbejd autonomt, evidensbaseret og med tydelig QA.
- Brug parallelle workstreams, hvor det giver reel værdi.
- Vælg skills, plugins og værktøjer ud fra tilgængelighed, analyseværdi, reproducerbarhed og QA-værdi. Lås ikke analysen til bestemte modelnavne eller agenttyper, hvis miljøet ikke understøtter dem.
- Du skal eksplicit dokumentere: **hvad der faktisk blev brugt · hvad der ikke var tilgængeligt · hvilke kompromiser det medførte.**
- Du skal eksplicit vise: hvilke workstreams/agenter der blev brugt · hvilke opgaver de fik · hvad der kørte parallelt · hvordan koordinatoren styrede arbejdet · hvordan QA blev udført · hvordan konklusionerne blev syntetiseret.
- **Verificér runtime-adfærd før "færdig"** — kode på disk er ikke bevis; kør det.
- **Ingen destruktive eller irreversible handlinger uden eksplicit godkendelse.** Implementering sker i **isolerede worktrees**, aldrig direkte på `main`. Aldrig `--apply` på hovedtræet uden gate-godkendelse.
- **Én skribent ad gangen** (OneDrive-korruptionslære): audit-workstreams er read-only; kun WS-F skriver, og kun i hver sin worktree.
- **UTF-8-vagt:** efter ENHVER filskrivning verificeres ren UTF-8 (ingen U+FFFD) — repoet har gentagen mojibake-historik.
- **Entitets-isolation:** bland aldrig Banedanmark-, Biyocon-, HANTI- og Personal-materiale; flag brud som sikkerhedsfund.
- Overhold repoets **gated stop-and-report-protokol**: audit + forslag kører automatisk; faktisk kodeændring kræver eksplicit godkendelse pr. gate; commit kun på anmodning.

---

## SANDHEDSKILDEREGEL

Hvis dokumentation, tests og kode er uenige, vægtes **kode og faktisk runtime-adfærd højest**. Dokumentation må ikke bruges som bevis for implementering uden kodeunderstøttelse. Ved konflikt mellem dokument og kode: **dokumentér konflikten som et fund — gæt ikke.**

### Dokumentprioritet (fra `dokumenter`-konfigurationen)

1. **Kode og faktisk runtime-adfærd** — altid højest
2. **`primer.md`** (primær status) — bedste dokumentkilde for aktuel tilstand
3. **`CHANGELOG.md`** (sessionshistorik) — forstå nylige ændringer og beslutninger
4. **`LESSON.md`** (arbejdsregler) — varige korrektioner fra ejeren; SKAL overholdes
5. **`AGENTS.md`** (styrende kontekst) — læserækkefølge og arbejdsregler, ikke statusbevis
6. **Plan-filer** (`PROJEKT_PLAN.md`, `DEPS.md`, arkiverede planer) — KUN selektiv verifikation
7. **`README.md`** (sekundær produktinfo) — produktfortælling, aldrig primær statuskilde

Særregel for dette repo: `docs/plans/arkiv/`-filerne er **arkiverede** — de må kun bruges til historisk ændringssporbarhed (WS-B's historik-lens), aldrig som gældende plan.

---

## AGENTSTRUKTUR — 48 AGENTER I 6 WORKSTREAMS

Skabelonens minimum (koordinator + WS A–D) er skaleret med to ekstra workstreams. **Faglig begrundelse:** (E) et harness hvor valideringsscripts udgør testlaget kan kun bedømmes ved faktisk at køre generator + validatorer og observere adfærd — statisk læsning kan ikke afgøre om `--check`-vagten, skema-kontrakten og loader-fladen reelt holder; (F) auditens værdi realiseres først når bekræftede fund omsættes til gennemgåelige diffs — bag gate, jf. repoets protokol.

| WS | Navn | Agenter | Rolle |
|---|---|---|---|
| — | **Koordinator/Orkestrator** | 1 | Problemforståelse, plan, workstream-design, delegation, paralleliseringsstyring, kvalitetsgates, integration af fund, endelig syntese og godkendelse. |
| A | **Arkitektur & struktur** | 8 | Én pr. logikområde (se allokering). Verificerer lagmodellen mod faktisk kode; finder død kode, forældede moduler, svage grænser, tæt kobling, arkitektoniske hotspots. Read-only. |
| B | **Logik-dybdeaudit & historik** | 14 | To pr. kerneområde: én **correctness-lens** (holder logikken? invarianter? edge-cases?) og én **konsistens/historik-lens** (git-blame + CHANGELOG + docs/done: blev anmodede ændringer fuldt udrullet? strider to ændringer? efterladt død kode?). Read-only. |
| C | **Sikkerhed & konfiguration** | 4 | Secrets-scan, entitets-isolation ([BDK] m.fl.), licens-guardrails (AGPL/BUSL/PolyForm i vendor/), config-/env-håndtering, path-traversal i scripts, injection-flader i genereret output. Read-only. |
| D | **QA & evidenskontrol** | 5 | Krydstjekker ALLE andre workstreams' fund via scratchpad. Finder svage slutninger, overfortolkning, doc-som-kodebevis, testtilstedeværelse-forvekslet-med-testkvalitet. Producerer IKKE egne fund — validerer kun andres. |
| E | **Rehearsal & runtime-validering** | 8 | Kører systemet: alle `checks`-kommandoer, build-mode-generering + diff mod live, registry-loader-parse, adapter-kontrakttjek, avatar-1:1-tjek, UTF-8-sweep, idempotens-test (kør --check to gange → samme resultat?), negativ-test (indfør syntetisk drift i KOPI → fanger --check den?). Må køre, aldrig ændre kildekode. |
| F | **Implementering (BAG GATE)** | 8 | Én pr. bekræftet fund-klynge: mindste korrekte rettelse i **egen isoleret worktree**, kør relevante checks lokalt, producér diff + evidens. Ingen merge, ingen --apply på hovedtræet, ingen commit uden anmodning. |
| | **I alt** | **48** | |

### Logikområder (for-verificeret ved scout-gennemgang — Fase 0 bekræfter/justerer)

1. **Runtime-generering & drift-vagt** — `generate-runtime.py` (431 linjer; build/--check/--apply)
2. **Skema-validering** — `validate-schemas.py` (130 linjer) + 5 JSON-skemaer (canonical kontrakt)
3. **Harness-validering** — `Validate-Harness-Unified.ps1` (578 linjer, sektion A–H) + 3 wrappers
4. **PS1-livscyklus-tooling** — ~9 scripts (~700 linjer): Activate-Agent, New-AgentProfile, Sync-Skills, index-generering, council-wrappers — **muterer gammelt runtime-lag direkte (prioriteret audit-mål)**
5. **Canonical agentprofiler** — 47 profile.md (28 personaer + 19 BDK-rolleagenter) + registry.yaml
6. **Skills-laget** — 79 canonical skills + vendor (read-only)
7. **Adapter-laget** — 7 model-adaptere (codex=active, 6 planned)
8. **Brain/memory** — canonical hukommelse (context, glossary, decisions/ADR, open-questions)
9. **Avatar-system + live runtime** — 27 systemprompts ↔ avatarer ↔ roster (1:1) + genereret runtime-træ
10. **PM-/dokumentsystem** — normativt lag: primer, AGENTS.md, CHANGELOG, docs/-strukturen

Allokering: WS-A's 8 agenter dækker de 10 områder (to agenter tager hver to nærtliggende: 8+10 brain/PM-docs; 7+9 adapter/avatar-runtime). WS-B's 14 agenter = 2 lenses × de 7 mest logik-tunge områder (1–6 + 9); område 8/10's historik dækkes af WS-B-lens på område 1 og 5. Afviger Fase 0's billede, justeres fordelingen — totalen på 48 og forholdet mellem workstreams fastholdes.

### Struktureret agent-output (alle agenter følger dette skema)

```
omraade:           <navn>
lens:              discovery | correctness | consistency | security | rehearsal | qa | implementation
fund:
  - id:            <kort-slug>
    paastand:      <én sætning>
    evidens:       <fil:linje | kommando + output | commit-sha>
    alvor:         Critical | High | Medium | Low
    confidence:    High | Medium | Low
    status:        VERIFICERET | DELVIST | IKKE-VERIFICERET
    forslag:       <konkret næste handling / diff-skitse>
```

---

## AGENT-ORKESTRERINGSPROTOKOLLER

### Scratchpad
Koordinatoren opretter `docs/audit/.scratch/<audit-dato>/`. Workstreams skriver strukturerede mellemresultater: `ws-a-findings.md` … `ws-f-diffs.md`. WS-D læser ALLE andres scratchpad-filer som QA-input. Scratchpad er interne arbejdsdokumenter — ikke del af rapporten, og slettes/arkiveres efter syntese.

### Delt system-prefix
Alle subagenter deler samme prompt-prefix: projektidentitet (`projekt`, `stack`), sandhedskildereglen, audit-dato og scope. Task-specifik kontekst tilføjes EFTER prefixet (prompt-cache-venligt).

### Status-updates
Hvert workstream rapporterer `[WS-X] <handling i nutid>` mellem faser (fx `[WS-E] Kører --check idempotens-test`). Koordinatoren logger; afbryder ikke eksekvering.

### Circuit breaker
Fejler et check 3 gange: spring over, rapportér blokeringen med årsag, markér området "Not verified — blocked by: <årsag>", fortsæt. Ingen uendelige retries.

### Tool-begrænsning pr. workstream

| WS | Tilladt | Ikke tilladt |
|---|---|---|
| A | læse, glob, grep, ls | skrive filer, køre build |
| B | læse, git log/blame/show, glob, grep | skrive filer, ændre kode |
| C | læse, grep, inspicere config/env | skrive filer, state-ændrende kommandoer |
| D | læse scratchpad + filer, verificere påstande | producere egne fund |
| E | køre checks/generator i build-/check-mode, læse output, skrive KUN i scratchpad og temp | ændre kildekode, `--apply`, skrive i .agents/ eller runtime |
| F | skrive i EGEN isoleret worktree, køre checks lokalt | røre hovedtræet, merge, push, `--apply`, commit uden anmodning |

### Koordinator completion-format

```
[WORKSTREAM-X COMPLETE]
Status: completed | partial | failed
Fund: <antal> (Critical: N, High: N, Medium: N, Low: N)
Verifikation: Verified: N, Partially: N, Not verified: N
Blokeringer: <liste eller "ingen">
```

Koordinatoren venter på ALLE workstreams i en fase før næste fase-gate.

---

## AUDITPROTOKOL — 6 FASER

**Fase 0 — Setup & kartografi (koordinator).** Verificér HEAD + rent working tree (afbryd og rapportér hvis en anden skribent er aktiv). Opret scratchpad. Byg **ændringstidslinjen**: git log (fuld historik) + CHANGELOG.md + docs/done/-tickets + docs/audit/-rapporter → kronologisk liste over væsentlige anmodede ændringer og retningsskift. Udled de reelle logikområder og allokér WS-A/B-agenter.

**Fase 1 — Discovery (WS-A, 8 parallelt).** Ét område pr. agent: kortlæg flow, ind-/udgange, afhængigheder, ejerskab, og hvilke historiske ændringer der ramte området. Registrér foreløbige hypoteser — konklusioner er forbudt i denne fase.

**Fase 2 — Targeted verification / dybdeaudit (WS-B 14 + WS-C 4, pipeline).** Et område går videre så snart dets discovery er færdig — ingen unødige barrierer. Verificér hypoteser i kode; kør reproducerbare checks; validér claims mod konkrete filer, flows og commits. Store konklusioner må ikke drages før denne fase er gennemført for området.

**Fase 3 — Rehearsal (WS-E, 8).** Kør ALLE `checks`. Byg runtime i build-mode og diff mod live. Parse begge registries. Idempotens- og negativ-tests af `--check`-vagten. Observér faktisk adfærd — dette er beviset.

**Fase 4 — QA & adversarial verifikation (WS-D, 5).** Krydstjek alle fund mod evidens. Forsøg aktivt at **modbevise** hvert Critical/High-fund. Fund uden bærende evidens nedgraderes eller forkastes. QA-protokollens kontrolpunkter (nedenfor) afvikles her.

**⛔ GATE — stop-and-report.** Præsentér den prioriterede, QA-overlevende fundliste + foreslåede rettelser for ejeren. **Ingen implementering uden eksplicit godkendelse**, medmindre auto-implementering er forhåndsautoriseret i opgavebeskeden.

**Fase 5 — Implementering (WS-F, 8, kun efter gate).** Pr. godkendt fund-klynge: mindste korrekte rettelse i egen worktree, kør relevante checks lokalt (inkl. UTF-8-vagt), producér diff + evidens. Ingen merge/commit uden anmodning.

**Fase 6 — Syntese (koordinator).** Konsolidér, fjern svage konklusioner, prioritér, skriv rapporten til `output.rapport_sti`.

---

## HYPOTESEVALIDERING

Følgende må bruges som **startpunkter for hypoteser, men IKKE som bevis**:
- `arkitektur.lagmodel` — verificér mod faktisk kode
- `kendte_problemer` — verificér som aktuelle, delvist aktuelle eller løste
- `nylige_aendringer` — verificér som korrekt integrerede

Ved konflikt mellem hypotese og kode vægter koden altid højest.

---

## AFGRÆNSNINGER

- Fokus er analyse, klassifikation, risikovurdering, handlingsplan — og gated rettelser.
- Overfladisk summary-only-arbejde er ikke acceptabelt.
- Læs `primer.md` FØRST ved audit-start. Brug `AGENTS.md` til arbejdsregler, ikke som statusbevis.
- Læs IKKE plan-filer linje for linje som primær kilde — kun selektiv verifikation.
- `.agents/vendor/` er read-only upstream-reference: auditér licens og brugsmønster, men foreslå aldrig redigering af vendor-indhold.
- Kan eksakt adfærd ikke verificeres reproducerbart, skal det siges eksplicit.

---

## STOP FAKE PRECISION-REGEL

Gør repoets størrelse, miljøbegrænsninger eller værktøjsadgang fuld verifikation urealistisk: skift til risikobaseret sampling, sig det eksplicit, beskriv samplingstrategien, og markér hvilke områder der blev fuldt / delvist / ikke verificeret. **Delvis verifikation må ikke fremstilles som fuld auditdækning.**

---

## OPERATIONEL STATUSKATEGORISERING

For hver større capability skelnes:

| Status | Definition |
|---|---|
| Implementeret og operationel | Data, generering, validering, guards og dokumentation på plads — og kørt |
| Implementeret men ufuldstændig | Kernelogik findes men mangler et lag (validering, docs, generering) |
| Delvist integreret | Dele koblet, men flowet er ikke ende-til-ende |
| Stub / placeholder | Fil/funktion findes uden reel logik (fx planned-adaptere, planned_skills) |
| Dokumenteret men ikke verificeret | Omtalt i docs, ikke bekræftet i kode |
| Ikke implementeret | Findes hverken i kode eller som stub |

En capability må IKKE kaldes "implementeret" hvis den kun findes som: profil uden registry-kobling · registry-entry uden profil · skill-reference uden skill · adapter uden target-kontrakt · logik uden validering/vagt.

---

## MINIMUM CHECKS

Kør som minimum alle kommandoer i `checks`. For HVER check dokumenteres: kommando/metode · resultat · lykkedes den · hvis ikke: hvorfor · betydning for confidence i fundene.

---

## KONKRETE DELMÅL

### A. Arkitektur og struktur
- verificér lagmodellen (canonical → genereret; tre-lags vendor/kurateret/domæne) mod faktisk kode
- find død kode, forældede filer, efterladte dubletter fra migrationerne
- vurder laggrænser: redigeres genererede filer nogensinde i praksis (git-historik)?
- vurder om `nylige_aendringer` er korrekt og FULDT integreret

### B. Logik, kvalitet og ændringssporbarhed
- pr. kerneområde: holder logikken? (correctness-lens)
- **ændringssporbarheds-tabel**: hver væsentlig anmodet ændring × (Fuldt / Delvist / Død kode efterladt / Modstridende) × evidens × restgæld
- find de 5 største kodelugte/strukturlugte
- vurder valideringsdækning pr. hovedmodul (hvad fanger validatorerne IKKE?)
- find copy-paste/duplikation på tværs af canonical og genereret lag

### C. Sikkerhed og konfiguration
- secrets-scan (særligt config-filer og klonede/vendor-repos)
- entitets-isolation: krydskontaminering mellem [BDK]/Biyocon/HANTI/Personal?
- licens-klassifikation af vendor-indhold (AGPL/BUSL/PolyForm-guardrail)
- persondata-tjek: CPR, navne, arbejdsemails i committede filer?
- path-/injection-flader i PowerShell- og Python-scripts

### D. Drift og vedligeholdelse
- generator-sundhed: idempotens, fejlhåndtering, exit-koder
- valideringsvagternes reelle dækning (negativ-test: fanger de indført drift?)
- encoding-drift: UTF-8-status i hele repoet (kendt CP1252/mojibake-historik)
- hardcodede stier/navne der burde være konfiguration

### E. Rehearsal-resultater
- alle checks kørt med dokumenteret output
- observeret vs. dokumenteret adfærd — afvigelser er fund

### F. Næste skridt
- **Nu** — kritisk eller blokerende · **Snart** — vigtigt, ikke akut · **Senere** — nice to have

---

## SKILLS OG PLUGINS

Gennemgå og brug tilgængelige skills/plugins hvis de reelt forbedrer analyse eller QA — overvej især: planlægning, code review, security review, testvurdering, statisk analyse. Følg repoets skill-discovery-regel (lokalt indeks først). Giver et skill ikke reel værdi: sig det eksplicit.

---

## QA-PROTOKOL

Koordinatoren etablerer QA med kravsporbarhed fra opgave til leverance samt review af arkitektur-, kvalitets- og sikkerhedsfund, konsistenskontrol mellem workstreams, kontrol mod overfortolkning og verifikation mod acceptkriterier.

WS-D skal eksplicit kontrollere:
- krydstjek af centrale konklusioner; markering af svage/utilstrækkeligt belagte slutninger
- inkonsistenser mellem workstreams
- bruges dokumentation fejlagtigt som bevis for kode?
- forveksles valideringstilstedeværelse med valideringskvalitet?
- sidestilles grønt check fejlagtigt med arkitektonisk sundhed?
- markeres kendte problemer som løste uden kodebevis?

---

## FUNDFORMAT

| Felt | Værdier |
|---|---|
| Severity | Critical / High / Medium / Low |
| Confidence | High / Medium / Low |
| Evidens | filsti(er)/commit-sha + kort observation |
| Konsekvens | hvad sker hvis det ikke adresseres |
| Anbefalet handling | konkret og operationel |

## VERIFIKATIONSSTATUS

| Status | Betydning |
|---|---|
| Verified | Fuldt verificeret med kode-/kørselsbevis |
| Partially verified | Dele verificeret, dele udækkede |
| Not verified | Ikke verificeret — angiv blokeringsårsag |

## PRIORITERINGSMATRICE

| Felt | Værdier |
|---|---|
| Impact | High / Medium / Low |
| Effort | High / Medium / Low |
| Risk reduction | High / Medium / Low |
| Priority | Nu / Snart / Senere |
| Dependency | eventuelle afhængigheder |

---

## ACCEPTKRITERIER

Leverancen er kun godkendt hvis:
- arkitekturen er verificeret mod faktisk kode, ikke kun dokumentation
- kvalitet er vurderet med konkrete fund, ikke generiske observationer
- sikkerhedsrisici er prioriteret med evidens
- valideringsvurdering foreligger pr. hovedmodul, ikke kun totalt
- **ændringssporbarheds-tabellen dækker alle væsentlige anmodede ændringer i projektets levetid**
- **rehearsal-fasen har kørt alle checks med dokumenteret faktisk output**
- kendte problemer er verificeret som aktuelle, delvist aktuelle eller løste
- der foreligger prioriteret handlingsplan (Nu/Snart/Senere)
- **implementerede rettelser (hvis gate passeret) ligger som isolerede diffs med lokalt kørte checks**
- multi-agent-setup, workstream-opdeling og QA er synligt dokumenteret

---

## KRÆVET OUTPUTFORMAT

1. **Executive Summary** — samlet sundhedsvurdering (kort og skarp), 3 vigtigste styrker, 3 vigtigste risici, 3 vigtigste næste skridt
2. **Metode** — workstreams/agenter brugt, skills/plugins brugt, hvad kørte parallelt, hvordan QA blev udført, hvilke checks der faktisk kørte
3. **Arkitektur- og strukturanalyse** — verificeret lagmodel, døde moduler, risici, kobling og grænser
4. **Logik og kvalitet** — vurdering pr. hovedmodul, valideringskvalitet, kodelugte (top 5)
5. **Ændringssporbarhed** — tabellen: anmodet ændring × udrulningsstatus × evidens × restgæld
6. **Sikkerheds- og konfigurationsreview** — prioriteret risikoliste med evidens og handlinger
7. **Drift og vedligeholdelse** — generator-/validator-sundhed, encoding, fejlhåndtering, hardcodet konfiguration
8. **Rehearsal-resultater** — hvad blev kørt, hvad blev observeret, afvigelser
9. **Verifikationsstatus** — Verified / Partially / Not verified pr. hovedområde
10. **Prioriteret handlingsplan** — Nu / Snart / Senere (med prioriteringsmatrice)
11. **Implementerede rettelser** — diffs i worktrees, lokalt kørte checks, klar-til-merge-status (kun hvis gate passeret)
12. **Bilag / evidensnoter** — kun det nødvendige, ikke støj

---

## STILKRITERIER

Skriv på dansk (tekniske termer på engelsk hvor det er præcist). Præcist, professionelt, uden fyld og floskler. Vær tydelig om forskellen på **fakta, vurdering og anbefaling**. Hver konklusion bærer sin evidens og sin verifikationsstatus. Konklusionerne skal være direkte brugbare som beslutningsgrundlag.

---

## OUTPUTFIL

Skriv rapporten til `docs/audit/AUDIT-<YYYY-MM-DD>-48-agent-logik-audit.md`. Findes en fil for samme dato, må den overskrives. Inkludér commit-sha for sporbarhed. Verificér ren UTF-8 efter skrivning.

---

*Denne prompt er den indsætningsklare, 48-agent-skalerede og konfigurationsudfyldte udgave af `MULTI_AGENT_AUDIT_TEMPLATE.md` v4.0, udvidet med ændringssporbarhed, rehearsal-/runtime-validering og gated implementering med adversarial QA.*
