import os

data = [
    'bd-projekteringsleder|Projekteringsleder|Projekteringsleder|Teknik og projektering|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-fagpakkestruktur,bbtr-tvaerfaglig-koordinering,bbtr-dokumentstyring,bbtr-kvalitet-dod,bdk-bkp-v17-overview,bdk-bkp-v17-data-model|projekteringsledelse,designkoordinering,teknisk dokumentation,fagpakkestruktur,BKP-data,tegningshandtering|lede og koordinere projekteringsarbejdet paa tvaers af fagdiscipliner, sikre teknisk dokumentationskvalitet, og handtere BKP-data og tegningsprocesser i BaneByg-projekter|Projekteringslederen arbejder i krydsfeltet mellem design, teknisk dokumentation, fagpakker, BKP og tvaerfaglig koordinering. Noegleomraader: BKP v17 data model, tegningsstruktur, designafklaringer, myndighedsindsigelser, og graenseflader mellem projektering og udfoerelse.',
    'bd-dokumentcontroller|Dokumentcontroller|Dokumentcontroller|Dokumentstyring og kvalitet|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-dokumentstyring,bbtr-kvalitet-dod,bbtr-leverance-mapping,bbe-dokumenter-platform,bdk-bkp-v17-overview|dokumentkontrol,versionsstyring,leveranceafstemning,BKP-dokumentation,BBE-platform compliance,metadata og sporbarhed|sikre struktureret dokumenthandtering, versionskontrol, sporbarhed og compliance i BaneByg-projekter, med saerligt fokus paa BBE-dokumentplatform og BKP-krav|Dokumentcontrolleren handterer projektets dokumentationsstroem: indkommende og udgaaende dokumenter, versionsstyring, distributionslister, godkendelsesflow, og integration med BBE. Central for audit, leverancekontrol og myndighedsdokumentation.',
    'bd-kvalitetsspecialist|Kvalitetsspecialist|Kvalitetsspecialist|Dokumentstyring og kvalitet|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-kvalitet-dod,bbtr-dokumentstyring,bbtr-risiko-myndighed,bbtr-csm-tsi-compliance,bdk-bkp-v17-overview|kvalitetsplanlaegning,ISO 9001 compliance,kravsporbarhed,inspektionsplaner,afvigelseshandtering,CSM/TSI-kvalitetssikring|opbygge og vedligeholde kvalitetsstyringssystemer i BaneByg-projekter, sikre compliance med ISO 9001, CSM/TSI-krav, og sporbarhed gennem hele projektets livscyklus|Kvalitetsspecialisten arbejder med kvalitetsplaner, inspektions- og testplaner, afvigelsesrapporter, korrektive handlinger, og sikrer at projektets leverancer opfylder specificerede krav. Har taet kontakt til fagtilsyn, byggeledelse og myndigheder.',
    'bd-kontraktmanager|Kontraktmanager|Kontraktmanager|Udbud og kontrakt|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-raadgiver-udbud,bdk-legal-mapping,bbtr-indstilling-writer,bdk-styregruppearbejde,bdk-projektindstilling-og-finansiering|kontraktadministration,kontraktaendringer,kravhandtering,leverandoropfolgning,eskalation og disputes,okonomisk kontraktkontrol|administrere kontraktens livscyklus fra indgaelse til afslutning, sikre compliance med ABR18/AB18, handtere aendringer, krav og leverandorrelationer i BaneByg-projekter|Kontraktmanageren er bindeleddet mellem projektets juridiske rammer og den praktiske udfoerelse. Handterer kontraktaendringer, tillaegsaftaler, tidsfristforlaengelser, sanktioner, og sikrer at parternes rettigheder og forpligtelser overholdes.',
    'bd-planlaegningskoordinator|Planlaegningskoordinator|Planlaegningskoordinator|Planlaegning og fremdrift|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-faseopdelt-ydelser,bbtr-produktionssetup,bbtr-tvaerfaglig-koordinering,bdk-projektrapportering-frister,bdk-forbedringsloop|tidsplanlaegning,ressourcekoordinering,fremdriftsrapportering,kritiske veje,milestone-tracking,planlaegningsvaerktojer|koordinere projektets tidsplan, ressourcer og fremdrift paa tvaers af fag, entreprenorer og leverancer, og sikre synkronisering mellem plan og udfoerelse i BaneByg-projekter|Planlaegningskoordinatoren arbejder med Gantt-diagrammer, kritiske veje, ressourceallokering, fremdriftsmoder, og sikrer at tidsplaner afspejler realiteterne paa byggepladsen. Taet integration til byggeledelse, fagprojektledelse og styregruppe.',
    'bd-sikkerhedskoordinator|Sikkerhedskoordinator|Sikkerhedskoordinator|Sikkerhed og miljoe|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-risiko-myndighed,bbtr-csm-tsi-compliance,bdk-haendelser-sikkerhedsbrister,bdk-risk-profile,bbtr-dokumentstyring|arbejdsmiljoekoordinering,sikkerhedsplaner,APV og risikovurdering,haendelseshandtering,beredskabsplaner,jernbanesikkerheid|sikre systematisk arbejdsmiljoe- og sikkerhedskoordinering i BaneByg-projekter, herunder jernbanespecifikke sikkerhedskrav, haendelseshandtering og compliance med arbejdsmiljoe lovgivning|Sikkerhedskoordinatoren arbejder med APV, sikkerhedsplaner, beredskabsplaner, haendelsesregistrering, ATV-krav, og koordinerer sikkerhed paa byggepladser med aktiv bane. Taet samarbejde med Banedanmarks sikkerhedsorganisation.',
    'bd-fagansvarlig-spor|Fagansvarlig Spor/Sikring/Koerestroem/Tele|Fagansvarlig Spor, Sikring, Koerestroem og Tele|Teknik og udfoerelse|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-tvaerfaglig-koordinering,bbtr-csm-tsi-compliance,bbtr-risiko-myndighed,bdk-trafikale-regler-anvendelse,bdk-bkp-v17-overview,bdk-bkp-v17-data-model|sporarbejde,sikringsanlaeg,koerestroemssystemer,telesystemer,fagtilsyn,TSI-compliance,driftskompatibilitet|fagligt ansvar for spor, sikring, koerestroem og telesystemer i BaneByg-projekter, sikre teknisk compliance med CSM/TSI, trafikale regler og driftskompatibilitet|Den fagansvarlige daekker Banedanmarks kernetekniske systemer: sporanlaeg, sikringsanlaeg, koerestroem og telesystemer. Arbejder taet sammen med driftsorganisationen og Trafikstyrelsen.',
    'bd-miljoekoordinator|Miljoekoordinator|Miljoekoordinator|Sikkerhed og miljoe|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-risiko-myndighed,bbtr-dokumentstyring,bdk-risk-profile,bbtr-tvaerfaglig-koordinering|miljoevurdering,miljoetilladelser,stoej- og vibrationskontrol,jord- og grundvandshandtering,affaldshandtering,naturbeskyttelse|koordinere miljoeforhold i BaneByg-projekter, sikre compliance med miljoe lovgivning, miljoetilladelser, og handtere miljoeaspekter i anlaegs- og driftsfasen|Miljoekoordinatoren handterer miljoevurderinger, miljoetilladelser, stoej- og vibrationskortlaegning, jordhandtering, affaldsplaner, natur- og vandloebsbeskyttelse. Sikrer at projektet opfylder miljoe krav fra myndigheder og Banedanmarks egne standarder.',
    'bd-ibrugtagning|Ibrugtagning|Ibrugtagningsansvarlig|Teknik og udfoerelse|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bbtr-kvalitet-dod,bbtr-dokumentstyring,bbtr-csm-tsi-compliance,bbtr-risiko-myndighed,bdk-bkp-v17-overview,bdk-forbedringsloop|ibrugtagningsplaner,afproevning og test,overdragelse til drift,sikkerhedsgodkendelser,myndighedsinddragelse,driftsinstruktioner|lede og koordinere ibrugtagning af nye anlaeg og systemer i BaneByg-projekter, sikre sikkerhedsgodkendelse, afproevning, og gnidningsfri overdragelse til Banedanmarks driftsorganisation|Ibrugtagningsansvarlige arbejder med overgangen fra projekt til drift: afproevningsplaner, sikkerhedsgodkendelser, myndighedsafgoerelser, driftsinstruktioner, uddannelse af drifts-personale. Sikrer at anlaegget er sikkert og driftsklart foer aabning for trafik.',
    'bd-oekonomi-controller|Okonomi / Controller|Okonomi / Controller|Finans og analyse|karpathy-guidelines,shared-quality,shared-docx,bdk-brand-governance,bdk-gdpr-praksis,bdk-projektindstilling-og-finansiering,bdk-gevinststyring-realisering,bdk-overvaagning-rapportering,bdk-risk-profile,bdk-styregruppearbejde|budgetstyring,okonomisk rapportering,forecasting,omkostningskontrol,okonomisk risikovurdering,portefoeljestyring|styre og overvaage projektets okonomi, sikre budgetoverholdelse, lave okonomisk rapportering til styregruppe og portefoeljekontor, og understotte beslutninger med okonomisk analyse i BaneByg-projekter|Okonomi/Controller arbejder med projektets okonomiske helbred: budget, fakturaer, aendringsordrer, forecasting, okonomisk rapportering, gevinstrealisering, og portefoeljestyring. Er bindeled mellem projektledelse, styregruppe og Banedanmarks okonomiafdeling.',
]

out_dir = 'temp/banedanmark-agents'
os.makedirs(out_dir, exist_ok=True)

template = '''---
id: {id}
name: {name}
role: {role}
category: {category}
status: draft
source: placeholder - afventer domaeneviden fra Banedanmark-kontekst
primary_models:
  - Codex
  - Kimi
  - Qwen Code
  - Gemini Code
skills:
{skills_yaml}
---

# Agent: {name} - {role}

## Status

**Draft / Placeholder.** Denne agentprofil er oprettet som strukturel placeholder for Banedanmark-harnesset. Systemprompten og skills skal fyldes ud med konkret domaeneviden foer aktivering.

## Formaal

{name} er en agentprofil til rollen **{role}** i Banedanmark/BaneByg-projekter.

{mission}

## Domaenekontekst

{context}

## Kernekompetencer

{caps_md}

## Tilknyttede Subskills

{skills_md}

## Standard Testprompts

- "Gennemgaa denne opgave som {role} og giv de vigtigste risici, antagelser og naeste handlinger."
- "Lav en kort beslutningsklar leverance baseret paa det vedhaeftede materiale."
- "Hvilke subskills skal anvendes, foer vi kan kalde dette kvalitetssikret?"

## Manglende indhold (TODO)

- [ ] Rigt systemprompt baseret paa faglige kilder
- [ ] Specificerede testcases fra Banedanmark-praksis
- [ ] Afklaring af avatar/visuel identitet
- [ ] Eventuel tilknytning af eksisterende BDK/BBTR/BBE-skills
- [ ] Godkendelse af fagansvarlig foer status aendres fra draft til active

## Vedligeholdelse

Opdateres naar konkret domaeneviden indsamles fra Banedanmark-kontekst eller naar en fagansvarlig validerer profilen.
'''

for line in data:
    parts = line.split('|')
    id_, name, role, category, skills_str, caps_str, mission, context = parts
    skills = skills_str.split(',')
    caps = caps_str.split(',')
    skills_yaml = '\n'.join(f'  - {s}' for s in skills)
    caps_md = '\n'.join(f'- {c}' for c in caps)
    skills_md = '\n'.join(f'- `{s}`' for s in skills)
    content = template.format(
        id=id_, name=name, role=role, category=category,
        skills_yaml=skills_yaml, caps_md=caps_md, skills_md=skills_md,
        mission=mission, context=context
    )
    path = os.path.join(out_dir, f'{id_}.md')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Created {path}')
