# Vejledning-skabelon — Step-by-step guides

## Skabelonformat

Alle BBE-brugervejledninger følger testcase-formatet fra systemudviklingen. Dette sikrer konsistens og gør det nemt at opdatere når funktionalitet ændres.

## Grundstruktur

```markdown
# [Vejledning titel]

## [X] [Hovedafsnit]

### [X.Y] [Handling/opgave]

#### [X.Y.Z] [Konkret trin]
[Beskrivelse af hvad brugeren skal gøre]

#### [X.Y.Z+1] [Næste trin]
[Beskrivelse...]

#### [X.Y.Z+n] Forventet resultat
[Hvad brugeren skal se/opleve når trinnet er gennemført korrekt]

---
```

## Eksempel: Opret nyt udbud

```markdown
# Guide til Ejer — Opret nyt udbud

## 3 Arbejde med udbud

### 3.1 Opret nyt udbud

#### 3.1.1 
Gå til menupunktet 'Udbud' i topmenuen

#### 3.1.2
Klik på 'Opret nyt udbud' knappen

#### 3.1.3
Udfyld stamdata:
- Projektnavn
- Projektnummer
- Link til SharePoint projektsite

#### 3.1.4
Vælg stadier for udbuddet (typisk 1-3 stadier)

#### 3.1.5
Klik 'Opret udbud'

#### 3.1.6 Forventet resultat
Du ser nu dit nye udbud i udbudsoversigten med status "Aktiv"

---

### 3.2 Vælg poster til udbud

#### 3.2.1
Find dit udbud i udbudsoversigten og klik på udbudsnavnet

#### 3.2.2
Du ser nu postoversigten med alle fagposter i venstre kolonne

#### 3.2.3
Klik på expand-ikonet (▸) ved den fagpost du vil arbejde med

#### 3.2.4
Sæt flueben ved de poster du vil inkludere i udbuddet

#### 3.2.5
Tilføj evt. udbudsspecifik kommentar i højre kolonne

#### 3.2.6 Forventet resultat
De valgte poster er nu markeret med flueben og vil indgå i udbudsdokumentet

---
```

## Vejledningstyper

### Guide til Ejer (Projektleder)
**Målgruppe:** Projektledere der opretter og styrer udbud

**Dækker:**
- Oprettelse af udbud
- Valg af poster
- Tilpasning af bilag
- Generering af udtræk
- Import af tilbudslister

### Guide til Bruger (Projekteringsleder)
**Målgruppe:** Projekteringsledere der arbejder med indhold

**Dækker:**
- Tilføjelse af poster til udbud
- Angivelse af mængder
- Tilføjelse af udbudsspecifikke kommentarer
- Preview af dokumenter
- Review af tilbudslister

### Guide til Ekstern leverandør (Rådgiver)
**Målgruppe:** Eksterne rådgivere med begrænset adgang

**Dækker:**
- Login og navigation
- Visning af poster
- Tilføjelse af kommentarer
- Download af preview-dokumenter

### Adgangsstyring
**Målgruppe:** Administratorer

**Dækker:**
- De 4 brugergrupper
- Tildeling af rettigheder
- Håndtering af eksterne brugere

## Sproglige retningslinjer

### Imperativ form
Brug **imperativ** (bydeform) i alle instruktioner:
- ✅ "Klik på knappen"
- ✅ "Gå til menupunktet"
- ✅ "Vælg den ønskede post"
- ❌ "Du skal klikke på knappen"
- ❌ "Brugeren går til menupunktet"

### Præcise handlingsanvisninger
- Angiv **præcis** hvor brugeren skal klikke
- Brug **ikonnavne** når relevant (Excel-ikon, PDF-ikon)
- Referer til **UI-elementer** med deres faktiske navne

### Screenshots
- Inkluder screenshots ved komplekse trin
- Marker relevante områder med rød cirkel/pil
- Opdater screenshots ved UI-ændringer

## Vedligeholdelse

### Ved funktionsændring
1. Identificer berørte vejledninger
2. Opdater relevante trin
3. Tag nye screenshots hvis nødvendigt
4. Opdater versionsnummer

### Versionering
```
Guide til Ejer v2.3 (Februar 2026)
- Opdateret: Tilføjet trin for ny import-funktion
- Ændret: Screenshots opdateret til nyt design
```

### Quick Guide
Udover detaljerede vejledninger vedligeholdes en **Quick Guide** (1-2 sider) med de mest almindelige handlinger i kort format.
