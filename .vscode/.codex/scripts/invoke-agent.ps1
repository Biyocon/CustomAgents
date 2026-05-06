# invoke-agent.ps1 - PowerShell wrapper til Python agent-invokation
# Brug: invoke-agent <navn> [-l] [-p] [-j]
param(
    [Parameter(Position=0)]
    [string]$Name,

    [switch]$l,
    [switch]$List,

    [switch]$p,
    [switch]$Prompt,

    [switch]$j,
    [switch]$Json
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pythonScript = Join-Path $scriptDir "invoke-agent.py"

if (-not (Test-Path $pythonScript)) {
    Write-Error "invoke-agent.py ikke fundet: $pythonScript"
    exit 1
}

# Byg argumenter
$argsList = @()
if ($Name) { $argsList += $Name }
if ($l -or $List) { $argsList += "-l" }
if ($p -or $Prompt) { $argsList += "-p" }
if ($j -or $Json) { $argsList += "-j" }

# Korrekt invoke med argumenter
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "python"
$psi.Arguments = "`"$pythonScript`" " + ($argsList -join " ")
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
$psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8

$proc = [System.Diagnostics.Process]::Start($psi)
$stdout = $proc.StandardOutput.ReadToEnd()
$stderr = $proc.StandardError.ReadToEnd()
$proc.WaitForExit()

if ($stdout) { Write-Output $stdout }
if ($stderr) { Write-Error $stderr }
exit $proc.ExitCode
