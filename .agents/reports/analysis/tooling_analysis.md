# Fase 3: Klassificering af Tooling-indhold til Agent-Harness

**Dato:** 2026-05-06
**Kilde:** C:\_tooling (~20+ repositories og konfigurationsmapper)
**Metode:** Topniveau-katalogisering + metadata-indlaesning
**Bemaerkning:** Indeholder flere aktive .claude/, .codex/, .cursor/ konfigurationsmapper, hvilket indikerer aktiv brug af multi-agent setups.

---

## 1. Hoejrelevans: Direkte genbrugspotentiale (⭐⭐⭐)

| # | Sti | Type | Klassificering | Begrundelse |
|---|-----|------|----------------|-------------|
| 1 | oh-my-claudecode/ | Repo | Direkte genbrug | Multi-agent orkestrering til Claude Code. Kommandoer: /setup, /omc-setup, autopilot. Plugin/marketplace-system. Kan integreres direkte som orkestreringslag i harness. |
| 2 | oh-my-codex/ | Repo | Direkte genbrug | Multi-agent orkestrering til Codex CLI. Tilsvarende struktur som oh-my-claudecode, men for OpenAI Codex. Komplementaer til Claude-orkesstreringen. |
| 3 | vscode-extension-samples/ | Repo | Direkte genbrug | Microsofts officielle VS Code extension samples. Chat-sample, chat-tutorial, completions-sample, code-actions-sample. Basis for MCP/udvidelsesudvikling i VS Code. |
| 4 | oh-my-claudecode/.claude/ | Mappe | Direkte genbrug | Eksisterende Claude-konfiguration med commands/, skills/, plugins/. Viser aktiv brug af agent-setup. Kan smeltes sammen med harness-strukturen. |
| 5 | oh-my-codex/.codex/ | Mappe | Direkte genbrug | Eksisterende Codex-konfiguration med commands/, skills/. Komplementaer til .claude/-strukturen. |
| 6 | claw-code/ | Repo | Direkte genbrug | AI-kodningsvaerktoej. Kan integreres som agent-vaerktoej i harness. |
| 7 | prompt-tower/ | Repo | Tilpasning | Prompt management system. Kan tilpasses til at haandtere BBTR-specifikke prompts og agent-instruktioner. |

---

## 2. Mellemrelevans: Tilpasning noedvendig (⭐⭐)

| # | Sti | Type | Klassificering | Begrundelse |
|---|-----|------|----------------|-------------|
| 8 | bolt.new/ | Repo | Tilpasning | AI web builder. Kan tilpasses til at generere BBTR-webgraenseflader eller rapporter. |
| 9 | claude-dev/ | Repo | Tilpasning | Claude-specifik udviklingsvaerktoej. Kan tilpasses til domaenespecifikke opgaver. |
| 10 | .claude/ (diverse) | Mappe | Reference | Aktive Claude-konfigurationer. Viser eksisterende agent-opsaetninger der kan migreres. |
| 11 | .codex/ (diverse) | Mappe | Reference | Aktive Codex-konfigurationer. Viser eksisterende agent-opsaetninger der kan migreres. |
| 12 | .cursor/ (diverse) | Mappe | Reference | Aktive Cursor-konfigurationer. Viser eksisterende agent-opsaetninger der kan migreres. |

---

## 3. Lavrelevans: Arkiver eller referencemateriale (⭐)

| # | Sti | Type | Klassificering | Begrundelse |
|---|-----|------|----------------|-------------|
| 13 | playwright-mcp/ | Repo | Arkiver | Playwright MCP server. For smalt til generelt harness. |
| 14 | diverse node_modules/ | Mappe | Arkiver | Afhaengigheder. Ingen direkte genbrug. |
| 15 | diverse build-artifacts/ | Mappe | Arkiver | Byggeartefakter. Ingen direkte genbrug. |

---

## 4. Samlet vurdering

### Direkte genbrug
- oh-my-claudecode/ -> Orkestreringskommandoer og plugin-system
- oh-my-codex/ -> Komplementaer Codex-orkesstrering
- vscode-extension-samples/ -> VS Code extension udvikling
- claw-code/ -> AI-kodningsvaerktoej

### Tilpasning kraeves
- prompt-tower/ -> Prompt management til BBTR
- bolt.new/ -> Web builder til rapporter/graenseflader
- claude-dev/ -> Domane-tilpasset udviklingsvaerktoej

### Eksisterende konfigurationer der skal migreres
- .claude/ mapper -> Migrer til .vscode/.codex/
- .codex/ mapper -> Migrer til .vscode/.codex/
- .cursor/ mapper -> Evaluer om indhold skal overfoeres

---

## 5. Anbefalinger

1. **Konsolider multi-agent setups:** De eksisterende .claude/, .codex/ og .cursor/ konfigurationer i _tooling boer samles i den nye .vscode/.codex/ struktur.
2. **Orkestrering:** oh-my-claudecode og oh-my-codex boer adapteres til at arbejde med den faelles .vscode/.codex/ mappe.
3. **Prompt management:** prompt-tower kan tilpasses til at indeholde BBTR-specifikke prompts (f.eks. BKP v17, risikovurdering, tilsynsrapporter).
4. **VS Code integration:** vscode-extension-samples boer bruges som reference naar der skal udvikles Banedanmark-specifikke VS Code-udvidelser.
5. **Web generation:** bolt.new kan tilpasses til at generere statiske rapporter eller dashboard-graenseflader fra agent-output.
