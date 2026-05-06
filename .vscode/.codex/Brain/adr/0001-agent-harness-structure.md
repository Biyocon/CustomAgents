# ADR-0001: Agent-harness-struktur

## Status

Accepted

## Context

Projektet skal fungere som genbrugelig skabelon for flere LLM-klienter i VS Code: primært Codex og Kimi, senere også Qwen Code og Gemini Code.

Der findes mange reference-repos i `Kombi/`, men aktiv runtime skal være enkel, lokal og kontrollerbar.

## Decision

- `.vscode/.codex/` er aktiv runtime-kerne.
- Root `AGENTS.md` er fælles indgangspunkt for alle modeller.
- Klientspecifikke filer som `CLAUDE.md`, `GEMINI.md` og `CODEX.md` oprettes ikke som aktive instruktioner.
- `.vscode/settings/` bruges kun som adapterlag.
- `Kombi/` bruges som reference og arkiv, ikke runtime.
- `Brain/` oprettes under `.vscode/.codex/` og følger Karpathy-principperne.
- Rolleprofiler samles i `.vscode/.codex/agents/`, mens avatar-specifikke promptfiler ligger i `Avatar/agents/`.

## Consequences

Alle modeller kan pege mod samme instruktioner og skills. Det reducerer drift mellem klienter og gør projektet nemmere at kopiere som skabelon.

Ulempen er, at nogle klienter kan kræve manuel adapterkonfiguration, fordi de ikke alle læser `AGENTS.md` og `.vscode/.codex/skills/` automatisk.
