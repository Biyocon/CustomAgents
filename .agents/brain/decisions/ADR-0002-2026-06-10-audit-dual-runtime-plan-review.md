# ADR-0002: Resultater af dyb multi-agent audit 2026-06-10 + opdatering af harness-plan

**Dato:** 2026-06-10  
**Status:** Accepted  
**Besluttet af:** Grok (koordinator) + bruger via audit-proces

## Kontekst

Der blev udført en fuld systematisk gennemgang af hele kodebasen efter MULTI_AGENT_AUDIT_TEMPLATE.md (tilpasset version). Samtidig blev den eksisterende plan i `Task/harness-roadmap.md` gennemgået og krydstjekket mod aktuelle filer og tidligere rapporter.

Audit'en blev udført med koordinator + 4 parallelle workstreams (A: Arkitektur & Dual-Runtime, B: Skills & Frontmatter, C: Agenter & Domæne-sporbarhed, D: QA/Drift/Risici).

## Beslutninger

1. **Dual-runtime er bekræftet som den dominerende arkitektoniske og operationelle virkelighed**
   - `.vscode/.codex/` er den aktive autoritative runtime (per AGENTS.md, QA-rapporter og ADR-0001).
   - `.agents/` er den fremtidige model-agnostiske struktur, men har betydelig drift, ufuldendt population og non-compliant elementer.
   - Der skal træffes en eksplicit aktiveringsbeslutning (med ny valideringsrapport), før `.agents/` må behandles som aktiv.

2. **`Task/harness-roadmap.md` er ikke længere en pålidelig sandhedskilde**
   - Mange "✅ Done" (faser 1-14 fra maj 2026) modsiger egne samtidige rapporter og aktuel tilstand.
   - De åbne faser 6-9 er stadig reelle huller og skal knyttes direkte til konkrete handlinger fra denne audit.

3. **Kildeindlæsning fra `Funktions- og stillingsbeskrivelser/FB/` (213+ PDF'er) er den højeste prioritet for domæneværdi**
   - De 4 FORELØBIG-agenter (Phase 7) og 6 FORELØBIG domæne-skills (Phase 8) mangler stadig konkret indhold.
   - Dette er den primære blokering for at harnesset kan levere reel Banedanmark-værdi.

4. **Oprydning og governance er forudsætning for videre udvikling og promotion**
   - Dual-runtime drift, multiple registries, script-duplikater, temp/-bloat og u-spec lag (root/skills/) skal adresseres.
   - Skills frontmatter i `.agents/skills/`-træet skal bringes i overensstemmelse med spec (især `name:` felt).

5. **Den tilpassede audit-skabelon (`MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md`) er nu det officielle værktøj til fremtidige audits**
   - Den er udfyldt med projektets faktiske konfiguration, workstreams, checks og fokusområder.

## Konsekvenser

- Roadmap-planen skal opdateres snarest (falske "Done" fjernes, åbne faser linkes til audit-anbefalinger).
- Næste større arbejde bør fokusere på oprydning + kildeindlæsning snarere end ny funktionalitet.
- Global promotion og `.agents/` aktivering udskydes indtil dual-runtime er ryddet op og valideret.

## Referencer

- `MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md`
- `Task/harness-roadmap.md`
- Workstream-rapporter A/B/C/D (2026-06-10)
- `reports/qa/QA_2026-06-07_CustomAgents.md`
- `.agents/brain/memory/session-2026-06-10.md` (detaljeret session memory)

## Opfølgning

- Opdater `Task/harness-roadmap.md`
- Opdater `.agents/brain/assumptions.md` og `open-questions.md`
- Udfør "Nu"-handlinger fra audit-rapporten (frontmatter-fix, oprydning, unified validate)