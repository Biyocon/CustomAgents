#Requires -Version 5.1
<#
.SYNOPSIS
    Validerer konsistens mellem agent-roster.json og Avatar/agents/*.md filer.
.DESCRIPTION
    Tjekker at hver agent i roster har en tilsvarende .md profil, at status er aktiv,
    at skills matcher, og at avatar paths er konsistente. Rapportér mangler og inkonsistenser.
.PARAMETER Root
    Rodstien til projektet. Default er nuværende mappe.
.PARAMETER JsonReport
    Sti til valgfri JSON-rapport.
.PARAMETER WhatIf
    Vis hvad der ville ske uden at ændre noget.
.EXAMPLE
    .\Validate-AgentHarness.ps1 -JsonReport validation-report.json
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$Root = (Get-Location),
    [string]$JsonReport = $null
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Hjælpefunktioner ---

function Write-Color {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

function Add-Finding {
    param([string]$Severity, [string]$Message, [string]$AgentId = "")
    $script:findings += [PSCustomObject]@{
        Severity = $Severity
        Message  = $Message
        AgentId  = $AgentId
        Time     = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    }
}

# --- Initialisering ---

$findings = @()
$rosterPath  = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir   = Join-Path $Root "Avatar/agents"
$baneDir     = Join-Path $Root ".vscode/.codex/agents/banedanmark"

Write-Color "=== Agent Harness Validator ===" "Cyan"
Write-Color "Root: $Root" "Gray"

# Tjek at roster findes
if (!(Test-Path $rosterPath)) {
    Add-Finding "CRITICAL" "agent-roster.json mangler: $rosterPath" ""
    Write-Color "CRITICAL: agent-roster.json mangler" "Red"
    exit 1
}

# Indlæs roster
$roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
Add-Finding "INFO" "Roster indlaest: $($roster.Count) agenter" ""

# Indlæs alle .md profiler
$mdProfiles = @{}
$mdFiles = Get-ChildItem $agentsDir -Filter "System_Prompt_Agent_*.md" -ErrorAction SilentlyContinue
foreach ($f in $mdFiles) {
    $content = Get-Content $f.FullName -Encoding UTF8 -Raw
    $mdProfiles[$f.Name] = $content
}

# --- Valideringer ---

# 1. Hver agent i roster har tilsvarende .md profil
foreach ($agent in $roster) {
    $expectedFile = "System_Prompt_Agent_$($agent.id).md"
    $filePath = Join-Path $agentsDir $expectedFile

    if (!(Test-Path $filePath)) {
        Add-Finding "ERROR" "Manglende profil-fil: $expectedFile" $agent.id
        continue
    }

    # 2. Tjek at .md profil har status: active
    $content = $mdProfiles[$expectedFile]
    if ($content -match "(?m)^status:\s*(\S+)") {
        $mdStatus = $Matches[1].Trim()
        if ($mdStatus -ne "active") {
            Add-Finding "WARN" "Profil status er '$mdStatus', forventet 'active'" $agent.id
        }
    } else {
        Add-Finding "WARN" "Profil mangler status-felt" $agent.id
    }

    # 3. Tjek skills konsistens
    $rosterSkills = @($agent.skills | Sort-Object)
    if ($content -match "(?ms)^skills:\s*\r?\n((?:\s*-\s+\S+\s*\r?\n)+)") {
        $mdSkillsBlock = $Matches[1]
        $mdSkills = @([regex]::Matches($mdSkillsBlock, "-\s+(\S+)") | ForEach-Object { $_.Groups[1].Value } | Sort-Object)
        $skillDiff = Compare-Object $rosterSkills $mdSkills -PassThru
        if ($skillDiff) {
            $onlyRoster = $skillDiff | Where-Object { $rosterSkills -contains $_ }
            $onlyMd = $skillDiff | Where-Object { $mdSkills -contains $_ }
            if ($onlyRoster) {
                Add-Finding "WARN" "Skills kun i roster: $($onlyRoster -join ', ')" $agent.id
            }
            if ($onlyMd) {
                Add-Finding "WARN" "Skills kun i .md: $($onlyMd -join ', ')" $agent.id
            }
        }
    } else {
        Add-Finding "WARN" "Kan ikke parse skills fra .md frontmatter" $agent.id
    }

    # 4. Tjek avatar path konsistens
    if ($content -match "(?m)^avatar:\s*(.+)$") {
        $mdAvatar = $Matches[1].Trim()
        $rosterAvatar = $agent.avatar
        # Sammenlign filnavn, ikke fuld path
        $mdFileName = Split-Path $mdAvatar -Leaf
        $rosterFileName = Split-Path $rosterAvatar -Leaf
        if ($mdFileName -ne $rosterFileName) {
            Add-Finding "WARN" "Avatar mismatch: roster='$rosterFileName' vs md='$mdFileName'" $agent.id
        }
    } else {
        Add-Finding "WARN" "Profil mangler avatar-felt" $agent.id
    }

    # 5. Tjek id match
    if ($content -match "(?m)^id:\s*(.+)$") {
        $mdId = $Matches[1].Trim()
        if ($mdId -ne $agent.id) {
            Add-Finding "ERROR" "ID mismatch: roster='$($agent.id)' vs md='$mdId'" $agent.id
        }
    } else {
        Add-Finding "WARN" "Profil mangler id-felt" $agent.id
    }
}

# 6. Orphan .md filer uden roster entry
foreach ($f in $mdFiles) {
    $m = $f.Name -replace "System_Prompt_Agent_","" -replace "\.md$",""
    $rosterIds = $roster | ForEach-Object { $_.id }
    if ($m -notin $rosterIds) {
        Add-Finding "WARN" "Orphan profil-fil uden roster-entry: $($f.Name)" $m
    }
}

# 7. Banedanmark agenter
if (Test-Path $baneDir) {
    $baneFiles = Get-ChildItem $baneDir -Filter "bd-*.md" -ErrorAction SilentlyContinue
    Add-Finding "INFO" "Banedanmark-agenter: $($baneFiles.Count)" ""
    foreach ($f in $baneFiles) {
        $txt = Get-Content $f.FullName -Encoding UTF8 -Raw
        if ($txt -notmatch "^---") {
            Add-Finding "WARN" "$($f.Name): mangler YAML-frontmatter" ""
        }
    }
} else {
    Add-Finding "WARN" "Banedanmark-mappe mangler: $baneDir" ""
}

# --- Output ---

$errCount  = @($findings | Where-Object Severity -in @("ERROR","CRITICAL")).Count
$warnCount = @($findings | Where-Object Severity -eq "WARN").Count
$infoCount = @($findings | Where-Object Severity -eq "INFO").Count

Write-Color "" "White"
Write-Color "--- Resultat ---" "Cyan"
foreach ($f in $findings) {
    switch ($f.Severity) {
        "CRITICAL" { Write-Color "[$($f.Severity)] $($f.Message)" "Red" }
        "ERROR"    { Write-Color "[$($f.Severity)] $($f.Message)" "Red" }
        "WARN"     { Write-Color "[$($f.Severity)] $($f.Message)" "Yellow" }
        "INFO"     { Write-Color "[$($f.Severity)] $($f.Message)" "Green" }
        default    { Write-Color "[$($f.Severity)] $($f.Message)" "White" }
    }
}

Write-Color "" "White"
Write-Color "Resumee: $errCount fejl, $warnCount advarsler, $infoCount info" $(if ($errCount -gt 0) { "Red" } elseif ($warnCount -gt 0) { "Yellow" } else { "Green" })

# JSON-rapport
if ($JsonReport) {
    $report = [PSCustomObject]@{
        validatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
        root        = $Root
        summary     = [PSCustomObject]@{ errors = $errCount; warnings = $warnCount; infos = $infoCount }
        findings    = $findings
    }
    $report | ConvertTo-Json -Depth 5 | Set-Content $JsonReport -Encoding UTF8
    Write-Color "JSON-rapport skrevet til $JsonReport" "Gray"
}

if ($errCount -gt 0) { exit 1 }
exit 0
