#Requires -Version 5.1
<#
.SYNOPSIS
    DEPRECATED - tynd wrapper. Se scripts/Validate-Harness-Unified.ps1.
.DESCRIPTION
    Denne fil (.agents/scripts/validate-harness.ps1) var tidligere en
    selvstaendig validator (244 linjer) der korte .agents/scripts/audit-harness.ps1
    som sub-fase, tjekkede .agents/registry.yaml (version:/agents:-felter),
    krydstjekkede .agents/agents/<id>/ mod agent-roster.json (begge veje),
    tjekkede .agents/skills/*/SKILL.md for overskrift, og skrev
    .agents/reports/validation_report.md med .bak-backup.

    Den 2026-07-09 blev tre uafhaengige "valider harness"-scripts konsolideret
    til ét kanonisk script: scripts/Validate-Harness-Unified.ps1 (i repo-roden,
    ikke under .agents/). Se docs/architecture/validate-scripts-map.md for
    baggrund og fuld oversigt.

    Alle tjek denne fil tidligere udforte findes nu (uaendret logik) i
    Sektion E, F, G og H af scripts/Validate-Harness-Unified.ps1, inkl.
    kald til .agents/scripts/audit-harness.ps1 og skrivning af
    .agents/reports/validation_report.md med .bak-backup. Denne fil er
    bevaret som en tynd wrapper - af hensyn til bagudkompatibilitet for alt
    der stadig kalder den paa dens kendte sti - som blot delegerer til det
    samlede script og videresender output og exit code uaendret.

    NB: Fordi det samlede script daekker BAADE .agents/- og
    .vscode/.codex-strukturen, vil et kald til denne wrapper nu ogsaa
    rapportere .vscode/.codex-tjek (Sektion A-D), som denne fil aldrig gjorde
    foer konsolideringen. Det er tilsigtet: det samlede resultat er nu ens
    uanset hvilken af de tre gamle stier man kalder.
.PARAMETER Root
    Rodstien til projektet. Videresendes til Validate-Harness-Unified.ps1.
.PARAMETER SkipAudit
    Spring audit-fasen over. Videresendes til Validate-Harness-Unified.ps1.
.EXAMPLE
    .\.agents\scripts\validate-harness.ps1
    .\.agents\scripts\validate-harness.ps1 -Root "C:\projekt"
#>
param(
    [string]$Root = (Get-Location),
    [switch]$SkipAudit
)

$unifiedScript = Join-Path $PSScriptRoot "..\..\scripts\Validate-Harness-Unified.ps1"

$forwardParams = @{ Root = $Root }
if ($SkipAudit) { $forwardParams["SkipAudit"] = $true }

& $unifiedScript @forwardParams
exit $LASTEXITCODE
