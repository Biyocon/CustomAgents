# Runbook: Saadan tilfoejer du en ny agent

## Formaal

Denne guide beskriver trin-for-trin hvordan en ny agent tilfoejes til harnesset.

## Forudsaeetninger

- Du har identificeret agentens rolle, trigger-betingelser og arbejdsomraade
- Du har laest `brain/context.md` for at forstaa projektets domaene
- Du har adgang til at skrive i `.agents/agents/`

## Trin

### 1. Vaelg et navn

Navnet skal vaere:
- **Beskrivende**: `bbtr-raadgiver`, `sikkerhedsvurderer`, `dokumentkontrollant`
- **Paa dansk** (medmindre det er et etableret engelsk begreb)
- **Uden mellemrum**: brug bindestreg (`-`) eller camelCase

### 2. Opret agent-mappen

```powershell
New-Item -ItemType Directory -Path ".agents\agents\<agent-navn>"
```

Eksempel:
```powershell
New-Item -ItemType Directory -Path ".agents\agents\bbtr-raadgiver"
```

### 3. Opret agent-manifest

Opret filen `.agents/agents/<agent-navn>/AGENT.md` med foelgende struktur:

```markdown
# <Agent-navn>

## Rolle

Beskriv hvad agenten goer, hvem den hjaelper, og hvad dens ekspertise er.

## Trigger

Hvornaar aktiveres agenten?
- Noegleord: "..."
- Kontekst: naar brugeren arbejder med ...
- Kommando: `/agent-navn`

## Arbejdsomraade

- Hvad agenten maa goere
- Hvad den ikke maa goere (negativ afgraensning)

## Arbejdsregler

1. ...
2. ...

## Afhaengigheder

- Skills: `skill-navn`
- Andre agenter: `anden-agent`
- Dokumenter: `stil/til/fil.md`

## Eksempel

```
<eksempel paa en typisk samtale>
```
```

### 4. Registrer agenten i registry

Tilfoej agenten til `.agents/registry.yaml` under noeglen `agents`:

```yaml
agents:
  - name: <agent-navn>
    path: agents/<agent-navn>/AGENT.md
    role: <kort beskrivelse>
    triggers: ["noegleord1", "noegleord2"]
```

### 5. Opdater agent-kortet

Tilfoej agenten til `.agents/brain/maps/agent-map.md` med rolle, trigger og bemaerkninger.

### 6. Valider

Kor valideringsscriptet:

```powershell
powershell .agents/scripts/validate-harness.ps1
```

Eller hvis scriptet ikke findes endnu:
- Verificer at `AGENT.md` foelger skabelonen
- Tjek at stierne i `registry.yaml` er korrekte
- Soerg for at agenten ikke duplikerer en eksisterende agents rolle

### 7. Commit

```powershell
git add .agents/agents/<agent-navn>/ .agents/registry.yaml .agents/brain/maps/agent-map.md
git commit -m "agent: tilfoej <agent-navn> til harnesset"
```

## Tjekliste

- [ ] Navn er beskrivende og paa dansk
- [ ] Mappen er oprettet under `.agents/agents/`
- [ ] `AGENT.md` foelger skabelonen
- [ ] Agenten er registreret i `registry.yaml`
- [ ] Agent-kortet er opdateret
- [ ] Validering er koert uden fejl
- [ ] Aendringer er committet

## Fejlfinding

| Problem | Loestring |
|---------|---------|
| Agenten trigger ikke | Tjek trigger-noegleordene i `AGENT.md` og `registry.yaml` |
| Agenten bruger forkert skill | Verificer `afhaengigheder`-sektionen i `AGENT.md` |
| Sti-fejl i registry | Soerg for at `path` i `registry.yaml` er relativ til `.agents/` |
