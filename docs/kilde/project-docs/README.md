# Projekt-dokumentationssystem — Templates

Genbrugelige skabeloner til det dokumentations- og hukommelsessystem der driver
agent-assisteret udvikling (Claude Code, Codex, Gemini m.fl.). Afledt af et modent
produktionsrepo og gjort projekt-agnostisk.

Kopiér indholdet af `templates/` ind i roden af et nyt projekt, søg-og-erstat
placeholders, og slet de sektioner du ikke bruger.

---

## Filosofien bag systemet

Dette er **ikke** 12 løse filer. Det er ét sammenhængende system med bevidst
rollefordeling, bygget på fire principper:

1. **Én sandhedskilde, mange indgange.** Agent-harnesses (Claude/Codex/Gemini)
   peger alle på samme master-instruks via tynde stub-filer.
2. **Frisk kondensat frem for genlæsning.** Agenten læser ét lille resumé
   (`primer.md`) ved session-start — aldrig de tunge planer i deres helhed.
3. **Fejl fanges som regler.** Hver bruger-korrektion bliver en nummereret,
   varig regel i `tasks/lessons.md`, så den ikke gentages.
4. **Plan adskilt fra historik.** "Hvad og hvorfor" (idébank) lever adskilt fra
   "hvad nu og i hvilken rækkefølge" (køreplan) og fra "hvad skete der" (memory).

### Sandhedskildeorden

Når kilder modsiger hinanden, gælder denne rækkefølge (mest til mindst autoritativ):

```
kode > primer.md > .claude-memory.md > tasks/lessons.md > CLAUDE.md
```

Koden er altid facit. Dokumenterne beskriver intention og hukommelse.

---

## De 12 filer — rolle og levetid

### Indgangslag (læses først hver session)
| Fil | Rolle | Levetid |
|-----|-------|---------|
| `primer.md` | Kondensatet: current focus, done, in-progress, blockers, next steps, key files. **Omskrives helt ved session-slut.** | Flygtig |
| `CLAUDE.md` | Master-instruks: kommandoer, arkitektur, gotchas, kodestil, reference-index. Overrider default agent-adfærd. | Stabil |
| `AGENTS.md` | Stub → peger på `CLAUDE.md` (for Codex og generiske agenter). | Statisk |
| `GEMINI.md` | Stub → peger på `CLAUDE.md` (for Gemini). | Statisk |

### Hukommelseslag
| Fil | Rolle |
|-----|-------|
| `tasks/lessons.md` | Durable operating rules fra bruger-korrektioner. Nummereret, append-only. |
| `.claude-memory.md` | Append-only commit-log + manuel session-log. Auto-opdateret af git post-commit hook. |

### Planlægningslag (to dokumenter, bevidst adskilt)
| Fil | Svarer på |
|-----|-----------|
| `PROJEKT_PLAN.md` | "Hvad bygger vi og hvorfor?" — idébank, designbeslutninger, ønskeliste, changelog. |
| `KØREPLAN.md` | "Hvad gør vi nu, i hvilken rækkefølge?" — sprints/faser med status. |

### Reference-/arkitekturlag
| Fil | Rolle |
|-----|-------|
| `systemkort.md` | Autoritativ arkitektur: lag, komponenter, agent-vs-tool-sondringer. |
| `FORBEDRINGSNOTAT.md` | Dyb arkitektur-kritik mod en referencearkitektur → konkret roadmap. |
| `README.md` | Offentlig projektbeskrivelse (capabilities, stack, kom-i-gang). |

### Bidragslag
| Fil | Rolle |
|-----|-------|
| `CONTRIBUTING.md` | Bidragsguide: struktur, setup, tests, konventioner, PR-regler. |

---

## Sådan tager du systemet i brug i et nyt projekt

1. **Kopiér** indholdet af `templates/` → projektets rod (filerne ligger direkte
   i roden, undtagen `tasks/lessons.md`).
2. **Søg-og-erstat** alle `{{PLACEHOLDER}}` (se tabel nedenfor).
3. **Beskær aggressivt.** Slet lag du ikke har brug for. Et lille projekt klarer
   sig med `CLAUDE.md` + `primer.md` + `tasks/lessons.md` + `README.md`. Tilføj
   plan-/arkitektur-filer når kompleksiteten kræver det.
4. **Installér commit-hook'en** (valgfri) så `.claude-memory.md` opdateres
   automatisk — se kommentaren i toppen af den fil.
5. **Pej CLAUDE.md** ind i din agents instruktioner (Claude Code læser den
   automatisk; for Codex/Gemini fungerer stub-filerne).

### Centrale placeholders

| Placeholder | Betydning |
|-------------|-----------|
| `{{PROJECT_NAME}}` | Projektets navn |
| `{{ONE_LINE_PITCH}}` | Én sætning om hvad projektet er |
| `{{PRIMARY_LANGUAGE}}` | Hovedsprog (TypeScript, Python, …) |
| `{{STACK}}` | Teknologistak |
| `{{ROOT_PATH}}` | Absolut sti til projektroden |
| `{{UI_LANGUAGE}}` | Sprog for UI-tekst (fx da-DK) |
| `{{DEFAULT_BRANCH}}` | Git-default branch |
| `{{PKG_MANAGER}}` | npm / pnpm / uv / cargo … |
| `{{TEST_CMD}}` / `{{BUILD_CMD}}` / `{{DEV_CMD}}` | Kommandoer |
| `{{TODAY}}` | Dato (YYYY-MM-DD) |

---

## Minimalt vs fuldt setup

- **Solo / lille projekt:** `CLAUDE.md`, `primer.md`, `tasks/lessons.md`, `README.md`.
- **Mellem:** + `PROJEKT_PLAN.md`, `KØREPLAN.md`, `CONTRIBUTING.md`, `.claude-memory.md`.
- **Stort / multi-agent:** alle 12, inkl. `systemkort.md` og `FORBEDRINGSNOTAT.md`.

Start småt. Dokumentation der ikke vedligeholdes lyver — og en lyvende `primer.md`
er værre end ingen.

---

## Mappestruktur i denne template-pakke

```
project-doc-templates/
  README.md            <- denne guide
  templates/
    CLAUDE.md
    AGENTS.md
    GEMINI.md
    primer.md
    README.md          <- projekt-README (offentlig)
    CONTRIBUTING.md
    PROJEKT_PLAN.md
    KØREPLAN.md
    systemkort.md
    FORBEDRINGSNOTAT.md
    .claude-memory.md
    tasks/
      lessons.md
```
