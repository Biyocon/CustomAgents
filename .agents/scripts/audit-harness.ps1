#Requires -Version 5.1
<#
.SYNOPSIS
    Audit af .agents/ harness-struktur.
.DESCRIPTION
    Scanner .agents/ og validerer påkrævede filer, agent-profiler, skills og vendor-isolation.
    Rapporterer mangler med farvekodet output og skriver rapport til .agents/reports/validation_report.md.
.PARAMETER Root
    Rodstien til projektet. Default er nuværende mappe.
.EXAMPLE
    .\.agents\scripts\audit-harness.ps1
    .\.agents\scripts\audit-harness.ps1 -Root "C:\projekt"
#>
param(
    [string]$Root = (Get-Location)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Farvekoder ---
# Rød = kritisk, Gul = advarsel, Grøn = OK
$ColorCritical = "Red"
$ColorWarning  = "Yellow"
$ColorOK       = "Green"
$ColorInfo     = "Cyan"

# --- Hjælpefunktioner ---

function Write-AuditLine {
    param([string]$Severity, [string]$Message)
    switch ($Severity) {
        "CRITICAL" { Write-Host "  [KRITISK] $Message" -ForegroundColor $ColorCritical }
        "ERROR"    { Write-Host "  [FEJL]    $Message" -ForegroundColor $ColorCritical }
        "WARN"     { Write-Host "  [ADVARSEL]$Message" -ForegroundColor $ColorWarning }
        "OK"       { Write-Host "  [OK]      $Message" -ForegroundColor $ColorOK }
        "INFO"     { Write-Host "  [INFO]    $Message" -ForegroundColor $ColorInfo }
        default    { Write-Host "  [$Severity] $Message" }
    }
}

function Add-ReportLine {
    param([string]$Severity, [string]$Message)
    $script:reportLines += "| $Severity | $Message |"
}

# --- Initialisering ---

$reportLines = @()
$reportLines += "# Harness Audit Rapport"
$reportLines += ""
$reportLines += "Genereret: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$reportLines += "Projektrod: $Root"
$reportLines += ""
$reportLines += "| Niveau    | Beskrivelse |"
$reportLines += "|-----------|-------------|"

$criticalCount = 0
$errorCount    = 0
$warnCount     = 0
$okCount       = 0

Write-Host ""
Write-Host "=== AGENTS HARNESS AUDIT ===" -ForegroundColor $ColorInfo
Write-Host "Projektrod: $Root" -ForegroundColor Gray
Write-Host ""

# --- 1. Påkrævede filer ---

Write-Host "[1] Tjekker påkrævede filer..." -ForegroundColor $ColorInfo

$requiredFiles = @(
    @{ Path = ".agents/registry.yaml";     Desc = "Registry-manifest" },
    @{ Path = "AGENTS.md";                  Desc = "Projekt-AGENTS.md" },
    @{ Path = ".agents/brain/context.md";  Desc = "Brain context" }
)

foreach ($rf in $requiredFiles) {
    $fullPath = Join-Path $Root $rf.Path
    if (Test-Path $fullPath) {
        Write-AuditLine -Severity "OK" -Message "$($rf.Desc): $($rf.Path)"
        Add-ReportLine -Severity "OK" -Message "$($rf.Desc) findes"
        $okCount++
    } else {
        Write-AuditLine -Severity "CRITICAL" -Message "$($rf.Desc) mangler: $($rf.Path)"
        Add-ReportLine -Severity "CRITICAL" -Message "$($rf.Desc) mangler: $($rf.Path)"
        $criticalCount++
    }
}

Write-Host ""

# --- 2. Agent-mapper ---

Write-Host "[2] Tjekker agent-mapper..." -ForegroundColor $ColorInfo

$agentsDir = Join-Path $Root ".agents/agents"
if (Test-Path $agentsDir) {
    $agentDirs = Get-ChildItem $agentsDir -Directory -ErrorAction SilentlyContinue
    Write-AuditLine -Severity "INFO" -Message "Fandt $($agentDirs.Count) agent-mapper i .agents/agents/"
    Add-ReportLine -Severity "INFO" -Message "$($agentDirs.Count) agent-mapper fundet"

    foreach ($dir in $agentDirs) {
        $profilePath = Join-Path $dir.FullName "profile.md"
        $skillsPath  = Join-Path $dir.FullName "skills.yaml"

        $hasProfile = Test-Path $profilePath
        $hasSkills  = Test-Path $skillsPath

        if ($hasProfile -and $hasSkills) {
            Write-AuditLine -Severity "OK" -Message "Agent '$($dir.Name)' har profile.md og skills.yaml"
            Add-ReportLine -Severity "OK" -Message "Agent '$($dir.Name)' komplet"
            $okCount++
        } else {
            if (-not $hasProfile) {
                Write-AuditLine -Severity "ERROR" -Message "Agent '$($dir.Name)' mangler profile.md"
                Add-ReportLine -Severity "ERROR" -Message "Agent '$($dir.Name)' mangler profile.md"
                $errorCount++
            }
            if (-not $hasSkills) {
                Write-AuditLine -Severity "ERROR" -Message "Agent '$($dir.Name)' mangler skills.yaml"
                Add-ReportLine -Severity "ERROR" -Message "Agent '$($dir.Name)' mangler skills.yaml"
                $errorCount++
            }
        }
    }
} else {
    Write-AuditLine -Severity "WARN" -Message "Agent-mappe mangler: .agents/agents/"
    Add-ReportLine -Severity "WARN" -Message "Agent-mappe .agents/agents/ mangler"
    $warnCount++
}

Write-Host ""

# --- 3. Skills ---

Write-Host "[3] Tjekker skills..." -ForegroundColor $ColorInfo

$skillsDir = Join-Path $Root ".agents/skills"
if (Test-Path $skillsDir) {
    $skillDirs = Get-ChildItem $skillsDir -Directory -ErrorAction SilentlyContinue
    Write-AuditLine -Severity "INFO" -Message "Fandt $($skillDirs.Count) skill-mapper i .agents/skills/"
    Add-ReportLine -Severity "INFO" -Message "$($skillDirs.Count) skills fundet"

    foreach ($dir in $skillDirs) {
        $skillMdPath = Join-Path $dir.FullName "SKILL.md"
        if (Test-Path $skillMdPath) {
            Write-AuditLine -Severity "OK" -Message "Skill '$($dir.Name)' har SKILL.md"
            Add-ReportLine -Severity "OK" -Message "Skill '$($dir.Name)' har SKILL.md"
            $okCount++
        } else {
            Write-AuditLine -Severity "ERROR" -Message "Skill '$($dir.Name)' mangler SKILL.md"
            Add-ReportLine -Severity "ERROR" -Message "Skill '$($dir.Name)' mangler SKILL.md"
            $errorCount++
        }
    }
} else {
    Write-AuditLine -Severity "WARN" -Message "Skills-mappe mangler: .agents/skills/"
    Add-ReportLine -Severity "WARN" -Message "Skills-mappe .agents/skills/ mangler"
    $warnCount++
}

Write-Host ""

# --- 4. Vendor isolation ---

Write-Host "[4] Tjekker vendor isolation..." -ForegroundColor $ColorInfo

$vendorDir = Join-Path $Root ".agents/vendor"
if (Test-Path $vendorDir) {
    Write-AuditLine -Severity "INFO" -Message "Vendor-mappe findes: .agents/vendor/"
    Add-ReportLine -Severity "INFO" -Message "Vendor-mappe findes"

    # Tjek at der ikke er redigerede filer i vendor (simpel tjek: ingen .md ændringer)
    $vendorMdFiles = Get-ChildItem $vendorDir -Recurse -Filter "*.md" -ErrorAction SilentlyContinue
    if ($vendorMdFiles) {
        Write-AuditLine -Severity "WARN" -Message "$($vendorMdFiles.Count) .md-fil(er) i vendor/. Overvej at flytte til .agents/skills/"
        Add-ReportLine -Severity "WARN" -Message "$($vendorMdFiles.Count) .md-filer i vendor/"
        $warnCount++
    } else {
        Write-AuditLine -Severity "OK" -Message "Vendor ser isoleret ud (ingen .md filer)"
        Add-ReportLine -Severity "OK" -Message "Vendor er isoleret"
        $okCount++
    }
} else {
    Write-AuditLine -Severity "WARN" -Message "Vendor-mappe mangler: .agents/vendor/"
    Add-ReportLine -Severity "WARN" -Message "Vendor-mappe .agents/vendor/ mangler"
    $warnCount++
}

Write-Host ""

# --- 5. Brain struktur ---

Write-Host "[5] Tjekker brain-struktur..." -ForegroundColor $ColorInfo

$brainDir = Join-Path $Root ".agents/brain"
if (Test-Path $brainDir) {
    $brainSubdirs = Get-ChildItem $brainDir -Directory -ErrorAction SilentlyContinue
    Write-AuditLine -Severity "INFO" -Message "Brain undermapper: $($brainSubdirs.Name -join ', ')"
    Add-ReportLine -Severity "INFO" -Message "Brain undermapper: $($brainSubdirs.Name -join ', ')"
    $okCount++
} else {
    Write-AuditLine -Severity "WARN" -Message "Brain-mappe mangler: .agents/brain/"
    Add-ReportLine -Severity "WARN" -Message "Brain-mappe .agents/brain/ mangler"
    $warnCount++
}

Write-Host ""

# --- Opsummering ---

Write-Host "--- RESUME ---" -ForegroundColor $ColorInfo
Write-AuditLine -Severity "INFO" -Message "OK:       $okCount"
Write-AuditLine -Severity "WARN" -Message "Advarsler: $warnCount"
if ($errorCount -gt 0) {
    Write-AuditLine -Severity "ERROR" -Message "Fejl:     $errorCount"
}
if ($criticalCount -gt 0) {
    Write-AuditLine -Severity "CRITICAL" -Message "Kritiske: $criticalCount"
}

$totalIssues = $criticalCount + $errorCount + $warnCount
if ($totalIssues -eq 0) {
    Write-Host ""
    Write-Host "Harness ser sundt ud!" -ForegroundColor $ColorOK
} else {
    Write-Host ""
    Write-Host "Harness har $totalIssues issue(s) der kræver opmærksomhed." -ForegroundColor $ColorWarning
}

# --- Skriv rapport ---

$reportLines += ""
$reportLines += "## Opsummering"
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
    Write-AuditLine -Severity "INFO" -Message "Backup oprettet: $backupPath"
}

$reportLines | Out-File $reportPath -Encoding UTF8
Write-Host ""
Write-Host "Rapport skrevet til: $reportPath" -ForegroundColor $ColorOK

# Exit code
if ($criticalCount -gt 0 -or $errorCount -gt 0) { exit 1 }
exit 0
