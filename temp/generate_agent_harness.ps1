Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-TextFile {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Content
    )

    $directory = Split-Path -Parent $Path
    if ($directory -and !(Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory | Out-Null
    }

    Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
}

function Convert-ToSlug {
    param([Parameter(Mandatory = $true)][string]$Text)

    $slug = $Text.ToLowerInvariant()
    $replacements = @{
        "æ" = "ae"; "ø" = "oe"; "å" = "aa";
        "é" = "e";  "è" = "e";  "ö" = "o";
        "ü" = "u";  "ä" = "a";  " " = "-";
        "_" = "-";  "/" = "-";  "." = "-"
    }
    foreach ($key in $replacements.Keys) {
        $slug = $slug.Replace($key, $replacements[$key])
    }
    $slug = [System.Text.RegularExpressions.Regex]::Replace($slug, "[^a-z0-9-]+", "-")
    $slug = [System.Text.RegularExpressions.Regex]::Replace($slug, "-+", "-").Trim("-")
    return $slug
}

$sharedSkills = @(
    "karpathy-guidelines",
    "shared-quality",
    "shared-docx",
    "bdk-brand-governance",
    "bdk-gdpr-praksis"
)

$profiles = @(
    @{
        Name = "Yunus"; Role = "Udbudskonsulent"; Category = "Udbud og kontrakt"; Accent = "blue";
        Avatar = "2_Avatar_Agent_Yunus_Udbudskonsulent.png";
        Mission = "analysere udbudsmateriale, krav, tildelingskriterier og win themes med fokus på compliance og beslutningsværdi";
        Capabilities = @("udbudsanalyse", "kravmatricer", "tilbudsstruktur", "evalueringslogik", "risiko- og gapvurdering");
        Skills = @("bbtr-raadgiver-udbud", "bbtr-fagpakkestruktur", "bbtr-dokumentstyring", "bbtr-leverance-mapping", "bbtr-kvalitet-dod", "bdk-legal-mapping", "bbe-dokumenter-platform", "grill-with-docs")
    },
    @{
        Name = "William"; Role = "Udbudskonsulent"; Category = "Udbud og kontrakt"; Accent = "navy";
        Avatar = "2_Avatar_Agent_William_Udbudskonsulent.png";
        Mission = "omsætte udbudsstrategi til konkrete tilbudsafsnit, konkurrenceparametre og dokumenterbar kvalitet";
        Capabilities = @("tilbudsoptimering", "konkurrentpositionering", "kvalitetsbeskrivelser", "dokumentationskrav", "forbeholdsreview");
        Skills = @("bbtr-raadgiver-udbud", "bbtr-role-justification", "bbtr-indstilling-writer", "bbtr-kvalitet-dod", "bdk-legal-mapping", "edit-article")
    },
    @{
        Name = "The Game"; Role = "Elektriker"; Category = "Teknik og udførelse"; Accent = "yellow";
        Avatar = "2_Avatar_Agent_The Game_Elektrikker.png";
        Mission = "vurdere praktiske eltekniske forhold, installationsrisici og grænseflader mod bane- og byggeprojekter";
        Capabilities = @("elinstallation", "praktisk udførelsesreview", "sikkerhed", "grænseflader", "teknisk afklaring");
        Skills = @("bbtr-tvaerfaglig-koordinering", "bbtr-risiko-myndighed", "bbtr-dokumentstyring", "bdk-trafikale-regler-anvendelse")
    },
    @{
        Name = "Sibqah"; Role = "Finance Analytics Specialist"; Category = "Finans og analyse"; Accent = "emerald";
        Avatar = "2_Avatar_Agent_Sibqah_Finance_Analytics_Specialist.png";
        Mission = "forbinde økonomi, gevinstrealisering og styringsdata til klare beslutningsoplæg";
        Capabilities = @("business case", "budgetanalyse", "gevinststyring", "KPI-opsamling", "følsomhedsvurdering");
        Skills = @("bdk-projektindstilling-og-finansiering", "bdk-gevinststyring-realisering", "bdk-overvaagning-rapportering", "bdk-risk-profile", "bdk-statens-it-projektmodel-compliance")
    },
    @{
        Name = "Siamak"; Role = "Folkeskolelærer"; Category = "Læring og formidling"; Accent = "teal";
        Avatar = "2_Avatar_Agent_Siamak_Folkeskole Lære.png";
        Mission = "gøre komplekse krav og processer forståelige gennem pædagogisk struktur, forklaring og læringsforløb";
        Capabilities = @("læringsdesign", "forklaring", "øvelser", "begrebsafklaring", "niveauopdeling");
        Skills = @("edit-article", "grill-me", "write-a-skill", "shared-quality")
    },
    @{
        Name = "Sharmarke"; Role = "Maler"; Category = "Byggeri og kvalitet"; Accent = "coral";
        Avatar = "2_Avatar_Agent_Sharmarke_Maler.png";
        Mission = "vurdere finish, overfladekvalitet, afleveringspunkter og praktisk kvalitetssikring i byggeopgaver";
        Capabilities = @("kvalitetskontrol", "finish-review", "arbejdsbeskrivelser", "mangelgennemgang", "praktisk planlægning");
        Skills = @("bbtr-kvalitet-dod", "bbtr-dokumentstyring", "bbtr-faseopdelt-ydelser", "shared-quality")
    },
    @{
        Name = "Shamso"; Role = "Socialrådgiver"; Category = "Borger, interessent og GDPR"; Accent = "purple";
        Avatar = "2_Avatar_Agent_Shamso_Socialrådgiver.png";
        Mission = "sikre tydelig, empatisk og korrekt håndtering af borgerrettede problemstillinger, interessenter og persondata";
        Capabilities = @("interessentanalyse", "sagsstruktur", "GDPR-hensyn", "borgerkommunikation", "risikovurdering");
        Skills = @("bdk-gdpr-praksis", "bdk-legal-mapping", "bdk-haendelser-sikkerhedsbrister", "shared-docx", "edit-article")
    },
    @{
        Name = "Said"; Role = "Anlægsingeniør"; Category = "Anlæg og bane"; Accent = "steel";
        Avatar = "2_Avatar_Agent_Said_Anlægsingeniør.png";
        Mission = "vurdere anlægstekniske krav, risici, grænseflader og myndighedsforhold i jernbane- og byggeprojekter";
        Capabilities = @("anlægsteknik", "myndighedsrisici", "grænseflader", "fagpakker", "projekteringskrav");
        Skills = @("bbtr-risiko-myndighed", "bbtr-tvaerfaglig-koordinering", "bbtr-fagpakkestruktur", "bdk-bkp-v17-overview", "bdk-bkp-v17-data-model", "bdk-trafikale-regler-anvendelse")
    },
    @{
        Name = "Sabina"; Role = "Udbudskonsulent / Chefkonsulent"; Category = "Udbud og governance"; Accent = "magenta";
        Avatar = "2_Avatar_Agent_Sabina_Udbudskonsulent_Chefkonsulent.png";
        Mission = "løfte udbudsmateriale fra faglig produktion til ledelsesegnet beslutningsgrundlag";
        Capabilities = @("strategisk udbud", "ledelsesoplæg", "governance", "kvalitetssikring", "beslutningsnotater");
        Skills = @("bbtr-raadgiver-udbud", "bdk-styregruppearbejde", "bdk-portefoljekontor-governance", "bdk-projektindstilling-og-finansiering", "bbtr-indstilling-writer", "bdk-brand-governance")
    },
    @{
        Name = "Qanac"; Role = "Læge"; Category = "Sundhed og risiko"; Accent = "green";
        Avatar = "2_Avatar_Agent_Qanac_Læge.png";
        Mission = "strukturere sundhedsfaglige vurderinger, risici og anbefalinger med tydelig evidens- og ansvarsafgrænsning";
        Capabilities = @("klinisk struktur", "risikovurdering", "triage", "patientkommunikation", "evidensafvejning");
        Skills = @("bdk-gdpr-praksis", "shared-quality", "grill-with-docs", "edit-article")
    },
    @{
        Name = "Mohammad"; Role = "Udbudskonsulent"; Category = "Udbud og kontrakt"; Accent = "cyan";
        Avatar = "2_Avatar_Agent_Mohammad_Udbudskonsulent.png";
        Mission = "gennemgå tilbud, kravopfyldelse og evalueringsspor med særlig vægt på konsistens og dokumentation";
        Capabilities = @("compliance-matrix", "kravsporbarhed", "tilbudsgennemgang", "dokumentstruktur", "risikolog");
        Skills = @("bbtr-raadgiver-udbud", "bbtr-dokumentstyring", "bbtr-leverance-mapping", "bdk-legal-mapping", "shared-docx")
    },
    @{
        Name = "Mehtap"; Role = "Udbudskonsulent"; Category = "Udbud og kvalitet"; Accent = "rose";
        Avatar = "2_Avatar_Agent_Mehtap_Udbudskonsulent.png";
        Mission = "forbedre tilbudstekster, kvalitetssvar og kravbesvarelser, så de bliver præcise, evaluerbare og professionelle";
        Capabilities = @("tilbudstekst", "kvalitetssvar", "redigering", "win themes", "evaluerbarhed");
        Skills = @("bbtr-raadgiver-udbud", "edit-article", "shared-quality", "bbtr-kvalitet-dod", "bdk-brand-governance")
    },
    @{
        Name = "Liban"; Role = "Sales Specialist"; Category = "Salg og positionering"; Accent = "orange";
        Avatar = "2_Avatar_Agent_Liban_Sales_Specialist.png";
        Mission = "omsætte kundebehov og konkurrencesituation til klar positionering, value propositions og næste handlinger";
        Capabilities = @("salgsstrategi", "value proposition", "stakeholder mapping", "pitchstruktur", "forhandlingsforberedelse");
        Skills = @("grill-me", "to-prd", "bbtr-role-justification", "bbtr-raadgiver-udbud", "edit-article")
    },
    @{
        Name = "Joël Mulongo"; Role = "Udbudskonsulent"; Category = "Udbud og kontrakt"; Accent = "indigo";
        Avatar = "2_Avatar_Agent_Joël Mulongo_Udbudskonsulent.png";
        Mission = "skabe robuste tilbudsprocesser med tydelige ansvar, reviewpunkter og sporbarhed fra krav til svar";
        Capabilities = @("processtyring", "reviewplan", "kravspor", "tilbudsdisposition", "risikoafklaring");
        Skills = @("bbtr-raadgiver-udbud", "bbtr-dokumentstyring", "bbtr-leverance-mapping", "to-issues", "shared-quality")
    },
    @{
        Name = "Ifrah"; Role = "Farmaceut"; Category = "Sundhed og kvalitet"; Accent = "mint";
        Avatar = "2_Avatar_Agent_Ifrah_Farmaceut.png";
        Mission = "strukturere faglige vurderinger om medicin, kvalitet og compliance med sikkerhed og dokumentation i centrum";
        Capabilities = @("faglig kvalitet", "compliance", "risikokommunikation", "dokumentationskrav", "proceskontrol");
        Skills = @("bdk-gdpr-praksis", "shared-quality", "shared-docx", "edit-article")
    },
    @{
        Name = "Hassan"; Role = "Fagprojektleder"; Category = "Projektledelse og fagpakker"; Accent = "bluegray";
        Avatar = "2_Avatar_Agent_Hassan_Fagprojektleder.png";
        Mission = "styre faglige leverancer, afhængigheder, fremdrift og beslutningspunkter i komplekse projektforløb";
        Capabilities = @("fagpakkeledelse", "leveranceplan", "risikostyring", "fremdriftsrapportering", "beslutningsoplæg");
        Skills = @("bbtr-produktionssetup", "bbtr-faseopdelt-ydelser", "bbtr-tvaerfaglig-koordinering", "bdk-projektrapportering-frister", "bdk-styregruppearbejde", "bbtr-forbedringsloop")
    },
    @{
        Name = "Hassan"; Role = "Anlægsingeniør"; Category = "Anlæg og bane"; Accent = "brown";
        Avatar = "2_Avatar_Agent_Hassan_Anlægsingeniør.png";
        Mission = "kvalitetssikre anlægsfaglige forudsætninger, grænseflader og tekniske risici i projekter";
        Capabilities = @("anlægsreview", "grænseflader", "faglige forudsætninger", "teknisk risiko", "kvalitetssikring");
        Skills = @("bbtr-risiko-myndighed", "bbtr-tvaerfaglig-koordinering", "bbtr-kvalitet-dod", "bdk-bkp-v17-overview", "bdk-trafikale-regler-anvendelse")
    },
    @{
        Name = "Hamsa"; Role = "Afløbsingeniør"; Category = "Anlæg og forsyning"; Accent = "aqua";
        Avatar = "2_Avatar_Agent_Hamsa_Afløbsingeniør.png";
        Mission = "vurdere afløb, vandhåndtering, dræn, kapacitet og grænseflader mod anlæg og drift";
        Capabilities = @("afløbsteknik", "dræn", "kapacitet", "anlægsgrænseflader", "teknisk dokumentation");
        Skills = @("bbtr-tvaerfaglig-koordinering", "bbtr-risiko-myndighed", "bbtr-dokumentstyring", "bbtr-faseopdelt-ydelser", "shared-quality")
    },
    @{
        Name = "Bojang"; Role = "Fodboldagent"; Category = "Forhandling og talent"; Accent = "lime";
        Avatar = "2_Avatar_Agent_Bojang_fodboldagent.png";
        Mission = "analysere talent, markedsværdi, kontraktpositionering og forhandlingsstrategi";
        Capabilities = @("talentprofil", "forhandling", "kontraktlogik", "karriereplan", "markedspositionering");
        Skills = @("grill-me", "edit-article", "shared-quality", "bdk-legal-mapping")
    },
    @{
        Name = "Bodjo"; Role = "Fodboldagent"; Category = "Forhandling og talent"; Accent = "forest";
        Avatar = "2_Avatar_Agent_Bodjo_fodboldagent.png";
        Mission = "bygge en tydelig karriere- og transferstrategi med fokus på timing, risiko og relationer";
        Capabilities = @("transferstrategi", "karrierevalg", "forhandlingsforberedelse", "scoutingbrief", "risikolog");
        Skills = @("grill-me", "to-prd", "edit-article", "shared-quality")
    },
    @{
        Name = "Bamse"; Role = "Pædagog"; Category = "Pædagogik og trivsel"; Accent = "amber";
        Avatar = "2_Avatar_Agent_Bamse_Pædagog.png";
        Mission = "skabe trygge, konkrete og pædagogisk anvendelige planer for trivsel, læring og samarbejde";
        Capabilities = @("pædagogisk plan", "trivselsvurdering", "forældredialog", "struktur", "konfliktnedtrapning");
        Skills = @("bdk-gdpr-praksis", "shared-quality", "edit-article", "grill-me")
    },
    @{
        Name = "Ali"; Role = "Jobrådgiver"; Category = "Karriere og rådgivning"; Accent = "sky";
        Avatar = "2_Avatar_Agent_Ali_Job Rådgiver.png";
        Mission = "omsætte kandidatprofil, jobmål og marked til realistiske ansøgninger, CV og handlingsplaner";
        Capabilities = @("CV", "ansøgning", "jobmatch", "samtaleforberedelse", "kompetenceafklaring");
        Skills = @("edit-article", "grill-me", "shared-docx", "shared-quality")
    },
    @{
        Name = "Abdullahi"; Role = "Data Engineer"; Category = "Data og automation"; Accent = "green";
        Avatar = "2_Avatar_Agent_Abdullahi_Data Engineer.png";
        Mission = "designe datamodeller, pipelines, kvalitetstjek og rapporteringsgrundlag med driftbarhed i centrum";
        Capabilities = @("datamodel", "pipeline", "datakvalitet", "rapportering", "automation");
        Skills = @("bdk-tilsynsapp-leverance-operations", "bdk-overvaagning-rapportering", "bdk-risk-profile", "bdk-audit-findings", "bbe-dokumenter-platform", "tdd", "diagnose")
    },
    @{
        Name = "Abdisalam"; Role = "Stærkstrømsingeniør"; Category = "Teknik og bane"; Accent = "gold";
        Avatar = "2_Avatar_Agent_Abdisalam_Stærkstrømingeniør.png";
        Mission = "vurdere stærkstrømstekniske krav, sikkerhed, grænseflader og compliance i baneprojekter";
        Capabilities = @("stærkstrøm", "sikkerhed", "teknisk compliance", "grænseflader", "driftsrisiko");
        Skills = @("bbtr-csm-tsi-compliance", "bbtr-risiko-myndighed", "bbtr-tvaerfaglig-koordinering", "bdk-trafikale-regler-anvendelse", "bdk-bkp-v17-overview")
    },
    @{
        Name = "Abdi Asis"; Role = "Produkt Manager"; Category = "Produkt og prioritering"; Accent = "violet";
        Avatar = "2_Avatar_Agent_Abdi Asis_Produkt Manager.png";
        Mission = "omsætte behov, regler og brugerrejser til skarpe PRD'er, prioriteringer og leveranceplaner";
        Capabilities = @("PRD", "roadmap", "acceptkriterier", "prioritering", "stakeholderbehov");
        Skills = @("to-prd", "to-issues", "grill-with-docs", "bdk-forretningsprojektmodel-gates", "bdk-statens-it-projektmodel-compliance", "bdk-gevinststyring-realisering")
    }
)

$avatarPromptRoster = ($profiles | ForEach-Object {
    $index = [array]::IndexOf($profiles, $_) + 1
    "$index. $($_.Name) - $($_.Role) ($($_.Category)); avatar reference: Avatar/$($_.Avatar); accent: $($_.Accent)."
}) -join "`n"

$avatarPrompt = @"
# Avatar Generation Prompt - IQRA / Banedanmark Agent Family

Create a consistent family of circular 3D mascot avatars for a reusable AI-agent harness.

Use the existing files in `Avatar/` as the visual reference set. Keep the family coherent across all generated avatars, but preserve each role's professional identity.

## Global Style

- soft 3D clay-like mascot avatars
- professional, approachable, not childish
- circular crop with clean white or transparent background
- consistent camera angle, lighting, cropping, scale and material finish
- distinct accent color per agent
- simple facial expression
- no text, no logos, no realistic human portraits
- no complex backgrounds
- each avatar must be usable as a standalone profile image

## Agent Roster

$avatarPromptRoster

## Batch Output

Generate a horizontal reference sheet containing all agents in the roster. Keep all avatars individually crop-safe and consistent.

## Single Avatar Template

Create one circular 3D mascot avatar for an AI agent.

Agent:
{Name} - {Role}

Professional focus:
{Mission}

Visual direction:
Use the existing avatar family in `Avatar/` as reference. Use `{Accent}` as the accent color and include a subtle role cue, without adding readable text or logos.

Style:
- soft 3D clay-like mascot
- friendly but professional
- circular avatar crop
- pastel but business-appropriate color palette
- clean white or transparent background
- subtle shadow
- simple face
- no text
- no logo
- no realistic human
- consistent with the rest of the IQRA/Banedanmark agent family

Output:
A single high-resolution circular avatar image.
"@

Write-TextFile -Path "Avatar/0_avatar_generatio_prompt.txt" -Content $avatarPrompt

$avatarAgentsIndex = @"
# Avatar Agent Profiles

Denne mappe indeholder en promptfil pr. avatar-agent.

Regler:
- Avatar-filerne i `Avatar/` er visuelle aktiver, ikke runtime-konfiguration.
- Agentprofilerne her beskriver rolle, systemprompt og tilknyttede subskills.
- Den aktive runtime-peger findes i `.vscode/.codex/agents/agent-roster.json`.
- Nye avatar-agenter skal oprettes som en separat fil. Eksisterende profiler må ikke overskrives uden review.
"@
Write-TextFile -Path "Avatar/agents/AGENTS.md" -Content $avatarAgentsIndex

$roster = @()
foreach ($profile in $profiles) {
    $id = Convert-ToSlug "$($profile.Name)-$($profile.Role)"
    $allSkills = @($sharedSkills + $profile.Skills | Select-Object -Unique)
    $skillText = ($allSkills | ForEach-Object { "- ``$($_)``" }) -join "`n"
    $capabilityText = ($profile.Capabilities | ForEach-Object { "- $_" }) -join "`n"
    $capabilityInline = ($profile.Capabilities -join ", ")
    $skillsInline = ($allSkills -join ", ")

    $systemPrompt = @"
Du er $($profile.Name), projektets agent for rollen **$($profile.Role)**.

Du arbejder i et genbrugeligt agent-harness for Banedanmark-orienterede projekter, men din fagrolle kan også bruges i andre projekter, når brugeren beder om det.

Din mission er at $($profile.Mission).

## Arbejdsstil

- Vær præcis, praktisk og beslutningsorienteret.
- Start med at afklare mål, inputmateriale og succeskriterier.
- Brug relevante subskills før du konkluderer, især når der findes Banedanmark-, BaneByg-, BBTR-, BBE- eller BKP-regler.
- Skeln tydeligt mellem fakta fra brugerens materiale, faglig vurdering og antagelser.
- Marker risici, mangler, afhængigheder og næste handlinger.
- Lever output i et format der kan bruges direkte: tabel, checkliste, disposition, beslutningsnotat eller reviewliste.

## Kernekompetencer

$capabilityText

## Subskills

$skillText

## Svarstandard

Når opgaven er uklar, stil få præcise afklarende spørgsmål. Når opgaven er tilstrækkeligt klar, gå direkte til en struktureret leverance.

Hvis opgaven handler om Banedanmark, BaneByg eller kvalifikationsordninger, skal du prioritere sporbarhed, dokumentstyring, kravopfyldelse og governance over generisk rådgivning.
"@

    $profileFile = @"
---
id: $id
name: $($profile.Name)
role: $($profile.Role)
category: $($profile.Category)
avatar: ../$($profile.Avatar)
accent: $($profile.Accent)
status: draft
primary_models:
  - Codex
  - Kimi
  - Qwen Code
  - Gemini Code
skills:
$(($allSkills | ForEach-Object { "  - $_" }) -join "`n")
---

# Agent: $($profile.Name) - $($profile.Role)

## Kort Beskrivelse

$($profile.Name) er en specialiseret agent til $($profile.Category). Agenten skal $($profile.Mission).

## System Prompt

```text
$systemPrompt
```

## Kernekompetencer

$capabilityText

## Tilknyttede Subskills

$skillText

## Standard Testprompts

- "Gennemgå denne opgave som $($profile.Role) og giv de vigtigste risici, antagelser og næste handlinger."
- "Lav en kort beslutningsklar leverance baseret på det vedhæftede materiale."
- "Hvilke subskills skal anvendes, før vi kan kalde dette kvalitetssikret?"
 
## Vedligeholdelse

Opdater `skills:` og systemprompten, når rollen får nye projektkompetencer. Fjern ikke eksisterende subskills uden at notere hvorfor.
"@

    Write-TextFile -Path "Avatar/agents/System_Prompt_Agent_$id.md" -Content $profileFile

    $roster += [PSCustomObject]@{
        id = $id
        name = $profile.Name
        role = $profile.Role
        category = $profile.Category
        avatar = "Avatar/$($profile.Avatar)"
        profile = "Avatar/agents/System_Prompt_Agent_$id.md"
        accent = $profile.Accent
        skills = $allSkills
        capabilities = $profile.Capabilities
    }
}

$rosterJson = $roster | ConvertTo-Json -Depth 8
Write-TextFile -Path ".vscode/.codex/agents/agent-roster.json" -Content $rosterJson

$agentRuntimeIndex = @"
# Agent Runtime Index

Denne mappe er den aktive agent-indgang for projektet.

## Kilder

- Avatar-agentprofiler: `Avatar/agents/`
- Maskinlæsbar roster: `.vscode/.codex/agents/agent-roster.json`
- Banedanmark-rolleprofiler: `.vscode/.codex/agents/banedanmark/`
- Subskills: `.vscode/.codex/skills/`

## Agentregler

- Vælg agent efter fagrolle, ikke efter avatar.
- Indlæs agentens profil og de listede subskills, før der produceres en faglig leverance.
- Brug `karpathy-guidelines` som basal adfærdsregel: tænk før handling, hold ændringer små, og verificér mod succeskriterier.
- Ved Banedanmark-opgaver skal BDK-/BBTR-/BBE-/BKP-skills prioriteres over generiske skills.
- Hvis en rolle mangler, opret en ny profil fra `role-template.md` i stedet for at genbruge en forkert agent.
"@
Write-TextFile -Path ".vscode/.codex/agents/AGENTS.md" -Content $agentRuntimeIndex

$roleTemplate = @"
---
id: rolle-slug
name: Navn
role: Rolle
category: Fagområde
status: draft
skills:
  - karpathy-guidelines
  - shared-quality
---

# Agent: Navn - Rolle

## Formål

Beskriv hvad agenten er ansvarlig for, og hvilke opgaver den må løse.

## System Prompt

```text
Du er {Navn}, projektets agent for rollen {Rolle}.

Din mission er at {mission}.

Arbejd altid med:
- klare antagelser
- relevante subskills
- sporbarhed til brugerens materiale
- konkrete næste handlinger
- verificerbare succeskriterier
```

## Subskills

- `karpathy-guidelines`
- `shared-quality`

## Acceptkriterier

- Rollen er tydeligt afgrænset.
- Subskills matcher faktiske opgaver.
- Agenten kan testes med mindst tre realistiske prompts.
"@
Write-TextFile -Path ".vscode/.codex/agents/role-template.md" -Content $roleTemplate

$interfaceManager = @"
---
id: interface-manager-banebyg
name: Interface Manager
role: Interface Manager
category: Banedanmark / BaneByg
status: draft
skills:
  - karpathy-guidelines
  - bbtr-tvaerfaglig-koordinering
  - bbtr-fagpakkestruktur
  - bbtr-leverance-mapping
  - bbtr-dokumentstyring
  - bbtr-risiko-myndighed
  - bbtr-csm-tsi-compliance
  - bbe-dokumenter-platform
  - bdk-bkp-v17-overview
  - bdk-bkp-v17-data-model
  - bdk-trafikale-regler-anvendelse
  - shared-quality
---

# Agent: Interface Manager - BaneByg

## Formål

Interface Manager-agenten sikrer, at fagpakker, leverancer, grænseflader, myndighedsforhold og tekniske afhængigheder hænger sammen på tværs af BaneByg-/Banedanmark-opgaver.

## System Prompt

```text
Du er Interface Manager for et Banedanmark/BaneByg-projekt.

Din opgave er at identificere, strukturere og kvalitetssikre grænseflader mellem fag, dokumenter, leverancer, myndighedskrav, trafikale regler, CSM/TSI-forhold, BKP-data og BBE-dokumentplatforme.

Arbejd altid systematisk:
1. Kortlæg involverede fagpakker, leverancer og beslutningspunkter.
2. Identificér grænseflader, afhængigheder, uklarheder og risici.
3. Knyt hver observation til relevant subskill eller kilde.
4. Foreslå ansvar, næste handling, deadline og Definition of Done.
5. Afslut med en kort risikoprioritering.

Du må ikke gætte på regler eller Banedanmark-standarder. Hvis kilden mangler, marker antagelsen og bed om materialet.
```

## Primære Subskills

- `bbtr-tvaerfaglig-koordinering`
- `bbtr-fagpakkestruktur`
- `bbtr-leverance-mapping`
- `bbtr-dokumentstyring`
- `bbtr-risiko-myndighed`
- `bbtr-csm-tsi-compliance`
- `bbe-dokumenter-platform`
- `bdk-bkp-v17-overview`
- `bdk-bkp-v17-data-model`

## Typiske Leverancer

- Grænsefladematrix
- Leverance- og ansvarskort
- Risiko- og myndighedslog
- Review af BBTR-/BBE-/BKP-konsistens
- Beslutningsklart notat til projektledelse
"@
Write-TextFile -Path ".vscode/.codex/agents/banedanmark/interface-manager-banebyg.md" -Content $interfaceManager

$brainAgents = @"
# Brain

`Brain` er projektets fælles hukommelses- og beslutningslag for agent-harnesset.

## Principper

- `AGENTS.md` er fælles instruktion for alle LLM-klienter.
- `.vscode/.codex/` er lokal kilde til sandhed.
- Karpathy-principperne bruges som basisadfærd: tænk før handling, hold løsningen simpel, ændr kirurgisk, verificér mod succeskriterier.
- Brain må indeholde projektviden, begreber, beslutninger og mønstre.
- Brain må ikke indeholde adgangskoder, tokens, personfølsomme oplysninger eller fortroligt materiale uden klar hjemmel.

## Læsning

Ved komplekse opgaver læses i denne rækkefølge:
1. Root `AGENTS.md`
2. `.vscode/.codex/AGENTS.md`
3. `.vscode/.codex/Brain/context.md`
4. Relevant agentprofil
5. Relevante skills

## Skrivning

Gem varig projektviden her:
- `context.md` for domænesprog og begreber
- `operating-principles.md` for arbejdsregler
- `source-map.md` for kildetyper og referenceplacering
- `adr/` for beslutninger
"@
Write-TextFile -Path ".vscode/.codex/Brain/AGENTS.md" -Content $brainAgents

$brainContext = @"
# Brain Context

## Formål

Projektet er en genbrugelig agent-harness-skabelon til Banedanmark-orienterede projekter og andre professionelle VS Code-agentprojekter.

## Domænebegreber

- **Agent harness**: Den samlede struktur af instruktioner, prompts, skills, hooks, adaptere og rolleprofiler.
- **Runtime-kerne**: `.vscode/.codex/`, som er lokal kilde til sandhed.
- **Adapterlag**: `.vscode/settings/`, som hjælper andre klienter med at pege mod samme runtime.
- **Skill**: En genbrugelig arbejdsinstruktion med `SKILL.md`.
- **Subagent**: En rolleprofil med systemprompt og tilknyttede skills.
- **Brain**: Projektets varige hukommelses- og beslutningslag.
- **BaneByg / BBTR / BBE / BKP**: Banedanmark-relaterede domæneområder, der skal håndteres med dedikerede skills.

## Arbejdshypotese

Codex er primær målplatform. Kimi, Qwen Code og Gemini Code skal bruge samme `AGENTS.md`, skills og agentroster, men kan kræve adaptere eller manuel pegekonfiguration.

## Vigtige afgrænsninger

- `Kombi/` er reference- og inspirationsmateriale, ikke aktiv runtime.
- `system_prompts_leaks` må ikke kopieres som autoritativ systemprompt.
- Upstream repos må kun adopteres efter kritisk vurdering og lokal tilpasning.
"@
Write-TextFile -Path ".vscode/.codex/Brain/context.md" -Content $brainContext

$operatingPrinciples = @"
# Operating Principles

## Karpathy-inspireret basisadfærd

1. Tænk før handling: angiv antagelser, uklarheder og tradeoffs.
2. Simplicity first: lav den mindste løsning der løser opgaven.
3. Kirurgiske ændringer: rør kun filer og linjer der er relevante.
4. Målstyret eksekvering: definer succeskriterier og verificér.

## Projektregler

- Brug `.vscode/.codex/` som aktiv kilde til sandhed.
- Brug `AGENTS.md`, ikke klientnavnede filer som `CLAUDE.md`, `GEMINI.md` eller `CODEX.md`.
- Brug `uv run` til Python.
- Opret nye scripts i `temp/`.
- Slet aldrig filer, du ikke selv har oprettet.
- Verificér før en opgave markeres færdig.

## Banedanmark-regler

- Brug BDK-/BBTR-/BBE-/BKP-skills før generiske vurderinger.
- Marker altid kildegrundlag, antagelser og manglende materiale.
- Lever beslutningsklare output: matrix, notat, checkliste, log eller acceptkriterier.
"@
Write-TextFile -Path ".vscode/.codex/Brain/operating-principles.md" -Content $operatingPrinciples

$sourceMap = @"
# Source Map

## Aktiv runtime

- `.vscode/.codex/AGENTS.md`
- `.vscode/.codex/prompts/`
- `.vscode/.codex/skills/`
- `.vscode/.codex/agents/`
- `.vscode/.codex/Brain/`

## Adaptere

- `.vscode/settings/claude.json`
- `.vscode/settings/gemini.json`
- `.vscode/settings/AGENTS.md`

## Referencekataloger

- `Kombi/skills-main`: Matt Pocock skills, nu installeret projektlokalt fra upstream.
- `Kombi/andrej-karpathy-skills-main`: Karpathy-principper, installeret som `karpathy-guidelines`.
- `Kombi/everything-claude-code-main`: agent-/hook-/harness-inspiration. Brug selektivt.
- `Kombi/agency-agents-main`: rolleprofil-inspiration. Brug formatmønstre, ikke blind kopiering.
- `Kombi/system_prompts_leaks-main`: researchmateriale. Må ikke bruges som aktiv runtime.
- `Avatar/`: visuelle aktiver og rolleprofiler for avatar-agenter.
"@
Write-TextFile -Path ".vscode/.codex/Brain/source-map.md" -Content $sourceMap

$adr = @"
# ADR-0001: Agent-harness-struktur

## Status

Accepted

## Context

Projektet skal fungere som genbrugelig skabelon for flere LLM-klienter i VS Code: primært Codex og Kimi, senere også Qwen Code og Gemini Code.

Der findes mange reference-repos i `Kombi/`, men aktiv runtime skal være enkel, lokal og kontrollerbar.

## Decision

- `.vscode/.codex/` er aktiv runtime-kerne.
- Root `AGENTS.md` er fælles indgangspunkt for alle modeller.
- Klientspecifikke filer som `CLAUDE.md`, `GEMINI.md` og `CODEX.md` oprettes ikke som aktive instruktioner.
- `.vscode/settings/` bruges kun som adapterlag.
- `Kombi/` bruges som reference og arkiv, ikke runtime.
- `Brain/` oprettes under `.vscode/.codex/` og følger Karpathy-principperne.
- Rolleprofiler samles i `.vscode/.codex/agents/`, mens avatar-specifikke promptfiler ligger i `Avatar/agents/`.

## Consequences

Alle modeller kan pege mod samme instruktioner og skills. Det reducerer drift mellem klienter og gør projektet nemmere at kopiere som skabelon.

Ulempen er, at nogle klienter kan kræve manuel adapterkonfiguration, fordi de ikke alle læser `AGENTS.md` og `.vscode/.codex/skills/` automatisk.
"@
Write-TextFile -Path ".vscode/.codex/Brain/adr/0001-agent-harness-structure.md" -Content $adr

$masterPrompt = @"
# Master System Prompt - Projektets Fælles Agent Harness

Du er en professionel agent i projektet **Kvalifikationsordning Entreprenør**. Du arbejder i et genbrugeligt agent-harness, hvor `.vscode/.codex/` er den aktive kilde til sandhed for prompts, skills, subagents, Brain og adaptere.

## Prioritet

1. Følg brugerens konkrete opgave.
2. Følg root `AGENTS.md`.
3. Følg `.vscode/.codex/AGENTS.md`.
4. Brug relevante agentprofiler fra `.vscode/.codex/agents/`.
5. Brug relevante skills fra `.vscode/.codex/skills/`.
6. Brug `Brain/` for domænesprog, beslutninger og kildeoverblik.

Hvis instruktioner konflikter, vælg den mest lokale og projektaktive instruktion. Brug ikke `.vscode/archive/` eller `Kombi/` som runtime, medmindre brugeren eksplicit beder om referenceanalyse.

## Grundadfærd

- Tænk før handling: angiv antagelser, uklarheder og tradeoffs.
- Vær kritisk: vurder om en idé faktisk forbedrer projektet.
- Hold løsninger enkle: ingen spekulative features eller unødige abstraktioner.
- Arbejd kirurgisk: ændr kun det der er nødvendigt.
- Verificér altid mod den oprindelige opgave før afslutning.
- Slet aldrig filer du ikke selv har oprettet.

## Projektstruktur

- Aktiv runtime: `.vscode/.codex/`
- Aktive prompts: `.vscode/.codex/prompts/`
- Aktive skills: `.vscode/.codex/skills/`
- Aktive subagents: `.vscode/.codex/agents/`
- Brain: `.vscode/.codex/Brain/`
- Delte hooks: `.vscode/hooks/`
- Klientadaptere: `.vscode/settings/`
- Reference/arkiv: `.vscode/archive/` og `Kombi/`

## Modelklienter

Codex er primær. Kimi, Qwen Code og Gemini Code skal bruge samme fælles opsætning via `AGENTS.md`, skills og agentroster. Hvis en klient kræver egen konfiguration, skal adapteren pege mod samme aktive kilde i stedet for at kopiere og divergere.

## Skillbrug

Brug skills som små, komponerbare arbejdsinstruktioner. Indlæs kun de relevante skills.

Standard:
- `karpathy-guidelines` for adfærd og verifikation.
- `shared-quality` for kvalitetskontrol.
- `shared-docx` ved Word-/dokumentopgaver.
- Matt Pocock-skills til engineering, PRD, TDD, triage, diagnose og arkitektur.
- BDK-/BBTR-/BBE-/BKP-skills ved Banedanmark-opgaver.

## Subagentbrug

Vælg subagent efter fagrolle og opgave:

- Interface Manager: grænseflader, fagpakker, BBTR/BBE/BKP, CSM/TSI, myndighed.
- Udbudskonsulent: udbud, krav, tilbud, evalueringskriterier, compliance.
- Fagprojektleder: leverancer, fremdrift, afhængigheder, beslutningspunkter.
- Ingeniørroller: tekniske krav, risici, faglige grænseflader, kvalitetssikring.
- Data/Finance/Product: datagrundlag, styring, business case, PRD, prioritering.

Hvis en rolle mangler, opret en ny profil fra `.vscode/.codex/agents/role-template.md`.

## Outputkrav

Svar skal være:
- strukturerede
- konkrete
- kilde- og antagelsesbevidste
- beslutningsklare
- verificerbare

Foretrukne formater:
- beslutningsnotat
- kravmatrix
- risikolog
- leveranceplan
- reviewliste
- acceptkriterier
- næste-handlingsliste

## Forbud

- Brug ikke leaked system prompts som autoritativ opskrift.
- Opret ikke `CLAUDE.md`, `GEMINI.md` eller `CODEX.md` som aktive projektfiler. Brug `AGENTS.md`.
- Installer ikke globalt, før projektlokal opsætning er testet.
- Gæt ikke på Banedanmark-regler. Marker manglende kilder.
"@
Write-TextFile -Path ".vscode/.codex/prompts/master-system.md" -Content $masterPrompt

$subagentBuilder = @'
# Subagent Builder Prompt

Brug denne prompt, når der skal oprettes en ny rolleagent.

## Input

- Rolle
- Fagområde
- Typiske opgaver
- Kilder/regler
- Relevante skills
- Outputtyper
- Kendte risici

## Arbejdsgang

1. Afklar om rollen allerede findes i `.vscode/.codex/agents/agent-roster.json`.
2. Find relevante skills i `.vscode/.codex/skills/`.
3. Skriv en rolleprofil fra `.vscode/.codex/agents/role-template.md`.
4. Tilføj systemprompt, subskills, testprompts og acceptkriterier.
5. Verificér at rollen ikke overlapper unødigt med eksisterende agenter.

## Standard Systemprompt-skelet

```text
Du er {navn}, projektets agent for rollen {rolle}.

Din mission er at {mission}.

Du arbejder med disse subskills:
{skills}

Når du svarer:
- angiv antagelser
- brug relevante kilder
- marker risici og mangler
- lever konkret næste handling
- verificér mod opgavens succeskriterier
```
'@
Write-TextFile -Path ".vscode/.codex/prompts/subagent-builder.md" -Content $subagentBuilder

$kombiAnalysis = @"
# Kombi-analyse og anvendelsesvurdering

## Scope

`Kombi/` er gennemgået på struktur-, README-, skill- og repræsentativ filniveau. Mappen indeholder flere tusinde filer, så den bør behandles som referencekatalog og ikke som direkte runtime.

## Hovedfund

| Kilde | Vurdering | Anbefalet brug |
|---|---|---|
| `skills-main` / `mattpocock/skills` | Høj værdi. Små, komponerbare engineering-skills. | Installer projektlokalt i `.vscode/.codex/skills/`. |
| `andrej-karpathy-skills-main` | Høj værdi som adfærdsprincipper. | Brug som `karpathy-guidelines` skill og Brain-princip. |
| `everything-claude-code-main` | Meget omfattende harness med agents, commands, hooks. | Brug selektivt til mønstre; kopier ikke hele runtime. |
| `agency-agents-main` | God inspiration til rolleprofiler. | Brug format og ideer til Banedanmark-subagents. |
| `planning-with-files-master` | God til plan-/filbaseret arbejdsdisciplin og multi-klient-adaptere. | Brug som reference for adapterstrategi. |
| `system_prompts_leaks-main` | Risikabelt som runtime; nyttigt kun til analyse af mønstre. | Må ikke anvendes som autoritativ systemprompt. |
| `claude-code-main`, `agentic-stack-master`, `oh-my-openagent-dev`, `get-shit-done-main` | Store frameworks med blandet relevans. | Udtræk kun hooks/agentmønstre efter review. |

## Beslutning

Projektet skal ikke kombinere alle frameworks direkte. Den robuste løsning er et smalt aktivt lag:

- `AGENTS.md` som fælles instruktion
- `.vscode/.codex/prompts/` for master- og workflowprompts
- `.vscode/.codex/skills/` for aktive skills
- `.vscode/.codex/agents/` for rolleprofiler
- `.vscode/.codex/Brain/` for principper og beslutninger
- `.vscode/settings/` som adapterlag

## Kritisk vurdering

Det største risikopunkt er at kopiere for meget fra store agent-frameworks. Det giver hurtigt konflikter, dobbelte hooks, modstridende regler og lavere forudsigelighed. Den bedste praksis for dette projekt er at installere små skills, definere klare rolleprofiler og kun aktivere hooks, som håndhæver konkrete projektregler.

## Status efter opsætning

- Matt Pocock-skills er installeret projektlokalt.
- Karpathy-principper er installeret som skill.
- Brain-struktur er oprettet.
- Avatar-agenter har individuelle promptprofiler.
- Interface Manager er oprettet som første Banedanmark/BaneByg-subagent.
"@
Write-TextFile -Path "docs/agent-harness-kombi-analysis.md" -Content $kombiAnalysis

$issueTracker = @"
# Issue Tracker

Dette projekt er ikke registreret som Git-repo i den aktuelle workspace. Indtil et GitHub/GitLab-remote er etableret, bruger agent-skills lokal markdown som issue tracker.

## Lokal struktur

Issues og planer skrives under:

```text
.scratch/<feature-or-topic>/
```

Anbefalet filnavn:

```text
YYYY-MM-DD-short-title.md
```

## Regler

- Brug lokale issues til planlægning, triage og opgaveopdeling.
- Opret ikke GitHub/GitLab-issues uden eksplicit brugerbesked.
- Når projektet senere bliver et repo, kan dette dokument opdateres til GitHub eller GitLab.
"@
Write-TextFile -Path "docs/agents/issue-tracker.md" -Content $issueTracker

$triageLabels = @"
# Triage Labels

Standard label vocabulary for agent-skills:

| Rolle | Label |
|---|---|
| Needs triage | `needs-triage` |
| Needs info | `needs-info` |
| Ready for agent | `ready-for-agent` |
| Ready for human | `ready-for-human` |
| Won't fix | `wontfix` |

Hvis projektet senere flyttes til GitHub/GitLab, skal disse labels enten oprettes i issue trackeren eller mappes til eksisterende labels.
"@
Write-TextFile -Path "docs/agents/triage-labels.md" -Content $triageLabels

$domainDocs = @"
# Domain Docs

## Layout

Dette projekt bruger et single-context layout med Brain som aktivt domænelag:

- `.vscode/.codex/Brain/context.md`
- `.vscode/.codex/Brain/operating-principles.md`
- `.vscode/.codex/Brain/source-map.md`
- `.vscode/.codex/Brain/adr/`

## For skills fra Matt Pocock

Når en skill forventer `CONTEXT.md` eller `docs/adr/`, skal agenten først læse Brain-filerne ovenfor. Hvis der senere oprettes root `CONTEXT.md`, skal den pege på Brain eller holdes synkron.

## Sprog

Brug projektets egne begreber:

- agent harness
- runtime-kerne
- adapterlag
- Brain
- subagent
- subskill
- BaneByg
- BBTR
- BBE
- BKP
"@
Write-TextFile -Path "docs/agents/domain.md" -Content $domainDocs

$settingsAgents = @"
# Settings Adapter Notes

`.vscode/settings/` er adapterlag. Det må ikke blive en separat kilde til agentinstruktioner.

## Regel

Alle klienter skal pege mod:

- root `AGENTS.md`
- `.vscode/.codex/AGENTS.md`
- `.vscode/.codex/prompts/`
- `.vscode/.codex/skills/`
- `.vscode/.codex/agents/`

## Klienter

- Codex: primær runtime via `.vscode/.codex/`
- Kimi: peg manuelt mod `AGENTS.md` og `.vscode/.codex/` hvis klienten ikke gør det automatisk
- Qwen Code: samme princip som Kimi
- Gemini Code: adapterfil findes i `gemini.json`, men aktiv kilde er stadig `.vscode/.codex/`

Opret ikke separate `Claude.md`, `Gemini.md`, `Codex.md` eller `Kimi.md` som aktive instruktioner. Brug `AGENTS.md`.
"@
Write-TextFile -Path ".vscode/settings/AGENTS.md" -Content $settingsAgents

New-Item -ItemType Directory -Path ".scratch" -Force | Out-Null

Write-Output "Generated agent harness files: $($profiles.Count) avatar profiles, Brain, prompts, docs, and runtime indexes."
