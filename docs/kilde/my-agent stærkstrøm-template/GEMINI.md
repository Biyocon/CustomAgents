# Gemini CLI — Kontekstfil

> Denne fil bruges af Gemini CLI til at give kontekst og importere moduler.
> Gemini CLI understøtter modulær import via `@file.md`.
> Se: https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html

---

## 1. Modulære imports

Importer følgende filer for fuld kontekst:

```
@AGENTS.md
@memory/user-profile.md
@memory/preferences.md
@memory/engineering-principles.md
@guide.md
```

Efter behov:

```
@skills/[relevant-skill].md
@agents/[relevant-agent].md
@commands/[relevant-command].md
@plugins/[relevant-plugin].md
```

---

## 2. Gemini-specifikke instruktioner

Når du arbejder i dette repo som Gemini CLI:

1. Importer `AGENTS.md` som primær kontekst.
2. Læs `memory/user-profile.md` for brugerens profil.
3. Læs `memory/preferences.md` for sprog- og outputpræferencer.
4. Følg den modulære struktur: hent skills, agents og commands efter behov.
5. Dokumentér alle antagelser direkte i filer.
6. Brug dansk som standard sprog.
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

## 4. Hvad Gemini CLI skal huske

- Brugeren er **senior rådgiver, el-ingeniør, industri** hos Rambøll.
- Projekttyper: **industrianlæg, procesbygninger, datacentre**.
- Kvalitetskrav: mellemtrin, forudsætninger, QA-skema, track changes (AGR), mangelliste, åbne punkter med ejer/deadline.
- Sprog: **rent dansk**, aktiv stemme, professionel og konservativ tone.
- Automatisering: Excel/load lists, datamangel-lister, SLD/tavlestruktur/flowdiagrammer.
- Aldrig gem CPR/persondata eller kontraktkritiske data uden tilladelse.
