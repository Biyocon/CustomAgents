#Requires -Version 5.1
#Requires -PSEdition Desktop
<#
.SYNOPSIS
    Validerer agent-harness konsistens.
.DESCRIPTION
    Tjekker at agent-roster.json, Avatar/agents/*.md og .vscode/.codex/agents/banedanmark/*.md
    er synkroniserede, korrekt encodede, og indeholder forventede sektioner.
#>
param(
    [string]$Root = (Get-Location)
)

$ErrorActionPreference = "Stop"
$issues = @()

function Add-Issue {
    param([string]$Severity, [string]$Message)
    $script:issues += [PSCustomObject]@{ Severity = $Severity; Message = $Message }
}

$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir  = Join-Path $Root "Avatar/agents"
$baneDir    = Join-Path $Root ".vscode/.codex/agents/banedanmark"

# 1. Roster load
if (!(Test-Path $rosterPath)) {
    Add-Issue "CRITICAL" "agent-roster.json mangler"
    exit 1
}
$roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
Add-Issue "INFO" "Roster indlaest: $($roster.Count) agenter"

# 2. Agent-filer vs roster
foreach ($id in $roster.id) {
    $file = Join-Path $agentsDir "System_Prompt_Agent_$id.md"
    if (!(Test-Path $file)) {
        Add-Issue "ERROR" "Manglende agent-fil: $file"
    } else {
        $txt = Get-Content $file -Encoding UTF8 -Raw
        if ($txt -notmatch "```text") {
            Add-Issue "WARN" "${file}: mangler ```text fence"
        }
        if ($txt -match "Ã¦|Ã") {
            Add-Issue "WARN" "${file}: ser ud til at have encoding-problemer"
        }
    }
}

# 3. Orphan files
Get-ChildItem $agentsDir -Filter "System_Prompt_Agent_*.md" | ForEach-Object {
    $m = $_.Name -replace "System_Prompt_Agent_","" -replace "\.md$",""
    if ($m -notin $roster.id) {
        Add-Issue "WARN" "Orphan agent-fil uden roster-entry: $($_.Name)"
    }
}

# 4. Banedanmark-agenter
if (Test-Path $baneDir) {
    $baneFiles = Get-ChildItem $baneDir -Filter "*.md" -ErrorAction SilentlyContinue
    Add-Issue "INFO" "Banedanmark-agenter: $($baneFiles.Count)"
    foreach ($f in $baneFiles) {
        $txt = Get-Content $f.FullName -Encoding UTF8 -Raw
        if ($txt -notmatch "^---") {
            Add-Issue "WARN" "$($f.Name): mangler YAML-frontmatter"
        }
    }
} else {
    Add-Issue "WARN" "Banedanmark-mappe mangler: $baneDir"
}

# 5. Registry
$regPath = Join-Path $Root "registry.yaml"
if (Test-Path $regPath) {
    Add-Issue "INFO" "registry.yaml findes"
} else {
    Add-Issue "WARN" "registry.yaml mangler"
}

# 6. Brain
$brainFiles = @(".vscode/.codex/Brain/glossary.md", ".vscode/.codex/Brain/open-questions.md", ".vscode/.codex/Brain/source-map.md")
foreach ($bf in $brainFiles) {
    $p = Join-Path $Root $bf
    if (Test-Path $p) { Add-Issue "INFO" "$bf findes" } else { Add-Issue "WARN" "$bf mangler" }
}

# Output
$issues | Format-Table -AutoSize
$errCount = ($issues | Where-Object Severity -in @("ERROR","CRITICAL")).Count
$warnCount = ($issues | Where-Object Severity -eq "WARN").Count
Write-Host "`nResumee: $($issues.Count) linjer, $errCount fejl, $warnCount advarsler" -ForegroundColor Cyan

if ($errCount -gt 0) { exit 1 }
