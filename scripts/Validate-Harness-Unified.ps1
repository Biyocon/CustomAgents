#Requires -Version 5.1
<#
.SYNOPSIS
    Samlet (konsolideret) validering af agent-harnesset.
.DESCRIPTION
    Denne fil erstatter tre tidligere uafhaengige "valider harness"-scripts, som
    tjekkede materielt forskellige, ikke-overlappende strukturer:

      - scripts/validate-harness.ps1            (94 linjer, oprindelig)
      - scripts/Validate-AgentHarness.ps1        (197 linjer, oprindelig)
      - .agents/scripts/validate-harness.ps1     (244 linjer, oprindelig)

    Konsolideringen er en UNION af alle tjek fra alle tre originaler - ingen nye
    tjek er opfundet. Hvert tjek er markeret med hvilket originalt script
    ("check-domain") det stammer fra, saa intet er tvetydigt. De tre originale
    filer er nu tynde deprecation-wrappers der kalder denne fil (se selve
    filerne for detaljer). Se ogsaa docs/architecture/validate-scripts-map.md.

    SEKTIONER (check-domaener) i denne fil:

      A. Roster <-> Avatar/agents/System_Prompt_Agent_<id>.md
         - Eksistens, ```text fence, mojibake-encoding  (fra scripts/validate-harness.ps1)
         - status/skills/avatar/id felt-konsistens        (fra scripts/Validate-AgentHarness.ps1,
           strikt dybere end den tilsvarende - nu droppede - svagere variant i
           scripts/validate-harness.ps1, som kun tjekkede eksistens)
         - Orphan-filer (begge originaler tjekkede dette identisk - koeres en gang)

      B. Banedanmark-agenter, BREDDE-variant: alle *.md (undtagen README.md) i
         .vscode/.codex/agents/banedanmark/ skal have YAML-frontmatter
         (fra scripts/validate-harness.ps1)

      C. Banedanmark-agenter, SNAEVER-variant: kun bd-*.md filer i samme mappe
         skal have YAML-frontmatter (fra scripts/Validate-AgentHarness.ps1)
         NB: B og C har forskellige filter (alle .md vs. kun bd-*.md) og kan derfor
         give forskellige resultater - begge bevares uaendret jf. konsolideringskravet.

      D. Canonical registry/brain + genereret Brain-pointer eksistens. Opdateret ved
         post-PR F-oprydningen 2026-07-11; foer da: Root/registry.yaml +
         .vscode/.codex/Brain/{glossary,open-questions,source-map}.md eksistens
         (fra scripts/validate-harness.ps1 - ingen tilsvarende tjek i de to andre originaler)

      E. .agents/scripts/audit-harness.ps1 som sub-fase (fra .agents/scripts/validate-harness.ps1)

      F. .agents/registry.yaml version:/agents:-felter (fra .agents/scripts/validate-harness.ps1)

      G. .agents/agents/<id>/ <-> agent-roster.json krydstjek, begge veje
         (fra .agents/scripts/validate-harness.ps1)

      H. .agents/skills/*/SKILL.md markdown-overskrift (fra .agents/scripts/validate-harness.ps1)

.PARAMETER Root
    Rodstien til projektet. Default er nuvaerende mappe.
.PARAMETER JsonReport
    Valgfri sti til JSON-rapport (samme skema som scripts/Validate-AgentHarness.ps1,
    udvidet med Domain-felt pr. finding).
.PARAMETER SkipAudit
    Spring .agents/scripts/audit-harness.ps1 sub-fasen over (svarer til -SkipAudit
    i .agents/scripts/validate-harness.ps1).
.EXAMPLE
    .\scripts\Validate-Harness-Unified.ps1
    .\scripts\Validate-Harness-Unified.ps1 -JsonReport out.json -Root "C:\projekt"
.NOTES
    Skriver ogsaa .agents/reports/validation_report.md (med .bak-backup af evt.
    eksisterende rapport), praecis som .agents/scripts/validate-harness.ps1 gjorde.
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$Root = (Get-Location),
    [string]$JsonReport = $null,
    [switch]$SkipAudit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Faelles severity-vokabular (Dansk konsol-label, konsistent med originalerne) ---
# OK / INFO / ADVARSEL(=WARN) / FEJL(=ERROR) / KRITISK(=CRITICAL)

$script:findings = @()
$script:okCount       = 0
$script:infoCount     = 0
$script:warnCount     = 0
$script:errorCount    = 0
$script:criticalCount = 0
$script:skillTotal    = 0   # antal .agents/skills/*/SKILL.md (metrik, jf. docs/active/#3)

function Add-Finding {
    param(
        [Parameter(Mandatory)][ValidateSet("OK","INFO","WARN","ERROR","CRITICAL")][string]$Severity,
        [Parameter(Mandatory)][string]$Domain,
        [Parameter(Mandatory)][string]$Message,
        [string]$AgentId = ""
    )
    $script:findings += [PSCustomObject]@{
        Severity = $Severity
        Domain   = $Domain
        Message  = $Message
        AgentId  = $AgentId
        Time     = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    }
    switch ($Severity) {
        "OK"       { $script:okCount++ }
        "INFO"     { $script:infoCount++ }
        "WARN"     { $script:warnCount++ }
        "ERROR"    { $script:errorCount++ }
        "CRITICAL" { $script:criticalCount++ }
    }
}

function Write-Status {
    param([string]$Severity, [string]$Message)
    switch ($Severity) {
        "OK"       { Write-Host "  [OK]       $Message" -ForegroundColor Green }
        "INFO"     { Write-Host "  [INFO]     $Message" -ForegroundColor Cyan }
        "WARN"     { Write-Host "  [ADVARSEL] $Message" -ForegroundColor Yellow }
        "ERROR"    { Write-Host "  [FEJL]     $Message" -ForegroundColor Red }
        "CRITICAL" { Write-Host "  [KRITISK]  $Message" -ForegroundColor Red }
        default    { Write-Host "  [$Severity] $Message" }
    }
}

function Write-SectionHeader {
    param([string]$Letter, [string]$Title, [string]$SourceScript)
    Write-Host ""
    Write-Host "=== SEKTION ${Letter}: $Title ===" -ForegroundColor Magenta
    Write-Host "    (check-domaene fra: $SourceScript)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=== VALIDER HARNESS (samlet/unified) ===" -ForegroundColor Cyan
Write-Host "Projektrod: $Root" -ForegroundColor Gray

$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir  = Join-Path $Root "Avatar/agents"
$baneDir    = Join-Path $Root ".vscode/.codex/agents/banedanmark"

# =====================================================================
# SEKTION A: Roster <-> Avatar/agents (scripts/validate-harness.ps1 +
#            scripts/Validate-AgentHarness.ps1)
# =====================================================================
Write-SectionHeader -Letter "A" -Title "Roster <-> Avatar/agents/System_Prompt_Agent_<id>.md" `
    -SourceScript "scripts/validate-harness.ps1 (eksistens/fence/encoding/orphans) + scripts/Validate-AgentHarness.ps1 (status/skills/avatar/id)"

if (!(Test-Path $rosterPath)) {
    Add-Finding "CRITICAL" "A" "agent-roster.json mangler: $rosterPath"
    Write-Status "CRITICAL" "agent-roster.json mangler: $rosterPath"
    $roster = $null
} else {
    $roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
    Add-Finding "INFO" "A" "Roster indlaest: $($roster.Count) agenter"
    Write-Status "INFO" "Roster indlaest: $($roster.Count) agenter"
}

$mdFiles = @()
if ($roster) {
    $mdFiles = Get-ChildItem $agentsDir -Filter "System_Prompt_Agent_*.md" -ErrorAction SilentlyContinue
    $mdProfiles = @{}
    foreach ($f in $mdFiles) {
        $mdProfiles[$f.Name] = Get-Content $f.FullName -Encoding UTF8 -Raw
    }

    foreach ($agent in $roster) {
        $id = $agent.id
        $expectedFile = "System_Prompt_Agent_$id.md"
        $filePath = Join-Path $agentsDir $expectedFile

        # -- eksistens (fra begge originaler; identisk logik, koeres en gang) --
        if (!(Test-Path $filePath)) {
            Add-Finding "ERROR" "A" "Manglende agent-fil: $filePath" $id
            Write-Status "ERROR" "Manglende agent-fil: $filePath"
            continue
        }

        $content = $mdProfiles[$expectedFile]

        # -- ```text fence (fra scripts/validate-harness.ps1) --
        # BUGFIX 2026-07-11: matchet brugte en DOUBLE-quoted "```text", hvor PowerShell
        # fortolker backticks som escapes (`` -> literal `, `t -> TAB) — regexen blev
        # reelt '`<TAB>ext' og matchede aldrig, saa ALLE filer fik falsk advarsel
        # (dokumenteret i be03741c). Nu bygges labelen single-quoted (literal) og
        # regex-escapes eksplicit. Residual-advarsler herefter er AEGTE fund.
        $fenceLabel = '```text'
        if ($content -notmatch [regex]::Escape($fenceLabel)) {
            Add-Finding "WARN" "A" "${filePath}: mangler $fenceLabel fence" $id
            Write-Status "WARN" "${filePath}: mangler $fenceLabel fence"
        }

        # -- mojibake-encoding (fra scripts/validate-harness.ps1) --
        if ($content -match "Ã¦|Ã") {
            Add-Finding "WARN" "A" "${filePath}: ser ud til at have encoding-problemer" $id
            Write-Status "WARN" "${filePath}: ser ud til at have encoding-problemer"
        }

        # -- status: active (fra scripts/Validate-AgentHarness.ps1) --
        if ($content -match "(?m)^status:\s*(\S+)") {
            $mdStatus = $Matches[1].Trim()
            if ($mdStatus -ne "active") {
                Add-Finding "WARN" "A" "Profil status er '$mdStatus', forventet 'active'" $id
                Write-Status "WARN" "[$id] Profil status er '$mdStatus', forventet 'active'"
            }
        } else {
            Add-Finding "WARN" "A" "Profil mangler status-felt" $id
            Write-Status "WARN" "[$id] Profil mangler status-felt"
        }

        # -- skills-diff (fra scripts/Validate-AgentHarness.ps1) --
        $rosterSkills = @($agent.skills | Sort-Object)
        if ($content -match "(?ms)^skills:\s*\r?\n((?:\s*-\s+\S+\s*\r?\n)+)") {
            $mdSkillsBlock = $Matches[1]
            $mdSkills = @([regex]::Matches($mdSkillsBlock, "-\s+(\S+)") | ForEach-Object { $_.Groups[1].Value } | Sort-Object)
            $skillDiff = Compare-Object $rosterSkills $mdSkills -PassThru
            if ($skillDiff) {
                $onlyRoster = $skillDiff | Where-Object { $rosterSkills -contains $_ }
                $onlyMd = $skillDiff | Where-Object { $mdSkills -contains $_ }
                if ($onlyRoster) {
                    Add-Finding "WARN" "A" "Skills kun i roster: $($onlyRoster -join ', ')" $id
                    Write-Status "WARN" "[$id] Skills kun i roster: $($onlyRoster -join ', ')"
                }
                if ($onlyMd) {
                    Add-Finding "WARN" "A" "Skills kun i .md: $($onlyMd -join ', ')" $id
                    Write-Status "WARN" "[$id] Skills kun i .md: $($onlyMd -join ', ')"
                }
            }
        } else {
            Add-Finding "WARN" "A" "Kan ikke parse skills fra .md frontmatter" $id
            Write-Status "WARN" "[$id] Kan ikke parse skills fra .md frontmatter"
        }

        # -- avatar filnavn-match (fra scripts/Validate-AgentHarness.ps1) --
        if ($content -match "(?m)^avatar:\s*(.+)$") {
            $mdAvatar = $Matches[1].Trim()
            $rosterAvatar = $agent.avatar
            $mdFileName = Split-Path $mdAvatar -Leaf
            $rosterFileName = Split-Path $rosterAvatar -Leaf
            if ($mdFileName -ne $rosterFileName) {
                Add-Finding "WARN" "A" "Avatar mismatch: roster='$rosterFileName' vs md='$mdFileName'" $id
                Write-Status "WARN" "[$id] Avatar mismatch: roster='$rosterFileName' vs md='$mdFileName'"
            }
        } else {
            Add-Finding "WARN" "A" "Profil mangler avatar-felt" $id
            Write-Status "WARN" "[$id] Profil mangler avatar-felt"
        }

        # -- id felt-match (fra scripts/Validate-AgentHarness.ps1) --
        if ($content -match "(?m)^id:\s*(.+)$") {
            $mdId = $Matches[1].Trim()
            if ($mdId -ne $id) {
                Add-Finding "ERROR" "A" "ID mismatch: roster='$id' vs md='$mdId'" $id
                Write-Status "ERROR" "[$id] ID mismatch: roster='$id' vs md='$mdId'"
            }
        } else {
            Add-Finding "WARN" "A" "Profil mangler id-felt" $id
            Write-Status "WARN" "[$id] Profil mangler id-felt"
        }
    }

    # -- orphan-filer (identisk i begge originaler, koeres en gang) --
    $rosterIds = @($roster | ForEach-Object { $_.id })
    foreach ($f in $mdFiles) {
        $m = $f.Name -replace "System_Prompt_Agent_", "" -replace "\.md$", ""
        if ($m -notin $rosterIds) {
            Add-Finding "WARN" "A" "Orphan agent-fil uden roster-entry: $($f.Name)" $m
            Write-Status "WARN" "Orphan agent-fil uden roster-entry: $($f.Name)"
        }
    }
} else {
    Write-Status "INFO" "Springer Sektion A over - roster kunne ikke indlaeses"
}

# =====================================================================
# SEKTION B: Banedanmark, BREDDE-variant (scripts/validate-harness.ps1)
# =====================================================================
Write-SectionHeader -Letter "B" -Title "Banedanmark-agenter - alle *.md (bredde)" `
    -SourceScript "scripts/validate-harness.ps1"

if (Test-Path $baneDir) {
    # @() noedvendig: efter PR F-aktiveringen er der kun README.md tilbage paa topniveau,
    # og et enkelt resultat er en skalar uden .Count under StrictMode.
    $baneFilesWide = @(Get-ChildItem $baneDir -Filter "*.md" -ErrorAction SilentlyContinue)
    Add-Finding "INFO" "B" "Banedanmark-agenter (alle *.md): $($baneFilesWide.Count)"
    Write-Status "INFO" "Banedanmark-agenter (alle *.md): $($baneFilesWide.Count)"
    foreach ($f in $baneFilesWide) {
        if ($f.Name -eq "README.md") { continue }
        $txt = Get-Content $f.FullName -Encoding UTF8 -Raw
        if ($txt -notmatch "^---") {
            Add-Finding "WARN" "B" "$($f.Name): mangler YAML-frontmatter"
            Write-Status "WARN" "$($f.Name): mangler YAML-frontmatter"
        }
    }
} else {
    Add-Finding "WARN" "B" "Banedanmark-mappe mangler: $baneDir"
    Write-Status "WARN" "Banedanmark-mappe mangler: $baneDir"
}

# =====================================================================
# SEKTION C: Banedanmark, SNAEVER-variant bd-*.md (scripts/Validate-AgentHarness.ps1)
# =====================================================================
Write-SectionHeader -Letter "C" -Title "Banedanmark-agenter - kun bd-*.md (snaever)" `
    -SourceScript "scripts/Validate-AgentHarness.ps1"

if (Test-Path $baneDir) {
    # @() noedvendig: efter PR F-aktiveringen findes ingen flade bd-*.md laengere
    # (rolleagenter ligger som <id>/profile.md), og 0/1 resultater er skalar/null under StrictMode.
    $baneFilesNarrow = @(Get-ChildItem $baneDir -Filter "bd-*.md" -ErrorAction SilentlyContinue)
    Add-Finding "INFO" "C" "Banedanmark-agenter (bd-*.md): $($baneFilesNarrow.Count)"
    Write-Status "INFO" "Banedanmark-agenter (bd-*.md): $($baneFilesNarrow.Count)"
    foreach ($f in $baneFilesNarrow) {
        $txt = Get-Content $f.FullName -Encoding UTF8 -Raw
        if ($txt -notmatch "^---") {
            Add-Finding "WARN" "C" "$($f.Name): mangler YAML-frontmatter"
            Write-Status "WARN" "$($f.Name): mangler YAML-frontmatter"
        }
    }
} else {
    Add-Finding "WARN" "C" "Banedanmark-mappe mangler: $baneDir"
    Write-Status "WARN" "Banedanmark-mappe mangler: $baneDir"
}

# =====================================================================
# SEKTION D: Root/registry.yaml + Brain-filer (scripts/validate-harness.ps1)
# =====================================================================
Write-SectionHeader -Letter "D" -Title "Canonical registry + brain + genereret Brain-pointer eksistens" `
    -SourceScript "scripts/validate-harness.ps1"

# Post-oprydning (2026-07-11): rod-registry.yaml er SLETTET (deprecated ved PR F);
# canonical registry + brain er sandheden, og runtime-Brain er en genereret pointer.
$dFiles = @(
    ".agents/registry.yaml",
    ".agents/brain/context.md",
    ".agents/brain/glossary.md",
    ".agents/brain/open-questions.md",
    ".agents/brain/source-map.md",
    ".vscode/.codex/Brain/AGENTS.md"
)
foreach ($bf in $dFiles) {
    $p = Join-Path $Root $bf
    if (Test-Path $p) {
        Add-Finding "INFO" "D" "$bf findes"
        Write-Status "INFO" "$bf findes"
    } else {
        Add-Finding "WARN" "D" "$bf mangler"
        Write-Status "WARN" "$bf mangler"
    }
}

# =====================================================================
# SEKTION E: .agents/scripts/audit-harness.ps1 sub-fase
#            (.agents/scripts/validate-harness.ps1)
# =====================================================================
Write-SectionHeader -Letter "E" -Title ".agents/scripts/audit-harness.ps1 sub-fase" `
    -SourceScript ".agents/scripts/validate-harness.ps1"

if (-not $SkipAudit) {
    $auditScript = Join-Path $Root ".agents/scripts/audit-harness.ps1"
    if (Test-Path $auditScript) {
        try {
            & $auditScript -Root $Root
            $auditExit = $LASTEXITCODE
            if ($auditExit -eq 0) {
                Add-Finding "OK" "E" "Audit fuldfoert uden fejl"
                Write-Status "OK" "Audit fuldfoert uden fejl"
            } else {
                Add-Finding "WARN" "E" "Audit rapporterede problemer (exit $auditExit)"
                Write-Status "WARN" "Audit rapporterede problemer (exit $auditExit)"
            }
        } catch {
            Add-Finding "ERROR" "E" "Audit-script fejlede: $_"
            Write-Status "ERROR" "Audit-script fejlede: $_"
        }
    } else {
        Add-Finding "ERROR" "E" "audit-harness.ps1 ikke fundet: $auditScript"
        Write-Status "ERROR" "audit-harness.ps1 ikke fundet: $auditScript"
    }
} else {
    Write-Host "  Springer audit over (-SkipAudit)" -ForegroundColor Cyan
}

# =====================================================================
# SEKTION F: .agents/registry.yaml felter (.agents/scripts/validate-harness.ps1)
# =====================================================================
Write-SectionHeader -Letter "F" -Title ".agents/registry.yaml version:/agents:-felter" `
    -SourceScript ".agents/scripts/validate-harness.ps1"

$agentsRegistryPath = Join-Path $Root ".agents/registry.yaml"
if (Test-Path $agentsRegistryPath) {
    $registryContent = Get-Content $agentsRegistryPath -Encoding UTF8 -Raw -ErrorAction SilentlyContinue
    if ($registryContent -match "(?m)^version:") {
        Add-Finding "OK" "F" "registry.yaml har version-felt"
        Write-Status "OK" "registry.yaml har version-felt"
    } else {
        Add-Finding "WARN" "F" "registry.yaml mangler version-felt"
        Write-Status "WARN" "registry.yaml mangler version-felt"
    }
    if ($registryContent -match "(?m)^agents:") {
        Add-Finding "OK" "F" "registry.yaml har agents-sektion"
        Write-Status "OK" "registry.yaml har agents-sektion"
    } else {
        Add-Finding "WARN" "F" "registry.yaml mangler agents-sektion"
        Write-Status "WARN" "registry.yaml mangler agents-sektion"
    }
} else {
    Add-Finding "ERROR" "F" "registry.yaml mangler: $agentsRegistryPath"
    Write-Status "ERROR" "registry.yaml mangler: $agentsRegistryPath"
}

# =====================================================================
# SEKTION G: .agents/agents/<id>/ <-> agent-roster.json (begge veje)
#            (.agents/scripts/validate-harness.ps1)
# =====================================================================
Write-SectionHeader -Letter "G" -Title ".agents/agents/<id>/ <-> agent-roster.json krydstjek" `
    -SourceScript ".agents/scripts/validate-harness.ps1"

$agentsAgentsDir = Join-Path $Root ".agents/agents"
# Meta-agenter er avatarløse orkestratorer der bevidst UDELADES af den Avatar-baserede
# agent-roster.json (dokumenteret i .agents/registry.yaml med meta_agent/roster_exempt).
# De skal derfor ikke give "mangler i roster"-advarsel her.
$rosterExemptMetaAgents = @('council-chairman')
if (Test-Path $agentsAgentsDir) {
    $agentDirs = Get-ChildItem $agentsAgentsDir -Directory -ErrorAction SilentlyContinue
    if (Test-Path $rosterPath) {
        try {
            $rosterG = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
            $rosterIdsG = @($rosterG | ForEach-Object { $_.id })

            foreach ($dir in $agentDirs) {
                if ($dir.Name -eq 'banedanmark') {
                    # Container for rolleagenter (role-vs-persona afgjort 2026-07-11):
                    # rolleagenter er roster-undtagne (ingen avatar-persona), jf.
                    # agent_model: role / roster_exempt i .agents/registry.yaml.
                    Add-Finding "INFO" "G" "Rolleagent-container 'banedanmark' er bevidst roster-undtaget (agent_model: role)"
                    Write-Status "INFO" "Rolleagent-container 'banedanmark' er bevidst roster-undtaget (agent_model: role)"
                } elseif ($dir.Name -in $rosterExemptMetaAgents) {
                    Add-Finding "INFO" "G" "Meta-agent '$($dir.Name)' er bevidst roster-undtaget (avatarløs)"
                    Write-Status "INFO" "Meta-agent '$($dir.Name)' er bevidst roster-undtaget (avatarløs)"
                } elseif ($dir.Name -notin $rosterIdsG) {
                    Add-Finding "WARN" "G" "Agent '$($dir.Name)' mangler i roster"
                    Write-Status "WARN" "Agent '$($dir.Name)' mangler i roster"
                } else {
                    Add-Finding "OK" "G" "Agent '$($dir.Name)' findes i roster"
                    Write-Status "OK" "Agent '$($dir.Name)' findes i roster"
                }
            }

            foreach ($id in $rosterIdsG) {
                $agentPath = Join-Path $agentsAgentsDir $id
                if (-not (Test-Path $agentPath)) {
                    Add-Finding "WARN" "G" "Roster-entry '$id' mangler agent-mappe"
                    Write-Status "WARN" "Roster-entry '$id' mangler agent-mappe"
                }
            }
        } catch {
            Add-Finding "ERROR" "G" "Kunne ikke parse agent-roster.json: $_"
            Write-Status "ERROR" "Kunne ikke parse agent-roster.json: $_"
        }
    } else {
        Add-Finding "INFO" "G" "agent-roster.json findes ikke - springer roster-konsistens over"
        Write-Status "INFO" "agent-roster.json findes ikke - springer roster-konsistens over"
    }
} else {
    Add-Finding "INFO" "G" ".agents/agents/ findes ikke - springer roster-konsistens over"
    Write-Status "INFO" ".agents/agents/ findes ikke - springer roster-konsistens over"
}

# =====================================================================
# SEKTION H: .agents/skills/*/SKILL.md overskrift (.agents/scripts/validate-harness.ps1)
# =====================================================================
Write-SectionHeader -Letter "H" -Title ".agents/skills/*/SKILL.md markdown-overskrift" `
    -SourceScript ".agents/scripts/validate-harness.ps1"

$agentsSkillsDir = Join-Path $Root ".agents/skills"
if (Test-Path $agentsSkillsDir) {
    $skillDirs = Get-ChildItem $agentsSkillsDir -Directory -ErrorAction SilentlyContinue
    foreach ($dir in $skillDirs) {
        $skillMd = Join-Path $dir.FullName "SKILL.md"
        if (Test-Path $skillMd) {
            $script:skillTotal++
            $content = Get-Content $skillMd -Encoding UTF8 -Raw -ErrorAction SilentlyContinue
            if ($content -match "(?m)^#\s+") {
                Add-Finding "OK" "H" "Skill '$($dir.Name)' har gyldig SKILL.md med overskrift"
                Write-Status "OK" "Skill '$($dir.Name)' har gyldig SKILL.md med overskrift"
            } else {
                Add-Finding "WARN" "H" "Skill '$($dir.Name)' SKILL.md mangler overskrift"
                Write-Status "WARN" "Skill '$($dir.Name)' SKILL.md mangler overskrift"
            }
        }
    }
} else {
    Add-Finding "INFO" "H" ".agents/skills/ findes ikke - springer skills-validering over"
    Write-Status "INFO" ".agents/skills/ findes ikke - springer skills-validering over"
}

# =====================================================================
# SAMLET OPSUMMERING (faelles for hele unified-scriptet)
# =====================================================================
Write-Host ""
Write-Host "=== METRIKKER (kanonisk kilde for tal, jf. docs/active/#3) ===" -ForegroundColor Cyan
Write-Status "INFO" "Aktive skills (.agents/skills/*/SKILL.md): $script:skillTotal"
Write-Host ""
Write-Host "=== SAMLET RESUME (alle sektioner A-H) ===" -ForegroundColor Cyan
Write-Status "OK" "OK:        $script:okCount"
Write-Status "INFO" "Info:      $script:infoCount"
if ($script:warnCount -gt 0)     { Write-Status "WARN" "Advarsler: $script:warnCount" }
if ($script:errorCount -gt 0)    { Write-Status "ERROR" "Fejl:      $script:errorCount" }
if ($script:criticalCount -gt 0) { Write-Status "CRITICAL" "Kritiske:  $script:criticalCount" }

$totalIssues = $script:criticalCount + $script:errorCount + $script:warnCount
Write-Host ""
if ($totalIssues -eq 0) {
    Write-Host "Harness er valideret OK (alle 8 sektioner)!" -ForegroundColor Green
} else {
    Write-Host "Harness har $totalIssues issue(s) paa tvaers af alle sektioner." -ForegroundColor Yellow
}

# --- JSON-rapport (fra scripts/Validate-AgentHarness.ps1's -JsonReport) ---
if ($JsonReport) {
    $report = [PSCustomObject]@{
        validatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
        root        = $Root
        summary     = [PSCustomObject]@{
            ok       = $script:okCount
            infos    = $script:infoCount
            warnings = $script:warnCount
            errors   = $script:errorCount
            critical = $script:criticalCount
        }
        findings    = $script:findings
    }
    $report | ConvertTo-Json -Depth 6 | Set-Content $JsonReport -Encoding UTF8
    Write-Host "JSON-rapport skrevet til $JsonReport" -ForegroundColor Gray
}

# --- .agents/reports/validation_report.md (fra .agents/scripts/validate-harness.ps1) ---
$reportLines = @()
$reportLines += "# Harness Valideringsrapport (samlet/unified)"
$reportLines += ""
$reportLines += "> **Status: AKTUEL (kanonisk valideringsrapport).** Denne fil er den ENESTE"
$reportLines += "> gaeldende valideringsrapport, auto-genereret ved hver koersel. Den aeldre"
$reportLines += "> ``reports/validation_report.md`` (2026-05-06) er markeret HISTORISK/SUPERSEDED."
$reportLines += ""
$reportLines += "Genereret: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$reportLines += "Projektrod: $Root"
$reportLines += ""
$reportLines += "Genereret af scripts/Validate-Harness-Unified.ps1 - konsolidering af"
$reportLines += "scripts/validate-harness.ps1, scripts/Validate-AgentHarness.ps1 og"
$reportLines += ".agents/scripts/validate-harness.ps1. Se doc-kommentaren i scriptet for"
$reportLines += "hvilken sektion (A-H) der stammer fra hvilket oprindeligt script."
$reportLines += ""
$reportLines += "## Resultat"
$reportLines += ""
$reportLines += "- OK: $script:okCount"
$reportLines += "- Info: $script:infoCount"
$reportLines += "- Advarsler: $script:warnCount"
$reportLines += "- Fejl: $script:errorCount"
$reportLines += "- Kritiske: $script:criticalCount"
$reportLines += ""
$reportLines += "---"

$reportDir = Join-Path $Root ".agents/reports"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$reportPath = Join-Path $reportDir "validation_report.md"

if (Test-Path $reportPath) {
    $backupPath = "$reportPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $reportPath $backupPath -Force
    Write-Status "INFO" "Backup oprettet: $backupPath"
}

$reportLines | Out-File $reportPath -Encoding UTF8
Write-Status "OK" "Rapport skrevet til: $reportPath"

# --- Exit code (faelles konvention) ---
if ($script:criticalCount -gt 0 -or $script:errorCount -gt 0) {
    exit 1
}
exit 0
