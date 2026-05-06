# _tooling-summary (Fase 3b / Block 1)

**Sti:** `C:\_tooling` — dev/test tools og CC-relaterede repos.

---

## A. Indhold (top-level)

### Mapper
- `.browser-use-home`, `.browser-use-venv` — browser-use Python venv (med adgang til alt fra venv inkl. aiofiles, etc.)
- `.claude` — bruger-CC konfig (read-only for projekt)
- `.playwright-browsers` — Playwright browsers
- `.uv-cache`, `.xdg-cache`, `.xdg-config` — caches
- `ai-website-cloner`, `Attached-Assets`, `bolt.new-main` — diverse tools
- **`claw-code`, `clawhip`** — CC-varianter
- `cli-microsoft365` — MS365 CLI
- **`everything-claude-code`** — CC config-suite (samme som Kombi-kopien)
- `graphify-5` — knowledge-graph tool (ældre version end Kombi)
- **`oh-my-claudecode`** (read-only, dvs. installeret) — CC harness
- **`oh-my-codex`** — Codex-specifikt
- **`oh-my-openagent`** — multi-model harness
- `openclaw` — open-source CC
- `prompt-tower` — prompt-management
- `ui-ux-pro-max-skill-main` — UI/UX skill
- `vscode`, `vscode-drawio`, `vscode-extension-samples`, `vscodium` — VS Code-relaterede

### Filer
- `.browser-use-debug.log`, `.browser-use-info.log` — browser-use logs
- `browser-use-local.cmd`, `browser-use-local.ps1` — wrappers til browser-use lokalt
- Diverse zip-arkiver: `ai-website-cloner-template-master.zip`, `Attached-Assets.zip`, `bolt.new-main.zip`, `career-ops-main.zip`, `CyberStrikeAI-main.zip`, `dyad-main.zip`, `ui-ux-pro-max-skill-main.zip`, `vscodium.zip`
- `Useful General Agent.png` — referencebillede

## B. Direkte harness-relevant

| Item | Relevans |
|------|----------|
| `oh-my-codex/` | Codex-specifikt — **kig ved finjustering af `.vscode/settings/codex.toml`-adapter** |
| `oh-my-claudecode/` | reference — sammenlign med vores CC-konventioner |
| `oh-my-openagent/` | multi-model adapter-mønstre |
| `everything-claude-code/` | konfig-bibliotek |
| `prompt-tower/` | hvis vi senere vil bygge en prompt-management UI |
| `browser-use-local.ps1` | hvis projektet skal bruge browser-automation skills senere |
| `ui-ux-pro-max-skill-main/` | skill-eksempel |

## C. Ikke-relevant (skip)

- `.uv-cache`, `.xdg-cache`, `.playwright-browsers` — caches, ikke kilde
- `cli-microsoft365` — MS-værktøj, ikke harness
- `vscode/`, `vscode-extension-samples/`, `vscodium/` — VS Code-kerne (kun nyttigt hvis vi udvikler ekstension)
- `Wan2.2`-relaterede (i Open source) — video-generering
- Browser-use venv — virtual env, ikke kode-kilde

## D. Konklusion

- **Ingen automatisk import nødvendig.**
- `oh-my-codex` er den stærkeste reference for vores Codex-primær-strategi; bør studeres ved næste iteration af `.vscode/settings/`.
- `_tooling` er bevidst eksternt (dev-PC-værktøj, ikke projektkilder). **Røres ikke i denne harness-opbygning.**
