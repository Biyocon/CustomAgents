# Flytning af repoet ud af OneDrive — plan + handoff til ny session

**Oprettet:** 2026-07-12 (af sessionen der afsluttede steps 1–10 + MULTI_AGENT_AUDIT)
**Fra:** `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom`
**Til:** `C:\Users\Biyocon\CustomAgents`
**Status:** ⬜ IKKE UDFØRT — når §B er kvitteret, arkivér denne fil til `docs/plans/arkiv/`.

> **Nye session: læs DENNE fil før du gør noget andet.** Derefter `primer.md`.
> Del A er brugerens manuelle trin (allerede udført når du læser dette).
> **Din opgave er Del B.** Del C er din kontekst.

## Hvorfor flytte

1. **OneDrive er repoets dokumenterede fjende.** Korruptionshændelsen 2026-07-02 (5 filer
   trunkeret midt i skrivning), stale-mount-problemer og hele "én skribent"-disciplinen udspringer
   af sync-mappen. `C:\Users\Biyocon\CustomAgents` synkroniseres ikke. Git-mapper i OneDrive er et
   kendt anti-mønster (`.git/` = 870 MB småfiler som sync-motoren konstant rører).
2. **Backup-argumentet er væk:** alt er pushet til GitHub — git ér backuppen.
3. **Stien er teknisk bøvlet:** mellemrum + bindestreger ("OneDrive - Biyocon") har krævet
   quoting-akrobatik i hvert eneste script-kald.
4. **Semantisk:** det er et modent projekt, ikke en skrivebordskladde.

## Risikobillede (kortlagt før flytning — alt grønt)

| Forhold | Fund | Konsekvens |
|---|---|---|
| Læser scripts den absolutte sti? | **NEJ** — 0 træffere på `project_root` i scripts; `generate-runtime.py`/`validate-schemas.py` bruger `--root`/`os.getcwd()`, PS-scripts bruger `$Root = (Get-Location)` | Flytningen bryder **ingen** automatik; sti-referencer er ren dokumentation |
| Cloud-only placeholders? | **NEJ** — alle 9.695 filer er lokale | `Move-Item` kan ikke fejle på ikke-hentede filer |
| Junctions/symlinks i repoet? | **NEJ** | Ingen brudte links |
| LFS | Aktiv (`*.zip filter=lfs`), `.git/lfs` findes | Objekter flytter med `.git/`; samme maskine = samme LFS-installation |
| `core.hooksPath` | `.githooks` (**relativ**, bor i `.git/config`) | Gaten virker uændret efter flytning |
| Volumen | C: → C: | `Move-Item` = rename, **instant**, ingen kopiering af de 1 GB |
| Størrelse | 9.695 filer / 1.049 MB (heraf `.git` 870 MB) | Irrelevant ved rename |

---

# DEL A — Flytningen (brugerens trin)

> Udføres i en **selvstændig PowerShell** — ikke fra en agent-session, som selv har
> arbejdsmappen åben (Windows kan låse mappen, og sessionens cwd bliver ugyldig midt i flytningen).

**Før du starter:** luk VS Code, alle terminaler og alle agent-sessioner der har mappen åben.

```powershell
$src = "C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom"
$dst = "C:\Users\Biyocon\CustomAgents"

# 1) Pausér OneDrive (GUI: højreklik OneDrive-ikon i proceslinjen -> "Pause synkronisering" -> 2 timer)
#    Så racer sync-motoren ikke flytningen.

# 2) Verificér at intet er ucommittet FØR flytning (skal vise "## main...origin/main" og intet andet)
Set-Location $src
git status -sb
git fsck --no-progress          # skal være tavs / ingen fejl

# 3) Flyt (stå UDEN FOR mappen, ellers låser din egen cwd den)
Set-Location C:\
Move-Item -LiteralPath $src -Destination $dst

# 4) Flyt Claude-memory til den nye projektnøgle (så den nye session har sin hukommelse)
$oldKey = "C:\Users\Biyocon\.claude\projects\C--Users-Biyocon-OneDrive---Biyocon-Desktop-Custom"
$newKey = "C:\Users\Biyocon\.claude\projects\C--Users-Biyocon-CustomAgents"
New-Item -ItemType Directory -Path "$newKey\memory" -Force | Out-Null
Copy-Item "$oldKey\memory\*" "$newKey\memory\" -Recurse -Force

# 5) Verificér integritet på ny placering
Set-Location $dst
git status -sb                  # ## main...origin/main
git fsck --no-progress
git lfs ls-files | Select-Object -First 3
git config core.hooksPath       # skal svare: .githooks

# 6) Genoptag OneDrive-sync
```

**Hvad OneDrive gør bagefter:** mappen forsvinder fra den synkroniserede sti, så OneDrive sletter
sky-kopierne. Det er forventet. **Sikkerhedsnettet:** kopierne ligger i OneDrives papirkurv i ~30
dage — lad dem ligge en uges tid, indtil §B er kvitteret grøn.

**Hvis `Move-Item` fejler** (fil i brug): find synderen med `handle64.exe` eller genstart maskinen
og prøv igen. Nødplan B: `robocopy "$src" "$dst" /E /MOVE /R:1 /W:1` (kopierer + sletter kilden).
Nødplan C (renest, men mister untracked filer + lokal git-config): frisk `git clone` til `$dst`.

**Start derefter en ny agent-session i `C:\Users\Biyocon\CustomAgents`.**

---

# DEL B — Efterbehandling (den nye sessions opgaveliste)

Kør i rækkefølge. Alt er små, verificerbare skridt. **Stage eksplicitte stier — aldrig `git add -A`.**

### B0 · Bekræft flytningen (før du retter noget)
```powershell
git status -sb ; git fsck --no-progress ; git config core.hooksPath
uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py   # 0 overtrædelser
uv run --with pyyaml python .agents/scripts/generate-runtime.py --check             # exit 0
```
Alle tre skal være grønne **uden** at du har rettet noget — det beviser at ingen automatik afhang
af den gamle sti. Er de ikke grønne: **stop og rapportér** (så holder analysen i tabellen øverst ikke).

### B1 · Opdatér de 4 levende sti-referencer

| Fil | Linje | Nuværende | Skal være |
|---|---|---|---|
| `.agents/registry.yaml` | 16 | `project_root: "C:\\Users\\Biyocon\\OneDrive - Biyocon\\Desktop\\Custom"` | `project_root: "C:\\Users\\Biyocon\\CustomAgents"` |
| `primer.md` | ~20 | `- **Rod:** \`C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom\`` | `- **Rod:** \`C:\Users\Biyocon\CustomAgents\`` |
| `MULTI_AGENT_AUDIT_ADAPTED_FOR_THIS_HARNESS.md` | 16 | `sti: "C:\\...\\Desktop\\Custom"` | `sti: "C:\\Users\\Biyocon\\CustomAgents"` |
| `PROMPT_MULTI_AGENT_LOGIC_AUDIT_48_V4.md` | 26 | `sti: "C:\\...\\Desktop\\Custom"` | `sti: "C:\\Users\\Biyocon\\CustomAgents"` |

`promotion_target_global_path: "C:\\Users\\Biyocon"` i registry er **fortsat korrekt** — rør den ikke.

> **Faldt fra 5 til 4 rækker (2026-07-12):** promoverings-runbooken er omskrevet og bruger nu
> `$env:USERPROFILE` + `git rev-parse --show-toplevel` i stedet for hardkodede stier — den
> rammes ikke af flytningen. Samme gælder `PROMPT.md` + `DESIGN.md` (se nederst).

### B2 · Ret Claude-permissions til den nye memory-nøgle
`.claude/settings.json` linje 10–11 indeholder absolutte stier til den **gamle** nøgle:
`c--Users-Biyocon-OneDrive---Biyocon-Desktop-Custom` → `C--Users-Biyocon-CustomAgents`
(begge forekomster: `Bash(cd ...)`-reglen og `Read(...)`-reglen).

### B3 · Regenerér den genererede rapport
`.agents/reports/validation_report.md` indeholder `Projektrod: <gammel sti>`. **Redigér den ikke** —
den er genereret. Kør harnessen, så skriver den sig selv:
```powershell
& .\scripts\Validate-Harness-Unified.ps1     # forvent: 0 fejl, 0 advarsler
```

### B4 · Fjern flytte-banneret i `primer.md`
Banneret øverst i primer er selvdestruerende — slet det når B1–B3 er grønne.

### B5 · Opdatér den globale skabelon (uden for repoet)
`C:\Users\Biyocon\.agents\templates\customagents-harness\README.md` linje ~3:
"Promoveret 2026-07-12 fra `C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Custom`"
→ ret kilde-stien til den nye. (ADR-0004 i repoet er derimod **historik** — lad den stå.)

### B6 · Opdatér memory
I `C:\Users\Biyocon\.claude\projects\C--Users-Biyocon-CustomAgents\memory\`:
- `MEMORY.md` + `customagents-multi-runtime-architecture.md`: ret rod-stien.
- `onedrive-corruption-incident-2026-07-02.md`: tilføj at repoet **er flyttet ud af OneDrive
  2026-07-12** — den oprindelige risikokilde er dermed elimineret; reglerne (én skribent,
  aldrig `git add -A`, UTF-8-vagt) gælder fortsat som god praksis.

### B7 · Commit + push (eksplicitte stier)
```
docs(move): repo moved out of OneDrive to C:\Users\Biyocon\CustomAgents
```
Kvittér til sidst denne fils status-linje øverst → ✅ UDFØRT, og `git mv` den til
`docs/plans/arkiv/`.

### B8 · IKKE en del af flytningen (rør dem ikke her)
**Historiske snapshots med den gamle sti — skal IKKE omskrives** (memory-governance:
SNAPSHOT-klassen er append-only; historik omskrives aldrig):
`reports/audits/AUDIT_2026-05-06*.md` · `reports/00_startup_check.md` ·
`.agents/reports/00_startup_check.md` · `.agents/brain/memory/session-2026-05-06.md` ·
`docs/audit/*` · `docs/done/#11-*` · `Task/**` + `docs/Task/**` (legacy) ·
`docs/kilde/**` (fremmed skabelon) · `PROMPT_MULTI_AGENT_DEEP_AUDIT_48.md` (afløst forgænger) ·
`.agents/brain/decisions/ADR-0004-*` (dokumenterer en fortidig handling).

---

# DEL C — Kontekst til den nye session

**Læs `primer.md` for den fulde tilstand.** Kort orientering:

**Projektet:** AgentSkills — model-agnostisk, genbrugelig AI-agent-harness til projektstyring,
med Banedanmark som domæne. GitHub: `Biyocon/CustomAgents`, arbejder direkte på `main`.

**Arkitektur (alt fuldført 2026-07-11/12):**
- `.agents/` = **CANONICAL** — eneste redigeringssted. 47 agenter (28 personaer + 19 BDK-rolleagenter),
  107 skills, 7 adaptere, brain.
- **Genererede lag — håndredigeres ALDRIG:** `.vscode/.codex/agents/` + Brain-pointer (codex) og
  `.claude/agents/` 47 subagenter (claude-code). Begge adaptere er `active`.
- **Arbejdsregel:** redigér canonical → `generate-runtime.py --apply` → bekræft `--check` exit 0.
- **Gating:** `.githooks/pre-commit` + CI kører skema- + sync-vagt ved hver commit.

**Status:** ADR-roadmap A–F + Fase G + steps 1–10 + MULTI_AGENT_AUDIT er fuldført og
dual-verificeret. Harness: 0 fejl / 0 advarsler. Alle tickets lukket (`docs/active/` er tom).
Intet blokerer — resterende punkter er valgfrie (audit-rapportens §8).

**Ufravigelige husregler:**
- **Én skrivende session ad gangen** — tjek `git status` for fremmede ucommittede ændringer FØR
  første skriv. **Aldrig `git add -A`** i et muligvis delt tree (near-miss 2026-07-12: fremmed fil
  blev fejet med i commits). Fremmed fil i add-listen = stopsignal.
- **UTF-8-vagt efter HVER redigering** (`chr(0xFFFD) not in ...`) — repoet har gentagen mojibake-historik.
- **Verificér før completion-claims** — kør kommandoen, citér output; kode på disk er ikke bevis.
- **Commit kun på anmodning**; aldrig push til main uden godkendelse. Conventional Commits.
- Dansk i projektdokumenter; engelsk i kode/commits/PR'er.
- Adapterfilen for Claude hedder `claude-code.md` (IKKE `claude.md` — Windows case-kollision med `CLAUDE.md`).

**Nøglefiler:** `primer.md` · `systemkort.md` (autoritativ arkitektur) ·
`docs/audit/AUDIT-2026-07-12-multi-agent-audit-post-roadmap.md` (seneste audit + §8-restliste) ·
`docs/architecture/{ADR-multi-runtime-agent-system,memory-governance,registry-reconciliation,repo-map}.md` ·
`docs/qa/RELEASE-runtime-activation-gate.md` (GODKENDT).

**Kendte åbne (valgfrit, intet haster):** 31 ældre skill-descriptions mangler trigger ·
28 nye domæneskills er FORELØBIG indtil kildeverifikation · `bbtr-webdesign` >500 linjer ·
`~/.claude/skills`-globalkopi er korrupt/ustyret (uden for repoet) · logopakken i `temp/` er
load-bearing for 3 brand-skills · `.codex`-rodflytning udskudt (kræver ekstern verifikation).

> **Løst 2026-07-12 (efter denne plan blev skrevet) — skal IKKE røres i Del B:**
> `PROMPT.md` + `DESIGN.md` er omskrevet til nutid og gjort **sti-agnostiske** (nul absolutte
> stier). PROMPT.md er nu et prompt-bibliotek pr. opgave; DESIGN.md ejer principper +
> beslutningsfilter for nye feature-ønsker.
> **Promoverings-runbooken** er ligeledes omskrevet: den brugte `C:\Users\HMDR` (maskine der ikke
> findes) og instruerede — i modstrid med sit eget banner — kopiering til og sletning af
> `.agents/`-**roden**, hvor MasterBrain bor. Nu: `$env:USERPROFILE` + `git rev-parse
> --show-toplevel`, korrekt `templates/`-målsti, eksistenstjek og et tilbagefald der kun rører
> skabelon-undermappen.
