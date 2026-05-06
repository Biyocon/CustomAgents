# 00 — Startup Check (Fase 0)

**Dato/tid:** 2026-05-06 (lokal Windows-session)
**Operatør:** Claude Opus 4.7 (1M context) i Claude Code CLI
**Konto:** `biyocon\biyocon`
**Brugerens email:** hmda@biyocon.com

---

## 1. Verificeret aktiv projektsti

```
C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør
```

Eksisterer ✅ — indeholder Avatar/, Kombi/, .vscode/, AGENTS.md, docs/, My-project-template/, temp/, .scratch/.

## 2. Sti angivet i system-prompten (ikke verificerbar)

```
C:\Users\HMDR\OneDrive - Banedanmark\Skrivebord\Kvalifikationsordning Entreprenør
```

`C:\Users\HMDR` findes IKKE på denne maskine. Antagelse: HMDR er målprofil på en separat Banedanmark-arbejdsmaskine. Denne PC kører på Biyocon-profilen, og projektet eksisterer som Biyocon-OneDrive-spejl af samme arbejde.

**Antagelse markeret:** Aktiv runtime-sti er Biyocon-stien ovenfor. HMDR-stien er **promotion target** ved senere globalisering, ikke aktiv arbejdssti.

## 3. Git-status

Projektet er **ikke** et git-repo. Ingen `.git/` i roden. Ingen versionskontrol = øget risiko ved destruktive ændringer. **Anbefaling:** kør `git init` i projektroden før yderligere strukturelle ændringer.

## 4. Tooling

| Værktøj | Version |
|---------|---------|
| git | 2.53.0.windows.1 |
| node | v24.13.0 |
| npm | 11.9.0 |
| npx | tilgængelig (`C:\Program Files\nodejs\npx.ps1`) |

## 5. Inspirationsmapper (fundet)

| Sti | Status | Note |
|-----|--------|------|
| `C:\Users\Biyocon\Open source` | ✅ findes | ~150+ repos (incl. andrej-karpathy-skills, claude-skills-main, paperclip-master, oh-my-claudecode-main, m.fl.) |
| `C:\_tooling` | ✅ findes | Bl.a. oh-my-claudecode, oh-my-codex, vscode-relaterede |

## 6. Avatar-/Kombi-filer (verificeret)

| Sti | Status | Bemærkning |
|-----|--------|-----------|
| `Avatar/0_avatar_generatio_prompt.txt` | ✅ findes (5510 b) | **ALLEREDE konsolideret** med 25 agenter + accent-farver |
| `Avatar/1_Prompt_custom_12_avatars.md` | ✅ findes (2765 b) | Indhold sandsynligvis allerede inkorporeret i 0_-filen |
| `Avatar/System_Prompt_Agent_Yunus_Udbudskonsulent.txt` | ✅ findes (4042 b) | Original .txt-version; 25 nye .md-versioner findes i `Avatar/agents/` |
| 27 avatar-PNG'er | ✅ alle til stede | 25 dækker roster + 2 ekstra (Hassan dobbelt, ChatGPT-fil) |

Filnavnet er bekræftet som `0_avatar_generatio_prompt.txt` (med stavefejl `generatio`). **Ingen omdøbning foretaget.**

## 7. Identificerede risici

1. **HØJ — Architecture-konflikt (blokering):** System-prompten foreskriver ny `.agents/`-struktur, men projektet har allerede en omfattende `.vscode/.codex/`-runtime, og ADR-0001 har eksplicit bestemt sidstnævnte som single source of truth. At følge spec literalt vil være destruktiv duplikering. Se `01_existing_harness_inventory.md` for komplet gap-analyse.
2. **MEDIUM — Ingen versionskontrol:** Strukturelle ændringer uden git er svære at rulle tilbage.
3. **LAV — Stinavn-mismatch (HMDR vs Biyocon):** Hvis user senere kører på HMDR-maskinen, skal alle absolutte stier i scripts/registry oversættes. Migrationsplan håndterer dette.
4. **LAV — Forkert oprettet mappe:** `C:\Users\Biyocon\Kvalifikationsordning Entreprenør\` blev fejlskabt af mig i tidligere svar (tom skelet). Mark for sletning efter user accept.

## 8. Antagelser markeret

- A1: Aktiv arbejdssti er Biyocon-OneDrive-stien.
- A2: HMDR er promotion target, ikke aktiv arbejdsmaskine i denne session.
- A3: Eksisterende `.vscode/.codex/` skal honoreres som autoritativ runtime indtil bruger eksplicit beslutter migration.
- A4: 25-agent-roster i `agent-roster.json` er stabil — nye agenter tilføjes kun efter bruger-godkendelse.
- A5: De 17 spec-listede Banedanmark-roller (Interface Manager, Udbudskonsulent, ..., Økonomi/Controller) skal valideres mod den eksisterende blandede 25-agent-roster (som inkluderer ikke-Banedanmark som Pædagog, Læge, Fodboldagent).

## 9. Status

Fase 0 ✅ udført. Fase 1–15 STOPPET pga. arkitekturkonflikt — afventer brugerbeslutning. Se `01_existing_harness_inventory.md` for detaljer og strategiske valg A/B/C.
