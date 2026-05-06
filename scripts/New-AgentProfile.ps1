#Requires -Version 5.1
<#
.SYNOPSIS
    Opretter en ny agent-profil fra skabelon.
.DESCRIPTION
    Genererer .md-fil med rig prompt baseret paa rolle, tilfoejer til roster.json,
    og foelger det standardiserede format. Idempotent: springer over hvis agent allerede findes.
.PARAMETER Name
    Agentens visningsnavn (paakraevet).
.PARAMETER Role
    Agentens rolle (paakraevet).
.PARAMETER Category
    Kategori (paakraevet).
.PARAMETER Accent
    Farveaccent (default: blue).
.PARAMETER Skills
    Array af skill-id'er.
.PARAMETER BanedanmarkDomain
    Opret som Banedanmark-subagent (bd-* prefix).
.PARAMETER Root
    Rodstien til projektet.
.PARAMETER WhatIf
    Vis hvad der ville ske uden at skrive filer.
.EXAMPLE
    .\New-AgentProfile.ps1 -Name "Amina" -Role "Kvalitetsspecialist" -Category "Kvalitet og miljø" -Skills @("shared-quality","bbtr-kvalitet-dod")
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [string]$Name,

    [Parameter(Mandatory = $true)]
    [string]$Role,

    [Parameter(Mandatory = $true)]
    [string]$Category,

    [string]$Accent = "blue",

    [string[]]$Skills = @("karpathy-guidelines", "shared-quality", "shared-docx", "bdk-brand-governance", "bdk-gdpr-praksis"),

    [switch]$BanedanmarkDomain,

    [string]$Root = (Get-Location)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Hjælpefunktioner ---
function New-AgentId {
    param([string]$n, [string]$r)
    $clean = ($n + "-" + $r) -replace "[^a-zA-Z0-9æøåÆØÅ\-]", "" -replace "\-+", "-" -replace "^-", "" -replace "-$", "" | ForEach-Object { $_.ToLowerInvariant() }
    return $clean
}

function Format-SafeFileName {
    param([string]$str)
    return $str -replace "[\\/:*?\"<>|]", "_"
}

# --- Stier ---
$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir  = Join-Path $Root "Avatar/agents"
$baneDir    = Join-Path $Root ".vscode/.codex/agents/banedanmark"

if ($BanedanmarkDomain -and !(Test-Path $baneDir)) {
    if ($PSCmdlet.ShouldProcess($baneDir, "Opretter mappe")) {
        New-Item -ItemType Directory -Path $baneDir -Force | Out-Null
        Write-Host "Mappe oprettet: $baneDir" -ForegroundColor Green
    }
}

# --- ID og filnavne ---
$agentId = New-AgentId -n $Name -r $Role
if ($BanedanmarkDomain) {
    $agentId = "bd-" + $agentId
    $fileName = "$agentId.md"
    $filePath = Join-Path $baneDir $fileName
} else {
    $fileName = "System_Prompt_Agent_$agentId.md"
    $filePath = Join-Path $agentsDir $fileName
}

# --- Idempotens: tjek eksistens ---
if (Test-Path $filePath) {
    Write-Warning "Agent-profil findes allerede: $filePath"
    # Tjek om agent allerede findes i roster
    if (Test-Path $rosterPath) {
        $roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
        $existing = $roster | Where-Object { $_.id -eq $agentId }
        if ($existing) {
            Write-Error "Agent '$agentId' findes allerede i roster. Afbryder."
            exit 1
        }
    }
    Write-Host "Fortsætter med at tilfoeje til roster..." -ForegroundColor Yellow
}

# --- Generer avatar path ---
$safeName = Format-SafeFileName $Name
$safeRole = Format-SafeFileName $Role
if ($BanedanmarkDomain) {
    $avatarPath = "Avatar/2_Avatar_Agent_${safeName}_${safeRole}.png"
} else {
    $avatarPath = "Avatar/2_Avatar_Agent_${safeName}_${safeRole}.png"
}

# --- Generer profil-indhold ---
$skillsYaml = ($Skills | Sort-Object -Unique | ForEach-Object { "  - $_" }) -join "`r`n"
$primaryModels = @("Codex", "Kimi", "Qwen Code", "Gemini Code")
$modelsYaml = ($primaryModels | ForEach-Object { "  - $_" }) -join "`r`n"

$capabilities = @(
    "domaene-ekspertise",
    "analyse",
    "raadgivning",
    "dokumentation",
    "kvalitetssikring"
)
$capYaml = ($capabilities | ForEach-Object { "  - $_" }) -join "`r`n"

$template = @"
---
id: $agentId
name: $Name
role: $Role
category: $Category
avatar: $avatarPath
accent: $Accent
status: active
source: "manuel-oprettet via New-AgentProfile.ps1 ($(Get-Date -Format 'yyyy-MM-dd'))"
primary_models:
$modelsYaml
skills:
$skillsYaml
capabilities:
$capYaml
---

# Agent: $Name – $Role

## System Prompt

```text
Du er $Name, en digital $Role.

Din rolle er at hjaelpe brugeren med at:
1. [SPECIFIKATION KRÆVES: Indsæt primaere opgaver her]
2. [SPECIFIKATION KRÆVES: Indsæt sekundaere opgaver her]
3. [SPECIFIKATION KRÆVES: Indsæt leverancer her]

Du arbejder struktureret, dokumenteret og i overensstemmelse med Biyocon-brand-guidelines.
```

## Kapaciteter

$($capabilities | ForEach-Object { "- $_" } | Out-String)

## Noter

- Oprettet: $(Get-Date -Format "yyyy-MM-dd")
- Status: draft (skal aktiveres med Activate-Agent.ps1)
"@

# --- Skriv profil ---
if ($PSCmdlet.ShouldProcess($filePath, "Opretter agent-profil")) {
    Set-Content $filePath -Value $template -Encoding UTF8
    Write-Host "Profil oprettet: $filePath" -ForegroundColor Green
}

# --- Tilfoej til roster ---
if (Test-Path $rosterPath) {
    $roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
} else {
    Write-Error "agent-roster.json mangler: $rosterPath"
    exit 1
}

# Undga duplikater
if ($roster | Where-Object { $_.id -eq $agentId }) {
    Write-Warning "Agent '$agentId' findes allerede i roster. Spring over."
} else {
    $newAgent = [ordered]@{
        id           = $agentId
        name         = $Name
        role         = $Role
        category     = $Category
        avatar       = $avatarPath
        profile      = if ($BanedanmarkDomain) { ".vscode/.codex/agents/banedanmark/$fileName" } else { "Avatar/agents/$fileName" }
        accent       = $Accent
        skills       = @($Skills | Sort-Object -Unique)
        capabilities = $capabilities
    }

    # Konverter roster til liste og tilfoej
    $rosterList = [System.Collections.Generic.List[PSObject]]::new()
    foreach ($a in $roster) { $rosterList.Add($a) }
    $rosterList.Add([PSCustomObject]$newAgent)

    if ($PSCmdlet.ShouldProcess($rosterPath, "Tilfoejer agent til roster")) {
        $rosterList | ConvertTo-Json -Depth 5 | Set-Content $rosterPath -Encoding UTF8
        Write-Host "Agent tilfoejet til roster: $agentId" -ForegroundColor Green
    }
}

Write-Host "Agent '$Name' ($agentId) klar. Aktiver med: .\Activate-Agent.ps1 -AgentId $agentId -Status active" -ForegroundColor Cyan
exit 0
