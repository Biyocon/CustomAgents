# Projektplan & Ønskeliste: AgentSkills — Custom AI Agent Harness

> Idébank. Svarer på "hvad bygger vi og hvorfor?" — designbeslutninger, rationale,
> ønskeliste og changelog. Tematisk, ikke sekventiel. (Den tidligere sekventielle plan
> `KØREPLAN.md` er ARKIVERET 2026-07-11 til `docs/plans/arkiv/` — overhalet af den
> fuldførte ADR-roadmap A–F; aktuel tilstand står i `primer.md` + `systemkort.md`.)

**Sidst opdateret:** 2026-07-11 (post-PR F + oprydning)

---

## §VISION. Hvad dette projekt er (og ikke er)

- **Er:** En model-agnostisk, genbrugelig AI-agent-harness (subagenter, skills,
  Brain-kontekst, registry) bygget med udgangspunkt i Banedanmark-kompetencer, men
  designet til at genbruges i alle fremtidige projekter uanset LLM (Codex, Kimi,
  Qwen Code, Gemini Code, Claude).
- **Er ikke:** Et produkt med eksterne slutbrugere, betalingsvilje eller
  personas i klassisk PRD-forstand. Det er intern infrastruktur til AI-assisteret
  projektstyring.
- **Kerneloop:** Vælg agent → indlæs profil + skills → arbejd med Brain-kontekst →
  opdatér Brain/registry (canonical) → generér runtime (`--apply`/`--check`) →
  (fremtidigt) promovér færdigt harness til global skabelon.
- **Differentiator:** De tre-lags-adskillelse (Vendor / Kurateret / Domæne),
  canonical→genereret runtime-arkitekturen, og Karpathy-inspirerede adfærdsregler
  (surgical changes, verificerbare succeskriterier).

---

## §GAP. Status vs. erklæret vision [opdateret 2026-07-11]

| Kapabilitet | Status nu | Erklæret vision | Beslutning |
|---|---|---|---|
| Én aktiv runtime | ✅ `.agents/` canonical; `.vscode/.codex/agents/` GENERERET (PR F 2026-07-11, gate GODKENDT) | Én kanonisk runtime alle LLM'er peger på | LUKKET (ticket #1 → done) |
| Model-agnostisk adapter-lag | 7 skema-konforme adaptere; 1 aktiv (codex) | Alle primære/sekundære modeller dækket af AKTIVE adaptere | Næste: claude-code som adapter #2 |
| Central registry | ✅ 1 canonical + 1 genereret (var 4) | Én central konfiguration | LUKKET (PR D/F + oprydning) |
| Fuld agent-filpakke | ✅ 47 agenter skema-valideret (0 overtrædelser) | Alle subagenter komplette | LUKKET (target-kontrakt: profile.md er kernen) |
| Domænedækning | Bro/Anlæg + Trafik/Drift lukket strukturelt (bd-bro-og-anlaeg, bd-trafikleder); indholdsmodning udestår (K-tabel-verifikation, planned_skills) | Fuld dækning af Banedanmark-fagroller | Igangværende — se "Næste steps" i primer |
| Verificerbare metrikker | ✅ Harness-validatorens METRIKKER-sektion = kanonisk kilde for tal | "Verificerbare succeskriterier" | LUKKET (#3) |

---

## §DESIGN. Arkitekturbeslutninger (letvægts-ADR-log)

> Tunge beslutninger ligger fuldt ud i `docs/architecture/ADR-*.md` og
> `.agents/brain/decisions/ADR-*.md`. Denne log er kun resuméet + kobling.

### Tre-lags-adskillelse: Vendor / Kurateret / Domæne [dokumenteret i README]
- **Valg:** `.agents/vendor/` (read-only), `.agents/skills/` (kurateret),
  `.agents/agents/` + `.agents/brain/` (domæne).
- **Konsekvenser:** Klar ansvarsfordeling; kopiér, redigér aldrig vendor direkte.

### Multi-runtime-arkitektur [Accepted 2026-07-09; FULDFØRT 2026-07-11]
- **Valg:** `.agents/` er canonical source of truth; runtime-lag genereres
  (`generate-runtime.py --apply`, sync-vagt `--check`). Roadmap PR A–F leveret.
- **Konsekvenser:** Dobbeltvedligehold afviklet; genererede filer håndredigeres aldrig;
  gate: `docs/qa/RELEASE-runtime-activation-gate.md` (GODKENDT).

### Role-vs-persona agent-model [Afgjort 2026-07-11]
- **Valg:** BEGGE modeller er canonical — 28 personaer + 19 rolleagenter
  (`.agents/agents/banedanmark/`, `agent_model: role`, roster-undtagne).

### Memory-governance [Afgjort 2026-07-11, PR E]
- **Valg:** CANONICAL (`.agents/brain/`) / RUNTIME-LOKAL (genereret pointer) /
  SNAPSHOT (append-only). Se `docs/architecture/memory-governance.md`.

---

## §INTEGRATION. Integrationsdybde for eksterne kilder

> Regel: kopiér aldrig tredjeparts-kildekode direkte ind i det kuraterede lag —
> behold den i `.agents/vendor/` (read-only) og tilpas en tynd kopi i `.agents/skills/`.

| Komponent | Måldybde | Status | Noter |
|---|---|---|---|
| `mattpocock-skills` | L3 — tilpasset kopi i kurateret lag | ✅ tracked vendored copy | Vendor-strategi (track vs gitignore) fortsat åben — separat vendor-PR |
| `andrej-karpathy-skills` | L4 — fuldt integreret i `AGENTS.md` og som skill | ✅ | Operationelt princip |
| IQRA-avatar-familie (27 personaer) | L2 — status + visuel profil | ✅ 27↔27↔27 verificeret 1:1 (2026-07-10) | |

---

## 🌟 Ønskeliste (features & visioner)

- [x] Ét autoritativt valideringsscript som eneste kilde til skill-/agent-tal
      (løst: harness-validatorens METRIKKER-sektion + validate-schemas.py)
- [x] Global promovering (Fase G) — **UDFØRT 2026-07-12** til
      `C:\Users\Biyocon\.agents\templates\customagents-harness\` (kun generiske komponenter;
      kollisionsfri undermappe i skills-hub'ens templates/-rum). Se ADR-0004.
- [ ] Kombi-map scan/import — `Kombi/` findes ikke i nuværende repo; skal enten importeres
      eller referencer fjernes fra planer (ejer-beslutning)
- [ ] Aktivér øvrige runtime-adaptere (kimi, gemini, ollama, cursor, qwen-code)
- [ ] Adfærds-test-suite med gyldne testcases (open-questions #5–#6)

---

## ✅ To-Do (nuværende overordnede intentioner)

- [x] ~~Løs runtime-modsigelsen formelt~~ (ADR Accepted 2026-07-09; aktiveret 2026-07-11)
- [x] ~~Reconciliér registry-filerne~~ (4→2: canonical + genereret)
- [x] ~~Komplettér de 4 FORELØBIG Banedanmark-subagenter~~ (ticket #5, 2026-07-10)
- [x] ~~Udfyld de 6 domæne-skills~~ (ticket #7, 2026-07-10)
- [ ] Domænemodning: K-tabel-verifikation mod FB-PDF'er + planned_skills efter behov
- [ ] Fase G: global promovering (scope-beslutning + eksekvering jf. runbook)

---

## 🚀 Changelog (afsluttet arbejde, nyeste først)

### 2026-07-11 — ADR-roadmap A–F FULDFØRT + post-oprydning
- PR D (generator + --check), PR E (memory-governance), PR F (AKTIVERING, gate GODKENDT,
  ticket #1 lukket). Role-vs-persona afgjort (begge canonical, 19 rolleagenter migreret).
- Oprydning: runtime-Brain → genereret pointer; rod-registry + scaffold + Export-Registry.ps1
  slettet; KØREPLAN + FORBEDRINGSNOTAT arkiveret til `docs/plans/arkiv/`.
- Fence-regex-buggen fixet (advarsels-baseline 27 falske → 12 ægte).
- Detaljer: `CHANGELOG.md` (aktive entries) + ADR-multi-runtime (Roadmap).

### 2026-07-09/10 — Beslutning + backlog-lukning
- ADR Accepted; 48-agent dybdeaudit; skills flyttet til `.agents/skills/` (79);
  tickets #2–#13 lukket.

### 2026-07-01 — Nyt PM-dokumentationssystem introduceret
- primer/systemkort/DEPS/CHANGELOG/LESSON + docs/active-ticketmodel.

---

## 🗂️ Mappestatus (rodniveau, udvalgt — opdateret 2026-07-11)

| Sti | Formål | Status |
|---|---|---|
| `.agents/` | CANONICAL source of truth | active |
| `.vscode/.codex/` | Genereret aktiv runtime | active (genereret — håndredigeres aldrig) |
| `Avatar/` | 27 visuelle agentpersonaer + systemprompts | active |
| `docs/` | Dokumentation, ADR'er, PM-struktur, arkiv | active (`docs/active/` tom — alle tickets lukket) |
| `reports/` | Historiske audits/QA | historisk arkiv |
| `scripts/` | PowerShell-automatisering (rod) | active |
| `Task/` | Ældre opgavesporing | legacy — erstattet af docs/-ticketmodellen |
| `temp/` | Parkeret materiale (logopakke = eneste kopi, bevidst) | parkeret |
