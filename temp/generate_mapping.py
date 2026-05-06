import json
import os
import re
from datetime import datetime

with open('.vscode/.codex/agents/agent-roster.json','r',encoding='utf-8') as f:
    roster = json.load(f)

with open('temp/fb_file_list.txt','r',encoding='utf-8') as f:
    pdfs = [line.strip().lstrip('\ufeff') for line in f if line.strip()]

placeholders = {
    'bd-dokumentcontroller': {'name':'Dokumentcontroller','role':'Dokumentcontroller','category':'Dokumentstyring og kvalitet'},
    'bd-fagansvarlig-spor': {'name':'Fagansvarlig Spor/Sikring/Koerestroem/Tele','role':'Fagansvarlig Spor, Sikring, Koerestroem og Tele','category':'Teknik og udfoerelse'},
    'bd-ibrugtagning': {'name':'Ibrugtagningsansvarlig','role':'Ibrugtagningsansvarlig','category':'Drift og overdragelse'},
    'bd-kontraktmanager': {'name':'Kontraktmanager','role':'Kontraktmanager','category':'Kontrakt og compliance'},
    'bd-kvalitetsspecialist': {'name':'Kvalitetsspecialist','role':'Kvalitetsspecialist','category':'Kvalitet og audit'},
    'bd-miljoekoordinator': {'name':'Miljoe- og baeredygtighedskoordinator','role':'Miljoe- og baeredygtighedskoordinator','category':'Miljoe og baeredygtighed'},
    'bd-oekonomi-controller': {'name':'Oekonomi-controller','role':'Oekonomi-controller','category':'Finans og controlling'},
    'bd-planlaegningskoordinator': {'name':'Planlaegningskoordinator','role':'Planlaegningskoordinator','category':'Planlaegning og koordinering'},
    'bd-projekteringsleder': {'name':'Projekteringsleder','role':'Projekteringsleder','category':'Projektering og design'},
    'bd-sikkerhedskoordinator': {'name':'Sikkerhedskoordinator','role':'Sikkerhedskoordinator','category':'Sikkerhed og miljoe'},
}

mapping_rules = {
    'yunus-udbudskonsulent': (['udbudskonsulent','udbuds','kontrakt','tilbud','evalueringslogik','kravmatrix'],['contract manager','kontraktholder','aftaleansvarlig','udbudsjurist','programme contract manager']),
    'william-udbudskonsulent': (['udbudskonsulent','udbuds','kontrakt','tilbud','forbeholdsreview','kvalitetsbeskrivelser'],['contract manager','kontraktholder','aftaleansvarlig','udbudsjurist','programme contract manager']),
    'the-game-elektriker': (['elektriker','elinstallation','el-sikkerhed','elektrisk','strøm'],['stærkstrøm','starkstrom','el ','elsikkerhed']),
    'sibgha-finance-analytics-specialist': (['finance','økonomi','controller','analyse','analytics','budget','finans'],['økonomikoordinator','økonomisupporter','data manager','data-koordinator']),
    'siamak-folkeskolelaerer': (['folkeskolelærer','underviser','lærer','training developer'],['træning','uddannelse','kørelærer','undervisning']),
    'sharmarke-maler': (['maler','maling'],['overflade','facade']),
    'shamso-socialraadgiver': (['socialrådgiver','social ','borger'],['pædagog','mentor','rådgivning']),
    'said-anlaegsingenioer': (['anlægsingeniør','anlægschef','anlæg ','byggeleder','infrastrukturprojekter'],['byggechef','projektleder infrastruktur','anlægs','infrastruktur']),
    'sabina-udbudskonsulent-chefkonsulent': (['udbudskonsulent','chefkonsulent','udbuds','kontrakt','governance'],['contract manager','kontraktholder','aftaleansvarlig','programme contract manager']),
    'qanac-laege': (['læge','sundhed','helbred','medicinsk'],['sundhedsspecialist','helbredsgodkendelse']),
    'mohammad-udbudskonsulent': (['udbudskonsulent','udbuds','kontrakt','tilbud'],['contract manager','kontraktholder','aftaleansvarlig']),
    'mehtap-udbudskonsulent': (['udbudskonsulent','udbuds','kontrakt','kvalitet','dokumentation'],['contract manager','kontraktholder','aftaleansvarlig','kvalitetssikrer']),
    'liban-sales-specialist': (['sales','salg','positionering','market'],['aftaleansvarlig','kommerciel','business']),
    'joel-mulongo-udbudsjurist': (['udbudsjurist','jurist','jura','legal','retlig'],['contract manager','kontrakt','aftale','bdk-legal']),
    'ifrah-farmaceut': (['farmaceut','apotek','medicin','lægemiddel'],['sundhed','sikkerhed','kvalitet']),
    'hassan-fagprojektleder': (['fagprojektleder','byggeleder','fagtilsyn','projektleder infrastruktur','fagpakke'],['anlægschef','byggechef','kontraktbyggeleder','projekteringsleder']),
    'hassan-anlaegsingenioer': (['anlægsingeniør','anlægschef','anlæg ','infrastrukturprojekter'],['byggeleder','byggechef','infrastruktur','projektleder infrastruktur']),
    'hamsa-afloebsingenioer': (['afløbsingeniør','afløb','kloak','dræn','spildevand'],['vand ','forsyning','infrastruktur']),
    'bojang-fodboldagent': (['fodboldagent','fodbold','sport','talent'],['agent','scout','spiller']),
    'bodjo-fodboldagent': (['fodboldagent','fodbold','sport','talent'],['agent','scout','spiller']),
    'bamse-paedagog': (['pædagog','pædagogik','børne','daginstitution'],['trivsel','mentor','social']),
    'ali-jobraadgiver': (['jobrådgiver','karriere','beskæftigelse','arbejdsmarked'],['mentor','coach','rådgivning','kompetence']),
    'abdullahi-data-engineer': (['data engineer','data manager','data-koordinator','dataassistent','database','automation'],['data ','gis ','it consultant','systemadministrator','it ','technical architect']),
    'abdisalam-staerkstroemsingenioer': (['stærkstrømsingeniør','stærkstrøm','el ','elektrisk','strøm'],['elektriker','el-sikkerhed','energi']),
    'abdi-asis-produkt-manager': (['produkt manager','product owner','produktionsansvarlig','produktionsleder'],['projektejer','program manager','portfolio']),
    'ahmad-el-wali': (['strategic engineering leader','head of sourcing','head of','direktør','administrerende direktør','ledelse','governance','styregruppe'],['områdechef','sektionschef','chef ','leder ','portfolio','contracts']),
    'hassan-dahir': (['byggeleder','fagprojektleder','fagtilsyn','product owner','interface manager','tværfaglig koordinering'],['projekteringsleder','kontraktbyggeleder','byggechef','anlægschef','commissioning']),
    'interface-manager-project-level': (['interface manager','system interface manager','grænseflade','interface '],['integration','koordinering','tværfaglig']),
    'contract-manager-project-level': (['contract manager','kontraktmanager','kontrakt','kontraktholder','aftaleansvarlig'],['udbud','programme contract manager','jurist','legal']),
    'document-manager-project-level': (['document manager','dokumentationsmedarbejder','dokumentejer','dokumentvedligeholder','dokumentcontroller','dokument '],['configuration manager','data manager','information','kvalitet']),
    'configuration-manager-project-level': (['configuration manager','konfiguration','configuration '],['document manager','systemadministrator','teknisk systemansvarlig']),
    'test-manager-project-level': (['test manager','tester','test ','v&v manager','verification','validation'],['kvalitetssikrer','audit','csm ','s&i ']),
    'incident-manager': (['incident manager','hændelse','beredskab','sikkerhed','krise'],['problem manager','sikkerhedskoordinator','undersøgelsesleder']),
    'si-manager-csm-interoperabilitet': (['s&i manager','csm ','interoperabilitet','sikkerheds','sikkerhed ','jernbanesikkerhed'],['test manager','kvalitetssikrer','s&i ','sikkerhedsspecialist','risiko']),
    'projekteringsleder': (['projekteringsleder','projektering','design manager','design & development manager','design authority'],['byggeleder','fagprojektleder','anlægschef','csm-projekteringsleder','senior csm-projekteringsleder']),
    'bro-inspektoer': (['bro-inspektør','bro ','brofoged','brovagt'],['infrastruktur','anlæg ','teknik','inspektør']),
    'gis-specialist': (['gis-specialist','gis-assistent','gis ','geografisk','geodata'],['data-koordinator','data manager','kort ','kortlægning']),
}

placeholder_rules = {
    'bd-dokumentcontroller': (['dokumentcontroller','document manager','dokumentationsmedarbejder','dokumentejer','dokumentvedligeholder'],['configuration manager','data-koordinator','information']),
    'bd-fagansvarlig-spor': (['fagansvarlig','spor ','sikring ','kørestrøm','tele ','fagtilsyn','teknisk systemansvarlig','systemansvarlig'],['fagprojektleder','projekteringsleder','byggeleder','atc ','signal']),
    'bd-ibrugtagning': (['ibrugtagningsansvarlig','commissioning','overdragelse','driftsansvarlig','transition manager'],['projektleder','test manager','drift ','vedligeholdelse']),
    'bd-kontraktmanager': (['kontraktmanager','contract manager','kontrakt ','kontraktholder','aftaleansvarlig','programme contract manager'],['udbud','jurist','jura','business change']),
    'bd-kvalitetsspecialist': (['kvalitetsspecialist','kvalitetssikrer','lead auditor','auditplanlægger','faglig kvalitetssikrer','kvalitet'],['dokumentcontroller','test manager','sikkerhedsspecialist']),
    'bd-miljoekoordinator': (['miljø','bæredygtighed','miljoe','environment','grøn ','green '],['sikkerhedskoordinator','arbejdsmiljø','natur']),
    'bd-oekonomi-controller': (['økonomi-controller','økonomikoordinator','økonomisupporter','controller','budget','finans'],['data manager','administrativ','accountant']),
    'bd-planlaegningskoordinator': (['planlægningskoordinator','planlægger','koordinator ','koordinering','planlægning','planner'],['projektkoordinator','projektleder','administrativ']),
    'bd-projekteringsleder': (['projekteringsleder','projektering','design manager','design authority','design & development manager'],['byggeleder','fagprojektleder','anlægsingeniør','csm-projekteringsleder']),
    'bd-sikkerhedskoordinator': (['sikkerhedskoordinator','sikkerhedsbyggeleder','sikkerhedsspecialist','sikkerhed ','arbejdsmiljø','apv','beredskab'],['incident manager','csm ','jernbanesikkerhed','risiko']),
}

def match_pdf(pdf, exact_terms, close_terms):
    p = pdf.lower()
    for term in exact_terms:
        if term.lower() in p:
            return 'exact', term
    for term in close_terms:
        if term.lower() in p:
            return 'close', term
    return None, None

agent_mappings = {a['id']: [] for a in roster}
agent_mappings.update({k: [] for k in placeholders})

pdf_coverage = {}
uncovered_pdfs = []
ambiguous = []

for pdf in pdfs:
    matches = []
    for agent in roster:
        aid = agent['id']
        if aid in mapping_rules:
            exact, close = mapping_rules[aid]
            mtype, term = match_pdf(pdf, exact, close)
            if mtype:
                matches.append((aid, mtype, term, 'existing'))
    for aid in placeholders:
        exact, close = placeholder_rules[aid]
        mtype, term = match_pdf(pdf, exact, close)
        if mtype:
            matches.append((aid, mtype, term, 'placeholder'))
    
    if not matches:
        uncovered_pdfs.append(pdf)
    else:
        exact_matches = [m for m in matches if m[1] == 'exact']
        best = exact_matches[0] if exact_matches else matches[0]
        agent_mappings[best[0]].append((pdf, best[1], best[2]))
        pdf_coverage[pdf] = best[0]
        other_matches = [m for m in matches if m[0] != best[0]]
        if other_matches:
            ambiguous.append((pdf, best[0], other_matches))

def confidence(pdf, match_type, term, agent_role):
    p = pdf.lower()
    role = agent_role.lower()
    if match_type == 'exact':
        core_words = [w.strip() for w in role.split() if len(w.strip()) > 3]
        hits = sum(1 for w in core_words if w in p)
        if hits >= max(1, len(core_words)//2 + 1):
            return 'high'
        return 'medium'
    return 'low'

lines = []
lines.append('# Agent 3: Mapping Report')
lines.append('')
lines.append(f'**Generated:** {datetime.now().isoformat()}')
lines.append(f'**Agents mapped:** {len(roster)} existing + {len(placeholders)} placeholders = {len(roster)+len(placeholders)} total')
lines.append(f'**PDF roles examined:** {len(pdfs)}')
lines.append('')
lines.append('## 1. Existing Agent Mappings')
lines.append('')

for agent in roster:
    aid = agent['id']
    aname = agent['name']
    arole = agent['role']
    acat = agent['category']
    mappings = agent_mappings.get(aid, [])
    lines.append(f'### {aname} (`{aid}`)')
    lines.append(f'- **Role:** {arole}')
    lines.append(f'- **Category:** {acat}')
    lines.append(f'- **Mapped PDFs:** {len(mappings)}')
    if mappings:
        lines.append('')
        lines.append('| PDF Title | Match Type | Confidence | Trigger Term |')
        lines.append('|-----------|------------|------------|--------------|')
        for pdf, mtype, term in mappings:
            conf = confidence(pdf, mtype, term, arole)
            lines.append(f'| {pdf} | {mtype} | {conf} | {term} |')
    else:
        lines.append('- **No matches found**')
    lines.append('')

lines.append('---')
lines.append('')
lines.append('## 2. Placeholder Agent (bd-*) Mappings')
lines.append('')

for aid, meta in placeholders.items():
    mappings = agent_mappings.get(aid, [])
    lines.append(f'### {meta["name"]} (`{aid}`)')
    lines.append(f'- **Proposed Role:** {meta["role"]}')
    lines.append(f'- **Category:** {meta["category"]}')
    lines.append(f'- **Mapped PDFs:** {len(mappings)}')
    if mappings:
        lines.append('')
        lines.append('| PDF Title | Match Type | Confidence | Trigger Term |')
        lines.append('|-----------|------------|------------|--------------|')
        for pdf, mtype, term in mappings:
            conf = confidence(pdf, mtype, term, meta['role'])
            lines.append(f'| {pdf} | {mtype} | {conf} | {term} |')
    else:
        lines.append('- **No matches found**')
    lines.append('')

lines.append('---')
lines.append('')
lines.append('## 3. Ambiguous Mappings (Flagged for Review)')
lines.append('')
if ambiguous:
    lines.append('| PDF Title | Primary Match | Also Matched By |')
    lines.append('|-----------|---------------|-----------------|')
    for pdf, primary, others in ambiguous:
        other_str = ', '.join([f'{o[0]} ({o[1]})' for o in others])
        lines.append(f'| {pdf} | {primary} | {other_str} |')
else:
    lines.append('No ambiguous mappings detected.')
lines.append('')

lines.append('---')
lines.append('')
lines.append('## 4. Coverage Summary')
lines.append('')
covered_count = len(pdf_coverage)
uncovered_count = len(uncovered_pdfs)
coverage_pct = round(covered_count / len(pdfs) * 100, 1) if pdfs else 0

existing_ids = {a['id'] for a in roster}
placeholder_ids = set(placeholders.keys())

covered_by_existing = sum(1 for p, aid in pdf_coverage.items() if aid in existing_ids)
covered_by_placeholder = sum(1 for p, aid in pdf_coverage.items() if aid in placeholder_ids)

lines.append(f'- **Total PDFs:** {len(pdfs)}')
lines.append(f'- **Covered by existing agents:** {covered_by_existing} ({round(covered_by_existing/len(pdfs)*100,1)}%)')
lines.append(f'- **Covered by placeholder agents:** {covered_by_placeholder} ({round(covered_by_placeholder/len(pdfs)*100,1)}%)')
lines.append(f'- **Total covered:** {covered_count} ({coverage_pct}%)')
lines.append(f'- **Uncovered:** {uncovered_count} ({round(uncovered_count/len(pdfs)*100,1)}%)')
lines.append('')

lines.append('### Coverage Table by Agent')
lines.append('')
lines.append('| Agent ID | Type | Role | PDFs Covered |')
lines.append('|----------|------|------|--------------|')
for agent in roster:
    aid = agent['id']
    count = len(agent_mappings.get(aid, []))
    if count > 0:
        lines.append(f'| {aid} | existing | {agent["role"]} | {count} |')
for aid, meta in placeholders.items():
    count = len(agent_mappings.get(aid, []))
    if count > 0:
        lines.append(f'| {aid} | placeholder | {meta["role"]} | {count} |')
lines.append('')

if uncovered_pdfs:
    lines.append('### Uncovered PDFs (No Agent Match)')
    lines.append('')
    for pdf in uncovered_pdfs:
        lines.append(f'- {pdf}')
    lines.append('')

lines.append('---')
lines.append('')
lines.append('## 5. Recommendations for Placeholder Agents')
lines.append('')
lines.append('Based on the PDF role titles, the 10 placeholder agents should represent the following PDF roles:')
lines.append('')
for aid, meta in placeholders.items():
    mappings = agent_mappings.get(aid, [])
    lines.append(f'### {meta["name"]} (`{aid}`)')
    if mappings:
        lines.append(f'Should primarily cover {len(mappings)} PDF roles:')
        for pdf, mtype, term in mappings:
            lines.append(f'- `{pdf}`')
    else:
        lines.append('No matching PDF roles found. **Requires manual review.**')
    lines.append('')

with open('temp/agent3_mapping.md','w',encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Wrote temp/agent3_mapping.md ({len(lines)} lines)')
print(f'Coverage: {covered_count}/{len(pdfs)} ({coverage_pct}%)')
print(f'Uncovered: {uncovered_count}')