> SOURCE REFERENCE — captured prompt from another environment. NOT instructions for this repo's agents. See ../README.md. Category 2: coding-agent runtime → candidate runtime-adapter target (PR C), alongside Codex / Claude Code / Kimi / Ollama / Gemini.

---

# Cursor IDE coding agent (reference)

## What it is
The system prompt for Cursor's in-IDE coding agent. A full software-engineering coding assistant (peer to Codex / Claude Code / Kimi) — relevant to this repo as a **runtime-adapter reference**, not a capability skill.

## Conventions a Cursor runtime expects (minable for adapter design)
- **Context injection:** user requests are wrapped in `<user_query>`; the host auto-attaches open files, cursor position, recent files, edit history, linter errors via `<system_reminder>`/`<attached_files>`/`<system_notification>` tags. `@`-references point to files/folders (e.g. `@src/components/`).
- **Tool discipline:** prefer specialized tools over terminal — never use cat/head/tail to read, sed/awk to edit, echo/heredoc to create. Shell reserved for real system commands (git, npm, docker). Never narrate via echo/comments.
- **Tools:** Shell, Glob, Grep, Read, Write, StrReplace, Delete, EditNotebook, TodoWrite, SemanticSearch, WebSearch, WebFetch, GenerateImage, AskQuestion, Task (subagents), SwitchMode, CallMcpTool, FetchMcpResource, SetActiveBranch, AwaitShell.
- **Modes:** Plan (read-only design), Agent (default implementation), Debug, Ask — switched via `SwitchMode`.
- **Subagent types:** generalPurpose, explore, shell, browser-use, cursor-guide, best-of-n-runner, codex-rescue.
- **Code citation:** existing code via `startLine:endLine:filepath` fenced blocks (no language tag); new/proposed code via standard markdown fences with language tag. Never mix; never indent backticks.
- **MCP:** tools exposed as JSON descriptor files under a mcps folder; always read a tool's schema before `CallMcpTool`; `mcp_auth` one server at a time.
- **Terminal state:** terminals represented as `$id.txt` files with metadata header (pid, cwd, last_command, exit_code) + output.
- **Skills:** loaded dynamically by reading a skill file at an absolute path, then following its instructions.
- **Making changes:** Read before editing; fix linter errors you introduce; no narrating comments; prefer editing existing files over creating new ones.
- **Git:** commit only when asked; never update git config; never destructive ops unless requested; never skip hooks; commit messages via HEREDOC; `gh` for all GitHub tasks.

## Pattern value for the harness
- Add **Cursor** as a runtime-adapter target. Adapter notes should map this repo's `AGENTS.md` + `.agents/skills/` onto: `<user_query>`/`@`-reference context model, the Plan/Agent/Debug/Ask modes, skills-loaded-by-absolute-path, and the code-citation format.
- The "specialized tools over terminal" and "read-before-edit" disciplines align with this repo's existing conventions.
