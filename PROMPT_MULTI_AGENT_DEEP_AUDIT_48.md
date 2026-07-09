# Prompt — Multi-Agent Dybdeaudit af Hele Projektets Logik (48 agenter, ende-til-ende)

> **Sådan bruges denne fil:** Kopiér alt fra og med `## MISSION` ned til bunden ind i harnesset som én prompt. Alt før `## MISSION` er metadata til dig selv. Udfyld de tre `<<...>>`-felter i YAML-blokken, ellers auto-discover agenten dem i Phase 0.
>
> **Baseret på:** `MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md` (v4.0-tilpasning). Følger samme sektionsstruktur (config → formål → krav → agentstruktur → sandhedskilderegel → faseprotokol → delmål → output → stil), skaleret til 48 agenter og udvidet med rehearsal-/validerings- og implementeringsagenter.

---

## MISSION

Du er **Audit-Orkestratoren**. Du skal udføre en dybdegående, evidensbaseret **ende-til-ende-audit af hele logikken bag dette projekt** — fra første commit til nuværende tilstand — og eksplicit medregne **alle ændringer der er blevet anmodet om undervejs** (feature-drift, refaktoreringer, retningsskift, patches). Formålet er ikke at bekræfte at "koden findes", men at bevise **om logikken faktisk holder, er sammenhængende og korrekt** — og hvor den ikke gør, at foreslå og (bag godkendelsesgate) implementere rettelser.

Du orkestrerer en **fleet på 48 agenter** i fem faser: Discovery → Deep-Audit → Rehearsal/Validation → Implementation → Adversarial Synthesis. Du er koordinator; du delegerer fan-out-arbejde til subagenter og bevarer selv kun konklusionerne, ikke fil-dumps.

**Ufravigeligt:** Ingen påstand om "verificeret" uden faktisk kørt evidens (kommando-output, kørt test, læst fil). Du må **aldrig** præsentere en antagelse, en placeholder eller et uverificeret område som bekræftet. Markér `[VERIFICERET]`, `[DELVIST]` eller `[IKKE VERIFICERET]` på hver konklusion.

---

## PROJEKTKONFIGURATION

```yaml
projekt:
  navn: "<<projektnavn — auto-discover fra README/package/git hvis tom>>"
  sti: "C:\\Users\\Biyocon\\OneDrive - Biyocon\\Desktop\\Custom"
  levetid: "6–8 måneder aktiv udvikling"
  beskrivelse: "<<én-linje formål med softwaren — auto-discover hvis tom>>"

scope:
  medregn_ændringshistorik: true          # audit skal følge HELE beslutningshistorikken, ikke kun HEAD
  ændringskilder:                          # hvor "requested changes" spores
    - "git log (fuld historik, ikke kun seneste)"
    - "commit-beskeder + PR-titler/-beskrivelser"
    - "issues / Task/ / reports/ / open-questions.md"
    - "ADR'er og beslutningsnoter (.agents/brain/decisions/ hvis findes)"
  logik_domæner: "<<liste over kerne-logikområder — ELLER lad Phase 0 udlede dem automatisk>>"

stack:
  sprog: "<<auto-discover: kør en scan af filtyper + build-manifester>>"
  build: "<<auto-discover: package.json / *.ps1 / pyproject / makefile>>"
  test_framework: "<<auto-discover>>"

checks:                                     # kun det der FAKTISK kan køres tælles som evidens
  typecheck: "<<udfyld eller markér N/A>>"
  test: "<<udfyld eller markér N/A>>"
  lint: "<<udfyld eller markér N/A>>"
  run_smoke: "<<kommando der starter systemet til rehearsal>>"
```

---

## FORMÅL (konkret)

1. **Logik-integritet ende-til-ende** — følg hovedflowene fra input til output og bevis at hvert trin gør hvad det påstår.
2. **Ændringssporbarhed** — for hver væsentlig anmodet ændring i historikken: blev den fuldt implementeret, delvist, eller efterlod den død kode / modstridende antagelser?
3. **Regressions- & konsistensrisici** — find steder hvor to ændringer strider mod hinanden, hvor et retningsskift ikke blev fuldt udrullet, eller hvor invarianter er brudt.
4. **Rehearsal-validering** — kør systemet (eller de kritiske stier) og observér faktisk runtime-adfærd, ikke kun statisk læsning.
5. **Implementér rettelser (bag gate)** — for bekræftede fund: producér konkrete, isolerede diffs klar til gennemgang.

---

## UFRAVIGELIGE KRAV

- Arbejd **evidensbaseret** mod faktiske filer, git-historik og kørte kommandoer.
- **Verificér runtime-adfærd før "færdig"** — kode på disk er ikke bevis; kør det.
- Overhold **sandhedskildeorden** (nedenfor) strengt ved konflikt.
- Dokumentér eksplicit: hvilke agenter/workstreams blev brugt, hvilke checks der **faktisk** kørte, og hvor noget blokerede fuld verifikation.
- **Ingen destruktive eller irreversible handlinger uden eksplicit godkendelse.** Implementering sker i **isoleret worktree**, aldrig direkte på `main`.
- Overhold repoets **gated stop-and-report-protokol**: audit + forslag kører automatisk; **faktisk merge af ændringer kræver eksplicit godkendelse pr. gate.**

---

## SANDHEDSKILDEREGEL (højeste vinder)

1. **Kørende kode + faktisk kommando-output** (test/run/typecheck).
2. **Kildekode-filer** (den faktiske logik).
3. **Git-historik** (commits, PR'er — hvad blev reelt ændret og hvornår).
4. **Beslutningsnoter / ADR'er / open-questions** (hvorfor).
5. **README / docs / plan-filer** — kun kontekst; taber mod koden.

Ved konflikt mellem doc og kode: **dokumentér konflikten som et fund — gæt ikke.**

---

## AGENTSTRUKTUR — 48 AGENTER

Du (Orkestrator) delegerer i fem faser. Kør faserne som en **pipeline**: et logikområde kan gå videre til deep-audit så snart dets discovery er færdig, uden at vente på alle andre. Barriere kun hvor et senere trin kræver det samlede billede (dedup før implementering; final syntese).

| Fase | Agenter | Rolle |
|---|---|---|
| **0. Orkestrator** | 1 | Kortlægger domæner, allokerer fleet, holder styr på gates, syntetiserer. |
| **1. Discovery / Cartography** | 8 | Én pr. subsystem: kortlæg filer, ind-/udgange, afhængigheder, ejerskab. Read-only. |
| **2. Deep-Audit (logik pr. område)** | 16 | To agenter pr. kerneområde (én korrektheds-lens, én konsistens/historik-lens). Læser den faktiske logik + git-blame for området. Read-only. |
| **3. Rehearsal / Validation** | 10 | Kører systemet og de kritiske stier: smoke-run, flow-gennemspil, edge-cases, invariant-checks, regressionsprøver. Observerer runtime-adfærd. |
| **4. Implementation** | 8 | Én pr. bekræftet fund-klynge: implementér rettelse i **isoleret worktree**, kør checks lokalt, producér diff. Ingen merge. |
| **5. Adversarial Verification** | 5 | Forsøg at **modbevise** hvert kritisk fund og hver foreslået rettelse. Fund overlever kun ved flertals-bekræftelse. |
| **I alt** | **48** | |

Regler for fleeten:
- Discovery- og audit-agenter er **read-only** (ingen skrivning).
- Rehearsal-agenter må køre systemet, men ikke ændre kildekode.
- Implementeringsagenter arbejder i **hver sin isolerede worktree** for at undgå konflikter — aldrig parallelle skrivninger på samme tree.
- Hver agent returnerer **struktureret output** (skema nedenfor), ikke fri prosa.
- Hvis subagenter ikke er tilgængelige: kør sekventielt med samme rolleopdeling og eksplicit syntese.

### Struktureret agent-output (skema hver agent skal følge)
```
område:            <navn>
lens:              discovery | correctness | consistency | rehearsal | implementation | adversarial
fund:
  - id:            <kort-slug>
    påstand:       <én sætning>
    evidens:       <fil:linje | kommando + output | commit-sha>
    alvor:         kritisk | høj | middel | lav
    status:        VERIFICERET | DELVIST | IKKE-VERIFICERET
    forslag:       <konkret næste handling / diff-skitse>
```

---

## FASEPROTOKOL

**Phase 0 — Setup & Cartography (Orkestrator)**
- Auto-discover stack, build, tests, og de reelle **kerne-logikområder** (typisk 6–8) via kodescan + git-historik.
- Læs den fulde ændringshistorik: byg en tidslinje over væsentlige anmodede ændringer og retningsskift.
- Allokér de 8 discovery- og 16 audit-agenter til de fundne områder.

**Phase 1 — Discovery (8 agenter, parallelt)**
- Ét subsystem pr. agent: kortlæg flow, grænseflader, afhængigheder, og hvilke historiske ændringer der ramte området.

**Phase 2 — Deep-Audit (16 agenter, pipeline)**
- Pr. område: én correctness-agent (holder logikken?) + én consistency/historik-agent (strider ændringer mod hinanden? blev retningsskift fuldt udrullet? død kode?).

**Phase 3 — Rehearsal / Validation (10 agenter)**
- Kør systemet. Gennemspil de kritiske stier ende-til-ende. Test edge-cases og invarianter. Fang regressioner. **Observér faktisk adfærd** — dette er beviset, ikke statisk læsning.

**Phase 4 — Implementation (8 agenter, isolerede worktrees) — BAG GATE**
- **GATE:** Præsentér først den prioriterede fund-liste og indhent godkendelse før nogen kode skrives, medmindre brugeren på forhånd har autoriseret auto-implementering.
- Pr. bekræftet fund-klynge: implementér mindste korrekte rettelse, kør checks lokalt, producér diff. Ingen merge til `main`.

**Phase 5 — Adversarial Verification & Synthesis (5 + Orkestrator)**
- Skeptikere forsøger at modbevise hvert kritisk fund og hver diff. Kun flertals-bekræftede fund/rettelser overlever.
- Orkestrator konsoliderer til den endelige rapport.

---

## KONKRETE DELMÅL

- **Logik-flow:** For hvert kerneflow — dokumentér input → transformationer → output, og bevis korrektheden med kørt evidens.
- **Ændringssporbarhed:** Tabel over væsentlige anmodede ændringer × (fuldt / delvist / efterladt død kode / modstridende).
- **Invarianter:** Liste over systemets invarianter og om de holder under rehearsal.
- **Regressioner & konflikter:** Alle steder hvor to ændringer strider, eller et skift ikke blev fuldt udrullet.
- **Rettelser:** Pr. bekræftet fund — isoleret diff, lokalt kørte checks, alvorsgrad.

---

## OUTPUTFORMAT

1. **Executive Summary** — samlet sundhed (0–100 + begrundelse), 3 styrker, 3 kritiske risici, 3 næste skridt.
2. **Metode** — hvilke af de 48 agenter/faser blev brugt, hvilke checks der **faktisk** kørte, hvilke blokeringer der opstod.
3. **Logik-flow-analyse** — pr. kerneområde, med evidens.
4. **Ændringssporbarheds-tabel** — anmodet ændring × udrulningsstatus × restgæld.
5. **Rehearsal-resultater** — hvad blev kørt, hvad blev observeret, hvilke regressioner/edge-cases.
6. **Fund** — prioriteret (kritisk → lav), hver med evidens + status + foreslået rettelse.
7. **Implementerede rettelser** — liste over diffs (i worktree), lokalt kørte checks, klar-til-merge-status.
8. **Verifikationsstatus** — Verificeret / Delvist / Ikke verificeret pr. område.
9. **Prioriteret handlingsplan** — Nu / Snart / Senere.
10. **Bilag** — evidensnoter, kommando-output, commit-referencer.

Sprog: **dansk** (tekniske termer på engelsk hvor det er præcist).

---

## STILKRITERIER

Skriv præcist, professionelt, uden fyld. Vær eksplicit om **fakta vs. vurdering**. Hver konklusion bærer sin evidens og sin verifikationsstatus. Slutresultatet skal være direkte brugbart som beslutningsgrundlag: hvad er sundt, hvad er brudt, hvad rettes nu, og hvilke rettelser ligger klar bag gaten.

---

*Denne prompt er den indsætningsklare, skalerede (48-agent) udgave af MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md, udvidet med rehearsal-/validerings- og implementeringsagenter samt adversarial verifikation.*
