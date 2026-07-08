#Requires -Version 5.1
<#
.SYNOPSIS
    DEPRECATED - tynd wrapper. Se scripts/Validate-Harness-Unified.ps1.
.DESCRIPTION
    Denne fil (scripts/Validate-AgentHarness.ps1) var tidligere en
    selvstaendig validator (197 linjer, del af v2-toolset med
    Export-Registry.ps1/New-AgentProfile.ps1/Sync-Skills.ps1/Activate-Agent.ps1)
    der tjekkede agent-roster.json mod Avatar/agents/*.md i dybden: status-felt,
    skills-diff, avatar-filnavn, id-felt, orphans, samt banedanmark bd-*.md
    frontmatter - og kunne skrive en valgfri JSON-rapport.

    Den 2026-07-09 blev tre uafhaengige "valider harness"-scripts konsolideret
    til ét kanonisk script: scripts/Validate-Harness-Unified.ps1. Se
    docs/architecture/validate-scripts-map.md for baggrund og fuld oversigt.

    Alle tjek denne fil tidligere udforte findes nu (uaendret logik) i
    Sektion A og C af scripts/Validate-Harness-Unified.ps1 (inkl. -JsonReport).
    Denne fil er bevaret som en tynd wrapper - af hensyn til bagudkompatibilitet
    for alt der stadig kalder den paa dens kendte sti - som blot delegerer til
    det samlede script og videresender output og exit code uaendret.

    NB: Fordi det samlede script daekker BAADE .vscode/.codex- og
    .agents/-strukturen, vil et kald til denne wrapper nu ogsaa rapportere
    .agents/-tjek (Sektion E-H) og Sektion B/D, som denne fil aldrig gjorde
    foer konsolideringen. Det er tilsigtet: det samlede resultat er nu ens
    uanset hvilken af de tre gamle stier man kalder.
.PARAMETER Root
    Rodstien til projektet. Videresendes til Validate-Harness-Unified.ps1.
.PARAMETER JsonReport
    Sti til valgfri JSON-rapport. Videresendes til Validate-Harness-Unified.ps1.
.EXAMPLE
    .\Validate-AgentHarness.ps1 -JsonReport validation-report.json
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$Root = (Get-Location),
    [string]$JsonReport = $null
)

$unifiedScript = Join-Path $PSScriptRoot "Validate-Harness-Unified.ps1"

$forwardParams = @{ Root = $Root }
if ($JsonReport) { $forwardParams["JsonReport"] = $JsonReport }

& $unifiedScript @forwardParams
exit $LASTEXITCODE
