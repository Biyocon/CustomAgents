# Projektplan & Ønskeliste: AgentSkills — Custom AI Agent Harness

> Idébank. Svarer på "hvad bygger vi og hvorfor?" — designbeslutninger, rationale,
> ønskeliste og changelog. Tematisk, ikke sekventiel. Den sekventielle plan lever i
> `KØREPLAN.md`. Peg på §-sektioner fra andre dokumenter (fx `primer.md`) i stedet
> for at forvente en fuld gennemlæsning.

**Sidst opdateret:** 2026-07-01

---

## §VISION. Hvad dette projekt er (og ikke er)

- **Er:** En model-agnostisk, genbrugelig AI-agent-harness (subagenter, skills,
  Brain-kontekst, registry) bygget med udgangspunkt i Banedanmark-kompetencer, men
  designet til at genbruges i alle fremtidige projekter uanset LLM (Codex, Kimi,
  Qwen Code, Gemini Code).
- **Er ikke:** Et produkt med eksterne slutbrugere, betalingsvilje eller
  personas i klassisk PRD-forstand. Det er intern infrastruktur til AI-assisteret
  projektstyring.
- **Kerneloop:** Vælg agent → indlæs profil + skills → arbejd med Brain-kontekst →
  opdatér Brain/registry → (fremtidigt) promovér færdigt harness til global skabelon.
- **Differentiator:** De tre-lags-adskillelse (Vendor / Kurateret / Domæne) og
  Karpathy-inspirerede adfærdsregler (surgical changes, verificerbare succeskriterier).

---

## §GAP. Status vs. erklæret vision [2026-07-01]

| Kapabilitet | Status nu | Erklæret vision | Beslutning |
|---|---|---|---|
| Én aktiv runtime | To modstridende kandidater (`.vscode/.codex/`, `.agents/`) | Én kanonisk runtime alle LLM'er peger på | Skal afgøres — se `docs/active/#1` |
| Model-agnostisk adapter-lag | 4 adaptere findes (codex, kimi, qwen, gemini) | Alle primære/sekundære modeller dækket | Behold — allerede opfyldt |
| Central registry | To divergerende `registry.yaml`-filer | Én central konfiguration | Reconciliér — se `docs/active/#2` |
| Fuld agent-filpakke | 1 af 37 mapper i `.agents/agents/` komplet | Alle subagenter har profile.md+skills.yaml+AGENTS.md+avatar.md | Komplettér batch-vis — se `docs/active/#6` |
| Domænedækning | ~65% samlet, 0% Bro/Anlæg, 10% Trafik/Drift | Fuld dækning af Banedanmark-fagroller | Prioritér i Fase E |
| Verificerbare metrikker | Skill-antal og validation-status modsiger sig selv på tværs af filer | "Verificerbare succeskriterier" (Karpathy-princip) | Ét script som eneste kilde — se `docs/active/#3`, `#4` |

---

## §DESIGN. Arkitekturbeslutninger (letvægts-ADR-log)

> Tunge beslutninger ligger fuldt ud i `docs/architecture/ADR-*.md` og
> `.agents/brain/decisions/ADR-*.md`. Denne log er kun resuméet + kobling.

### Tre-lags-adskillelse: Vendor / Kurateret / Domæne [oprindelig dato ukendt, dokumenteret i README]
- **Kontekst:** Behov for at undgå at blande rå open source, tilpassede skills og
  Banedanmark-specifik viden sammen.
- **Valg:** `.agents/vendor/` (read-only), `.agents/skills/` (kurateret),
  `.agents/agents/` + `.agents/brain/` (domæne).
- **Konsekvenser:** Klar ansvarsfordeling, men kræver disciplin ved skill-oprettelse
  (kopiér, redigér aldrig vendor direkte).

### Multi-runtime-arkitektur [2026-06-17, Status: Proposed — IKKE besluttet]
- **Kontekst:** `.agents/` blev bygget som fremtidigt model-agnostisk lag sideløbende
  med den aktive `.vscode/.codex/`-runtime.
- **Valg (foreslået, ikke vedtaget):** `.agents/` skal blive canonical.
- **Konsekvens af IKKE at beslutte:** Se `FORBEDRINGSNOTAT.md` §1 — dette er
  projektets P0-risiko lige nu. Se `docs/plans/runtime-konsolidering-plan.md` for
  det fulde løsningsdesign.

---

## §INTEGRATION. Integrationsdybde for eksterne kilder

> Regel: kopiér aldrig tredjeparts-kildekode direkte ind i det kuraterede lag —
> behold den i `.agents/vendor/` (read-only) og tilpas en tynd kopi i
> `.agents/skills/`.

| Komponent | Måldybde | Status | Noter |
|---|---|---|---|
| `mattpocock-skills` (engineering-workflows: TDD, PRD, issue-slicing, debugging) | L3 — tilpasset kopi i kurateret lag | ⚠️ Vendor tracked, men gitlink-fejl uden `.gitmodules` (QA-finding) | Ret vendor-link før videre kuratering |
| `andrej-karpathy-skills` (adfærdsregler) | L4 — fuldt integreret i `AGENTS.md` og som skill | ✅ | Allerede operationelt princip i README |
| IQRA-avatar-familie (26+ personaer) | L2 — status + visuel profil | ⚠️ | Systemprompt-optælling skal rettes (26 findes, ikke "23 mangler") |

---

## 🌟 Ønskeliste (features & visioner)

- [ ] Ét autoritativt valideringsscript der eneste kilde til skill-/agent-tal (fjerner §GAP-rækken om metrikker)
- [ ] Global promovering: flyt færdigt harness til `C:\Users\Biyocon` som skabelon til fremtidige projekter (nævnt i README's "Kendte mangler")
- [ ] Kombi-map scan/import — `Kombi/` findes ikke i nuværende repo, skal enten importeres eller fjernes fra planer

---

## ✅ To-Do (nuværende overordnede intentioner)

- [ ] Løs runtime-modsigelsen formelt (ADR-0002 → Accepted/Rejected)
- [ ] Reconciliér de to `registry.yaml`-filer
- [ ] Komplettér de 4 FORELØBIG Banedanmark-subagenter
- [ ] Udfyld de 6 domæne-skills

---

## 🚀 Changelog (afsluttet arbejde, nyeste først)

### 2026-07-01 — Nyt PM-dokumentationssystem introduceret
- Kombination af `docs/kilde/docs` (task-livscyklus, dependency-mapping, audit/QA-gates)
  og `docs/kilde/project-docs` (primer, systemkort, forbedringsnotat) skabeloner,
  tilpasset dette repos faktiske indhold og huller.
- Se `KØREPLAN.md`, `systemkort.md`, `FORBEDRINGSNOTAT.md`, `DEPS.md`, `LESSON.md`,
  `CHANGELOG.md`, `primer.md`, samt `docs/active/`, `docs/drafts/`, `docs/audit/`,
  `docs/qa/`, `docs/plans/`.

### 2026-06-17 — `.agents/` erklæret "canonical source target" (Proposed, ikke Accepted)
- Se `docs/architecture/ADR-multi-runtime-agent-system.md`.

### 2026-06-12 — Runtime-status konsolideret (README-version)
- `docs/agents/runtime-status-2026-06-12.md` udpeger `.vscode/.codex/` som aktiv.

---

## 🗂️ Mappestatus (rodniveau, udvalgt)

| Sti | Formål | Status |
|---|---|---|
| `.vscode/.codex/` | Påstået aktiv runtime | active (omstridt) |
| `.agents/` | Påstået fremtidig canonical runtime | active (omstridt) |
| `Avatar/` | 26+ visuelle agentpersonaer + systemprompts | active |
| `docs/` | Dokumentation, ADR'er, ny PM-struktur | active |
| `reports/` | Historiske audits/QA/validering | active (historisk arkiv, ikke aktiveringsbeslutninger) |
| `scripts/` | PowerShell-automatisering (rod) | active |
| `Task/` | Ældre opgavesporing/roadmap | active — erstattes gradvist af `docs/active/` |
| `.qodo/`, `.scratch/`, `temp/` | Midlertidigt arbejde | planned for oprydning |
