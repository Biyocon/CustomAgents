#Requires -Version 5.1
<#
.SYNOPSIS
    Genererer indeks over alle agenter i .agents/agents/.
.DESCRIPTION
    Læser .agents/agents/ og genererer:
    - .agents/brain/maps/agent-map.md
    - .agents/agents/AGENTS.md (root index for alle agenter)
.PARAMETER Root
    Rodstien til projektet. Default er nuværende mappe.
.EXAMPLE
    .\.agents\scripts\generate-agent-index.ps1
    .\.agents\scripts\generate-agent-index.ps1 -Root "C:\projekt"
#>
param(
    [string]$Root = (Get-Location)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Farvekoder ---
$ColorOK   = "Green"
$ColorInfo = "Cyan"
$ColorWarn = "Yellow"

function Write-Status {
    param([string]$Level, [string]$Message)
    switch ($Level) {
        "OK"    { Write-Host "  [OK]  $Message" -ForegroundColor $ColorOK }
        "INFO"  { Write-Host "  [INFO]$Message" -ForegroundColor $ColorInfo }
        "WARN"  { Write-Host "  [WARN]$Message" -ForegroundColor $ColorWarn }
        default { Write-Host "  [$Level] $Message" }
    }
}

Write-Host ""
Write-Host "=== GENERER AGENT INDEKS ===" -ForegroundColor $ColorInfo
Write-Host "Projektrod: $Root" -ForegroundColor Gray
Write-Host ""

# --- Sikkerhed: tjek at .agents/agents/ findes ---

$agentsDir = Join-Path $Root ".agents/agents"
if (-not (Test-Path $agentsDir)) {
    Write-Status -Level "WARN" -Message "Agent-mappe mangler: $agentsDir"
    exit 1
}

# --- Indlæs agenter ---

Write-Host "[1] Indlæser agenter..." -ForegroundColor $ColorInfo

$agentDirs = Get-ChildItem $agentsDir -Directory -ErrorAction SilentlyContinue | Sort-Object Name
$agents = @()

foreach ($dir in $agentDirs) {
    $profilePath = Join-Path $dir.FullName "profile.md"
    $skillsPath  = Join-Path $dir.FullName "skills.yaml"

    $agent = [PSCustomObject]@{
        Name        = $dir.Name
        Path        = $dir.FullName
        HasProfile  = Test-Path $profilePath
        HasSkills   = Test-Path $skillsPath
        Role        = ""
        Description = ""
        Skills      = @()
    }

    # Parse profile.md for navn, rolle, beskrivelse
    if ($agent.HasProfile) {
        $content = Get-Content $profilePath -Encoding UTF8 -Raw -ErrorAction SilentlyContinue
        if ($content -match "^#\s+(.+)") {
            $agent.Role = $Matches[1].Trim()
        }
        if ($content -match "(?ms)^##\s+Beskrivelse\s*\r?\n(.+?)(?=^##|\z)") {
            $agent.Description = ($Matches[1].Trim() -split "`r?`n")[0]
        }
    }

    # Parse skills.yaml
    if ($agent.HasSkills) {
        $skillsContent = Get-Content $skillsPath -Encoding UTF8 -Raw -ErrorAction SilentlyContinue
        $skillMatches = [regex]::Matches($skillsContent, "^\s*-\s*(.+)$", [System.Text.RegularExpressions.RegexOptions]::Multiline)
        $agent.Skills = $skillMatches | ForEach-Object { $_.Groups[1].Value.Trim() }
    }

    $agents += $agent
    Write-Status -Level "INFO" -Message "Indlæst agent: $($agent.Name) ($($agent.Role))"
}

Write-Host ""
Write-Host "[2] Genererer brain-map..." -ForegroundColor $ColorInfo

# --- Generer .agents/brain/maps/agent-map.md ---

$mapLines = @()
$mapLines += "# Agent Kort"
$mapLines += ""
$mapLines += "> Auto-genereret indeks over alle agenter i harnesset."
$mapLines += "> Genereret: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$mapLines += ""
$mapLines += "## Oversigt"
$mapLines += ""
$mapLines += "| Agent | Rolle | Profil | Skills |"
$mapLines += "|-------|-------|--------|--------|"

foreach ($a in $agents) {
    $profileIcon = if ($a.HasProfile) { "✅" } else { "❌" }
    $skillsIcon  = if ($a.HasSkills)  { "✅" } else { "❌" }
    $skillsSummary = if ($a.Skills.Count -gt 0) { "$($a.Skills.Count) skills" } else { "-" }
    $mapLines += "| $($a.Name) | $($a.Role) | $profileIcon | $skillsSummary |"
}

$mapLines += ""
$mapLines += "## Detaljer"
$mapLines += ""

foreach ($a in $agents) {
    $mapLines += "### $($a.Name)"
    $mapLines += ""
    $mapLines += "- **Rolle:** $($a.Role)"
    $mapLines += "- **Beskrivelse:** $($a.Description)"
    $mapLines += "- **Profil:** $(if ($a.HasProfile) { "`profile.md`" } else { "Mangler" })"
    $mapLines += "- **Skills:**"
    if ($a.Skills.Count -gt 0) {
        foreach ($s in $a.Skills) {
            $mapLines += "  - $s"
        }
    } else {
        $mapLines += "  - (ingen)"
    }
    $mapLines += ""
}

$mapLines += "---"
$mapLines += ""
$mapLines += "*Kort genereret af generate-agent-index.ps1*"

$mapsDir = Join-Path $Root ".agents/brain/maps"
if (-not (Test-Path $mapsDir)) {
    New-Item -ItemType Directory -Path $mapsDir -Force | Out-Null
}

$mapPath = Join-Path $mapsDir "agent-map.md"

# Sikkerhed: backup før overskrivning
if (Test-Path $mapPath) {
    $backupPath = "$mapPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $mapPath $backupPath -Force
    Write-Status -Level "INFO" -Message "Backup af agent-map.md: $backupPath"
}

$mapLines | Out-File $mapPath -Encoding UTF8
Write-Status -Level "OK" -Message "Agent-kort skrevet til $mapPath"

Write-Host ""
Write-Host "[3] Genererer root AGENTS.md..." -ForegroundColor $ColorInfo

# --- Generer .agents/agents/AGENTS.md ---

$indexLines = @()
$indexLines += "# Agenter"
$indexLines += ""
$indexLines += "> Root-index over alle agenter i dette harness."
$indexLines += "> Genereret: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$indexLines += ""
$indexLines += "## Agent-liste"
$indexLines += ""

foreach ($a in $agents) {
    $indexLines += "### $($a.Name)"
    $indexLines += ""
    if ($a.Role) {
        $indexLines += "**Rolle:** $($a.Role)"
        $indexLines += ""
    }
    if ($a.Description) {
        $indexLines += "$($a.Description)"
        $indexLines += ""
    }
    $indexLines += "- [profile.md]($($a.Name)/profile.md)"
    $indexLines += "- [skills.yaml]($($a.Name)/skills.yaml)"
    $indexLines += ""
}

$indexLines += "---"
$indexLines += ""
$indexLines += "*Index genereret af generate-agent-index.ps1*"

$agentsIndexPath = Join-Path $agentsDir "AGENTS.md"

# Sikkerhed: backup før overskrivning
if (Test-Path $agentsIndexPath) {
    $backupPath = "$agentsIndexPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $agentsIndexPath $backupPath -Force
    Write-Status -Level "INFO" -Message "Backup af AGENTS.md: $backupPath"
}

$indexLines | Out-File $agentsIndexPath -Encoding UTF8
Write-Status -Level "OK" -Message "Agent-index skrevet til $agentsIndexPath"

Write-Host ""
Write-Host "Færdig. Genererede $($agents.Count) agent-posts." -ForegroundColor $ColorOK
exit 0
