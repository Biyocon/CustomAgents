#Requires -Version 5.1
#Requires -PSEdition Desktop
<#
.SYNOPSIS
    DEPRECATED - tynd wrapper. Se scripts/Validate-Harness-Unified.ps1.
.DESCRIPTION
    Denne fil (scripts/validate-harness.ps1) var tidligere en selvstaendig
    validator (94 linjer) der tjekkede agent-roster.json mod Avatar/agents/*.md
    (eksistens, ```text fence, mojibake-encoding, orphans), banedanmark-
    frontmatter (alle *.md), Root/registry.yaml og .vscode/.codex/Brain/*.md.

    Den 2026-07-09 blev tre uafhaengige "valider harness"-scripts konsolideret
    til ét kanonisk script: scripts/Validate-Harness-Unified.ps1. Se
    docs/architecture/validate-scripts-map.md for baggrund og fuld oversigt.

    Alle tjek denne fil tidligere udforte findes nu (uaendret logik) i
    Sektion A, B og D af scripts/Validate-Harness-Unified.ps1. Denne fil er
    bevaret som en tynd wrapper - af hensyn til bagudkompatibilitet for alt
    der stadig kalder den paa dens kendte sti - som blot delegerer til det
    samlede script og videresender output og exit code uaendret.

    NB: Fordi det samlede script daekker BAADE .vscode/.codex- og
    .agents/-strukturen, vil et kald til denne wrapper nu ogsaa rapportere
    .agents/-tjek (Sektion E-H), som denne fil aldrig gjorde foer
    konsolideringen. Det er tilsigtet: det samlede resultat er nu ens uanset
    hvilken af de tre gamle stier man kalder.
.PARAMETER Root
    Rodstien til projektet. Videresendes til Validate-Harness-Unified.ps1.
.PARAMETER JsonReport
    Valgfri sti til JSON-rapport. Videresendes til Validate-Harness-Unified.ps1.
.PARAMETER SkipAudit
    Videresendes til Validate-Harness-Unified.ps1 (spring .agents-audit-fasen over).
#>
param(
    [string]$Root = (Get-Location),
    [string]$JsonReport = $null,
    [switch]$SkipAudit
)

$unifiedScript = Join-Path $PSScriptRoot "Validate-Harness-Unified.ps1"

$forwardParams = @{ Root = $Root }
if ($JsonReport) { $forwardParams["JsonReport"] = $JsonReport }
if ($SkipAudit)  { $forwardParams["SkipAudit"] = $true }

& $unifiedScript @forwardParams
exit $LASTEXITCODE
