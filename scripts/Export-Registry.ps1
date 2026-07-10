#Requires -Version 5.1
<#
.SYNOPSIS
    Eksporterer agent-registry til forskellige formater.
.DESCRIPTION
    Læser agent-roster.json og genererer registry i onsket format:
    yaml, json eller csv. Inkluderer agenter, skills, kategorier og subagenter.
.PARAMETER Format
    Output-format: yaml | json | csv. Default: json.
.PARAMETER OutputPath
    Sti til output-fil. Paakraevet.
.PARAMETER Root
    Rodstien til projektet.
.PARAMETER WhatIf
    Vis hvad der ville ske uden at skrive fil.
.EXAMPLE
    .\Export-Registry.ps1 -Format yaml -OutputPath ./registry.yaml
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [ValidateSet("yaml", "json", "csv")]
    [string]$Format = "json",

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [string]$Root = (Get-Location)
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Hjælpefunktioner ---
function ConvertTo-Yaml {
    param([hashtable]$Obj, [int]$Indent = 0)
    $yaml = [System.Collections.Generic.List[string]]::new()
    $spaces = " " * $Indent
    foreach ($kv in $Obj.GetEnumerator()) {
        $k = $kv.Key
        $v = $kv.Value
        if ($v -is [System.Collections.IEnumerable] -and $v -isnot [string]) {
            $yaml.Add("${spaces}${k}:")
            foreach ($item in $v) {
                if ($item -is [hashtable]) {
                    $yaml.Add("${spaces}  -")
                    $nested = ConvertTo-Yaml -Obj $item -Indent ($Indent + 4)
                    foreach ($n in $nested.TrimStart() -split "`r?`n") {
                        if ($n) { $yaml.Add("${spaces}    $n") }
                    }
                } else {
                    $yaml.Add("${spaces}  - $item")
                }
            }
        } elseif ($v -is [hashtable]) {
            $yaml.Add("${spaces}${k}:")
            $nested = ConvertTo-Yaml -Obj $v -Indent ($Indent + 2)
            foreach ($n in $nested.TrimStart() -split "`r?`n") {
                if ($n) { $yaml.Add("${spaces}  $n") }
            }
        } else {
            # Escape strings with special chars
            $str = "$v"
            if ($str -match "[:#\r\n]") { $str = """$str""" }
            $yaml.Add("${spaces}${k}: $str")
        }
    }
    return $yaml -join "`r`n"
}

# --- Stier ---
$rosterPath = Join-Path $Root ".vscode/.codex/agents/agent-roster.json"
$agentsDir  = Join-Path $Root "Avatar/agents"
$baneDir    = Join-Path $Root ".vscode/.codex/agents/banedanmark"

if (!(Test-Path $rosterPath)) {
    Write-Error "agent-roster.json mangler: $rosterPath"
    exit 1
}

Write-Host "=== Export af Registry ===" -ForegroundColor Cyan
Write-Host "Format: $Format" -ForegroundColor White
Write-Host "Output: $OutputPath" -ForegroundColor White

$roster = Get-Content $rosterPath -Encoding UTF8 -Raw | ConvertFrom-Json

# Byg registry-struktur
$categories = @($roster | ForEach-Object { $_.category } | Sort-Object -Unique)
$allSkills  = @($roster | ForEach-Object { $_.skills } | Sort-Object -Unique)
$subAgents  = @()

# Subagenter (Banedanmark)
if (Test-Path $baneDir) {
    $baneFiles = Get-ChildItem $baneDir -Filter "bd-*.md" -ErrorAction SilentlyContinue
    foreach ($f in $baneFiles) {
        $content = Get-Content $f.FullName -Encoding UTF8 -Raw
        $sub = @{ id = $f.BaseName; file = $f.Name }
        if ($content -match "^name:\s*(.+)$") { $sub.name = $Matches[1].Trim() }
        if ($content -match "^status:\s*(\S+)") { $sub.status = $Matches[1].Trim() }
        if ($content -match "^role:\s*(.+)$") { $sub.role = $Matches[1].Trim() }
        if ($content -match "^category:\s*(.+)$") { $sub.category = $Matches[1].Trim() }
        $subAgents += $sub
    }
}

# Byg output-data
$registry = [ordered]@{
    _note       = "GENERERET af scripts/Export-Registry.ps1 - IKKE canonical. Canonical kilde: .agents/registry.yaml (ADR-multi-runtime Accepted 2026-07-09). Se docs/architecture/registry-reconciliation.md."
    generatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
    totalAgents = $roster.Count
    categories  = $categories
    skills      = $allSkills
    agents      = @()
    subAgents   = $subAgents
}

foreach ($a in $roster) {
    $agentHash = [ordered]@{
        id          = $a.id
        name        = $a.name
        role        = $a.role
        category    = $a.category
        accent      = $a.accent
        avatar      = $a.avatar
        profile     = $a.profile
        skills      = @($a.skills)
        capabilities = @($a.capabilities)
    }
    $registry.agents += $agentHash
}

# --- Generer output ---
if ($PSCmdlet.ShouldProcess($OutputPath, "Skriver registry som $Format")) {
    switch ($Format) {
        "json" {
            $registry | ConvertTo-Json -Depth 10 | Set-Content $OutputPath -Encoding UTF8
        }
        "yaml" {
            $yamlHeader = "# GENERERET af scripts/Export-Registry.ps1 - IKKE canonical / deprecate-kandidat.`n" +
                          "# Canonical kilde: .agents/registry.yaml. Se docs/architecture/registry-reconciliation.md.`n"
            $yaml = ConvertTo-Yaml -Obj $registry
            Set-Content $OutputPath -Value ($yamlHeader + $yaml) -Encoding UTF8
        }
        "csv" {
            $rows = @()
            foreach ($a in $registry.agents) {
                $rows += [PSCustomObject]@{
                    Id           = $a.id
                    Name         = $a.name
                    Role         = $a.role
                    Category     = $a.category
                    Accent       = $a.accent
                    Avatar       = $a.avatar
                    Profile      = $a.profile
                    Skills       = ($a.skills -join "; ")
                    Capabilities = ($a.capabilities -join "; ")
                }
            }
            if ($subAgents) {
                foreach ($s in $subAgents) {
                    $rows += [PSCustomObject]@{
                        Id       = $s.id
                        Name     = $s.name
                        Role     = $s.role
                        Category = $s.category
                        Accent   = ""
                        Avatar   = ""
                        Profile  = $s.file
                        Skills   = ""
                        Capabilities = ""
                    }
                }
            }
            $rows | Export-Csv $OutputPath -Encoding UTF8 -NoTypeInformation -Delimiter ";"
        }
    }
    Write-Host "Registry eksporteret til $OutputPath" -ForegroundColor Green
}

exit 0
