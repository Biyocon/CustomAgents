# Memory-governance (PR E)

Ledsagedokument til [ADR-multi-runtime-agent-system.md](ADR-multi-runtime-agent-system.md) (Roadmap, PR E)
og [registry-reconciliation.md](registry-reconciliation.md). Politik for al persistent hukommelse i repoet:
hvad der er sandhed, hvor nye indsigter lander, og hvad der er frossent.

## De tre memory-klasser

| Klasse | Placering | Skriveregel | Livscyklus |
|---|---|---|---|
| **CANONICAL** | `.agents/brain/` (context, glossary, assumptions, open-questions, decisions/, maps/, runbooks/, personal/, tasks/, source-map) | Redigeres **in-place**; én skribent ad gangen; UTF-8-vagt efter hver redigering | Levende — altid aktuel; forældet indhold rettes eller slettes |
| **RUNTIME-LOKAL** | `.vscode/.codex/Brain/` (og fremtidige `.claude/`, `.gemini/` m.fl.) | **FROSSET** pr. 2026-07-11 — må ikke håndredigeres som datakilde; ny varig viden skrives ALDRIG her | Transitional legacy; erstattes/genereres ved PR F. Kendte forældede påstande er dokumenteret i mapping-tabellen nedenfor |
| **SNAPSHOT** | `.agents/brain/memory/` (sessionslogs), `.agents/brain/diary/`, `.agents/reports/` | **Append-only**: dateret ved skrivning, redigeres aldrig retroaktivt | Historik, ikke aktuel sandhed. `validation_report.md` er specialtilfælde: regenereres af værktøj (overskrives, håndredigeres ikke) |

## Landing-regler

1. **Ny varig indsigt** (begreb, beslutning, antagelse, åbent spørgsmål) → CANONICAL, i den relevante
   `.agents/brain/`-fil. Beslutninger → ny ADR i `decisions/`.
2. **Sessionsforløb/arbejdslog** → SNAPSHOT: `.agents/brain/memory/session-YYYY-MM-DD*.md`.
3. **Runtime-lag må gerne LÆSES** (Codex læser `.vscode/.codex/Brain/` i dag), men enhver konflikt
   afgøres af sandhedskildeordenen: **kode > primer.md > canonical brain > runtime-Brain**.
4. Ingen duplikering: canonical henviser, kopierer ikke (undtagen bevidste snapshot-landinger med
   provenance-header, se nedenfor).
5. Landede kopier fra runtime får en provenance-header (`> LANDET fra <sti> ved PR E …`) og
   klassificeres som SNAPSHOT — de opdateres ikke.

## Mapping: `.vscode/.codex/Brain/` → disposition (pr. 2026-07-11)

| Runtime-fil | Klasse | Canonical-modpart | Disposition |
|---|---|---|---|
| `AGENTS.md` | stabil kontekst | `.agents/brain/README.md` | Superseded — skrivereglerne heri ("gem varig viden her") er ophævet af denne politik; frossen-banner tilføjet |
| `context.md` | stabil kontekst | `.agents/brain/context.md` | Superseded — påstanden "`.vscode/.codex/` er lokal kilde til sandhed" er ophævet af ADR-0003 |
| `operating-principles.md` | stabil kontekst | rod-`AGENTS.md` + `.agents/brain/context.md` | Dækket; runtime-sandhedspåstand superseded |
| `glossary.md` | stabil kontekst | `.agents/brain/glossary.md` (nyere/større) | Dækket |
| `open-questions.md` | stabil kontekst | `.agents/brain/open-questions.md` (nyere/større) | Dækket |
| `source-map.md` | stabil kontekst | **manglede** → **LANDET** som `.agents/brain/source-map.md` (Kombi/Iqra-proveniens var ikke dækket af repo-map.md) |
| `adr/0001-agent-harness-structure.md` | beslutning | `.agents/brain/decisions/ADR-0001-agent-harness.md` | Dækket (variant af samme beslutning); pkt. om `.vscode/.codex/` som kerne superseded af ADR-0003 |
| `session-history.md` | snapshot | **manglede** → **LANDET** som `.agents/brain/memory/session-history-runtime-2026-05-06-til-2026-06-17.md` (unikke detaljer: commits, dækningstabel 2026-05-06) |
| `memory/session-2026-06-10-audit.md` | snapshot | `.agents/brain/memory/session-2026-06-10.md` (fyldigere) | Dækket |
| `memory/session-2026-06-17-agent-system-shutdown.md` | snapshot | **manglede** → **LANDET** som `.agents/brain/memory/session-2026-06-17-agent-system-shutdown.md` |

Efter disse tre landinger indeholder runtime-Brain **ingen unik varig viden**. Ved PR F erstattes
`.vscode/.codex/Brain/`-indholdet af genereret/minimalt indhold (beslutning tages i PR F sammen med
resten af aktiveringen; rollback-plan påkrævet).

## Registry-felter

`.agents/registry.yaml` `brain_paths` + `extended_brain_paths` peger på canonical brain og er
autoritative for hvor agenter læser/skriver hukommelse. Runtime-adapternes `memory_behavior`-felt
beskriver pr. runtime hvordan canonical brain eksponeres (se `.agents/model-adapters/`).

## Orchestrator-referencer (lukker PR E-delen af open decision)

`docs/agents/sources/orchestrators/perplexity-computer.md` m.fl. er **kilde-referencer (Category 3)**
— de MINES for mønstre (skill-scoping, `preload_skills` til subagenter, memory-adskillelse
bruger/space/org, scheduling/gating) men bliver ALDRIG selv runtime-memory eller instruktioner.
Mønstrene er noteret her som input til fremtidig orchestrator-design; ingen af dem er implementeret,
og de forpligter ikke. Reconciliation-punktet "Perplexity/orchestrator governance (ejer: PR E)" er
hermed dispositioneret: memory-delen er dækket af denne politik; skill-loading/subagent/scheduling-
delene hører til et evt. senere orchestrator-spor (ikke på roadmappen A–F).

## Vedligehold

- Denne politik er kanonisk kilde for memory-spørgsmål; `.agents/brain/README.md` henviser hertil.
- Politikken revideres ved PR F (runtime-aktivering) når runtime-Brain-erstatningen besluttes.
