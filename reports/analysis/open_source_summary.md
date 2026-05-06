# Open source-summary (Fase 3a / Block 1)

**Sti:** `C:\Users\Biyocon\Open source` — ~150+ repos (eksternt til projektet, kun inspirationskilde).

**Scope:** Lavt-niveau-skanning for harness-relevante repos. Bruges ikke som runtime, ikke kopieres ind i projekt.

---

## A. Direkte agent-harness-relevant (priorité 1)

| Repo | Formål | Relevans |
|------|--------|----------|
| `andrej-karpathy-skills` | Karpathy-principper | ✅ allerede integreret som `karpathy-guidelines` skill |
| `claude-code-main` | Claude Code source (officielt) | reference |
| `claude-skills-main` | Anthropic upstream skills | reference (allerede klonet i `.vscode/archive/upstream-skills/skills/` med .git) |
| `oh-my-claudecode-main` | CC config-suite | reference (også i Kombi som zip) |
| `oh-my-codex` | Codex-specifikke configs | **DIREKTE relevant for vores Codex-primær-strategi** |
| `oh-my-openagent` | Multi-model harness | reference |
| `agency-agents-main` | Multi-agent personae | reference (også i Kombi) |
| `agents-cli-main` | Agent CLI-tool | reference |
| `claude-mem` | Memory-CLI for CC | reference (også i Kombi) |
| `claw-code` | CC fork/variant | reference |
| `clawhip` | CC enhancement | reference |
| `openclaw-main` | Open-source CC clone | reference |
| `mempalace-main` | Hukommelses-system | reference (kunne inspirere Brain/) |
| `paperclip-master` | Tool for prompt management | reference |
| `impeccable-main` | Karpathy-relateret? | reference |
| `finalrun-agent-main` | Agent-runtime | reference |
| `agentscope` | Agent-framework | reference |

## B. Sub-relevant (priorité 2)

| Repo | Formål | Relevans |
|------|--------|----------|
| `cline-main`, `continue-main` | VS Code AI-extensions | reference for adapter-design |
| `cherry-studio-main`, `dyad-main`, `boneyard-main` | LLM-clients | reference |
| `claude-code-main`, `cursor4designers` | Claude/Cursor-tools | reference |
| `goose-main`, `OpenHands-main`, `OpenManus-main`, `MetaGPT-main`, `aider-main` | Generelle AI-coding-agenter | reference (mønsterbibliotek) |
| `spec-driven`, `bolt.diy-main`, `clicky-main` | Workflow/spec-tools | reference |
| `gpt-pilot-main`, `pyspur-AgentBuilder`, `TaskMatrix-main` | Multi-agent-orchestration | reference |

## C. Domæne-fjernt men interessant (priorité 3)

| Kategori | Repos |
|---------|-------|
| **3D/CAD** | `engine_components`, `engine_web-ifc`, `FreeCAD-main`, `IfcOpenShell`, `LibreCAD-master`, `openscad-master`, `Open3D` |
| **Browser/scraping** | `BrowserOS-dev`, `Scrapling-main`, `playwright-cli-main`, `screenshot-to-code-main` |
| **Data/RAG** | `LightRAG-main`, `openrag-main`, `sentrysearch-master`, `pgvector-master`, `quran-database-main` |
| **Voice/Video** | `chatterbox-master`, `LuxTTS-master`, `tiny-tts-develop`, `VibeVoice-main`, `VoxCPM`, `HunyuanVideo-main`, `Wan2.2`, `unreal-text2face` |
| **UI** | `vue-element-admin`, `Seelen-UI`, `Cursor4Designers`, `excalidraw-master`, `ToolJet`, `budibase-master`, `pocketbase-master` |
| **Other tooling** | `iptv-master`, `Ix-main`, `Kronos`, `lx-music-desktop`, `MoneyPrinterV2`, `SpotiFlyer`, `spotube`, `tdesktop-dev` |

## D. Specielle/HMDA-personlige

`HMDA/` — formentlig brugerens egen mappe, må ikke røres.
`Ventures/` — read-only.
`Brand Biyocon/` — personlig branding.

## E. Konklusion

- **Ingen automatisk import nødvendig** — alt relevant er enten allerede installeret (karpathy-guidelines) eller arkiveret som reference (Kombi/, .vscode/archive/upstream-skills/).
- `oh-my-codex` og `oh-my-claudecode-main` er stærkest for **multi-model adapter-design** — værd at studere ved senere finjustering af `.vscode/settings/` adapterlag.
- **Specifikt action:** ingen. Open source bevares som passiv inspirationskilde.
