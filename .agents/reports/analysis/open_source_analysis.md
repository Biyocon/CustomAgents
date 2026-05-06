# Fase 3: Klassificering af Open Source-indhold til Agent-Harness

**Dato:** 2026-05-06
**Kilde:** C:\Users\Biyocon\Open source (~100+ repositories)
**Metode:** Topniveau-katalogisering + metadata-indlaesning
**Bemaerkning:** Ingen Banedanmark-specifikke mapper fundet i topniveau.

---

## 1. Hoejrelevans: Direkte genbrugspotentiale (⭐⭐⭐)

| # | Sti | Type | Klassificering | Begrundelse |
|---|-----|------|----------------|-------------|
| 1 | claude-skills-main/ | Repo | Direkte genbrug | 235 produktionsklare Claude Code skills. SKILL.md-struktur + scripts/ + references/ pattern. Konverteringsscript til andre formater. Kategorier: engineering, DevOps, marketing, compliance, C-level. Kan direkte kopieres til .vscode/.codex/skills/. |
| 2 | oh-my-claudecode-main/ | Repo | Direkte genbrug | Multi-agent orkestrering specifikt til Claude Code. /setup, autopilot: kommandoer, plugin/marketplace system. Zero-learning-curve. Kan integreres som orkestreringslag. |
| 3 | everything-claude-code-main/ | Repo | Direkte genbrug | Omfattende regelsaet (agent.yaml, RULES.md, SOUL.md, COMMANDS-QUICK-REF.md). Agent-konfiguration og orkestreringslogik. Kan tilpasses til .vscode/.codex/-strukturen. |
| 4 | oh-my-openagent-dev/ | Repo | Tilpasning | Multi-model orkestrering (Claude / Kimi / GLM / GPT / Minimax / Gemini). Model-agnostisk routing. npm-baseret CLI. Kan tilpasses til at pege paa .vscode/.codex/. |
| 5 | agency-agents-main/ | Repo | Direkte genbrug | Samling af AI-agentpersonligheder ("The Agency") med specialiserede domaener, personligheder og leverancer. Klar struktur til genbrug i harness som .vscode/.codex/agents/. |
| 6 | vscode-main/.agents/skills/launch/SKILL.md | Fil | Reference/tilpasning | Officiel VS Code repo skill. Viser .agents/skills/ struktur indenfor Microsoft/vscode. Benchmark for skill-placering. |
| 7 | promptfoo-main/AGENTS.md | Fil | Reference | Guide til AI-agenter der arbejder paa promptfoo-kodebasen. Viser AGENTS.md i undermapper-pattern. Godt eksempel paa domaenespecifik agent-guidance. |
| 8 | mempalace-main/ | Repo | Tilpasning | Knowledge graph/hukommelses-system med MCP server (mcp_server.py), hooks (mempal_precompact_hook.sh), entity detection, room-based memory. Kan tilpasses til projekt-hukommelse. |
| 9 | context-mode-main/ | Repo | Tilpasning | Kontekst-haandteringssystem med .claude/, hooks/, skills/, .mcp.json. CLI og MCP-server. Kan tilpasses til .vscode/.codex/-struktur. |
| 10 | freepik-mcp-main/src/application/server_factory.py | Fil | Reference | MCP server factory implementation. Domain-driven folder struktur. Godt eksempel paa MCP-arkitektur. |
| 11 | n8n-full/.claude/plugins/n8n/ | Mappe | Reference/tilpasning | Komplet Claude plugin med agents/, skills/, commands/, scripts/. 13 skills inkl. create-skill, setup-mcps, spec-driven-development. Marketplace-klar struktur. |
| 12 | n8n-full/.agents/design-system-style-rules.md | Fil | Reference | Design system style rules for AI-agenter i n8n. |

---

## 2. Mellemrelevans: Tilpasning noedvendig (⭐⭐)

| # | Sti | Type | Klassificering | Begrundelse |
|---|-----|------|----------------|-------------|
| 13 | MetaGPT-main/ | Repo | Tilpasning | Multi-agent framework med software company simulation. Roll-baserede agenter. Kraever tilpasning til jernbanedomane. |
| 14 | CrewAI-main/ | Repo | Tilpasning | Role-based multi-agent framework. Task delegation, process orchestration. Python-baseret. Kan tilpasses til BBTR-arbejdsgange. |
| 15 | langgraph-main/ | Repo | Tilpasning | Agent state graph framework fra LangChain. Cykler, branches, persistence, human-in-the-loop. Godt til komplekse agent-workflows. |
| 16 | browser-use-home/ | Repo | Tilpasning | Browser automation for AI-agenter. Selvstyrende web-interaktion. Kan integreres med Banedanmarks webbaserede systemer. |
| 17 | OpenManus-main/ | Repo | Tilpasning | General AI agent framework. Tool use, planning, execution. Kraever domaene-specifik prompt engineering. |
| 18 | bolt.new-main/ | Repo | Arkiver | AI web builder. For generisk til direkte genbrug, men prompt engineering patterns kan studeres. |
| 19 | speckle-server/.cursor/mcp.json | Fil | Reference | MCP-konfiguration i Cursor-kontekst. Viser integration pattern. |
| 20 | mempalace-main/examples/mcp_setup.md | Fil | Reference | MCP opsaetningsguide for mempalace. |
| 21 | mempalace-main/hooks/README.md | Fil | Reference | Hook-dokumentation for precompact/save. |
| 22 | mempalace-main/mempalace/mcp_server.py | Fil | Reference | MCP server implementation i Python. |

---

## 3. Lavrelevans: Arkiver eller referencemateriale (⭐)

| # | Sti | Type | Klassificering | Begrundelse |
|---|-----|------|----------------|-------------|
| 23 | 3x-ui-main/ | Repo | Arkiver | VPN panel. Ingen agent-relevans. |
| 24 | Aasa.main/ | Repo | Arkiver | Projektstyring. Generisk. |
| 25 | AgentForge-main/ | Repo | Arkiver | Agent framework, men mindre modent end MetaGPT/CrewAI. |
| 26 | ai-suggestion-box-main/ | Repo | Arkiver | AI feedback system. For snaevert. |
| 27 | baileys-main/ | Repo | Arkiver | WhatsApp API. Kun relevant hvis WhatsApp-integration onskes. |
| 28 | bolt-main/ | Repo | Arkiver | AI web builder (aeldre). |
| 29 | cobalt-main/ | Repo | Arkiver | Media downloader. Ingen agent-relevans. |
| 30 | cursor-free-vip-main/ | Repo | Arkiver | Cursor workaround. Etisk tvivlsom. |
| 31 | fast-proxy-main/ | Repo | Arkiver | Proxy server. Ingen agent-relevans. |
| 32 | genezio-monorepo/ | Repo | Arkiver | Serverless platform. Ingen direkte agent-relevans. |
| 33 | hyperframes-main/ | Repo | Arkiver | Video generation. Kunstnerisk, ikke produktionsagent-relevant. |
| 34 | LangChain-main/ | Repo | Arkiver | For stor og generisk. Langgraph er mere fokuseret. |
| 35 | Lovable-main/ | Repo | Arkiver | AI app builder. For generisk. |
| 36 | Lucy-main/ | Repo | Arkiver | Voice AI. Specifikt domaene. |
| 37 | melo-main/ | Repo | Arkiver | TTS (text-to-speech). Specifikt domaene. |
| 38 | n8n-full/ (rest) | Repo (rest) | Arkiver | Hovedrepo er workflow automation, ikke agent-harness. |
| 39 | next-forge-main/ | Repo | Arkiver | Next.js boilerplate. Ikke agent-specifikt. |
| 40 | node-deepseek-main/ | Repo | Arkiver | DeepSeek API wrapper. For smalt. |
| 41 | open-webui-main/ | Repo | Arkiver | Chat UI. Frontend-fokuseret, ikke agent-orkestrering. |
| 42 | orbstack-main/ | Repo | Arkiver | Docker desktop alternative. Ingen agent-relevans. |
| 43 | pi-main/ | Repo | Arkiver | Generisk AI chat. |
| 44 | promptfoo-main/ (rest) | Repo (rest) | Arkiver | Hovedrepo er LLM evaluation. AGENTS.md er interessant, resten er for specifikt. |
| 45 | rabbit-r1-main/ | Repo | Arkiver | Rabbit R1 reverse engineering. Niche. |
| 46 | replicate-go-main/ | Repo | Arkiver | Replicate API client. For smalt. |
| 47 | searxng-main/ | Repo | Arkiver | Metasearch engine. Kan vaere relevant for agent-research. |
| 48 | speckle-server/ (rest) | Repo (rest) | Arkiver | Engineering data platform. Kun .cursor/mcp.json er agent-relevant. |
| 49 | text-generation-webui-main/ | Repo | Arkiver | Local LLM UI. Ikke agent-orkestrering. |
| 50 | trae-main/ | Repo | Arkiver | AI IDE. For generisk. |

---

## 4. Samlet vurdering

### Direkte genbrug (kopier til harness)
- claude-skills-main/ -> Kopier udvalgte skills til .vscode/.codex/skills/
- oh-my-claudecode-main/ -> Orkestreringskommandoer og plugin-system
- everything-claude-code-main/ -> Regelsaet og agent-konfigurationer
- agency-agents-main/ -> Agent-personligheder til .vscode/.codex/agents/

### Tilpasning kraeves
- oh-my-openagent-dev/ -> Multi-model routing
- mempalace-main/ -> Hukommelsessystem
- context-mode-main/ -> Kontekst-haandtering
- MetaGPT-main/ -> Agent-arkitektur
- CrewAI-main/ -> Task delegation
- langgraph-main/ -> State management
- browser-use-home/ -> Browser automation
- OpenManus-main/ -> General agent

### Referencemateriale
- n8n-full/.claude/plugins/n8n/ -> Plugin-struktur benchmark
- vscode-main/.agents/skills/launch/ -> Skill-struktur benchmark
- promptfoo-main/AGENTS.md -> AGENTS.md-pattern reference
- freepik-mcp-main/ -> MCP server arkitektur reference
- speckle-server/.cursor/mcp.json -> MCP config reference

---

## 5. Anbefalinger

1. **Start med direkte genbrug:** Kopier skills og agents til .vscode/.codex/
2. **Orkestreringslag:** Adapter oh-my-claudecode kommandoer til at pege paa .vscode/.codex/
3. **Hukommelse:** Evaluer mempalace til projekthukommelse, eller brug context-mode som lettere alternativ
4. **MCP:** Brug freepik-mcp og n8n plugin som reference for MCP-server integration
5. **Agent-arbejdsgange:** Adapter MetaGPT/CrewAI roller til BBTR-specifikke roller
