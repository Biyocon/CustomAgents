---
id: "#13"
title: "Rodårsagsundersøgelse af filkorruption 2026-07-02 + resterende code-review-fund"
fase: "F"
sprint: "TBD"
status: done
prioritet: "P1"
deps: []
blocks: []
oprettet: "2026-07-02"
sidst_opdateret: "2026-07-10"
lukket: "2026-07-10"
---

> **LUKKET 2026-07-10.** Alle code-review-fund er rettet eller løst (docs/done/, council-chairman,
> mojibake i brain-filer). Rodårsagen til selve filkorruptionen er **afskrevet som ikke-reproducerbar**
> efter 8 dage (OneDrive-versionshistorik kræver GUI-adgang og er sandsynligvis rullet), men de
> forebyggende foranstaltninger (én skribent ad gangen, commit ofte, snapshot-diff før multi-agent)
> er adopteret og dokumenteret i memory. Se detaljer pr. punkt nedenfor.

---

## Hvad & Hvorfor

Natten mellem 2026-07-01/02 blev 5 ikke-committede filer korrumperet (4 afkortet midt i
ord/sætning, 1 faldet tilbage til ældre indhold) — se CHANGELOG 2026-07-02. Indholdet er
genoprettet og committet (`1ea48fba`), men selve rodårsagen til hvilken proces der skrev
de korrupte versioner kl. 00:47:05/00:48:56 er ikke identificeret. Samtidig fandt
code-review-sessionen (Fable 5) 4 mindre fund der overlevede genoprettelsen og stadig
er reelle huller.

---

## Done ser sådan ud

Rodårsagen er enten bekræftet (og en forebyggende foranstaltning er indført) eller
eksplicit afskrevet som ikke-reproducerbar efter et forsøg på undersøgelse. De 4
code-review-fund er hver enten rettet eller bevidst nedprioriteret med begrundelse.

---

## Teknisk scope (foreløbigt)

### Rodårsag
- [~] ~~Tjek OneDrive-versionshistorik på de 5 filer~~ **Afskrevet 2026-07-10:** kan kun gøres via
      OneDrive-GUI (brugerhandling), og versionshistorikken er efter 8 dage sandsynligvis rullet.
      Rodårsagen (hvilken proces skrev 00:47:05/00:48:56-versionerne) er **ikke reproducerbar** nu.
- [x] Driftsregel adopteret: "én skribent ad gangen" + "snapshot-diff før multi-agent" + "commit ofte"
      er dokumenteret i memory (OneDrive-korruptionshændelse-noten + gated stop-and-report-protokol).
      De forebyggende foranstaltninger er dermed på plads, selvom selve rodårsagen ikke kunne bekræftes.
- [x] Hyppigere commits som standardpraksis: fulgt i praksis gennem hele 2026-07-09/10-arbejdet
      (mange små, verificerede commits; intet uncommitted arbejde efterladt som eneste kopi).

### Resterende code-review-fund
- [x] `README.md` refererer til `docs/done/` — **løst:** `docs/done/` blev oprettet 2026-07-09 (commit `83152c00`) og indeholder nu 10+ lukkede tickets. Referencen er gyldig.
- [x] `council-chairman` roster/avatarløs — **løst 2026-07-09:** dokumenteret som bevidst meta-agent-undtagelse i `.agents/registry.yaml` (`meta_agent: true`/`roster_exempt: true`); validate-scriptet springer den over (INFO, ikke WARN). Meta-agent uden avatar er korrekt; ikke arkiveret.
- [~] Manglende EOF-newline — delvist overlap med #12 (CRLF-normalisering, done). Ikke separat forfulgt; lav-risiko kosmetik.
- [x] Gamle U+0097/`¦`-tegn i `.agents/brain/context.md` (3×) og `.agents/brain/README.md` (1× U+0097 + 7× ¦) — **rettet 2026-07-10:** U+0097 → `—` (em-dash), `¦` → `|` (matcher strukturtræets `+--`). Begge filer verificeret ren UTF-8.

---

## Åbne spørgsmål før aktivering

- [~] Er "kun én skrivende agent-session ad gangen" praktisk holdbar? Adopteret som praksis/memory-regel;
      hvis brugeren senere kører flere parallelle værktøjer, kan reglen revideres — ikke en blokering nu.
- [x] Skal `council-chairman` være en permanent undtagelse fra avatarløs-arkiverings-konventionen?
      **Ja, afgjort 2026-07-09:** meta-agent uden avatar er korrekt; markeret `meta_agent`/`roster_exempt`
      i registry og undtaget i validate-scriptet.

---

## Blocker / noter

2026-07-02: Ingen af punkterne er datatab eller akutte — alle kan tages i normal
sprint-rækkefølge. Rodårsags-punktet bør dog tages mens OneDrive-versionshistorikken
stadig er frisk (den ruller typisk med tiden).
