# Agent 4: Gap Analyse - Manglende Agent Profiler

## Executive Summary
Af 213 Banedanmark roller er ca. **60-70% dækket** af eksisterende agentprofiler (enten direkte match eller tæt relateret). De største gaps findes i **Trafik/Drift**, **IT/System**, og **Materiel**.

## Top 20 Prioriterede Gaps

| # | PDF-rolle | Foreslået Agent ID | Kategori | Prioritet | Rationale |
|---|-----------|---------------------|----------|-----------|-----------|
| 1 | Trafikleder Fjern / S-bane | bd-trafikleder | Trafik og Drift | HØJ | 80+ medarbejdere i Banedanmark har denne rolle. Kernekompetence. |
| 2 | Togleder S-bane | bd-togleder | Trafik og Drift | HØJ | Driftskritisk rolle. Mangler fuldstændigt. |
| 3 | Lokomotivfører (LKF) | bd-lokomotivfoerer | Trafik og Drift | MEDIUM | Driftsrolle. Specifik men vigtig. |
| 4 | Systemadministrator for Infrastruktur | bd-systemadministrator | IT og System | HØJ | IT-infrastruktur er kritisk for BaneByg. |
| 5 | IT Consultant (DTC/JTL) | bd-it-konsulent | IT og System | MEDIUM | Generisk IT-rolle. Brede kompetencer. |
| 6 | Data Manager / Data-koordinator | bd-data-manager | IT og System | MEDIUM | Datahåndtering er central i BKP. |
| 7 | GIS-specialist / GIS-assistent | bd-gis-specialist | IT og System | MEDIUM | GIS er vigtigt for infrastrukturprojekter. |
| 8 | Materielkoordinator | bd-materielkoordinator | Materiel og Teknik | HØJ | Rullende materiel er kernen i Banedanmark. |
| 9 | ECM Fagansvarlig, Rullende Materiel | bd-rullende-materiel | Materiel og Teknik | HØJ | ECM (Ørestad) er centralt. |
| 10 | Bro-inspektør / Brofoged / Brovagt | bd-bro-og-anlaeg | Bro og Anlæg | MEDIUM | Broer er sikkerhedskritiske. |
| 11 | Kompetenceassistent | bd-kompetenceassistent | Kompetence og Uddannelse | MEDIUM | Understøtter ledernes kompetencestyring. |
| 12 | Kørelærer Infrastruktur | bd-koerelaerer | Kompetence og Uddannelse | MEDIUM | Uddannelsesrolle. |
| 13 | Underviser / Training Developer | bd-underviser | Kompetence og Uddannelse | LOW | Bred uddannelsesrolle. |
| 14 | Økonomikoordinator / Økonomisupporter | (udvid bd-oekonomi-controller) | Økonomi | LOW | Allerede delvist dækket. |
| 15 | Landsdækkende tilsynsspecialist | bd-tilsynsspecialist | Kvalitet | MEDIUM | Tilsyn er relevant for kvalitetsagent. |
| 16 | Vagthavende trafikleder / Vagtleder | bd-vagthavende-trafikleder | Trafik og Drift | MEDIUM | Driftsrolle. Tæt på Trafikleder. |
| 17 | Driftsansvarlig Person DAP | bd-driftsansvarlig | Trafik og Drift | MEDIUM | Driftsansvarlig rolle. |
| 18 | Køreplanlægger | bd-koereplanlaegger | Trafik og Drift | MEDIUM | Planlægningsrolle i trafik. |
| 19 | Lods, Infrastruktur | bd-lods | Trafik og Drift | LOW | Infrastruktur-lods. Niche. |
| 20 | Implementeringskoordinator for Lovkrav | bd-implementeringskoordinator | Kvalitet | LOW | Lovkrav-implementering. |

## Statistik

| Måling | Antal |
|--------|-------|
| Totale PDF-roller | 213 |
| Udgået roller | 4 |
| Aktive roller | 209 |
| Dækket af eksisterende agent (high confidence) | ~45 |
| Dækket af eksisterende agent (medium confidence) | ~55 |
| Delvist dækket / tæt relateret | ~35 |
| Ikke dækket (gaps) | ~74 |
| **Dækningsprocent** | **~65%** |

## Domæne-specifikke Gaps

### Trafik og Drift (største gap)
- 29 roller, kun ~3 dækket
- Kerneroller: Trafikleder, Togleder, Lokomotivfører, Driftsansvarlig, Køreplanlægger
- **Anbefaling**: Opret bd-trafikleder som primær agent; driftsroller kan grupperes

### IT og System (stort gap)
- 24 roller, kun ~2 dækket
- Kerneroller: Systemadministrator, IT Consultant, Data Manager, GIS-specialist
- **Anbefaling**: Opret bd-it-infrastruktur agent; data/GIS kan evt. underagent

### Materiel og Teknik (stort gap)
- 17 roller, kun ~2 dækket
- Kerneroller: Materielkoordinator, ECM Fagansvarlig, Svejseansvarlig
- **Anbefaling**: Opret bd-materiel agent; ECM-rullende-materiel som sub-agent

### Kompetence og Uddannelse (mindre gap)
- 6 roller, kun ~1 dækket
- Kerneroller: Kompetenceassistent, Kørelærer, Underviser
- **Anbefaling**: Udvid bd-kvalitetsspecialist med kompetencekomponenter

## Anbefalede Nye Agenter (prioriteret)

1. **bd-trafikleder** (Trafik og Drift) — høj prioritet
2. **bd-systemadministrator** (IT og System) — høj prioritet
3. **bd-materielkoordinator** (Materiel og Teknik) — høj prioritet
4. **bd-koerelaerer** (Kompetence og Uddannelse) — medium prioritet
5. **bd-bro-og-anlaeg** (Bro og Anlæg) — medium prioritet
