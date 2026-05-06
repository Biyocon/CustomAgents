#Requires -Version 5.1
<#
.SYNOPSIS
    Audit af agent-harness omfang.
.DESCRIPTION
    Taeler agenter, skills, filer og kataloger. Nyttigt til hurtigt overblik.
#>
param([string]$Root = (Get-Location))

$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir  = Join-Path $Root "Avatar/agents"
$skillsDir  = Join-Path $Root ".vscode/.codex/skills"
$baneDir    = Join-Path $Root ".vscode/.codex/agents/banedanmark"

$roster = if (Test-Path $rosterPath) { (Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json).Count } else { 0 }
$avatarFiles = (Get-ChildItem $agentsDir -Filter "System_Prompt_Agent_*.md" -ErrorAction SilentlyContinue).Count
$skillDirs   = (Get-ChildItem $skillsDir -Directory -ErrorAction SilentlyContinue).Count
$baneFiles   = if (Test-Path $baneDir) { (Get-ChildItem $baneDir -Filter "*.md" -ErrorAction SilentlyContinue).Count } else { 0 }

Write-Host "=== Harness Audit ===" -ForegroundColor Green
Write-Host "Roster agenter:        $roster"
Write-Host "Avatar profiler:       $avatarFiles"
Write-Host "Active skills:        $skillDirs"
Write-Host "Banedanmark profiler:  $baneFiles"
Write-Host ""
Write-Host "Kataloger:" -ForegroundColor Cyan
Write-Host "  Runtime:     .vscode/.codex/"
Write-Host "  Brain:       .vscode/.codex/Brain/"
Write-Host "  Skills:      .vscode/.codex/skills/"
Write-Host "  Agents:      Avatar/agents/"
Write-Host "  Banedanmark: .vscode/.codex/agents/banedanmark/"
