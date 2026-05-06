# Koordinator Workplan: Banedanmark Roller -> Agent Harness

## Scope
Analyse af 213 funktionsbeskrivelser (PDF) fra `Funktions- og stillingsbeskrivelser/FB/` med henblik på at kortlægge dækning mod eksisterende agent-harness.

## Eksisterende Harness
- **27 aktive agenter** i `agent-roster.json` (inkl. 11 Iqra-baserede)
- **10 Banedanmark placeholder-agenter** i `.vscode/.codex/agents/banedanmark/`
- **73 aktive skills** i `.vscode/.codex/skills/`
- **Samlet: 37 agentprofiler**

## Kategorisering af 213 Roller

| Domæne | Antal | Eksisterende Agent Dækning |
|--------|-------|---------------------------|
| Bygge og Udførelse | 15 | bd-byggeleder, bd-fagansvarlig-spor, Hassan Dahir |
| Projektering og Design | 23 | bd-projekteringsleder, Interface Manager |
| Trafik og Drift | 29 | Begrænset - kun få direkte agent-match |
| Sikkerhed og Beredskab | 16 | bd-sikkerhedskoordinator, bd-miljoekoordinator |
| Kontrakt og Jura | 5 | bd-kontraktmanager, Joël Mulongo |
| Kvalitet og Dokumentation | 36 | bd-dokumentcontroller, bd-kvalitetsspecialist |
| IT og System | 24 | Begrænset - tekniske system-roller mangler |
| Materiel og Teknik | 17 | Begrænset - materiel-roller mangler |
| Ledelse og Styring | 15 | Ahmad El-Wali, Sabina, bd-oekonomi-controller |
| Kompetence og Uddannelse | 6 | Begrænset |
| Økonomi og Forvaltning | 3 | bd-oekonomi-controller |
| Bro og Anlæg | 3 | Begrænset |
| Test og Validering | 15 | bd-ibrugtagning, bd-kvalitetsspecialist |
| Udgået | 4 | Ingen |

## Workstream Design

### Agent 2: Katalog Agent
- Kategoriser alle 213 roller med præcis filnavn-referencer
- Flag UDGÅET roller
- Output: `temp/agent2_catalog.md`

### Agent 3: Mapping Agent
- Kortlægning af 37 eksisterende agenter -> PDF-roller
- Confidence scoring per match
- Output: `temp/agent3_mapping.md`

### Agent 4: Gap Agent
- Identificer top 20 manglende roller
- Forslag til nye agentprofiler
- Output: `temp/agent4_gaps.md`

### Agent 5: Tekniske Roller Analyst
- Fokus: Projektering, byggeledelse, fagtilsyn, CSM
- Anbefalinger til bd-* placeholder berigelse

### Agent 6: Admin & Management Analyst
- Fokus: Kontrakt, økonomi, planlægning, ledelse
- Governance-flow analyse

### Agent 7: Sikkerhed & Miljø Analyst
- Fokus: Jernbanesikkerhed, CSM/TSI, beredskab
- Compliance-krav mapping

### Agent 8: QA Agent
- Krydsreference-validering
- Dublet-detektion
- Naming-konvention audit

### Agent 9: Report Synthesizer
- Samler alle rapporter
- Producerer endelig audit-rapport
- Output: `reports/AUDIT_YYYY-MM-DD_Banedanmark_Roles.md`

## Succeskriterier
- [ ] Alle 213 roller kategoriseret
- [ ] Mapping-dækning > 80% af kritiske roller
- [ ] Top 20 gaps identificeret med prioritering
- [ ] Mindst 5 placeholder-agenter har berigelsesplan
- [ ] Ingen dubletter eller inkonsistenser i mapping

## Begrænsninger
- PDF-indhold kan ikke læses i dette miljø
- Analyse er baseret på filnavne + eksisterende agent-data
- Faktisk domæneviden kræver manuel verifikation
