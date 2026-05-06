# Fase 0 — Startup Check

## Dato/tid
2026-05-06T11:45:00+02:00

## Aktuel arbejdsmappe
C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør

## Verificerede stier
| Sti | Status | Bemærkning |
|-----|--------|------------|
| Projektrod | ✅ Fundet | Git-repo (master) |
| Kombi/ | ✅ Fundet | Scanning påkrævet |
| Avatar/ | ✅ Fundet | Scanning påkrævet |
| reports/ | ✅ Fundet | Eksisterer i roden |
| C:\Users\Biyocon\Open source | ✅ Fundet | Ekstern inspiration |
| C:\_tooling | ✅ Fundet | Ekstern tooling |

## Git-status
- Branch: master
- Staged changes: 5 filer (3 avatar-agenter, temp-filer)
- Unstaged changes: 16 filer (.vscode/.codex/agents/banedanmark/*, temp/*)
- Untracked files: 35 filer (nye avatar-agenter, scripts, temp/*)
- Bemærkning: Der findes allerede agent-arbejde i `.vscode/.codex/agents/banedanmark/` og `Avatar/agents/`, men det er ikke konsolideret i målarkitekturen.

## Miljø
| Værktøj | Version |
|---------|---------|
| Git | 2.53.0.windows.1 |
| Node.js | v24.13.0 |
| npm | 11.9.0 |

## Kendte risici
1. **Stavevariant i filnavn**: Brugeren bemærker at `0_avatar_generatio_prompt.txt` muligvis har stavefejl (mangler 'n'). Dette skal verificeres før redigering.
2. **Eksisterende git-ændringer**: Der er mange unstaged/untracked filer. Harness-opbygning bør ikke røre eksisterende arbejde uden backup.
3. **OneDrive-synkronisering**: Stien ligger under OneDrive, hvilket kan give synkroniseringsforsinkelse ved mange filændringer.
4. **Sti-forskel**: Brugerens prompt refererer til `C:\Users\HMDR\...`, men aktuel sti er `C:\Users\Biyocon\...`. Vi arbejder i den aktuelle fysiske sti.
5. **Vendor-repoer**: Matt Pocock skills og Karpathy skills skal klones; det kræver netværksadgang.

## Antagelser
- [ ] Vi arbejder i den aktuelle fysiske sti (`C:\Users\Biyocon\...`), ikke `C:\Users\HMDR\...`.
- [ ] Eksisterende `.vscode/.codex/` er en tidligere agent-struktur, der skal migreres eller arkiveres.
- [ ] `Kombi/` indeholder referencekilder og tredjeparts-kode, der ikke må bruges aktivt uden bevidst reaktivering (jf. eksisterende AGENTS.md).
- [ ] Avatar-mappen indeholder både billedfiler og promptfiler.

## Næste trin
Fortsæt til Fase 1 (Kombi-scanning), Fase 2 (Avatar-scanning) og Fase 3 (eksterne mapper) i parallel.
