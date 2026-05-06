#Requires -Version 5.1
<#
.SYNOPSIS
    Genererer markdown-indeks over alle agenter.
.DESCRIPTION
    Laver et laesbart indeks med links til profiler.
#>
param(
    [string]$Root = (Get-Location),
    [string]$OutFile = "AGENT_INDEX.md"
)

$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$baneDir    = Join-Path $Root ".vscode/.codex/agents/banedanmark"

$roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
$lines = @()
$lines += "# Agent Indeks"
$lines += ""
$lines += "## Aktive agenter (fra roster)"
$lines += ""
$lines += "| ID | Navn | Rolle | Kategori |"
$lines += "|----|------|-------|----------|"
foreach ($a in $roster) {
    $lines += "| $($a.id) | $($a.name) | $($a.role) | $($a.category) |"
}

if (Test-Path $baneDir) {
    $baneFiles = Get-ChildItem $baneDir -Filter "bd-*.md" -ErrorAction SilentlyContinue
    if ($baneFiles.Count -gt 0) {
        $lines += ""
        $lines += "## Banedanmark placeholder-agenter"
        $lines += ""
        $lines += "| Fil | Status |"
        $lines += "|-----|--------|"
        foreach ($f in $baneFiles) {
            $lines += "| $($f.Name) | draft |"
        }
    }
}

$lines += ""
$lines += "---"
$lines += "Genereret $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

$outPath = Join-Path $Root $OutFile
$lines | Out-File $outPath -Encoding UTF8
Write-Host "Indeks skrevet til $outPath" -ForegroundColor Green
