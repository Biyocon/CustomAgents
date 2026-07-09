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

Afslutning af Fase A — Runtime- og registry-konsolidering (se `KØREPLAN.md`)

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
