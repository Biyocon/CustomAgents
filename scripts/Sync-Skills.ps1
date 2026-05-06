#Requires -Version 5.1
<#
.SYNOPSIS
    Synkroniserer skills paa tvaers af alle agenter.
.DESCRIPTION
    Identificerer skills der findes i roster men ikke i .md frontmatter,
    og omvendt. Rapportér forskelle. Valgfri auto-korrektion med -Fix.
.PARAMETER Root
    Rodstien til projektet.
.PARAMETER Fix
    Auto-korriger skills i .md-filer så de matcher roster.
.PARAMETER WhatIf
    Vis hvad der ville ske uden at ændre noget.
.EXAMPLE
    .\Sync-Skills.ps1 -Fix
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$Root = (Get-Location),
    [switch]$Fix
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Hjælpefunktioner ---
function Get-MdSkills {
    param([string]$Content)
    if ($Content -match "(?ms)^skills:\s*\r?\n((?:\s*-\s*\S+\s*\r?\n)+)") {
        $block = $Matches[1]
        return @([regex]::Matches($block, "^\s*-\s*(\S+)") | ForEach-Object { $_.Groups[1].Value.Trim() })
    }
    return @()
}

function Set-MdSkills {
    param([string]$Content, [string[]]$Skills)
    $sorted = $Skills | Sort-Object -Unique
    $block = ($sorted | ForEach-Object { "  - $_" }) -join "`r`n"
    if ($Content -match "(?ms)^skills:\s*\r?\n(?:\s*-\s*\S+\s*\r?\n)+") {
        return $Content -replace "(?ms)^skills:\s*\r?\n(?:\s*-\s*\S+\s*\r?\n)+", "skills:`r`n$block`r`n"
    }
    # Hvis skills ikke findes, indsæt efter id
    return $Content -replace "(?m)^(id:\s*\S+\r?\n)", "`$1skills:`r`n$block`r`n"
}

# --- Stier ---
$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir  = Join-Path $Root "Avatar/agents"

if (!(Test-Path $rosterPath)) {
    Write-Error "agent-roster.json mangler: $rosterPath"
    exit 1
}

$roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
$diffs = @()

Write-Host "=== Skills-synkronisering ===" -ForegroundColor Cyan
Write-Host "Fix aktiveret: $Fix" -ForegroundColor $(if ($Fix) { "Yellow" } else { "Gray" })

foreach ($agent in $roster) {
    $fileName = "System_Prompt_Agent_$($agent.id).md"
    $filePath = Join-Path $agentsDir $fileName

    if (!(Test-Path $filePath)) {
        Write-Host "[SKIP] $($agent.id): Profil-fil mangler" -ForegroundColor Red
        continue
    }

    $content = Get-Content $filePath -Encoding UTF8 -Raw
    $mdSkills = @(Get-MdSkills $content)
    $rosterSkills = @($agent.skills)

    $onlyRoster = $rosterSkills | Where-Object { $_ -notin $mdSkills }
    $onlyMd = $mdSkills | Where-Object { $_ -notin $rosterSkills }

    if ($onlyRoster -or $onlyMd) {
        $diffs += [PSCustomObject]@{
            AgentId      = $agent.id
            OnlyInRoster = $onlyRoster
            OnlyInMd     = $onlyMd
        }

        Write-Host "[$($agent.id)] $($agent.name)" -ForegroundColor Cyan
        if ($onlyRoster) {
            Write-Host "  Kun i roster : $($onlyRoster -join ', ')" -ForegroundColor Yellow
        }
        if ($onlyMd) {
            Write-Host "  Kun i .md    : $($onlyMd -join ', ')" -ForegroundColor Yellow
        }

        if ($Fix) {
            $merged = @($mdSkills) + @($rosterSkills) | Sort-Object -Unique
            $newContent = Set-MdSkills -Content $content -Skills $merged
            if ($PSCmdlet.ShouldProcess($filePath, "Opdaterer skills")) {
                Set-Content $filePath -Value $newContent -Encoding UTF8
                Write-Host "  -> Opdateret" -ForegroundColor Green
            }
        }
    }
}

# --- Resumé ---
Write-Host "" 
$totalDiffs = $diffs.Count
if ($totalDiffs -eq 0) {
    Write-Host "Alle skills er synkroniseret. Ingen forskelle fundet." -ForegroundColor Green
} else {
    Write-Host "$totalDiffs agent(er) har skill-forskelle." -ForegroundColor $(if ($Fix) { "Green" } else { "Yellow" })
}

exit 0
