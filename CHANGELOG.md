# Changelog: AgentSkills — Custom AI Agent Harness
**Ref:** `DEPS.md` (change-impact-procedure) | `PROJEKT_PLAN.md`

<!--
HVAD LOGGES HER:
  ✅ Ændringer til PROJEKT_PLAN.md (nye/fjernede/ændrede beslutninger)
  ✅ Ændringer til KØREPLAN.md (nye faser, re-sekvensering, scope-beslutninger)
  ✅ Ændringer til DEPS.md (nye blokerings-relationer)
  ✅ Prioritetsændringer (P0 → P1, ny P0 tilføjet)

HVAD LOGGES IKKE HER:
  ❌ Kodeændringer — det hører i git commit-beskeder
  ❌ Test-/QA-resultater — det hører i docs/qa/
  ❌ Audit-findings — det hører i docs/audit/

ARKIVERING: Når filen nærmer sig 20 entries, arkivér de ældste til
docs/plans/changelog-arkiv-{{ÅRSTAL}}.md og behold kun de seneste 10 her.
-->

---

## Aktive entries

### [2026-07-09→11] Runtime-retning afgjort, backlog lukket, PR A–C leveret

Tre sammenhængende sessioner (48-agent dybdeaudit → oprydning → arkitektur):

- **Beslutning (P0):** ADR-multi-runtime-agent-system.md = **Accepted** (ADR-0003).
  `.agents/` er canonical; `.vscode/.codex/` transitional runtime. Hybrid: skills
  allerede flyttet til `.agents/skills/` (79); resten afventer PR D–F.
- **Backlog:** tickets #2–#13 alle lukket → `docs/done/` (12+). Kun #1 åben
  (afventer faktisk aktivering, PR F). KØREPLAN's fase-tabel er dermed reelt
  overhalet for Fase A–C-indhold; ny prioritering = ADR-roadmap PR D→E→F.
- **DEPS-effekt:** #1's blokeringer (#2/#3/#4/#6) er alle løst — kritisk sti er nu
  udelukkende PR D→F-kæden.
- **Leveret:** PR B (skemaer validérbare, canonical = 0 overtrædelser) + PR C
  (7 runtime-adaptere inkl. de manglende Claude/Ollama). Unified validate-script
  afløste de 3 gamle. Se git-log 7c090376..d4334c42 for detaljer.
- **Prioritet fremad:** PR D (export/generering) er næste — første kode-tunge PR.

### [2026-07-01] Initial: Projektstyrings-dokumentationssystem oprettet

**Type:** tilføjelse
**Ændrede filer:** `PROJEKT_PLAN.md`, `KØREPLAN.md`, `DEPS.md`, `LESSON.md`,
`CHANGELOG.md`, `primer.md`, `systemkort.md`, `FORBEDRINGSNOTAT.md`,
`docs/audit/AUDIT-2026-07-01-runtime-og-registry.md`,
`docs/qa/RELEASE-runtime-activation-gate.md`,
`docs/active/#1` til `#6`, `docs/drafts/#7`, `#8`, `#10`, `#9`,
`docs/plans/runtime-konsolidering-plan.md`
**Årsag:** Grundig kodebase-analyse afslørede at eksisterende dokumentation
(README, ADR'er, validation-rapporter, issue-tracker) indeholder reelle,
uløste modsigelser (runtime-status, registry-divergens, skill-antal,
validerings-konklusioner) uden noget system til at spore og lukke dem
systematisk. Kombination af to lokale skabelon-sæt
(`docs/kilde/docs` — task-livscyklus/dependency/audit/QA — og
`docs/kilde/project-docs` — primer/systemkort/forbedringsnotat) valgt som
bedst egnet, fordi de tilsammen dækker både granulær task-sporing og
arkitektur-kontinuitet for et multi-LLM-harness.
**Berørte tasks:** Alle (ny baseline)
**Impact:** Ingen re-sekvensering nødvendig (ny baseline). Fase A i
`KØREPLAN.md` sætter runtime-modsigelsen som P0 og blokerende for alt andet.
**Beslutning krævet:** Ja — runtime-beslutningen (ADR-0002: Accepted eller
Rejected) kræver en menneskelig/projektejer-beslutning, kan ikke afgøres
automatisk. Se `docs/active/#1-los-runtime-modsigelse.md`.

---

### [2026-07-01] Modifikation: Uafhængig QA-krydstjek korrigerede flere tal og fandt 3 nye fejl

**Type:** modifikation + tilføjelse
**Ændrede filer:** `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md`,
`docs/active/#1-los-runtime-modsigelse.md`, `docs/active/#6-komplettér-agentmapper.md`,
`docs/active/#11-ryd-op-i-roster-og-registry-fejl.md` (ny), `systemkort.md`,
`primer.md`, `DEPS.md`
**Årsag:** En uafhængig QA-gennemgang (codex-agent) fandt konkrete, efterfølgende
verificerede fejl: (1) `invoke-agent.py` læser allerede fra 3 kilder — runtime
de facto hybrid; (2) 10 arkiverede agenter stadig i aktiv roster; (3)
`council-chairman` fejlplaceret som arkiveret; (4) 4 Higgsfield-skills
uregistrerede i alle 4 registries. Desuden blev en fejl i denne sessions egen
tidligere dokumentation rettet: `.agents/agents/` har 0 af 28 (ikke "1 af 37")
mapper med fuld filpakke — "37" var en sammenblanding med
`.vscode/.codex/`-rosterens entry-antal. Avatar-systemprompt-tal rettet fra 26 til 27.
**Berørte tasks:** #1 (nuance tilføjet), #6 (tal rettet), #11 (ny), Fase A i `KØREPLAN.md`
**Impact:**
- #11 tilføjet til kritisk sti mellem #2 og #3 i `DEPS.md`
- #6's acceptkriterie er uændret i substans, men baseline-tallet er rettet
**Beslutning krævet:** Nej — rent faktuel korrektion baseret på direkte verificering

---

### [2026-07-02] Hændelse: Filkorruption i 5 ikke-committede filer — genoprettet og committet

**Type:** modifikation (incident response)
**Ændrede filer:** `README.md`, `.agents/brain/README.md`, `.agents/brain/context.md`,
`.agents/brain/assumptions.md`, `.agents/registry.yaml`
**Årsag:** En parallel code-review-session (Fable 5) opdagede at 4 filer blev afkortet
midt i ord/sætning kl. 00:47:05, og en 5. faldt tilbage til en ældre version kl. 00:48:56 —
alle med samme fingeraftryk (cp1252→UTF-8-transkodning af em-dash, manglende EOF-newline).
Rodårsagen er ikke endeligt identificeret, men mønstret ligner en afbrudt encoding-omskrivning
(Set-Content/Python-stil), muligvis relateret til at to agent-sessioner (denne + Fable 5)
arbejdede på samme OneDrive-synkroniserede arbejdstræ samtidigt. Indholdet blev genskabt
fuldstændigt fra en pre-korruptions-diff-fangst (Fable 5) + `git show HEAD:<fil>` for de
uændrede haler, verificeret linje-for-linje via `Read`, og committet som `1ea48fba`.
Sideløbende blev ~180 filer med tilsyneladende "M"-status i `git status` bekræftet som ren
CRLF/LF-linjeskiftstøj (ikke relateret til korruptionen) — se ticket #12.
**Berørte tasks:** Ny ticket #13 (rodårsagsundersøgelse + resterende code-review-fund), #12 (CRLF)
**Impact:** Ingen re-sekvensering af eksisterende tasks. Ny driftsregel bør overvejes: kun
én agent-session ad gangen bør have skriveadgang til arbejdstræet, og commit hyppigere for
at undgå at uncommitted arbejde er eneste kopi.
**Beslutning krævet:** Nej for selve genoprettelsen (allerede udført og verificeret). Ja for
om driftsreglen "kun én skrivende session ad gangen" skal formaliseres i `AGENTS.md`.

---

### [2026-07-02] Lukket: #12 CRLF-normalisering + fanget og lukket .gitattributes-regression

**Type:** modifikation (ticket-lukning)
**Ændrede filer:** `.gitattributes` (ny), `docs/drafts/#12-normalisér-linjeskift-crlf-stoej.md`,
`LESSON.md`, `primer.md`
**Årsag:** Ticket #12 udført efter bruger-godkendelse: `.gitattributes` med `* text=auto` +
eksplicitte binary-regler, `git add --renormalize .`, committet i `2be73f02`. Fjernede alle
~180 falske " M"-filer fra `git status`. En parallel review-session (Fable 5) opdagede at
overskrivningen af `.gitattributes` havde slettet en eksisterende, aktiv Git LFS-regel
(`*.zip filter=lfs diff=lfs merge=lfs -text`) for 2 LFS-sporede zip-filer i
`.vscode/archive/upstream-skills/`. Uafhængigt bekræftet (git-historik + faktisk
LFS-pointer-indhold i begge zip-filer), og genindsat i `c6a68cce`.
**Berørte tasks:** #12 (lukket, status: done), #13 (uændret, stadig åben)
**Impact:** Ingen re-sekvensering. 3 commits på `main` samlet fra nattens forløb:
`1ea48fba` (genoprettelse), `2be73f02` (CRLF-normalisering), `c6a68cce` (LFS-fix).
Ny lesson tilføjet i `LESSON.md` om at tjekke eksisterende filindhold før overskrivning af
konfigurationsfiler, og om at Cowork-sandboxens OneDrive-mount kan vise forældet
arbejdstræ-indhold — index-muterende git-kommandoer køres derfor fremover kun fra
brugerens lokale terminal, ikke fra sandboxen.
**Beslutning krævet:** Nej — udført efter eksplicit bruger-godkendelse, verificeret
uafhængigt af begge sider (Cowork + Fable 5).

---

<!--
ENTRY-FORMAT (kopiér ved ny entry):

### [YYYY-MM-DD] Ændring: <kort titel>

**Type:** tilføjelse | fjernelse | modifikation | prioritetsændring
**Ændrede filer:** <liste over filer der opdateres som del af denne ændring>
**Årsag:** <1 sætning — HVORFOR sker ændringen>
**Berørte tasks:** #N, #M, Fase X
**Impact:**
- #N: re-sekvenseret (blokeres nu af #M)
- #M: acceptkriterie opdateret (se ticket)
- Fase X: sprint X-3 tilføjet
**Beslutning krævet:** ja — <hvad skal besluttes og af hvem> | nej
-->
