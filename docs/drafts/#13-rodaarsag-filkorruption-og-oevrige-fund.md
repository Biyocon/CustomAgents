---
id: "#13"
title: "Rodårsagsundersøgelse af filkorruption 2026-07-02 + resterende code-review-fund"
fase: "F"
sprint: "TBD"
status: draft
prioritet: "P1"
deps: []
blocks: []
oprettet: "2026-07-02"
---

---

## Hvad & Hvorfor

Natten mellem 2026-07-01/02 blev 5 ikke-committede filer korrumperet (4 afkortet midt i
ord/sætning, 1 faldet tilbage til ældre indhold) — se CHANGELOG 2026-07-02. Indholdet er
genoprettet og committet (`829b34ad`), men selve rodårsagen til hvilken proces der skrev
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
- [ ] Tjek OneDrive-versionshistorik (højreklik → Versionshistorik) på de 5 filer for at se
      hvilken klient/proces der skrev 00:47:05- og 00:48:56-versionerne
- [ ] Overvej driftsregel: kun én agent-session ad gangen har skriveadgang til arbejdstræet
      (kandidat til `AGENTS.md`) — kræver beslutning, se CHANGELOG-entry
- [ ] Overvej hyppigere commits som standardpraksis, så uncommitted arbejde aldrig er eneste kopi

### Resterende code-review-fund
- [ ] `README.md` refererer til `docs/done/`, som ikke findes på disk (kun `docs/active/`
      og `docs/drafts/`) — ret referencen eller opret mappen
- [ ] `council-chairman` mangler i `.vscode/.codex/agents/agent-roster.json` og er
      avatarløs, hvilket strider mod den dokumenterede konvention (avatarløse arkiveres) —
      afklar om council-chairman skal undtages fra konventionen (meta-agent uden avatar er
      måske korrekt) eller have avatar tilføjet
- [ ] Manglende EOF-newline på flere filer (delvist overlap med ticket #12)
- [ ] Gamle U+0097/`¦`-tegn (cp1252-em-dash-korruption, forudgående for nattens hændelse) i
      `.agents/brain/context.md` (linje 20, 24, 25) og `.agents/brain/README.md`
      (strukturtræets ældre linjer) — kosmetisk, men bør ryddes op i samme ombæring som #12

---

## Åbne spørgsmål før aktivering

- [ ] Er "kun én skrivende agent-session ad gangen" en praktisk holdbar regel givet
      brugerens arbejdsform (flere parallelle AI-værktøjer)? Kræver ejerbeslutning.
- [ ] Skal `council-chairman` behandles som en permanent undtagelse fra
      avatarløs-arkiverings-konventionen i `agent-profile.schema.json`?

---

## Blocker / noter

2026-07-02: Ingen af punkterne er datatab eller akutte — alle kan tages i normal
sprint-rækkefølge. Rodårsags-punktet bør dog tages mens OneDrive-versionshistorikken
stadig er frisk (den ruller typisk med tiden).
