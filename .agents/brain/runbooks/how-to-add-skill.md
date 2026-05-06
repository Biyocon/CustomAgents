# Runbook: Saadan tilfoejer du en ny skill

## Formaal

Denne guide beskriver trin-for-trin hvordan en ny skill tilfoejes til harnesset.

## Forudsaeetninger

- Du har identificeret hvad skillen skal kunne, og hvornaar den skal aktiveres
- Du har laest `brain/glossary.md` for at sikre konsistent domaenesprog
- Du har adgang til at skrive i `.agents/skills/`

## Trin

### 1. Vaelg et navn

Navnet skal vaere:
- **Handling-orienteret**: `bbtr-fagpakkestruktur`, `bdk-risk-profile`, `csm-ra-vurdering`
- **Paa dansk** (medmindre det er et etableret engelsk fagudtryk)
- **Uden mellemrum**: brug bindestreg (`-`)

### 2. Tjek for duplikering

Soeq i eksisterende skills for at undgaa overlap:

```powershell
Get-ChildItem -Path ".agents\skills" -Filter "*.md" -Recurse | Select-String -Pattern "<noegleord>"
```

### 3. Opret skill-mappen

```powershell
New-Item -ItemType Directory -Path ".agents\skills\<skill-navn>"
```

Eksempel:
```powershell
New-Item -ItemType Directory -Path ".agents\skills\bbtr-fagpakkestruktur"
```

### 4. Opret skill-manifest

Opret filen `.agents/skills/<skill-navn>/SKILL.md` med foelgende struktur:

```markdown
# <Skill-navn>

## Formaal

Hvad goer denne skill? Hvornaar skal den aktiveres?

## Trigger

- Noegleord: "..."
- Situationer: naar brugeren arbejder med ...
- Kommando: `/skill-navn`

## Instruktioner

### Trin 1: ...

Beskriv hvad agenten skal goere.

### Trin 2: ...

Fortsaet med naeste trin.

## Eksempel

```
<eksempel paa input og forventet output>
```

## Afhaengigheder

- Andre skills: `andet-skill-navn`
- Dokumenter: `stil/til/fil.md`
- Eksterne kilder: URL eller reference

## Bemaerkninger

- Kendte begraensninger
- Sikkerhedsadvarsler
- Domaenespecifikke forbehold
```

### 5. Registrer skillen i registry

Tilfoej skillen til `.agents/registry.yaml` under noeglen `skills`:

```yaml
skills:
  - name: <skill-navn>
    path: skills/<skill-navn>/SKILL.md
    scope: <domaene eller trigger-beskrivelse>
    used_by: [<agent-navn>]
```

Hvis `used_by` endnu ikke kendes, lad feltet vaere tomt eller saet det til `[]`.

### 6. Opdater skill-kortet

Tilfoej skillen til `.agents/brain/maps/skill-map.md` med trigger-scope og bemaerkninger.

### 7. Valider

- Verificer at `SKILL.md` foelger skabelonen
- Tjek at stierne i `registry.yaml` er korrekte
- Laes skillen igennem for at sikre at instruktionerne er entydige

### 8. Commit

```powershell
git add .agents/skills/<skill-navn>/ .agents/registry.yaml .agents/brain/maps/skill-map.md
git commit -m "skill: tilfoej <skill-navn> til harnesset"
```

## Tjekliste

- [ ] Navn er handling-orienteret og paa dansk
- [ ] Mappen er oprettet under `.agents/skills/`
- [ ] `SKILL.md` foelger skabelonen
- [ ] Skillen er registreret i `registry.yaml`
- [ ] Skill-kortet er opdateret
- [ ] Ingen duplikering med eksisterende skills
- [ ] Aendringer er committet

## Fejlfinding

| Problem | Loestring |
|---------|---------|
| Skillen aktiveres ikke | Tjek trigger-noegleordene i `SKILL.md` og `registry.yaml` |
| Skill-instruktioner er uklare | Gennemlaes og opdel i mindre, konkrete trin |
| Skill refererer til ikke-eksisterende fil | Verificer `afhaengigheder`-sektionen |

## Tips

- Hold skills fokuserede: een skill til et formaal
- Brug eksempler: det goer instruktionerne konkrete
- Dokumenter antagelser: hvis skillen antager noget om domaenet, skriv det i `Bemaerkninger`
