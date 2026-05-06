# Runbook: Saadan promoverer du projekt-harnesset til global profil

## Formaal

Denne guide beskriver hvordan du kopierer det aktuelle projekts agent-harness til en global brugerprofil (`C:\Users\HMDR`), saa det kan genbruges paa tvaers af projekter.

> **Advarsel**: Dette er en fremtidig operation. Laes hele guiden igennem foer du udfoerer den.

## Forudsaeetninger

- Projekt-harnesset i `.agents/` er fuldt funktionelt og valideret
- Du har skriveadgang til `C:\Users\HMDR`
- Du har en backup af begge stier

## Trin

### 1. Valider projekt-harnesset

Kor valideringsscriptet fra projektets rod:

```powershell
powershell .agents/scripts/validate-harness.ps1
```

Hvis scriptet ikke findes endnu, verificer manuelt:
- [ ] `registry.yaml` er syntaktisk korrekt
- [ ] Alle stier i `registry.yaml` peger paa eksisterende filer
- [ ] `AGENTS.md` i projektroden er opdateret
- [ ] Brain-mappen er komplet

### 2. Identificer projektspecifikt vs. genbrugbart indhold

Gennemgaa `.agents/` og marker hvad der er generisk vs. projektspecifikt:

| Generisk (kopieres) | Projektspecifikt (beholdes lokalt) |
|---------------------|-------------------------------------|
| `brain/README.md` | `brain/context.md` (tilpasses) |
| `brain/glossary.md` (kernen) | `brain/glossary.md` (projekttilfoejelser) |
| `brain/runbooks/` | `brain/maps/` (tilpasses) |
| Struktur og skabeloner | Specifikke agent-definitioner |
| Valideringsscripts | Projekt-specifikke skills |

### 3. Forbered maalstien

```powershell
$source = "C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenoer\.agents"
$target = "C:\Users\HMDR\.agents"

# Sikr at maalstien eksisterer
if (-not (Test-Path $target)) {
    New-Item -ItemType Directory -Path $target
}
```

### 4. Kopier filerne

```powershell
# Kopier struktur
Copy-Item -Path "$source\brain\README.md" -Destination "$target\brain\README.md" -Force
Copy-Item -Path "$source\brain\runbooks\*" -Destination "$target\brain\runbooks\" -Force -Recurse
Copy-Item -Path "$source\scripts\*" -Destination "$target\scripts\" -Force -Recurse

# Kopier skabeloner (tomme mapper eller eksempler)
Copy-Item -Path "$source\agents" -Destination "$target\agents" -Force -Recurse
Copy-Item -Path "$source\skills" -Destination "$target\skills" -Force -Recurse
```

### 5. Tilpas globale filer

Efter kopiering skal foelgende tilpasses i `C:\Users\HMDR\.agents/`:

- **`registry.yaml`**:
  - Opdater `project_root` til et passende sted eller marker det som `"GLOBAL"`
  - Fjern eller marker `promotion_target_global_path` som `"N/A"`
  - Ryd `agents` og `skills` hvis de er projektspecifikke

- **`brain/context.md`**:
  - Tilpas til generisk Banedanmark-kontekst
  - Fjern projektspecifikke stier

### 6. Verificer global installation

```powershell
# Tjek at strukturen er komplet
Get-ChildItem -Path "C:\Users\HMDR\.agents" -Recurse

# Tjek at registry kan laeses
Get-Content "C:\Users\HMDR\.agents\registry.yaml" | Select-Object -First 20
```

### 7. Dokumenter promoveringen

Tilfoej en note i projektets `brain/decisions/`:

```markdown
# ADR-XXXX: Promovering til global profil

## Beslutning

Projekt-harnesset blev promoveret til `C:\Users\HMDR\.agents` den <dato>.

## Motivation

... (hvorfor det blev promoveret)

## Aendringer ved promovering

... (hvad der blev tilpasset)
```

## Tilbagefald

Hvis noget gaar galt:

1. Slet `C:\Users\HMDR\.agents`
2. Gendan fra backup hvis noedvendigt
3. Fejlsog i projekt-harnesset foer ny promovering

## Tjekliste

- [ ] Projekt-harnesset er valideret
- [ ] Backup er taget
- [ ] Projektspecifikt vs. generisk indhold er identificeret
- [ ] Maalstien er forberedt
- [ ] Filer er kopieret
- [ ] Globale filer er tilpasset
- [ ] Verificer at strukturen er korrekt
- [ ] Promovering er dokumenteret

## Bemaerkning

> Dette er en **envejsoperation** for strukturen, men ikke for indholdet. Du kan altid opdatere det globale harness ved at gentage processen med nyere versioner fra projektet.
