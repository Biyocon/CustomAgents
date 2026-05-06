# Multi-Agent Dybdeanalyse — Universel Skabelon v4.0

Du skal loese denne opgave som et reelt audit-team, ikke som en generisk opsummering.

Hvis miljoeet understoetter subagents, skal du bruge dem.
Hvis miljoeet ikke understoetter subagents, skal du gennemfoere samme workstreams sekventielt med tydelig rolleopdeling og eksplicit arbejdsdeling.

Du maa ikke simulere dybde med narrativ alene.
Stoerre konklusioner maa kun drages, hvis fundene faktisk baerer dem.

---

## Projektkonfiguration

Udfyld foelgende inden brug. Slet eksempel-vaerdierne og indsaet projektets egne.

```yaml
projekt:
  navn: "<projektnavn>"                        # f.eks. "Hassan-Master", "MinApp"
  sti: "<absolut sti til repo>"                # f.eks. "C:\Users\X\project"
  version: "<version>"                         # f.eks. "v1.12.1", "0.3.0", "ukendt"
  beskrivelse: "<kort beskrivelse>"            # f.eks. "AI Work OS", "E-commerce backend"

stack:
  sprog: "<primaert sprog>"                    # f.eks. "TypeScript", "Python", "Go"
  framework: "<primaert framework>"            # f.eks. "Next.js 16", "FastAPI", "Spring Boot"
  runtime: "<runtime>"                         # f.eks. "Node.js 22", "Python 3.12", "Go 1.25"
  database: "<database>"                       # f.eks. "SQLite + Drizzle ORM", "PostgreSQL + Prisma"
  test_framework: "<test framework>"           # f.eks. "Vitest", "pytest", "Jest"
  build: "<build tool>"                        # f.eks. "Turbopack", "Vite", "Webpack"

dokumenter:
  # Angiv projektets vigtigste dokumenter i prioriteret raekkefoelge.
  # Bruges til sandhedskildereglen. Slet irrelevante linjer.
  primaer_status: "<fil>"                      # f.eks. "primer.md", "STATUS.md"
  sessionshistorik: "<fil>"                    # f.eks. ".claude-memory.md", "CHANGELOG.md"
  arbejdsregler: "<fil>"                       # f.eks. "tasks/lessons.md", "CONTRIBUTING.md"
  styrende_kontekst: "<fil>"                   # f.eks. "CLAUDE.md", "AGENTS.md"
  plan_filer:                                  # filer der KUN bruges til selektiv verifikation
    - "<fil>"                                  # f.eks. "KOREPLAN.md", "ROADMAP.md"
  sekundaer_produktinfo: "<fil>"               # f.eks. "README.md"

arkitektur:
  # Beskriv den dokumenterede lagmodel. Bruges som hypotese der skal verificeres.
  # Eksempel:
  # src/
  # |-- app/           # Web framework routes
  # |-- components/    # UI-komponenter
  # |-- lib/           # Kernelogik
  lagmodel: |
    <indsaet arkitekturdiagram her>

kendte_problemer:
  # Liste over kendte issues der skal verificeres som aktuelle, delvist aktuelle eller loeste.
  # Eksempel: "orchestrator.ts:334 mapper partial til failed"
  - "<problem 1>"
  - "<problem 2>"

nylige_aendringer:
  # Nylige aendringer der kan pavirke audit-scope.
  # Eksempel: "Sprint 30: AgentApprovalGate tilfojet"
  - "<aendring 1>"
  - "<aendring 2>"

checks:
  # Kommandoer der skal forsoeges koert. Tilpas til projektets stack.
  typecheck: "<kommando>"                      # f.eks. "npx tsc --noEmit", "mypy src/"
  test: "<kommando>"                           # f.eks. "npm run test", "pytest"
  lint: "<kommando>"                           # f.eks. "npm run lint", "ruff check ."
  migration_verifikation: "<metode>"           # f.eks. "tael SQL-filer i drizzle/", "alembic history"
  route_scan: "<glob pattern>"                 # f.eks. "src/app/api/**/route.ts", "app/routes/**/*.py"
  # Tilfoej yderligere checks efter behov:
  # security_scan: "<kommando>"
  # build: "<kommando>"

output:
  rapport_sti: "<sti>"                         # f.eks. "docs/audits/", "reports/"
  filnavn_format: "AUDIT_<YYYY-MM-DD>.md"      # dato indsaettes automatisk
  sprog: "dansk"                               # "dansk" eller "english"
```

---

## Formaal

Foretag en dybdegaaende, evidensbaseret og prioriteret analyse af projektet defineret i `projekt.sti`.

Leverancen skal entydigt identificere:
1. arkitektonisk sundhed og teknisk gaeld
2. kode- og testkvalitet paa tvaers af alle lag
3. sikkerheds- og vedligeholdelsesrisici
4. ubrugt, doed eller foraeldet kode
5. de bedste naeste skridt for at styrke platformen

---

## Ufravigelige krav

- Arbejd autonomt, evidensbaseret og med tydelig QA.
- Brug parallelle workstreams, hvor det giver reel vaerdi.
- Vaelg skills, plugins og vaerktoejer ud fra tilgaengelighed, analysevaerdi, reproducerbarhed og QA-vaerdi.
- Laas ikke analysen til bestemte modelnavne eller agenttyper, hvis miljoeet ikke understoetter dem.
- Du skal eksplicit dokumentere:
  - hvad der faktisk blev brugt
  - hvad der ikke var tilgaengeligt
  - hvilke kompromiser det medfoerte
- Du maa ikke levere en enkelt-agent analyse forklaedt som multi-agent arbejde.

Du skal eksplicit vise:
- hvilke workstreams eller agenter der blev brugt
- hvilke opgaver de fik
- hvad der blev koert parallelt
- hvordan koordinatorrollen styrede arbejdet
- hvordan QA blev udfoert
- hvordan endelige konklusioner blev syntetiseret

---

## Sandhedskilderegel

Hvis dokumentation, tests og kode er uenige, skal kode og faktisk runtime-adfaerd vaegtes hoejest.
Dokumentation maa ikke bruges som bevis for implementering uden kodeunderstoettelse.

### Dokumentprioritet

Brug foelgende prioritet, naar du danner sessionskontekst og vaegter dokumentation.
Prioriteten baseres paa felterne i `dokumenter`-sektionen af projektkonfigurationen.

1. **Kode og faktisk runtime-adfaerd** — altid hoejest prioritet
2. **Primaer statusdokument** (`dokumenter.primaer_status`) — bedste dokumentkilde for aktuel tilstand
3. **Sessionshistorik** (`dokumenter.sessionshistorik`) — append-only historik, bruges til at forstaa nylige aendringer
4. **Arbejdsregler** (`dokumenter.arbejdsregler`) — varige korrektioner og regler fra brugeren, skal overholdes
5. **Styrende kontekst** (`dokumenter.styrende_kontekst`) — laeseraekkefoelge, arbejdsregler, strategisk kontekst
6. **Plan-filer** (`dokumenter.plan_filer`) — kun til selektiv verifikation af konkrete paastande
7. **Sekundaer produktinfo** (`dokumenter.sekundaer_produktinfo`) — kun som sekundaer kilde

Det betyder:
- Plan-filer maa IKKE bruges som primaer sandhedskilde ved session-start
- Sekundaer produktinfo maa IKKE bruges som primaer statuskilde, hvis nyere kontekst eller kode siger noget andet
- Ved konflikt mellem dokumenter og kode vinder koden altid

---

## Agentstruktur

Brug 1 koordinator og 3-4 specialiserede workstreams, hvis subagents er tilgaengelige.

Hvis subagents ikke er tilgaengelige, skal samme workstreams gennemfoeres sekventielt med:
- tydelig rolleopdeling
- tydelig arbejdsdeling
- tydelig syntese paa tvaers af sporene

### Koordinatoransvar

Koordinatoren har ansvar for:
- problemforstaaelse
- plan
- workstream-design
- delegation
- paralleliseringsstyring
- kvalitetsgates
- integration af fund
- endelig syntese
- endelig godkendelse

### Minimum workstreams

#### Workstream A — Arkitektur og struktur
- verificerer den dokumenterede lagmodel (`arkitektur.lagmodel`) mod faktisk kode
- finder doed kode, ubrugte imports, foraeldede moduler og svage graenser
- vurderer separation of concerns og laggraenser
- identificerer taet kobling eller arkitektoniske hotspots

#### Workstream B — Kodekvalitet og test
- vurderer testtilstedevaerelse og testdybde per hovedmodul
- finder moduler med 0 tests eller svage tests
- vurderer kodelugte, lange filer, dyb nesting og duplikation
- vurderer type-sikkerhed og strictness

#### Workstream C — Sikkerhed og konfiguration
- gennemgaar auth, validering, rate limiting og kritiske API-ruter
- vurderer sandbox-begraensninger, command allowlists og file access
- finder potentielle SSRF, injection, path traversal eller secrets-risici
- vurderer env-var og config-haandtering

#### Workstream D — QA og evidenskontrol
- krydstjekker fund fra de andre workstreams
- finder svage slutninger og overfortolkning
- validerer at centrale konklusioner er belaegt med reel evidens
- kontrollerer at acceptkriterierne faktisk er opfyldt

Hvis flere workstreams giver reel vaerdi, maa du oprette dem, men kun med tydelig faglig begrundelse.

---

## Agent-orkestreringsprotokoller

Disse protokoller er valgfrie optimeringer — brug dem, hvis miljoeet understoetter det.

### Scratchpad

Koordinatoren opretter et delt mellemresultat-directory:
`<output.rapport_sti>/.scratch/<audit-dato>/`

Workstreams skriver strukturerede mellemresultater her:
- `ws-a-findings.md`, `ws-b-findings.md`, `ws-c-findings.md`
- Workstream D laeser ALLE andre workstreams' scratchpad-filer som QA-input

Scratchpad-filer er ikke del af den endelige rapport. De er interne arbejdsdokumenter.

### Delt system-prefix

Naar workstreams spawnes som subagents, skal de dele samme system-prompt prefix:
- Projektidentitet (`projekt.navn`, `projekt.version`, `stack`)
- Sandhedskildereglen (kode > dokumenter i prioriteret raekkefoelge)
- Audit-dato og scope

Dette giver prompt-cache hits og reducerer token-forbrug.
Hvert workstream tilfojer kun sin task-specifikke kontekst efter prefix'et.

### Status-updates

Hvert workstream rapporterer en 3-5 ords status-update mellem faser:
- Format: `[WS-X] <handling i nutid>` — f.eks. `[WS-A] Scanner src/lib/agents/`
- Koordinatoren logger disse, men de afbryder ikke workstream-eksekveringen

### Circuit breaker

Hvis et workstream fejler 3 gange paa samme check (f.eks. en kommando der konsekvent fejler):
- Spring checkken over
- Rapportér blokeringen med aarsag
- Marker omraadet som "Not verified — blocked by: <aarsag>"
- Fortsaet med naeste check

Brug ikke uendeligt mange retries paa checks der ikke virker.

### Tool-begraensning per workstream

| Workstream | Tilladt | Ikke tilladt |
|---|---|---|
| A (Arkitektur) | Laese filer, glob, grep, ls | Skrive filer, koere build |
| B (Kodekvalitet) | Laese filer, koere tests, koere lint, typecheck | Aendre kode |
| C (Sikkerhed) | Laese filer, grep, inspicere env | Skrive filer, koere commands der aendrer state |
| D (QA) | Laese scratchpad, laese filer, verificere paastande | Producere egne fund — kun validere andres |

### Koordinator completion-format

Naar et workstream afslutter, rapporteres resultat som struktureret besked:

```
[WORKSTREAM-X COMPLETE]
Status: completed | partial | failed
Fund: <antal> (Critical: N, High: N, Medium: N, Low: N)
Verifikation: Verified: N, Partially: N, Not verified: N
Blokeringer: <liste eller "ingen">
```

Koordinatoren venter paa ALLE workstreams foer syntese-fasen.

---

## Auditprotokol

### Phase 1 — Discovery
- kortlaeg repo-struktur
- identificer hoejrisikoomraader
- identificer centrale moduler, entry points og sandsynlige hotspots
- registrer foreloebige hypoteser

### Phase 2 — Targeted verification
- verificer de vigtigste hypoteser i kode
- koer reproducerbare checks (defineret i `checks`-sektionen)
- valider claims mod konkrete filer, flows og runtime-spor
- undgaa store konklusioner foer denne fase er gennemfoert

### Phase 3 — Synthesis
- konsolider fund
- fjern svage konklusioner
- prioriter anbefalinger
- skriv endelig rapport

---

## Hypotesevalidering

Foelgende kilder maa bruges som startpunkter for hypoteser, men IKKE som bevis:
- `arkitektur.lagmodel` — skal verificeres mod faktisk kode
- `kendte_problemer` — skal verificeres som aktuelle, delvist aktuelle eller loeste
- `nylige_aendringer` — skal verificeres som korrekt integrerede

Ved konflikt mellem hypoteser og faktisk kode skal koden altid vaegte hoejest.

---

## Afgraensninger

- Fokus er analyse, klassifikation, risikovurdering og handlingsplan.
- Overfladisk summary-only arbejde er ikke acceptabelt.
- Laes primaer statusdokument foerst ved audit-start.
- Brug styrende kontekstdokument til arbejdsregler og laeseraekkefoelge, ikke som primaer statusbevis.
- Laes IKKE plan-filer linje for linje som primaer kilde. Brug dem kun til selektiv verifikation.
- Brug sekundaer produktinfo som produktfortaelling, ikke som primaer drifts- eller statuskilde.
- Hvis eksakt coverage, runtime-adfaerd eller health-status ikke kan verificeres reproducerbart, skal du sige det eksplicit.

---

## Stop fake precision-regel

Hvis repoets stoerrelse, miljoebegransninger eller vaerktoejsadgang goer fuld verifikation urealistisk, skal du:
- skifte til risikobaseret sampling
- sige det eksplicit
- beskrive samplingstrategien
- markere hvilke omraader der blev fuldt verificeret, delvist verificeret eller ikke verificeret

Du maa ikke fremstille delvis verifikation som fuld auditdaekning.

---

## Operationel statuskategorisering

For hver stoerre capability skal du skelne mellem:

| Status | Definition |
|---|---|
| Implementeret og operationel | Kode, persistence, auth/guards, UI-flow og tests er paa plads |
| Implementeret men ufuldstaendig | Kernelogik eksisterer men mangler et eller flere lag (tests, auth, UI) |
| Delvist integreret | Dele er koblet sammen, men flowet er ikke end-to-end |
| Stub / placeholder | Route, funktion eller UI eksisterer men indeholder ingen reel logik |
| Dokumenteret men ikke verificeret | Omtalt i docs men ikke bekraeftet i kode |
| Ikke implementeret | Findes hverken i kode eller som stub |

Du maa IKKE kalde en capability "implementeret", hvis den kun findes som:
- UI uden backend-kobling
- backend uden aktivt UI-flow
- schema/types uden operationel brug
- route uden reel logik
- logik uden persistence, auth, guards, observability eller tests

---

## Minimum checks

Forsoeg som minimum at koere eller verificere checks defineret i `checks`-sektionen.

For HVER check skal du dokumentere:
- kommando eller metode
- resultat
- om den lykkedes
- hvis den ikke kunne koeres: hvorfor
- hvilken betydning det har for confidence i fundene

---

## Konkrete delmaal

### A. Arkitektur og struktur
- verificer den dokumenterede lagmodel mod faktisk kode
- find doed kode, ubrugte moduler og foraeldede exports
- vurder laggraenser og separation of concerns
- identificer de vigtigste arkitektoniske risici
- vurder om nylige aendringer er korrekt integreret

### B. Kodekvalitet og test
- vurder testtilstedevaerelse, testdybde og kritiske huller per hovedmodul
- find moduler med 0 tests
- vurder om tests er meningsfulde eller overmockede
- find de 5 stoerste kodelugte
- vurder type-sikkerhed og strictness
- find copy-paste eller anden duplikation

### C. Sikkerhed og konfiguration
- gennemgaa auth-lag og rate limiting hvor relevant
- gennemgaa kritiske API routes for input-validering
- gennemgaa sandbox-sikkerhed og command allowlists
- gennemgaa config-haandtering, env vars og secrets-risici
- verificer kendte sikkerhedsfixes hvis de omtales
- find nye sikkerhedsrisici

### D. Drift og vedligeholdelse
- vurder build-sundhed
- vurder migrationssundhed
- vurder logging-kvalitet
- find hardcoded konfiguration der burde vaere env-baseret
- vurder fejlhaandtering og resilience

### E. Naeste skridt
Anbefal de vigtigste naeste skridt i prioriteret raekkefoelge:
- **Nu** — kritisk eller blokerende
- **Snart** — vigtigt men ikke akut
- **Senere** — nice to have

---

## Skills og plugins

Gennemgaa og brug de noedvendige skills og plugins, hvis de er tilgaengelige og faktisk forbedrer analyse eller QA.

Overvej isaer:
- planlaegning
- code review
- security review
- testvurdering
- kodestandarder
- entitetsgraenser
- statisk analyse

Hvis et skill eller plugin ikke giver reel vaerdi, skal du sige det eksplicit.

---

## QA-protokol

Koordinatoren skal etablere en QA-proces med:
- kravsporbarhed fra opgave til leverance
- review af arkitekturfund
- review af kodekvalitetsfund
- review af sikkerhedsfund
- konsistenskontrol mellem workstreams
- kontrol mod overfortolkning
- verifikation mod acceptkriterier

QA-sporet skal eksplicit:
- krydstjekke centrale konklusioner
- markere svage eller utilstraekkeligt belaegte slutninger
- paapege inkonsistenser
- kontrollere om dokumentation fejlagtigt bruges som bevis for kode
- kontrollere om testtilstedevaerelse forveksles med testkvalitet
- kontrollere om groen build fejlagtigt sidestilles med arkitektonisk sundhed
- kontrollere om kendte problemer fejlagtigt markeres som loeste uden kodebevis

---

## Fundformat

For hvert centralt fund:

| Felt | Vaerdier |
|---|---|
| Severity | Critical / High / Medium / Low |
| Confidence | High / Medium / Low |
| Evidens | filsti(er) + kort observation |
| Konsekvens | hvad sker hvis det ikke adresseres |
| Anbefalet handling | konkret og operationel |

---

## Verifikationsstatus

For hvert hovedomraade:

| Status | Betydning |
|---|---|
| Verified | Fuldt verificeret med kodebevis |
| Partially verified | Dele verificeret, dele ikke daekkede |
| Not verified | Ikke verificeret — angiv blokeringsaarsag |

---

## Prioriteringsmatrice for anbefalinger

For hver vigtig anbefaling:

| Felt | Vaerdier |
|---|---|
| Impact | High / Medium / Low |
| Effort | High / Medium / Low |
| Risk reduction | High / Medium / Low |
| Priority | Nu / Snart / Senere |
| Dependency | eventuelle afhaengigheder |

---

## Acceptkriterier

Leverancen er kun godkendt, hvis:
- arkitekturen er verificeret mod faktisk kode, ikke kun dokumentation
- kodekvalitet er vurderet med konkrete fund, ikke generiske observationer
- sikkerhedsrisici er prioriteret med evidens
- testvurdering er lavet per hovedmodul, ikke kun totalt
- der foreligger en prioriteret handlingsplan opdelt i Nu / Snart / Senere
- kendte problemer er verificeret som aktuelle, delvist aktuelle eller loeste
- multi-agent setup eller workstream-opdeling og QA er synligt dokumenteret

---

## Kraevet outputformat

### 1. Executive Summary
- kort og skarp vurdering af platformens sundhed
- de 3 vigtigste styrker
- de 3 vigtigste risici
- de 3 vigtigste naeste skridt

### 2. Metode
- hvilke workstreams eller agenter blev brugt
- hvilke skills og plugins blev brugt
- hvad koerte parallelt
- hvordan QA blev udfoert
- hvilke checks blev faktisk koert

### 3. Arkitektur- og strukturanalyse
- verificeret lagmodel
- doede moduler / ubrugt kode
- arkitektoniske risici
- kobling og graenser

### 4. Kodekvalitet og test
- testvurdering per hovedmodul
- kvalitetsvurdering af tests
- kodelugte (top 5)
- type-sikkerhed og strictness

### 5. Sikkerheds- og konfigurationsreview
- prioriteret risikoliste
- evidens for hvert fund
- anbefalede handlinger
- status paa kendte fixes hvis relevante

### 6. Drift og vedligeholdelse
- build-sundhed
- migrationssundhed
- fejlhaandtering
- hardcoded konfiguration

### 7. Verifikationsstatus
- Verified / Partially verified / Not verified per hovedomraade

### 8. Prioriteret handlingsplan
- Nu
- Snart
- Senere

### 9. Bilag / evidensnoter
- kort dokumentation for centrale fund
- kun det noedvendige, ikke stoej

---

## Stilkriterier

- skriv paa det sprog der er angivet i `output.sprog`
- skriv praecist, professionelt og uden fyld
- undgaa generiske floskler
- vaer tydelig om forskellen paa fakta, vurdering og anbefaling
- konklusionerne skal vaere direkte brugbare som beslutningsgrundlag

---

## Outputfil

Skriv den endelige rapport til:
`<output.rapport_sti>/<output.filnavn_format>`

Hvis en fil for samme dato allerede findes, maa den overskrives.
Hvis miljoeet tillader det, maa commit-sha eller timestamp inkluderes for bedre sporbarhed.
