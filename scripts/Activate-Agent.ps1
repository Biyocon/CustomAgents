#Requires -Version 5.1
<#
.SYNOPSIS
    Aktiverer eller deaktiverer en agent.
.DESCRIPTION
    Opdaterer status i bade .md-fil og roster.json. Sikrer synkronisering.
    Laver backup af roster foer aendring.
.PARAMETER AgentId
    Agentens ID (paakraevet).
.PARAMETER Status
    Onsket status: active eller draft.
.PARAMETER Root
    Rodstien til projektet.
.PARAMETER WhatIf
    Vis hvad der ville ske uden at aendre noget.
.EXAMPLE
    .\Activate-Agent.ps1 -AgentId "hassan-anlaegsingenioer" -Status active
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [string]$AgentId,

    [Parameter(Mandatory = $true)]
    [ValidateSet("active", "draft")]
    [string]$Status,

    [string]$Root = (Get-Location)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Stier ---
$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir  = Join-Path $Root "Avatar/agents"
$profilePath = Join-Path $agentsDir "System_Prompt_Agent_$AgentId.md"

# --- Tjek forudsaetninger ---
if (!(Test-Path $rosterPath)) {
    Write-Error "agent-roster.json mangler: $rosterPath"
    exit 1
}

if (!(Test-Path $profilePath)) {
    Write-Error "Profil-fil mangler: $profilePath"
    exit 1
}

# --- Backup af roster ---
$backupPath = "$rosterPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if ($PSCmdlet.ShouldProcess($rosterPath, "Laver backup til $backupPath")) {
    Copy-Item $rosterPath $backupPath -Force
    Write-Host "Backup oprettet: $backupPath" -ForegroundColor Gray
}

# --- Indlæs data ---
$roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
$agentEntry = $roster | Where-Object { $_.id -eq $AgentId }

if (!$agentEntry) {
    Write-Error "Agent '$AgentId' findes ikke i roster"
    exit 1
}

Write-Host "Agent: $($agentEntry.name) [id=$AgentId]" -ForegroundColor Cyan
Write-Host "Nuvaerende status i roster: $($agentEntry.status)" -ForegroundColor White
Write-Host "Onsket status: $Status" -ForegroundColor White

# --- Opdater .md profil ---
$mdContent = Get-Content $profilePath -Encoding UTF8 -Raw
if ($mdContent -match "(?m)^status:\s*\S+") {
    $newMdContent = $mdContent -replace "(?m)^status:\s*\S+", "status: $Status"
} else {
    # Tilfoej status efter id i frontmatter
    $newMdContent = $mdContent -replace "(?m)^(id:\s*\S+\r?\n)", "`$1status: $Status`r`n"
}

if ($PSCmdlet.ShouldProcess($profilePath, "Opdaterer status til '$Status'")) {
    Set-Content $profilePath -Value $newMdContent -Encoding UTF8
    Write-Host "Profil opdateret: $profilePath" -ForegroundColor Green
}

# --- Opdater roster ---
# roster er PSCustomObject-array; vi skal konvertere til hashtable for at kunne aendre
$rosterList = [System.Collections.Generic.List[PSObject]]::new()
foreach ($a in $roster) {
    $hash = @{}
    $a.PSObject.Properties | ForEach-Object { $hash[$_.Name] = $_.Value }
    if ($hash.id -eq $AgentId) {
        $hash.status = $Status
        Write-Host "Roster-entry opdateret: status = $Status" -ForegroundColor Green
    }
    $rosterList.Add([PSCustomObject]$hash)
}

if ($PSCmdlet.ShouldProcess($rosterPath, "Gemmer opdateret roster")) {
    $rosterList | ConvertTo-Json -Depth 5 | Set-Content $rosterPath -Encoding UTF8
    Write-Host "Roster gemt: $rosterPath" -ForegroundColor Green
}

Write-Host "Aktivering fuldfort for $AgentId -> $Status" -ForegroundColor Cyan
exit 0
