# Validate-harness scripts — side-by-side map

Der findes tre uafhængige "valider harness"-scripts i repoet. De tjekker
**materielt forskellige, ikke-overlappende strukturer** — ingen af dem tjekker
det de to andre tjekker. At køre kun ét giver en falsk-ren rapport for resten
af harnesset. Dette dokument findes så en fremtidig læser ikke skal genopdage
det ved at læse alle tre scripts igen.

Dette er kun dokumentation — ingen af scriptene er slettet, omdøbt eller
sammenlagt. Konsolidering (hvis ønsket) er en menneskelig beslutning, jf.
`docs/drafts/#12-normalisér-linjeskift-crlf-stoej.md` og relaterede issues i
`docs/active/`.

## Oversigt

| Script | Linjer | Hvad den tjekker | Hvad den IKKE tjekker |
|---|---|---|---|
| `scripts/validate-harness.ps1` | 94 | `.vscode/.codex/agents/agent-roster.json` mod `Avatar/agents/System_Prompt_Agent_<id>.md`: fil findes, ```` ```text ```` fence, mojibake-encoding (Ã¦/Ã); orphan-filer; `.vscode/.codex/agents/banedanmark/*.md` har YAML-frontmatter; `Root/registry.yaml` eksistens; `.vscode/.codex/Brain/{glossary,open-questions,source-map}.md` eksistens | Detaljeret felt-konsistens (status/skills/avatar/id) mellem roster og .md; hele `.agents/`-strukturen (registry.yaml, agents/, skills/) |
| `scripts/Validate-AgentHarness.ps1` | 197 | Samme roster/`Avatar/agents` par, men dybere: `status: active`-felt, skills-liste diff (roster vs. .md frontmatter, begge veje), avatar-filnavn match, id-felt match (ERROR ved mismatch), orphans, banedanmark `bd-*.md` frontmatter; valgfri JSON-rapport (`-JsonReport`). Del af v2-toolset sammen med `Export-Registry.ps1`, `New-AgentProfile.ps1`, `Sync-Skills.ps1`, `Activate-Agent.ps1` | ```` ```text ```` fence/encoding-tjek; `Root/registry.yaml`; `.vscode/.codex/Brain/*.md`; hele `.agents/`-strukturen |
| `.agents/scripts/validate-harness.ps1` | 244 | Kører `.agents/scripts/audit-harness.ps1` (medmindre `-SkipAudit`); `.agents/registry.yaml` har `version:` og `agents:`-felter; `.agents/agents/<id>/`-mapper mod `agent-roster.json` (begge veje); `.agents/skills/*/SKILL.md` har markdown-overskrift; skriver `.agents/reports/validation_report.md` med `.bak`-backup | `Avatar/agents/*.md` indhold overhovedet (fence, encoding, status/skills/avatar/id-felter); `.vscode/.codex/agents/banedanmark/*.md` frontmatter; `Root/registry.yaml` (den anden registry-fil, uden for `.agents/`); Brain-filer |

## Konsekvens

For **fuld harness-validering** skal alle tre scripts køres:

```powershell
.\scripts\validate-harness.ps1
.\scripts\Validate-AgentHarness.ps1
.\.agents\scripts\validate-harness.ps1
```

Hver enkelt kørsel dækker kun sin egen del af repoet:

- `scripts/validate-harness.ps1` + `scripts/Validate-AgentHarness.ps1` → dækker
  `.vscode/.codex/`-strukturen (roster + `Avatar/agents/*.md` + banedanmark-agenter).
  De to overlapper delvist på samme filer, men med forskellig tjek-dybde
  (se tabel) — kør begge, ikke kun én, for både bredde- og dybde-dækning.
- `.agents/scripts/validate-harness.ps1` → dækker den separate `.agents/`-struktur
  (`.agents/registry.yaml`, `.agents/agents/*/`, `.agents/skills/*/SKILL.md`) og
  kalder desuden `.agents/scripts/audit-harness.ps1`.

Ingen af de tre bygger bro mellem `.vscode/.codex/agents/agent-roster.json` og
`.agents/registry.yaml` — hvis disse to skal holdes i sync, er det i dag ikke
automatiseret af noget script.

## Se også

- Doc-kommentar-blok øverst i hvert af de tre scripts (samme indhold som denne tabel, kortere).
- `docs/architecture/registry-reconciliation.md` — for kontekst om de to registry-filer.
- `docs/architecture/ADR-multi-runtime-agent-system.md` — for `.agents/` vs. `.vscode/.codex/` arkitekturbaggrund.
