# Runbook: Sådan promoverer du projekt-harnesset til global skabelon

> **Status: UDFØRT første gang 2026-07-12 (Fase G)** — beslutning, scope og afvigelser:
> `.agents/brain/decisions/ADR-0004-2026-07-12-fase-g-global-promovering.md`.
> Denne runbook beskriver den **faktisk udførte** procedure, så den kan gentages ved opdatering.
>
> **Envejs:** kilde-repoet er sandheden. Skabelonen håndredigeres aldrig — den opdateres ved at
> gentage denne runbook.

## ⚠️ Kollisionsforbehold (læs før alt andet)

`$env:USERPROFILE\.agents\` er **ikke** ledig plads — det er brugerens delte Claude Code
skills/plugin-hub med **MasterBrain** under `brain/` (junctions til vaults) og sin egen
`STRUCTURE.md`-konvention.

- **Kopiér ALDRIG ind i hub'ens rod.** Promovér altid til en **undermappe under `templates/`**,
  som er hub'ens eget rum til genbrugelige skabelon-specs.
- **Slet aldrig hub-roden** som tilbagefald. (Den oprindelige udgave af denne runbook
  instruerede begge dele mod `C:\Users\HMDR` — en maskine der ikke findes. Havde man kørt den
  mod den faktiske profil, ville MasterBrain være blevet overskrevet.)
- **Eksistenstjek før skrivning:** afbryd hvis målmappen allerede findes.

## Variable (ingen hardkodede stier — de rådner)

```powershell
$repo   = (git rev-parse --show-toplevel)              # kør fra repo-roden
$hub    = "$env:USERPROFILE\.agents"                   # delt skills/plugin-hub (MasterBrain!)
$target = "$hub\templates\customagents-harness"        # skabelonens plads
```

## Forudsætninger

- Alle kvalitetsporte er grønne i kilde-repoet (se trin 1).
- Arbejdstræet er rent og pushet (git ér backuppen).
- `$hub\templates\` findes (hub'ens egen konvention).

---

## Trin

### 1. Validér kilde-harnesset

```powershell
Set-Location $repo
uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py   # 0 overtrædelser
uv run --with pyyaml python .agents/scripts/generate-runtime.py --check             # exit 0
& .\scripts\Validate-Harness-Unified.ps1                                            # 0 fejl
git status -sb                                                                      # rent + synkront
```

Promovér **kun** fra en grøn, committet tilstand — skabelonen arver det du sender.

### 2. Skel generisk fra projektspecifikt

Kun det **generiske** promoveres. Domæneindholdet bliver i repoet.

| Promoveres (generisk) | Bliver lokalt (projekt-/domænespecifikt) |
|---|---|
| `.agents/schema/` (5 JSON-skemaer = target-kontrakten) | `.agents/agents/**` (28 personaer + 19 BDK-rolleagenter) |
| `.agents/scripts/` (`generate-runtime.py`, `validate-schemas.py`, `audit-harness.ps1`) | `.agents/skills/**` (BDK/BBTR-domæneskills) |
| `.agents/model-adapters/` (mønster + frontmatter-format) | `.agents/registry.yaml` (data) |
| `.agents/brain/README.md` + `.agents/brain/runbooks/` → `brain-skeleton/` | `.agents/brain/` indhold (context, glossary, assumptions, memory, maps) |
| `docs/architecture/memory-governance.md` → `governance/` | `Avatar/`, `Funktions- og stillingsbeskrivelser/` |
| `.githooks/` → `githooks-skeleton/` | Projektets ADR'er og PM-dokumenter |
| `.github/workflows/validate.yml` → `github-workflows-skeleton/` | |

Gaten er **dobbelt** (hook + CI) — promovér begge, ellers arver et nyt projekt kun det halve værn.

### 3. Opret målmappen (med eksistenstjek)

```powershell
if (Test-Path $target) { throw "FINDES ALLEREDE: $target — opdatér bevidst frem for at overskrive blindt" }
New-Item -ItemType Directory -Path $target | Out-Null
```

### 4. Kopiér de generiske komponenter

```powershell
Copy-Item "$repo\.agents\schema"          "$target\schema"         -Recurse
Copy-Item "$repo\.agents\model-adapters"  "$target\model-adapters" -Recurse
Copy-Item "$repo\.githooks"               "$target\githooks-skeleton" -Recurse

New-Item -ItemType Directory -Path "$target\scripts", "$target\brain-skeleton", "$target\governance", "$target\github-workflows-skeleton" -Force | Out-Null
Copy-Item "$repo\.agents\scripts\generate-runtime.py", "$repo\.agents\scripts\validate-schemas.py", "$repo\.agents\scripts\audit-harness.ps1" "$target\scripts\"
Copy-Item "$repo\.agents\brain\README.md" "$target\brain-skeleton\README.md"
Copy-Item "$repo\.agents\brain\runbooks"  "$target\brain-skeleton\runbooks" -Recurse
Copy-Item "$repo\docs\architecture\memory-governance.md" "$target\governance\memory-governance.md"
Copy-Item "$repo\.github\workflows\validate.yml" "$target\github-workflows-skeleton\validate.yml"
```

### 5. Skriv skabelonens README

`$target\README.md` skal indeholde: hvad der er promoveret (og hvad bevidst ikke er),
instantieringsguide til et nyt projekt, de arvede arbejdsregler (canonical→genereret,
én skribent, UTF-8-vagt), og at skabelonen opdateres envejs fra kilde-repoet.

### 6. Verificér

```powershell
(Get-ChildItem $target -Recurse -File).Count      # forventet: ~26 filer
Get-Content "$target\README.md" -TotalCount 10
```

### 7. Dokumentér

Opret/opdatér en ADR i `.agents/brain/decisions/` (mønster: ADR-0004): beslutning, målsti,
scope-skel, afvigelser fra denne runbook og hvorfor. Opdatér `PROJEKT_PLAN.md` + `DEPS.md`
hvis promoveringen lukker en fase.

---

## Tilbagefald

1. Slet **kun** `$target` (skabelon-undermappen) — **aldrig** `$hub`-roden.
2. Kilde-repoet er urørt af promoveringen (der kopieres kun **fra** det), så der er intet at gendanne der.
3. Fejlsøg i kilden, kør portene grønne, promovér igen.

## Tjekliste

- [ ] Kvalitetsporte grønne + arbejdstræ rent og pushet
- [ ] Kollisionsforbeholdet læst; målsti er en **undermappe** under `templates/`
- [ ] Eksistenstjek udført (ingen blind overskrivning)
- [ ] Kun generiske komponenter kopieret (jf. trin 2)
- [ ] Begge gate-halvdele med (hook + CI-workflow)
- [ ] Skabelon-README skrevet
- [ ] Verificeret (filantal + README læsbar)
- [ ] ADR skrevet/opdateret

## Kendte huller i skabelonen (fra audit 2026-07-12 — luk ved næste runde)

- **Mangler `examples/`**: et minimalt gyldigt `registry.yaml` + én agent-profil + én skill der
  består `validate-schemas.py`. Uden dem skal et nyt projekt reverse-engineere skemaerne.
- **`generate-runtime.py` har domæne-hardcodes** i det "generiske" lag: `ROLE_CONTAINER = "banedanmark"`,
  `banebyg` som eneste tilladte skills-leftover, og Avatar-sti-antagelsen. Checks degraderer pænt
  når stierne mangler, men konstanterne bør parametriseres (fx via registry/adapter-frontmatter)
  eller dokumenteres eksplicit som "SKAL rettes ved instantiering".
