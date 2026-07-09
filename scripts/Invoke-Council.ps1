# scripts/Invoke-Council.ps1
# LLM Council — 3-stage deliberation wrapper for Windows PowerShell.
# Calls the Python script with nice formatting.

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Prompt,

    [string]$Models,
    [string]$Chairman,
    [switch]$Verbose
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$councilScript = Join-Path $scriptDir ".." ".agents" "skills" "llm-council" "scripts" "llm-council.py"

$args = @($Prompt)
if ($Models) { $args += "--models"; $args += $Models }
if ($Chairman) { $args += "--chairman"; $args += $Chairman }
if ($Verbose) { $args += "--verbose" }

python $councilScript @args
