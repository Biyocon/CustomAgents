#Requires -Version 5.1
<#
.SYNOPSIS
    Validerer agent-harness konsistens.
.DESCRIPTION
    Kører audit-harness.ps1 og udfører ekstra validering:
    - registry.yaml syntaks
    - agent-roster konsistens
    Skriver .agents/reports/validation_report.md.
    Exit code 0 = OK, 1 = fejl.
.PARAMETER Root
    Rodstien til projektet. Default er nuværende mappe.
.PARAMETER SkipAudit
    Spring audit-fasen over (kør kun ekstra validering).
.EXAMPLE
    .\.agents\scripts\validate-harness.ps1
    .\.agents\scripts\validate-harness.ps1 -Root "C:\projekt"
#>
param(
    [string]$Root = (Get-Location),
    [switch]$SkipAudit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Farvekoder ---
$ColorCritical = "Red"
$ColorWarning  = "Yellow"
$ColorOK       = "Green"
$ColorInfo     = "Cyan"

function Write-Status {
    param([string]$Level, [string]$Message)
    switch ($Level) {
        "OK"       { Write-Host "  [OK]       $Message" -ForegroundColor $ColorOK }
        "INFO"     { Write-Host "  [INFO]     $Message" -ForegroundColor $ColorInfo }
        "WARN"     { Write-Host "  [ADVARSEL] $Message" -ForegroundColor $ColorWarning }
        "ERROR"    { Write-Host "  [FEJL]     $Message" -ForegroundColor $ColorCritical }
        "CRITICAL" { Write-Host "  [KRITISK]  $Message" -ForegroundColor $ColorCritical }
        default    { Write-Host "  [$Level]   $Message" }
    }
}

Write-Host ""
Write-Host "=== VALIDÉR HARNESS ===" -ForegroundColor $ColorInfo
Write-Host "Projektrod: $Root" -ForegroundColor Gray
Write-Host ""

$criticalCount = 0
$errorCount    = 0
$warnCount     = 0
$okCount       = 0

$reportLines = @()
$reportLines += "# Harness Valideringsrapport"
$reportLines += ""
$reportLines += "Genereret: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$reportLines += "Projektrod: $Root"
$reportLines += ""

# --- Fase 1: Kør audit-harness.ps1 ---

if (-not $SkipAudit) {
    Write-Host "[1] Kører audit-harness.ps1..." -ForegroundColor $ColorInfo

    $auditScript = Join-Path $Root ".agents/scripts/audit-harness.ps1"
    if (Test-Path $auditScript) {
        try {
            & $auditScript -Root $Root
            $auditExit = $LASTEXITCODE
            if ($auditExit -eq 0) {
                Write-Status -Level "OK" -Message "Audit fuldført uden fejl"
                $okCount++
            } else {
                Write-Status -Level "WARN" -Message "Audit rapporterede problemer (exit $auditExit)"
                $warnCount++
            }
        } catch {
            Write-Status -Level "ERROR" -Message "Audit-script fejlede: $_"
            $errorCount++
        }
    } else {
        Write-Status -Level "ERROR" -Message "audit-harness.ps1 ikke fundet: $auditScript"
        $errorCount++
    }

    Write-Host ""
} else {
    Write-Host "[1] Springer audit over (-SkipAudit)" -ForegroundColor $ColorInfo
    Write-Host ""
}

# --- Fase 2: Ekstra validering ---

Write-Host "[2] Ekstra validering..." -ForegroundColor $ColorInfo

# 2a. registry.yaml syntaks
$registryPath = Join-Path $Root ".agents/registry.yaml"
if (Test-Path $registryPath) {
    $registryContent = Get-Content $registryPath -Encoding UTF8 -Raw -ErrorAction SilentlyContinue
    if ($registryContent -match "^version:") {
        Write-Status -Level "OK" -Message "registry.yaml har version-felt"
        $okCount++
    } else {
        Write-Status -Level "WARN" -Message "registry.yaml mangler version-felt"
        $warnCount++
    }
    if ($registryContent -match "^agents:") {
        Write-Status -Level "OK" -Message "registry.yaml har agents-sektion"
        $okCount++
    } else {
        Write-Status -Level "WARN" -Message "registry.yaml mangler agents-sektion"
        $warnCount++
    }
} else {
    Write-Status -Level "ERROR" -Message "registry.yaml mangler: $registryPath"
    $errorCount++
}

# 2b. Agent-roster konsistens
$agentsDir = Join-Path $Root ".agents/agents"
$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"

# Hvis .agents/agents/ findes, tjek roster-konsistens
if (Test-Path $agentsDir) {
    $agentDirs = Get-ChildItem $agentsDir -Directory -ErrorAction SilentlyContinue
    if (Test-Path $rosterPath) {
        try {
            $roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json
            $rosterIds = $roster | ForEach-Object { $_.id }

            # Tjek at hver agent-mappe har en roster-entry
            foreach ($dir in $agentDirs) {
                if ($dir.Name -notin $rosterIds) {
                    Write-Status -Level "WARN" -Message "Agent '$($dir.Name)' mangler i roster"
                    $warnCount++
                } else {
                    Write-Status -Level "OK" -Message "Agent '$($dir.Name)' findes i roster"
                    $okCount++
                }
            }

            # Tjek at hver roster-entry har en agent-mappe
            foreach ($id in $rosterIds) {
                $agentPath = Join-Path $agentsDir $id
                if (-not (Test-Path $agentPath)) {
                    Write-Status -Level "WARN" -Message "Roster-entry '$id' mangler agent-mappe"
                    $warnCount++
                }
            }
        } catch {
            Write-Status -Level "ERROR" -Message "Kunne ikke parse agent-roster.json: $_"
            $errorCount++
        }
    } else {
        Write-Status -Level "INFO" -Message "agent-roster.json findes ikke - springer roster-konsistens over"
    }
} else {
    Write-Status -Level "INFO" -Message ".agents/agents/ findes ikke - springer roster-konsistens over"
}

# 2c. Skills-konsistens
$skillsDir = Join-Path $Root ".agents/skills"
if (Test-Path $skillsDir) {
    $skillDirs = Get-ChildItem $skillsDir -Directory -ErrorAction SilentlyContinue
    foreach ($dir in $skillDirs) {
        $skillMd = Join-Path $dir.FullName "SKILL.md"
        if (Test-Path $skillMd) {
            $content = Get-Content $skillMd -Encoding UTF8 -Raw -ErrorAction SilentlyContinue
            if ($content -match "^#\s+") {
                Write-Status -Level "OK" -Message "Skill '$($dir.Name)' har gyldig SKILL.md med overskrift"
                $okCount++
            } else {
                Write-Status -Level "WARN" -Message "Skill '$($dir.Name)' SKILL.md mangler overskrift"
                $warnCount++
            }
        }
    }
} else {
    Write-Status -Level "INFO" -Message ".agents/skills/ findes ikke - springer skills-validering over"
}

Write-Host ""

# --- Fase 3: Opsummering og rapport ---

Write-Host "[3] Opsummering..." -ForegroundColor $ColorInfo

$totalIssues = $criticalCount + $errorCount + $warnCount

Write-Status -Level "INFO" -Message "OK:        $okCount"
if ($warnCount -gt 0) {
    Write-Status -Level "WARN" -Message "Advarsler: $warnCount"
}
if ($errorCount -gt 0) {
    Write-Status -Level "ERROR" -Message "Fejl:      $errorCount"
}
if ($criticalCount -gt 0) {
    Write-Status -Level "CRITICAL" -Message "Kritiske:  $criticalCount"
}

if ($totalIssues -eq 0) {
    Write-Host ""
    Write-Host "Harness er valideret OK!" -ForegroundColor $ColorOK
} else {
    Write-Host ""
    Write-Host "Harness har $totalIssues issue(s)." -ForegroundColor $ColorWarning
}

# --- Skriv rapport ---

$reportLines += "## Resultat"
$reportLines += ""
$reportLines += "- OK: $okCount"
$reportLines += "- Advarsler: $warnCount"
$reportLines += "- Fejl: $errorCount"
$reportLines += "- Kritiske: $criticalCount"
$reportLines += ""
$reportLines += "---"

$reportDir = Join-Path $Root ".agents/reports"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

$reportPath = Join-Path $reportDir "validation_report.md"

# Sikkerhed: backup før overskrivning
if (Test-Path $reportPath) {
    $backupPath = "$reportPath.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $reportPath $backupPath -Force
    Write-Status -Level "INFO" -Message "Backup oprettet: $backupPath"
}

$reportLines | Out-File $reportPath -Encoding UTF8
Write-Host ""
Write-Status -Level "OK" -Message "Rapport skrevet til: $reportPath"

# --- Exit code ---
if ($criticalCount -gt 0 -or $errorCount -gt 0) {
    exit 1
}
exit 0
