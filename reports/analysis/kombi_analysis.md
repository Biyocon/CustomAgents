# Kombi-analyse (Fase 1 / Block 1)

**Status:** `Kombi/` er reference- og inspirationskatalog per ADR-0001 og `Brain/source-map.md`. **Ikke aktiv runtime.** Aktiv runtime er `.vscode/.codex/`.

**Indhold:** 14 unzipped repos + 17 zip-arkiver + 1 Banedanmark-tilbudsliste (`Kopi af 03.00 Tilbudsliste_NFSP0598_Høje Taastrup  Roskilde St. Fri strækning_v5 (3).xlsx`).

---

## A. Klassifikation pr. mappe

| Mappe | Type | Formål | Kvalitet | Action |
|-------|------|--------|----------|--------|
| **agency-agents-main** | Multi-agent skills (msitarzewski) | 19 specialiseret agent-personae med personlighed/processer/leverancer | direkte inspiration | **Reference** — agentprofile-mønstre kan informere `role-template.md` |
| **agentic-stack-master** | (dobbelt-nestet zip) | Agent-stack-template | ukendt — kræver dybdegang hvis nødvendigt | **Lavprioritet** |
| **andrej-karpathy-skills-main** | Karpathy CLAUDE.md-principper | Adfærdsregler mod LLM-kode-faldgruber | **allerede installeret** som `karpathy-guidelines` skill i `.vscode/.codex/skills/` | **Reference** — kilden er bevaret |
| **caveman-main** | "Few-token mode" prompt-stil | Terse caveman-svar-skill | brugbar — eksisterer som skill | `caveman` skill findes allerede i `.vscode/.codex/skills/` |
| **claude-code-main** | (dobbelt-nestet zip) | Claude Code samples | ukendt | **Lavprioritet** |
| **claude-mem-main** | Memory-compression CLI til Claude Code | Persistent memory across sessions, v12.6 | brugbar separat-tool | **Reference** — kunne installeres som CLI hvis behovet opstår |
| **deer-flow-main** | (dobbelt-nestet zip) | Deer-flow workflow | ukendt | **Lavprioritet** |
| **everything-claude-code-main** | "Battle-tested CC configs" — agents/skills/hooks/rules | komplet Claude Code config-suite v2.0-rc.1 | rig kilde | **Reference** — selektiv kopi af hooks/rules kunne vurderes |
| **get-shit-done-main** | Meta-prompting + context engineering for CC/OpenCode/Gemini/Codex (TÂCHES) | spec-driven development workflow, multi-model | **direkte relevant** for vores model-agnostiske mål | **Reference** — værd at studere CLI-design |
| **graphify-6** | Knowledge-graph fra kode/docs/papers | python-package, multi-agent | brugbar separat tool | **Reference** — kunne udvide harness senere |
| **oh-my-openagent-dev** | "Best AI Agent Harness" multi-model OpenCode plugin v3.17 | parallel background agents, LSP/AST-tools | **direkte relevant** for harness-design | **Reference** — studér multi-model orchestration-mønstre |
| **planning-with-files-master** | "Work like Manus" — file-based planning | $2B-acquired-AI-pattern | direkte inspiration | **Reference** — Brain/-konceptet udvider denne tankegang |
| **skills-main** | **mattpocock/skills** (= upstream) | source-of-truth for de 22 mattpocock skills | **allerede installeret** i `.vscode/.codex/skills/` via `setup-matt-pocock-skills` skill | **Reference** — keep as upstream-kilde |
| **system_prompts_leaks-main** | (dobbelt-nestet zip) Lækkede system prompts | researchmateriale | må **IKKE** bruges som autoritativ runtime per source-map.md | **Reference only — read-only research** |

## B. Zip-arkiver i Kombi-roden (ikke unzipped)

`agency-agents-main.zip`, `agentic-stack-master.zip`, `andrej-karpathy-skills-main.zip`, `awesome-design-md-main.zip`, `caveman-main.zip`, `claude-code-main.zip`, `claude-mem-main.zip`, `claw-code-main.zip`, `deer-flow-main.zip`, `everything-claude-code-main.zip`, `get-shit-done-main.zip`, `graphify-6.zip`, `linkedin-rs-main.zip`, `oh-my-claudecode-main.zip`, `oh-my-codex-main.zip`, `oh-my-openagent-dev.zip`, `planning-with-files-master.zip`, `skills-main.zip`, `system_prompts_leaks-main.zip`.

**Action:** behold zip'erne som immutable backup. Ikke unzippe medmindre konkret behov opstår. `oh-my-claudecode-main.zip` (10 MB) og `oh-my-codex-main.zip` (3 MB) er endnu ikke unzipped — kunne være relevante for Codex/Kimi-adapter-tuning hvis behov opstår.

## C. Domæne-artefakt

`Kopi af 03.00 Tilbudsliste_NFSP0598_Høje Taastrup  Roskilde St. Fri strækning_v5 (3).xlsx` (174 KB). Banedanmark-tilbudsliste til konkret udbud (NFSP0598 = Høje Taastrup–Roskilde St. fri strækning). **Ikke en del af harness** — er reelt projekt-arbejdsfil. Bør formentlig flyttes ud af Kombi/ til en fagmappe (fx `temp/` eller projekt-arbejdsmappe). **Beslutning udskudt** — ikke kritisk nu.

## D. Kvalitetsvurdering pr. spec'ens skema

| Kategori | Mappe(r) |
|----------|---------|
| **Direkte genbrug** | (ingen — Kombi er ikke runtime) |
| **Kræver omskrivning** | (ikke aktuelt — vi ekstraherer ikke aktivt fra Kombi nu) |
| **Dublet** | `skills-main` (= mattpocock, allerede installeret), `andrej-karpathy-skills-main` (allerede integreret som karpathy-guidelines), `caveman-main` (allerede skill) |
| **Arkivér** | `system_prompts_leaks-main` (research-only) |
| **Manuel afklaring** | `agentic-stack-master`, `claude-code-main`, `deer-flow-main` (dobbelt-nestede; ingen synlig README i ydre lag) |
| **Inspiration / reference** | resten — bevares i Kombi/ urørt |

## E. Konklusion + anbefalinger

1. **Ingen aktion nødvendig på Kombi-indhold.** Status quo: Kombi forbliver passiv reference per ADR-0001.
2. **Tilbudsliste-Excel** bør flyttes ud af Kombi (det er en domæne-artefakt, ikke en kilde-repo). Forslag: flyt til `docs/banedanmark-artefakter/` eller `temp/`.
3. **Iqra-main** kommer hertil i Block 6 (flyttes fra Avatar/ til Kombi/).
4. **Zip-arkiverne** behold urørte som immutable backup.
5. **Tre ikke-unzippede zip'er** (`oh-my-claudecode-main.zip`, `oh-my-codex-main.zip`, `awesome-design-md-main.zip`, `claw-code-main.zip`, `linkedin-rs-main.zip`) — vurdér unzip kun ved konkret behov. **Lavprioritet**.
