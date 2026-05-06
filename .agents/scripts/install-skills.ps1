#Requires -Version 5.1
<#
.SYNOPSIS
    Installerer eller opdaterer vendor-skills i .agents/vendor/.
.DESCRIPTION
    Verificerer git, node og npm. Kloner eller opdaterer whitelistede vendor-repoer.
    Rører ikke kuraterede skills uden eksplicit parameter.
.PARAMETER UpdateVendor
    Tillad opdatering (git pull) af eksisterende vendor-mapper.
.PARAMETER Root
    Rodstien til projektet. Default er nuværende mappe.
.EXAMPLE
    .\.agents\scripts\install-skills.ps1
    .\.agents\scripts\install-skills.ps1 -UpdateVendor
#>
param(
    [switch]$UpdateVendor,
    [string]$Root = (Get-Location)
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
        default    { Write-Host "  [$Level]   $Message" }
    }
}

Write-Host ""
Write-Host "=== INSTALLER VENDOR SKILLS ===" -ForegroundColor $ColorInfo
Write-Host "Projektrod: $Root" -ForegroundColor Gray
Write-Host ""

# --- 1. Verificer git, node, npm ---

Write-Host "[1] Verificerer værktøjer..." -ForegroundColor $ColorInfo

$tools = @("git", "node", "npm")
foreach ($tool in $tools) {
    $cmd = Get-Command $tool -ErrorAction SilentlyContinue
    if ($cmd) {
        Write-Status -Level "OK" -Message "$tool fundet: $($cmd.Source)"
    } else {
        Write-Status -Level "ERROR" -Message "$tool mangler. Installer $tool først."
        exit 1
    }
}

Write-Host ""

# --- 2. Sikkerhed: whitelist af vendor-repoer ---

Write-Host "[2] Forbereder vendor-mapper..." -ForegroundColor $ColorInfo

$vendorDir = Join-Path $Root ".agents/vendor"
if (-not (Test-Path $vendorDir)) {
    New-Item -ItemType Directory -Path $vendorDir -Force | Out-Null
    Write-Status -Level "INFO" -Message "Oprettede vendor-mappe: $vendorDir"
}

# Whitelist: kun disse repoer må installeres/opdateres
$whitelist = @(
    [PSCustomObject]@{
        Name   = "mattpocock-skills"
        Url    = "https://github.com/mattpocock/skills.git"
        Target = "mattpocock-skills"
    },
    [PSCustomObject]@{
        Name   = "andrej-karpathy-skills"
        Url    = "https://github.com/forrestchang/andrej-karpathy-skills.git"
        Target = "andrej-karpathy-skills"
    }
)

# --- 3. Klon eller opdater ---

Write-Host "[3] Kloner/opdaterer vendor-repoer..." -ForegroundColor $ColorInfo

foreach ($repo in $whitelist) {
    $targetPath = Join-Path $vendorDir $repo.Target

    if (Test-Path $targetPath) {
        # Sikkerhed: kun opdater hvis -UpdateVendor er sat
        if ($UpdateVendor) {
            Write-Status -Level "INFO" -Message "Opdaterer $($repo.Name)..."
            Push-Location $targetPath
            try {
                $output = git pull 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Status -Level "OK" -Message "$($repo.Name) opdateret"
                } else {
                    Write-Status -Level "WARN" -Message "$($repo.Name) pull fejlede: $output"
                }
            } finally {
                Pop-Location
            }
        } else {
            Write-Status -Level "INFO" -Message "$($repo.Name) findes allerede. Brug -UpdateVendor for at opdatere."
        }
    } else {
        # Sikkerhed: whitelist-tjek
        if ($repo.Target -notin @("mattpocock-skills", "andrej-karpathy-skills")) {
            Write-Status -Level "ERROR" -Message "$($repo.Target) er ikke på whitelist. Springer over."
            continue
        }

        Write-Status -Level "INFO" -Message "Kloner $($repo.Name) fra $($repo.Url)..."
        try {
            git clone $repo.Url $targetPath 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Status -Level "OK" -Message "$($repo.Name) klonet til $targetPath"
            } else {
                Write-Status -Level "ERROR" -Message "Kloning af $($repo.Name) fejlede (exit $LASTEXITCODE)"
            }
        } catch {
            Write-Status -Level "ERROR" -Message "Kloning af $($repo.Name) fejlede: $_"
        }
    }
}

Write-Host ""

# --- 4. Rapport ---

Write-Host "[4] Rapport..." -ForegroundColor $ColorInfo

$installed = Get-ChildItem $vendorDir -Directory -ErrorAction SilentlyContinue
Write-Status -Level "INFO" -Message "Vendor-mapper installeret: $($installed.Count)"
foreach ($d in $installed) {
    Write-Status -Level "OK" -Message "  - $($d.Name)"
}

Write-Host ""
Write-Host "Færdig." -ForegroundColor $ColorOK
exit 0
