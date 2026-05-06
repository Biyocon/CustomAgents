# Avatar↔Agent Mapping Analyse

**Dato:** 2026-05-06  
**Projekt:** Kvalifikationsordning Entreprenør  
**Mapper:** `Avatar/`, `Avatar/agents/`, `Avatar/agents.bak-2026-05-06/`  
**Referencer:** `0_avatar_generatio_prompt.txt`, `1_Prompt_custom_12_avatars.md`, `1_Prompt_custom_billede_avatars.txt`

---

## 1. Executive Summary

Der findes **to adskilte avatar-familier** i projektet:

| Familie | Antal billeder | Agent-MD | Status |
|---------|---------------|----------|--------|
| **(A) Banedanmark-agenter** | 27 individuelle billeder + 1 batch-sheet | 37 aktive .md-filer | ✅ Primær, aktiv |
| **(B) IQRA-agenter** | 0 billeder, 0 .md-filer | 0 | ⚠️ Defineret i prompt, men uimplementeret |

**Nøgletal:**
- **25** avatar-billeder har direkte 1:1-mapping til en agent `.md`-fil.
- **2** Ahmad-varianter (JPEG) mappes til samme agent (`ahmad-el-wali`).
- **11** agent-filer er "virtuelle" — de har `.md` men intet billede.
- **0** billeder mangler en agent-fil (undtagen batch-sheet).
- **12** IQRA-agenter fra `1_Prompt_custom_12_avatars.md` har hverken billede eller agent-fil.

---

## 2. Image → Agent Mapping (25 mapped + 2 variants)

Alle individuelle avatar-billeder er mappet. Nedenstående tabel viser de **kritiskste** poster:

| # | Billedfil | Agent `.md` | Status | Bemærkning |
|---|-----------|-------------|--------|------------|
| 1 | `Yunus_Udbudskonsulent.png` | `yunus-udbudskonsulent.md` | ✅ | Reference-template |
| … | *(23 flere korrekte mappings)* | | ✅ | |
| 25 | `Ahmad_Sektionschef.jpeg` | `ahmad-el-wali.md` | ⚠️ | **Mismatch**: agent forventer `Ahmad_El-Wali_Strategic_Engineering_Leader.png` |
| 25b | `Ahmad_Sektionschef_002.jpeg` | `ahmad-el-wali.md` | ⚠️ | Variant af #25 |

### 2.1 Navneafvigelser (ikke-kritiske, men dokumentérbare)

| Billedfil | Roster/agent navn | Issue |
|-----------|-------------------|-------|
| `Sibqah_Finance_Analytics_Specialist.png` | Sibgha | Stavefejl i filnavn |
| `Siamak_Folkeskole Lære.png` | Siamak Folkeskolelærer | Stavefejl + mellemrum |
| `The Game_Elektrikker.png` | The Game Elektriker | Stavefejl i filnavn |
| `Joël Mulongo_Udbudskonsulent.png` | Joël Mulongo Udbudsjurist | Rolle-label mismatch |

> **Anbefaling:** Omdøb **ikke** eksisterende billedfiler — det kan ødelægge referencer. Dokumentér aliaser i roster og agent-filer i stedet.

---

## 3. Agent → Image Mapping (37 aktive .md-filer)

### 3.1 Agenter MED billede (26 unikke agenter)

Alle 26 unikke persona-agenter (inkl. Ahmad) har et tilknyttet billede.

### 3.2 Virtuelle agenter UDEN billede (11 stk.)

Følgende agent-filer eksisterer men refererer til ikke-eksisterende billeder:

| Agent-ID | Forventet billede | Type | Noter |
|----------|-------------------|------|-------|
| `bro-inspektoer` | `Bro_Inspektoer.png` | Standard | Banedanmark-rolle |
| `configuration-manager-project-level` | — | Projekt-rolle | Generisk titel |
| `contract-manager-project-level` | — | Projekt-rolle | Generisk titel |
| `document-manager-project-level` | — | Projekt-rolle | Generisk titel |
| `gis-specialist` | `GIS_Specialist.png` | Standard | Banedanmark-rolle |
| `hassan-dahir` | `Hassan_Dahir_Technical_Interface_Product_Owner.png` | **IQRA** | Multi-role super-agent; source: `Iqra-main` |
| `incident-manager` | — | Projekt-rolle | Generisk titel |
| `interface-manager-project-level` | — | Projekt-rolle | Generisk titel |
| `projekteringsleder` | `Projekteringsleder.png` | Standard | Banedanmark-rolle |
| `si-manager-csm-interoperabilitet` | — | Standard | SI Manager |
| `test-manager-project-level` | — | Projekt-rolle | Generisk titel |

> **Vurdering:** De 10 projekt-rolle agenter er sandsynligvis **bevidst virtuelle** — de repræsenterer funktionsbeskrivelser frem for personificerede maskotter. `hassan-dahir` er den eneste personificerede agent uden billede.

---

## 4. Prompt-fil Analyse

### 4.1 `0_avatar_generatio_prompt.txt` (Master)
- **Sprog:** Engelsk
- **Stil:** 3D clay-mascot, bold typography, white background
- **Roster:** 25 agenter (linje 21–45)
- **Status:** Aktiv, opdateret 2026-05-06
- **Mangler:** Ahmad er **ikke** med i rosteren (billedet findes, agent findes)

### 4.2 `1_Prompt_custom_12_avatars.md` (IQRA)
- **Sprog:** Engelsk
- **Stil:** Soft 3D clay, glossy, pastel, circular crop
- **Roster:** 12 agenter (Abdi Malik, Abdul Badi, …, Abdul Raqib)
- **Status:** **Uimplementeret** — ingen billeder, ingen agent-filer
- **Potentiel kilde:** `Avatar/Iqra-main.zip` (58 MB)

### 4.3 `1_Prompt_custom_billede_avatars.txt` (Single-template)
- **Sprog:** Dansk/engelsk
- **Scope:** Enkelt-avatar generation
- **Status:** Aktiv

---

## 5. IQRA-afklaring

**Spørgsmål:** Er de 12 IQRA-agenter fra `1_Prompt_custom_12_avatars.md` historisk reference eller aktivt krav?

**Fakta:**
- To agenter (`ahmad-el-wali`, `hassan-dahir`) har frontmatter `source: "Iqra-main/lib/agents/src/index.ts"`.
- `Iqra-main.zip` (58 MB) ligger i `Avatar/` som potentiel kilde.
- De 12 IQRA-navne overlapper **ikke** med de 25 Banedanmark-navne.

**Hypotese:** `1_Prompt_custom_12_avatars.md` er en **tidlig prototype** for et separat IQRA-produkt, mens `ahmad-el-wali` og `hassan-dahir` er "stowaways" der blev migreret ind i Banedanmark-sættet. De 12 Abdul-/Abdi-navne har aldrig fået genereret billeder i dette projekt.

---

## 6. Anbefalinger

| # | Anbefaling | Prioritet |
|---|------------|-----------|
| 1 | **Opdater `ahmad-el-wali.md` avatar-sti** til `../2_Avatar_Agent_Ahmad_Sektionschef.jpeg` | 🔴 Høj |
| 2 | **Tilføj Ahmad til `0_avatar_generatio_prompt.txt` roster** som #26 | 🔴 Høj |
| 3 | **Fastslå om `hassan-dahir` skal have billede** — generér eller behold som virtuel | 🟡 Mellem |
| 4 | **Beslut skæbne for 12 IQRA-agenter** — implementér, arkivér eller fjern prompt-fil | 🟡 Mellem |
| 5 | **Dokumentér stavealiaser** (`Sibqah`→`Sibgha`, `Lære`→`lærer`, `Elektrikker`→`Elektriker`) i roster | 🟢 Lav |
| 6 | **Beslut om 10 virtuelle projekt-roller skal have billeder** | 🟢 Lav |

---

## 7. Assumptions & Open Questions

1. **Ahmad-identitet:** Antages at `Ahmad_Sektionschef` og `Ahmad El-Wali` er samme persona. Hvis ikke, skal der oprettes en separat agent-fil.
2. **IQRA-scope:** Antages at `1_Prompt_custom_12_avatars.md` er historisk reference. Hvis aktivt krav, skal `Iqra-main.zip` udpakkes og billeder genereres.
3. **Projekt-roller:** Antages at de 10 virtuelle agenter er bevidst virtuelle (funktionsbeskrivelser uden maskot).
4. **Backup-retention:** `agents.bak-2026-05-06/` indeholder 21 filer (1.4 MB). Antages at være pre-migration backup.

---

## 8. Bilag: Filstruktur

```
Avatar/
├── 0_avatar_generatio_prompt.txt          # Master prompt (25 agenter)
├── 1_Prompt_custom_12_avatars.md          # IQRA prompt (12 agenter, uimplementeret)
├── 1_Prompt_custom_billede_avatars.txt    # Single-avatar template
├── 2_Avatar_Agent_{navn}_{rolle}.png      # 25 individuelle billeder
├── 2_Avatar_Agent_Ahmad_Sektionschef.jpeg # + variant _002.jpeg
├── ChatGPT Image ... PM.png               # Batch reference sheet
├── Iqra-main.zip                          # Potentiel IQRA-kilde (58 MB)
├── agents/
│   ├── System_Prompt_Agent_{id}.md        # 37 aktive agent-prompts
│   └── System_Prompt_Agent_Yunus_Udbudskonsulent.txt  # Legacy (1 fil)
└── agents.bak-2026-05-06/
    └── System_Prompt_Agent_{id}.md        # 21 backup-filer
```

---

*Rapport genereret af Kimi Code CLI som led i Fase 2 + Fase 11 avatar-harness opgave.*
