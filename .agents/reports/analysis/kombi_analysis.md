# Kombi-analyse

_Genereret: 2026-05-06T12:07:43.945331_

## Top-level klassifikation

| Mappe | Klassifikation | Vurdering | Bemærkning |
|---|---|---|---|
| agency-agents-main | agent prompt | kræver omskrivning |  |
| agentic-stack-master | agent prompt | kræver omskrivning |  |
| andrej-karpathy-skills-main | skill | direkte genbrug | Persona-skills baseret på Andrej Karpathy – kan arkiveres som reference |
| caveman-main | ukendt | kræver manuel afklaring |  |
| claude-code-main | ukendt | kræver manuel afklaring | Claude Code-specifikke scripts – kræver omskrivning til model-agnostisk brug |
| claude-mem-main | ukendt | kræver manuel afklaring |  |
| deer-flow-main | ukendt | kræver manuel afklaring |  |
| everything-claude-code-main | ukendt | kræver manuel afklaring | Claude Code guides – kan genbruges delvist efter omskrivning |
| get-shit-done-main | ukendt | kræver manuel afklaring |  |
| graphify-6 | ukendt | kræver manuel afklaring |  |
| Iqra-main | ukendt | kræver manuel afklaring | Iqra-projekt – app-kode og dokumentation, ikke direkte genbrugelig som skill |
| oh-my-openagent-dev | agent prompt | kræver omskrivning |  |
| planning-with-files-master | ukendt | kræver manuel afklaring |  |
| skills-main | skill | direkte genbrug | mattpocock/skills – primær kilde til generelle engineering-skills |
| system_prompts_leaks-main | agent prompt | kræver omskrivning |  |

## Deep-scan bemærkninger

### skills-main
- Indeholder skills under `skills/` fordelt på engineering, productivity, misc.
- Har også `.claude-plugin/` og `scripts/` som er værktøjsspecifikke.

### andrej-karpathy-skills-main
- Primært persona-skills og prompt-templates.
- Mindre direkte værdi for Banedanmark-harness, men kan inspirere agent-personaer.

### Iqra-main
- Fuld app-kodebase (Next.js, scripts, docs).
- Ikke en skill-samling; dokumentation og scripts kan dog studeres for patterns.

## Vendor-kopiering

- **mattpocock-skills** kopieret fra `Kombi\skills-main` til `.agents\vendor\mattpocock-skills`.
- **andrej-karpathy-skills** kopieret fra `Kombi\andrej-karpathy-skills-main` til `.agents\vendor\andrej-karpathy-skills`.
