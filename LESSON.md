# Lessons Learned: AgentSkills — Custom AI Agent Harness

> Skrives ved afslutning af en FASE (ikke et sprint) eller efter en alvorlig
> bloker. Formål: forhindre gentagelse — hvert punkt under "Hvad vi ændrer
> fremover" skal pege på en konkret handling, ikke en observation.

---

## Fase (pre-A) — Dokumentations- og statuskonsolidering — Afsluttet 2026-07-01

**Varighed:** Ikke en formel sprint-fase, men konsolideringen af eksisterende
rapporter (2026-05-06 → 2026-06-17) op til introduktionen af dette PM-system.
**Sprints:** N/A (retrospektiv analyse af eksisterende dokumentation)
**Status ved start → slut:** Spredt, delvist modstridende dokumentation → ét
konsolideret system (`KØREPLAN.md`, `DEPS.md`, `systemkort.md`, audit/QA-gates)

---

### Hvad gik godt

- Projektet har allerede stærke dokumentationsvaner: dateret filnavngivning
  (`runtime-status-YYYY-MM-DD.md`, `QA_YYYY-MM-DD_*.md`), konsekvente
  statusmarkører (✅/⏳/⬜/FORELØBIG), og en eksplicit tre-lags arkitektur
  (Vendor/Kurateret/Domæne) der gør ansvarsfordeling let at forstå.
- Karpathy-principperne (surgical changes, verificerbare succeskriterier) er
  allerede skrevet ind i `AGENTS.md` — det giver et solidt fundament at bygge
  det nye task-system oven på.

### Hvad gik skidt

- Ingen fil dokumenterede overgangen fra "`.vscode/.codex/` er aktiv" (2026-06-12)
  til "`.agents/` er canonical target" (2026-06-17) — to ugers stilhed om en
  arkitekturbeslutning der ellers blev behandlet som afgjort i den ene retning
  og stadig "Proposed" i den anden.
- Skill-antal blev rapporteret forskelligt i mindst 3 filer (29, 73/33, 188) uden
  at nogen fil flagger uoverensstemmelsen — det blev først synligt ved
  systematisk krydsreference.
- To `validation_report.md`-versioner med diametralt modsatte konklusioner
  (3 PASS/2 PARTIAL/4 FAIL vs. 69 OK/0 fejl) eksisterede side om side uden en
  fil der forklarer forbedringen eller forklarer hvilken der er gældende.

### Hvad vi ændrer fremover

- Enhver arkitekturbeslutning der ændrer "hvad er aktivt" SKAL opdatere alle
  berørte filer i samme commit/session (README, AGENTS.md, ADR-status,
  runtime-status-rapport) — ellers opstår præcis denne modstrid igen. Håndhæves
  nu via `docs/audit/AUDIT-2026-07-01-runtime-og-registry.md` gate-tjekliste.
- Metrikker (skill-antal, agent-antal, valideringsresultat) skal fremover komme
  fra ét script, aldrig hardkodes i prosa-dokumenter. Se `docs/active/#3` og `#4`.
- Ved enhver ny validation_report: den forrige SKAL enten opdateres in-place
  eller eksplicit markeres som "SUPERSEDED" med dato og begrundelse — aldrig
  efterlades som en stille modsigelse.

### Estimat vs. faktisk

| Aktivitet | Estimeret | Faktisk | Delta | Årsag til afvigelse |
|---|---|---|---|---|
| Fuld kodebase-scan + krydsreference | Ikke tidligere estimeret | ~1 dyb researchpasse | N/A | Første gang denne systematiske krydsreference er lavet |

### Næste lesson skrives ved

~~Afslutning af Fase A — Runtime- og registry-konsolidering~~ Skrevet 2026-07-11 (se nedenfor).

---

## Fase: ADR-roadmap PR A–F — Runtime-konsolidering og aktivering — Afsluttet 2026-07-11

**Varighed:** 2026-06-17 (ADR Proposed) → 2026-07-09 (Accepted) → 2026-07-11 (PR D+E+F
leveret, aktiveret, gated og post-oprydning samme dag).
**Status ved start → slut:** To konkurrerende runtime-lag med dokumenteret P0-modsigelse →
ét canonical lag (`.agents/`) + ét genereret runtime-lag, sync-vagtet af `--check` (exit 0),
gate GODKENDT, alle tickets #1–#13 lukket, registry-landskab 4→2.

### Hvad gik godt

- **Gated single-purpose-PR-flowet skalerede:** D, E og F kunne leveres på én dag fordi
  hver PR havde ét formål, egne verifikationskriterier og eksplicit ejer-godkendelse
  mellem dem. Beslutningen (role-vs-persona) blev taget FØR generatoren blev designet —
  ingen re-work.
- **"Verificér før completion-claims" fangede reelle fejl:** uafhængig krydsverifikation
  mellem to sessioner fandt en stale --check-footer, en stale primer-HEAD og bekræftede
  alle load-bearing claims. Fence-regex-fixet afslørede at 12 af 27 "falske" advarsler
  faktisk var ægte fund som den brækkede regex havde camoufleret.
- **Sync-validering som aktiverings-gate virkede:** `--check` exit 0 var et objektivt,
  reproducerbart bestå-kriterie — gaten kunne godkendes på evidens, ikke skøn.
- **Mojibake-vagten betalte sig igen:** fandt CP1252 i 9 runtime-skills.yaml og
  '?'-korruption i 2 personas capabilities FØR indholdet blev canonical.

### Hvad gik skidt

- **Dokumentations-efterslæbet voksede hurtigere end det blev betalt:** aktiveringen
  gjorde README/systemkort/brain/PM-docs stale på 6+ punkter samme dag som de var
  opdateret — post-F-sandhedsoprydningen skulle have været en eksplicit del af PR F's
  definition-of-done, ikke et opfølgningsstep.
- **To skrivende sessioner kørte samtidig på samme working tree** (near-miss 2026-07-11).
  Ingen skade — men kun fordi den ene stoppede korrekt og filerne var disjunkte.
- **Volatile tal i instruktionsfiler rådnede igen** (HEAD-hash i primer): reglen fandtes
  allerede i global CLAUDE.md, men blev først håndhævet efter anden påmindelse.

### Hvad vi ændrer fremover

- **Definition-of-done for arkitekturændringer udvides:** "alle berørte statusdokumenter
  opdateret i SAMME commit-serie" — tjekliste: README, AGENTS.md, systemkort, primer,
  brain (open-questions/assumptions), PM-docs (PROJEKT_PLAN/DEPS), berørte README'er i
  undermapper. (Denne lesson's fase betalte gælden 2026-07-11.)
- **Én skrivende session ad gangen håndhæves som procedure,** ikke kun som regel: ny
  session skal tjekke `git status` for fremmede uncommittede ændringer FØR første skriv
  og stoppe hvis de findes (dokumenteret i memory + open-questions #7).
- **Aldrig aktuel HEAD-hash i vedvarende dokumenter** — kun stabile milepæls-hashes;
  aktuel tilstand verificeres med `git status -sb` (håndhævet i primer 2026-07-11).

### Estimat vs. faktisk

| Aktivitet | Estimeret | Faktisk | Delta | Årsag til afvigelse |
|---|---|---|---|---|
| PR D–F (generator → aktivering) | "første kode-tunge PR" + F = "højeste risiko" (ingen tidsestimat) | Én dag (2026-07-11) inkl. beslutning, drift-oprydning og gate | N/A | Forarbejdet (PR A–C, skemaer, adaptere, audit) havde fjernet al usikkerhed fra den kritiske sti |

### Næste lesson skrives ved

Afslutning af Fase G (global promovering) eller næste alvorlige bloker.

---

## Hændelse — Filkorruption + .gitattributes-regression — Afsluttet 2026-07-02

**Varighed:** Én nats forløb (2026-07-01 kl. ~00:44 → 2026-07-02 kl. ~02:00).
**Status ved start → slut:** 5 ikke-committede filer korrumperet (afkortet/tilbagefaldet) →
genoprettet, committet, og en efterfølgende `.gitattributes`-regression (tabt LFS-regel)
fundet og lukket samme session. 3 commits: `1ea48fba`, `2be73f02`, `c6a68cce`.

### Hvad gik godt

- To parallelle AI-sessioner (Cowork + en review-session, "Fable 5") supplerede hinanden:
  den ene fangede og diagnosticerede hændelsen, den anden udførte genoprettelsen — med
  gensidig, uafhængig verificering ved hvert skridt frem for at stole blindt på hinandens
  rapporter. Dette fangede reelt en efterfølgende regression (LFS-reglen), som ellers var
  gået upåagtet hen.
- Genoprettelsen brugte en pre-korruptions-diff-fangst + `git show HEAD:<fil>` til at
  rekonstruere indholdet linje-for-linje, verificeret via direkte filaflæsning før commit.

### Hvad gik skidt

- Roden til selve filkorruptionen (hvad der skrev de afkortede versioner kl. 00:47:05/
  00:48:56) blev aldrig endeligt identificeret — sandsynlig kandidat er samtidig
  skriveadgang fra to agent-sessioner til samme OneDrive-synkroniserede arbejdstræ, men
  ikke bekræftet.
- En rutine-opgave (tilføj `.gitattributes`) overskrev stille en eksisterende, aktiv
  Git LFS-regel, fordi filens eksisterende indhold ikke blev tjekket før `Set-Content`.
  Kun fanget fordi den efterfølgende verifikationsdisciplin (uafhængig krydstjek efter
  hver commit) allerede var etableret tidligere samme nat.
- Cowork-sandboxens OneDrive-mount viste gentagne gange forældet arbejdstræ-indhold for
  nyligt ændrede filer (selvom `.git`-historikken var frisk), hvilket tvang en omlægning
  af hvor kommandoer måtte køres midt i en tidskritisk genoprettelse.

### Hvad vi ændrer fremover

- Tjek altid en fils eksisterende indhold (`git show HEAD:<fil>` eller tilsvarende) før den
  overskrives med `Set-Content`/`Write`/lignende — særligt for konfigurationsfiler
  (`.gitattributes`, `.gitignore`, `.gitmodules`) hvor tabt indhold ikke nødvendigvis
  fejler synligt med det samme.
- Index-muterende git-kommandoer (`add`, `commit`, `checkout`, `restore`, `--renormalize`)
  køres aldrig fra Cowork-sandboxens bash mod dette repo — kun fra brugerens lokale
  PowerShell/Git Bash-session, som er den autoritative kilde. Cowork-sandboxen må gerne
  bruges til read-only inspektion (`git show`, `git log`) og til at redigere filindhold via
  fil-værktøjer (Read/Edit/Write), som har vist sig at gå direkte mod den rigtige fil.
- Overvej som beslutningspunkt (endnu ikke afgjort): skal kun én agent-session ad gangen
  have skriveadgang til arbejdstræet? Se `docs/drafts/#13` og CHANGELOG 2026-07-02.
- Committ hyppigere generelt, så uncommitted arbejde aldrig er eneste kopi af værdifuldt
  indhold — reglen der reelt reddede denne hændelse var at en fuld `git diff HEAD` var
  fanget minutter før korruptionen indtraf.

### Estimat vs. faktisk

| Aktivitet | Estimeret | Faktisk | Delta | Årsag til afvigelse |
|---|---|---|---|---|
| Genoprettelse af 5 filer + CRLF-normalisering + LFS-fix | Ikke estimeret (uforudset hændelse) | ~1,5 time samlet, 3 commits | N/A | Uforudset hændelse midt i planlagt PM-dokumentationsarbejde |

### Næste lesson skrives ved

Afslutning af Fase A, ELLER hvis "kun én skrivende session"-beslutningen træffes (se `#13`)

---

## Hændelse — to uafhængige lag skjuler filer med æ/ø/å for ad-hoc-scanning — Fundet 2026-07-16

**Varighed:** Ingen data tabt; opdaget under en lille oprydningsopgave (to stale
OneDrive-påstande efter flytningen 2026-07-12), ikke en selvstændig session.
**Status ved start → slut:** To uafhængige sessioner fik hver sin forkerte filoptælling
samme dag (18 vs. 3, og 33 vs. 36) uden fejlbesked → årsagen isoleret til TO uafhængige
lag, ikke ét. Den første note her foreskrev kun det ene lag som fix og blev selv
verificeret forkert (2×2-matrix, se nedenfor) før commit.

### Hvad gik skidt

- **Lag 1 — `core.quotepath`** (git-default `true`): `git ls-files`/`git grep -l`
  udskriver stier med æ/ø/å oktal-escaped (`St\303\246rkstr\303\270m...png`), ikke som
  en åbnbar sti.
- **Lag 2 — Windows-lokalkodning ved `subprocess(..., text=True)`:** selv med `-z`
  (quoting fikset) dekoder Python stdout med `cp1252` på Windows, ikke UTF-8, så
  strengen stadig ikke matcher den rigtige fil.
- Kun kombinationen af **begge** fix (quoting-fix + eksplicit UTF-8-decode) giver 0
  skips. Verificeret 2×2 på samme datasæt — de tre brudte kombinationer giver
  identisk resultat (148 uåbnelige af 6717), umulige at skelne fra hinanden uden testen:

  | quoting | decode | uåbnelige |
  |---|---|---|
  | brudt | brudt (`text=True`) | 148 |
  | FIX (`-z`) | brudt (`text=True`) | 148 |
  | brudt | FIX (eksplicit utf-8) | 148 |
  | **FIX (`-z`)** | **FIX (eksplicit utf-8)** | **0** |

- Ramte to uafhængige forsøg samme dag: en PowerShell-løkke der brugte `Test-Path` på
  git's output (fejlede synligt med "Ugyldige tegn i stien" — det held reddede den),
  og en Python-scanner der brugte git's escaped output direkte og bare talte 3 filer
  for lidt uden nogen fejl.
- 148 af 6717 trackede filer (2,2%) har ikke-ASCII i stien — forventeligt permanent i
  et dansk-domæne-repo, ikke en engangsforekomst.
- **Denne notes egen første version gik i samme fælde:** foreskrev `-z` ELLER
  `core.quotepath=false` som fix — begge alene er virkningsløse på Windows. En læser
  der fulgte originalen ville have fået 0 fejl, stadig 148 skips, og troet problemet
  var løst. Rettet efter uafhængig verificering, før commit.

### Hvad vi ændrer fremover

- Enhver scanning af trackede filstier via git kræver **begge** fix sammen, ikke ét:
  ```python
  raw = subprocess.run(['git','ls-files','-z'], capture_output=True).stdout   # ingen text=True
  files = [f for f in raw.decode('utf-8').split('\0') if f]                   # eksplicit UTF-8
  ```
  Aldrig `git ls-files`/`git grep -l` med default quoting, og aldrig
  `subprocess(text=True)` for git-output på Windows uden at kontrollere encoding.
- En scanner skal **aldrig** have en tavs `except: continue` omkring fil-åbning eller
  -parsing — det var netop det mønster der lod alle 148 skips passere uden en lyd i
  begge de oprindelige scanninger. Tæl skips eksplicit og rapportér antallet.
- Repoets egne gates (`validate-schemas.py`, `generate-runtime.py`, `audit-harness.ps1`)
  er IKKE ramt — de enumererer filsystemet direkte (`glob`/`Get-ChildItem`), ikke via
  git-output. Fælden rammer kun ad-hoc scanning/audit-agenter, ikke portene.
- En filtælling der er "lidt for lav" uden fejlbesked er nu et kendt symptom på denne
  fælde — mistænk sti-encoding og quoting samlet (begge lag — se 2×2) før man mistænker
  volatile tal eller forkert regex.

### Næste lesson skrives ved

Afslutning af Fase A, ELLER hvis "kun én skrivende session"-beslutningen træffes (se `#13`)
