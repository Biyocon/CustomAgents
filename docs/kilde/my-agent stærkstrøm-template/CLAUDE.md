# Claude Code — Projektinstruktion

> Denne fil bruges af Claude Code som projektmemory og kontekst.
> Claude Code læser `CLAUDE.md` automatisk ved opstart i dette repo.
> Se: https://code.claude.com/docs/en/memory

---

## 1. Referencer

- **Masterprompt:** `AGENTS.md` — den primære agentinstruktion for el-ingeniør
- **Brugerprofil:** `memory/user-profile.md`
- **Præferencer:** `memory/preferences.md`
- **Kvalitetsprincipper:** `memory/engineering-principles.md`
- **Vejledning:** `guide.md`

---

## 2. Claude-specifikke instruktioner

Når du arbejder i dette repo som Claude Code:

1. Læs altid `AGENTS.md` først for at forstå agentens identitet, principper og begrænsninger.
2. Læs `memory/user-profile.md` og `memory/preferences.md` for at forstå brugerens kontekst.
3. Følg den modulære struktur: brug `skills/`, `agents/`, `commands/` og `tools/` efter behov.
4. Dokumentér alle antagelser direkte i filer, ikke kun i samtalen.
5. Brug track changes og initialer (**AGR**) ved review, som beskrevet i `memory/engineering-principles.md`.
6. Skriv altid på dansk medmindre bruger beder om andet.
7. Marker usikkerheder og manglende data tydeligt.

---

## 3. Struktur — hvor finder du hvad

| Mappe | Indhold |
|-------|---------|
| `AGENTS.md` | Masterprompt, identitet, principper, workflows |
| `memory/` | Brugerprofil, præferencer, beslutninger, læring |
| `agents/` | Specialistroller (lead, QA, beregning, data, diagram, tilbud) |
| `skills/` | Genbrugelige evner (load lists, kabler, tavler, review, diagrammer) |
| `commands/` | Kaldelige workflows (start projekt, kør Ralph-loop, review, mm.) |
| `tools/` | Python-scripts, Excel-hjælpere, Excalidraw-skabeloner, CAD-noter |
| `plugins/` | Integrationer til FEBDOC, Simaris, AutoCAD, MicroStation, SharePoint, ProjectWise, Outlook, Teams |
| `mcp/` | MCP-servers, -tools, -resources, -prompts |
| `templates/` | Genbrugelige faglige skabeloner |
| `tasks/` | Dagens opgaver, backlog, afsluttede |
| `diary/` | Teknisk arbejdsdagbog |
| `quality/` | QA-fund, tjeklister, review-skabeloner |
| `docs/` | Standarder, Rambøll-dokumentation, projekteksempler |
| `projects/` | Aktive projekter (kopieres fra template) |

---

## 4. Hvad Claude Code skal huske

- Brugeren er **senior rådgiver, el-ingeniør, industri** hos Rambøll.
- Projekttyper: **industrianlæg, procesbygninger, datacentre**.
- Kvalitetskrav: mellemtrin, forudsætninger, QA-skema, track changes (AGR), mangelliste, åbne punkter med ejer/deadline.
- Sprog: **rent dansk**, aktiv stemme, professionel og konservativ tone.
- Automatisering: Excel/load lists, datamangel-lister, SLD/tavlestruktur/flowdiagrammer.
- Aldrig gem CPR/persondata eller kontraktkritiske data uden tilladelse.
