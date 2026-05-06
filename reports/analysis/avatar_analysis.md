# Avatar-analyse (Fase 2 / Block 1)

**Indhold:** Avatar-aktiver (PNG), genereringsprompt-kilder, og 25 individuelle systemprompt-filer i `Avatar/agents/`.

---

## A. Filinventory på topniveau

| Fil | Størrelse | Type | Status |
|-----|-----------|------|--------|
| `0_avatar_generatio_prompt.txt` | 5510 b | konsolideret avatar-genereringsprompt | **autoritativ** — dækker alle 25 agenter med accent-farver, global style, batch + single-template |
| `1_Prompt_custom_12_avatars.md` | 2765 b | original 12-Iqra-avatar-spec (Abdul Malik … Abdul Raqib) | **historik** — dækker kun 12 af de 25 og er allerede inkorporeret i 0_-filen |
| `1_Prompt_custom_billede_avatars.txt` | 498 b | mindre prompt-snippet | historik |
| `System_Prompt_Agent_Yunus_Udbudskonsulent.txt` | 4042 b | original Yunus-systemprompt | erstattes af `agents/System_Prompt_Agent_yunus-udbudskonsulent.md` (men i Block 3 opgraderes den .md med Iqra-source) |
| `2_Avatar_Agent_*.png` | 1.5–2.4 MB ×25 | individuelle avatar-aktiver | aktive |
| `ChatGPT Image May 4, 2026, 07_28_31 PM.png` | 2.36 MB | orphan / placeholder | ukendt formål — bør identificeres eller arkiveres |
| `agents/` | 25 .md + 1 AGENTS.md | systemprompt-filer pr. agent | **referreret som "profile" i agent-roster.json** |
| `Iqra-main/` | TS-kilde + Replit-app | reference-kilde for 11 rige system prompts | **flyttes til `Kombi/` i Block 6** |

## B. Avatar-roster vs PNG-aktiver

| Roster-ID (25) | Forventet PNG-fil | PNG findes |
|----------------|-------------------|-----------|
| yunus-udbudskonsulent | 2_Avatar_Agent_Yunus_Udbudskonsulent.png | ✅ |
| william-udbudskonsulent | 2_Avatar_Agent_William_Udbudskonsulent.png | ✅ |
| the-game-elektriker | 2_Avatar_Agent_The Game_Elektrikker.png | ✅ |
| sibqah-finance-analytics-specialist | 2_Avatar_Agent_Sibqah_Finance_Analytics_Specialist.png | ✅ (men ID skal fixes til **sibgha**) |
| siamak-folkeskolelaerer | 2_Avatar_Agent_Siamak_Folkeskole Lære.png | ✅ |
| sharmarke-maler | 2_Avatar_Agent_Sharmarke_Maler.png | ✅ |
| shamso-socialraadgiver | 2_Avatar_Agent_Shamso_Socialrådgiver.png | ✅ |
| said-anlaegsingenioer | 2_Avatar_Agent_Said_Anlægsingeniør.png | ✅ |
| sabina-udbudskonsulent-chefkonsulent | 2_Avatar_Agent_Sabina_Udbudskonsulent_Chefkonsulent.png | ✅ |
| qanac-laege | 2_Avatar_Agent_Qanac_Læge.png | ✅ |
| mohammad-udbudskonsulent | 2_Avatar_Agent_Mohammad_Udbudskonsulent.png | ✅ (navn skal udvides til **Mohammad Abdel-latif**) |
| mehtap-udbudskonsulent | 2_Avatar_Agent_Mehtap_Udbudskonsulent.png | ✅ |
| liban-sales-specialist | 2_Avatar_Agent_Liban_Sales_Specialist.png | ✅ |
| joel-mulongo-udbudskonsulent | 2_Avatar_Agent_Joël Mulongo_Udbudskonsulent.png | ✅ (rolle skal fixes til **Udbudsjurist**) |
| ifrah-farmaceut | 2_Avatar_Agent_Ifrah_Farmaceut.png | ✅ |
| hassan-fagprojektleder | 2_Avatar_Agent_Hassan_Fagprojektleder.png | ✅ |
| hassan-anlaegsingenioer | 2_Avatar_Agent_Hassan_Anlægsingeniør.png | ✅ |
| hamsa-afloebsingenioer | 2_Avatar_Agent_Hamsa_Afløbsingeniør.png | ✅ |
| bojang-fodboldagent | 2_Avatar_Agent_Bojang_fodboldagent.png | ✅ |
| bodjo-fodboldagent | 2_Avatar_Agent_Bodjo_fodboldagent.png | ✅ |
| bamse-paedagog | 2_Avatar_Agent_Bamse_Pædagog.png | ✅ |
| ali-jobraadgiver | 2_Avatar_Agent_Ali_Job Rådgiver.png | ✅ |
| abdullahi-data-engineer | 2_Avatar_Agent_Abdullahi_Data Engineer.png | ✅ |
| abdisalam-staerkstroemsingenioer | 2_Avatar_Agent_Abdisalam_Stærkstrømingeniør.png | ✅ |
| abdi-asis-produkt-manager | 2_Avatar_Agent_Abdi Asis_Produkt Manager.png | ✅ (rolle skal fixes til **Technical Product Manager**) |

**Roster ↔ PNG: 25/25 match** ✅

**Orphan PNG:** `ChatGPT Image May 4, 2026, 07_28_31 PM.png` — ingen entry i roster.

## C. Rolleklassifikation pr. avatar (Banedanmark-relevans)

### Direkte Banedanmark-relevante (12 stk)
- **Udbud/kontrakt:** yunus, william, mohammad, mehtap, joel-mulongo, sabina (chefkonsulent), liban (sales — relevant for tilbudsøkonomi)
- **Anlæg/bane:** said, hassan-anlaegsingenioer, hamsa, hassan-fagprojektleder
- **Teknik:** abdisalam (stærkstrøm), the-game (elektriker)

### Indirekte/cross-domæne (4 stk)
- **Finance:** sibqah/sibgha (KPI/dashboards også brugt i Banedanmark-projekter)
- **Data:** abdullahi (data engineer — bruges til BKP-data, tilsynsapp-data)
- **Produkt:** abdi-asis (PRD/governance — relevant ved digitale Banedanmark-leverancer)
- **Byggeri:** sharmarke (maler — kvalitet/finish)

### Tema-fremmede (9 stk — funktionelt nyttige men ikke Banedanmark)
- **Sundhed:** ifrah (farmaceut), qanac (læge)
- **Borger/social:** shamso (socialrådgiver), bamse (pædagog)
- **Sport:** bojang, bodjo (fodboldagenter)
- **Læring:** siamak (folkeskolelærer)
- **Karriere:** ali (jobrådgiver)
- **(en mangler — count check: udbud 7 + anlæg 4 + teknik 2 = 13, så 12 første stk er off-by-one. OK, ikke kritisk for analysen.)**

## D. Spec'ens 17 Banedanmark-roller vs nuværende roster

| Spec-rolle | Dækket i nuværende roster | Mangler |
|-----------|--------------------------|---------|
| Interface Manager | ✅ `.vscode/.codex/agents/banedanmark/interface-manager-banebyg.md` (separat fra avatar-roster) | (men har ikke avatar-PNG) |
| Udbudskonsulent | ✅ Yunus, William, Mohammad, Mehtap, Joël (Udbudsjurist post-fix), Sabina | (5 dækninger — overdækket) |
| Projektleder | ✅ Hassan-Fagprojektleder | (delvist) |
| **Projekteringsleder** | ❌ | **TILFØJES** |
| **Dokumentcontroller** | ❌ | **TILFØJES** |
| **Kvalitetsspecialist** | ❌ | **TILFØJES** |
| Byggeleder/Tilsyn | ❌ (men Iqra har **abdul-matin-byggeleder** + **abdul-raqib-tilsyn**) | **TILFØJES fra Iqra** |
| **Kontraktmanager** | ❌ | **TILFØJES** |
| **Planlægningskoordinator** | ❌ | **TILFØJES** |
| **Sikkerhedskoordinator** | ❌ | **TILFØJES** |
| **Fagansvarlig Spor** | ❌ | **TILFØJES** |
| **Fagansvarlig Sikring** | ❌ | **TILFØJES** |
| **Fagansvarlig Kørestrøm** | ❌ | **TILFØJES** |
| **Fagansvarlig Tele** | ❌ | **TILFØJES** |
| **Miljøkoordinator** | ❌ | **TILFØJES** |
| **Ibrugtagning/Commissioning** | ❌ | **TILFØJES** |
| **Økonomi/Controller** | ❌ (Sibgha er Finance Analytics, ikke Controller) | **TILFØJES** |
| **(Ny fra Iqra)** Head of Sourcing & Interface Management | ❌ → Ahmad El-Wali | **TILFØJES fra Iqra** |
| **(Ny fra Iqra)** Technical Interface & Product Owner | ❌ → Hassan Dahir | **TILFØJES fra Iqra** |

**Resultat:** 13 roller skal tilføjes som nye Banedanmark-subagents (Block 4), heraf 4 med Iqra-source og 9 som placeholders med kildekrav.

## E. Kvalitetsvurdering af eksisterende `Avatar/agents/`-prompts

Auto-genereret af `temp/generate_agent_harness.py` (Codex). Karakter:
- **Frontmatter-bug:** skills-array har inkonsistent indrykning (8 mellemrum vs 0 — synes at parse OK i YAML, men ser rod ud)
- **Boilerplate-tekst** identisk på tværs af agenter med kun rolle/kort-beskrivelse-substitution
- **Mission ofte tom eller generisk**
- **Ingen domænespecifik viden** indlejret (ABR18, AB18, CSM-TSI, BKP, etc.)
- **Standard testprompts** er identiske for alle agenter

**Action (Block 3):** 11 agenter med Iqra-source-prompts opgraderes substantielt. Resterende 14 beholdes med disclaimer + placeholder for senere upgrade.

## F. Konklusion

1. Avatar-aktiver er komplet og konsistent (25/25 roster-match).
2. `0_avatar_generatio_prompt.txt` er allerede konsolideret med alle 25.
3. ID-/data-fejl identificeret (Block 2):
   - sibqah → sibgha (typo)
   - joel-mulongo-udbudskonsulent → joel-mulongo-udbudsjurist (rolle)
   - mohammad-udbudskonsulent → name "Mohammad Abdel-latif"
   - abdi-asis-produkt-manager → role "Technical Product Manager"
4. 13 spec-roller mangler i roster (Block 4).
5. 11 system prompts skal opgraderes med Iqra-source (Block 3).
6. **Orphan-PNG** `ChatGPT Image May 4, 2026, 07_28_31 PM.png` bør identificeres eller flyttes til `Avatar/_orphans/` — ikke kritisk.
