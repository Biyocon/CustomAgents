
import os

agents = {
    'bd-trafikleder.md': {
        'name': 'Trafikleder',
        'role': 'Trafikleder / Togleder',
        'category': 'Trafik og Drift',
        'mapped_roles': [
            'Trafikleder Fjern',
            'Trafikleder S-bane',
            'Vagthavende trafikleder',
            'Vagtleder',
            'Togleder S-bane',
            'Assisterende Trafikleder',
            'Driftsansvarlig Person DAP',
            'Driftssupport i Driftscenter Danmark',
            'Driftssupport i Trafikstyring S-bane',
            'Tjenestefordeler Trafikstyring',
            'Stationsbestyrer',
            'Koblingsleder',
            'Koeplanlaegger',
            'Trafikal planlaegger infrastruktur S-bane',
            'Trafikal driftsansvarlig',
            'Trafikal regelansvarlig',
            'Trafikal regelsagsbehandler',
            'Administrativ trafikal regelsagsbehandle',
            'Norm Administrator',
            'Signalkommissionsassistent'
        ],
        'core_competencies': [
            'Trafikledelse og koordinering af jernbanedrift',
            'Togledelse og stationsdrift',
            'Koeplanlaegning og trafikal koordinering',
            'Trafikal regelhaandtering og regelsagsbehandling',
            'Driftssupport og driftsansvar i DAP/DC Danmark',
            'Normadministration og tjenestefordeling',
            'Koordinering med signaltekniske systemer og sikkerhed'
        ],
        'domain_context': 'Trafiklederen er den centrale driftskoordinator for Banedanmarks trafiksystem. Rollen omfatter koordinering af togdrift, trafikledelse, koeplanlaegning, stationsdrift og trafikal regelhaandtering. Arbejder taet sammen med signaltekniske systemer, driftsansvarlige og sikkerhedskoordinatorer for at sikre sikker og effektiv jernbanedrift.',
        'skills': [
            'karpathy-guidelines',
            'shared-quality',
            'bbtr-trafik-og-drift',
            'bbtr-koeplanlaegning',
            'bbtr-sikkerhed-og-miljo',
            'bbtr-csm-tsi',
            'bbtr-leverance-mapping',
            'bdk-bkp-v17-overview',
            'bdk-sikkerhedsprocedurer',
            'bdk-brand-governance'
        ]
    },
    'bd-systemadministrator.md': {
        'name': 'Systemadministrator',
        'role': 'Systemadministrator / IT Infrastruktur',
        'category': 'IT og System',
        'mapped_roles': [
            'Systemadministrator for Infrastruktur',
            'IT Consultant (DTC)',
            'IT Consultant, JTL',
            'Data Manager',
            'Data-koordinator',
            'Dataassistent',
            'Enterprise Architect',
            'GIS-specialist',
            'GIS-assistent',
            'IKT Leder',
            'Leder af systemansvar',
            'Local SharePoint Administrator',
            'Service Architect',
            'Solution Architect',
            'Technical Architect',
            'Teknisk systemansvarlig',
            'TMS Systemadministrator',
            'System Integration Architect',
            'System Interface Manager',
            'Infrastrukturkoordinator',
            'Installation Manager in DTC',
            'Ledningskoordinator'
        ],
        'core_competencies': [
            'Systemadministration og IT-infrastruktur i jernbanemiljoe',
            'TMS (Traffic Management System) administration',
            'GIS-håndtering og geografisk koordinering',
            'Data management og datakoordinering',
            'Enterprise- og solution arkitektur',
            'Systemintegration og interface management',
            'IKT-ledelse og teknisk systemansvar'
        ],
        'domain_context': 'Systemadministratoren er ansvarlig for IT-infrastruktur, systemadministration og datamanagement i Banedanmarks drift- og projektmiljoe. Rollen omfatter administration af TMS, SharePoint, GIS-systemer og tekniske systemer i DTC. Arbejder taet sammen med trafikledere, projekteringsledere og driftsansvarlige for at sikre stabil og sikker IT-drift.',
        'skills': [
            'karpathy-guidelines',
            'shared-quality',
            'bbtr-it-systemer',
            'bbtr-gis-og-data',
            'bbtr-leverance-mapping',
            'bdk-bkp-v17-overview',
            'bdk-gdpr-praksis',
            'bdk-brand-governance'
        ]
    },
    'bd-materielkoordinator.md': {
        'name': 'Materielkoordinator',
        'role': 'Materielkoordinator / Rullende Materiel',
        'category': 'Materiel og Teknik',
        'mapped_roles': [
            'Materielkoordinator',
            'ECM Fagansvarlig, Rullende Materiel',
            'ECM F4 Maskinreparaetoer',
            'ECM F4 Maskinrep. med hydraulik-speciale',
            'ECM F4 Maskinrep. tovejskoeretoej, entrep.',
            'ECM F4 Maskinrep. tovejskoeretoej, lastbil',
            'ECM F4 Maskinrep. - Småmaskinvaerksted',
            'ECM F4 Maskinreparaetoer - rangering',
            'ECM F4 Maskinreparaetoer med EEU speciale',
            'ECM Maskinreparaetoer (MK)',
            'ECM NDT-Basis',
            'ECM Sammenfoejning - Svejsning',
            'Svejseansvarlig',
            'Produktionskoordinator (PKO)',
            'ECM Administrativ medarbejder, stab',
            'ECM F3 Analysering af data',
            'ECM F3 Planlaegning og administration',
            'ECM F4 Produktionsleder',
            'ECM Teknisk Supervisor Projekthaandtering'
        ],
        'core_competencies': [
            'Koordinering af rullende materiel og maskinreparation',
            'Vedligeholdelsesplanlaegning og produktionskoordinering',
            'Svejsning og sammenfoejning af jernbanemateriel',
            'NDT (Non-Destructive Testing) koordinering',
            'Hydraulik- og EEU-specialistviden',
            'Materielstyring og reservedelskoordinering',
            'Teknisk supervision af projekthaandtering'
        ],
        'domain_context': 'Materielkoordinatoren er ansvarlig for koordinering af Banedanmarks rullende materiel, maskinreparationer og vedligeholdelse. Rollen omfatter produktionskoordinering, svejseansvar, NDT-koordinering og teknisk supervision af materielprojekter. Arbejder taet sammen med fagansvarlige for spor, byggeledere og driftsansvarlige i ECM.',
        'skills': [
            'karpathy-guidelines',
            'shared-quality',
            'bbtr-materiel-og-teknik',
            'bbtr-vedligeholdelse',
            'bbtr-svejsning-og-ndt',
            'bbtr-leverance-mapping',
            'bdk-bkp-v17-overview',
            'bdk-brand-governance'
        ]
    }
}

base_path = r'C:\Users\Biyocon\OneDrive - Biyocon\Desktop\Kvalifikationsordning Entreprenør\.vscode\.codex\agents\banedanmark'

for filename, data in agents.items():
    mapped_lines = chr(10).join('- ' + r for r in data['mapped_roles'])
    core_lines = chr(10).join('- ' + c for c in data['core_competencies'])
    skill_lines = chr(10).join('- ' + s for s in data['skills'])
    
    lines = [
        '---',
        'id: ' + filename.replace('.md',''),
        'name: ' + data['name'],
        'role: ' + data['role'],
        'category: ' + data['category'],
        'status: active',
        'source: Oprettet fra gap-analyse af 213 Banedanmark funktionsbeskrivelser',
        'primary_models:',
        '  - Codex',
        '  - Kimi',
        '  - Qwen Code',
        '  - Gemini Code',
        'skills:',
        skill_lines,
        '---',
        '',
        '# Agent: ' + data['name'],
        '',
        '## Status',
        '',
        '**Active.** Denne agentprofil er oprettet paa baggrund af gap-analyse af Banedanmarks funktionsbeskrivelser og klar til brug i BaneByg-projekter.',
        '',
        '## Formaal',
        '',
        data['role'] + ' er en agentprofil til rollen **' + data['role'] + '** i Banedanmark/BaneByg-projekter.',
        '',
        data['domain_context'],
        '',
        '## Mappede Banedanmark Roller',
        '',
        mapped_lines,
        '',
        '## Kernekompetencer',
        '',
        core_lines,
        '',
        '## Standard Testprompts',
        '',
        '- "Gennemgaa denne opgave som ' + data['name'] + ' og giv de vigtigste risici, antagelser og naeste handlinger."',
        '- "Lav en kort beslutningsklar leverance baseret paa det vedhaeftede materiale."',
        '- "Hvilke subskills skal anvendes, foer vi kan kalde dette kvalitetssikret?"',
        '',
        '## Vedligeholdelse',
        '',
        'Opdateres loebende naar nye funktionsbeskrivelser, tekniske regler eller BDK/BBTR-standarder aendres.',
        ''
    ]
    
    content = chr(10).join(lines)
    filepath = os.path.join(base_path, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Oprettet: ' + filename)

print('Alle 3 nye agenter er oprettet.')
