<#
.SYNOPSIS
    Analyse af PPTX-filer for BDK branding compliance (v2.1).
.DESCRIPTION
    Scanner PPTX-filer for fonter, tabeller, charts, billeder, noter, diagrammer og tema-data.
    Udpakker PPTX (ZIP) og parser XML-indhold direkte.
    Understøtter -OutputJson til maskinlæsbar rapportering.
    Understøtter -Path til enkeltfil eller mappe (scanner alle .pptx).
.EXAMPLE
    .\analyze_pptx.ps1 -Path "C:\Banedanmark\11_Power point præsentationer\Ledelsesgrundlag.pptx"
    .\analyze_pptx.ps1 -Path "C:\Banedanmark\11_Power point præsentationer" -OutputJson
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$Path,
    [switch]$OutputJson
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Analyze-SinglePptx {
    param([string]$FilePath)

    $fileName = (Get-Item $FilePath).Name
    $tempDir = Join-Path $env:TEMP "pptx_analysis_$(Get-Random)"

    try {
        [System.IO.Compression.ZipFile]::ExtractToDirectory($FilePath, $tempDir)
    } catch {
        Write-Warning "Kunne ikke udpakke $fileName : $_"
        return $null
    }

    # --- Slides ---
    $slideDir = Join-Path $tempDir "ppt\slides"
    $slideFiles = @()
    if (Test-Path $slideDir) {
        $slideFiles = Get-ChildItem $slideDir -Filter "slide*.xml" | Sort-Object { [int]($_.BaseName -replace '\D','') }
    }
    $slideCount = $slideFiles.Count

    # --- Noter ---
    $notesDir = Join-Path $tempDir "ppt\notesSlides"
    $notesCount = 0
    if (Test-Path $notesDir) {
        $noteFiles = Get-ChildItem $notesDir -Filter "notesSlide*.xml"
        foreach ($nf in $noteFiles) {
            $noteXml = [xml](Get-Content $nf.FullName -Raw -Encoding UTF8)
            $noteTexts = $noteXml.SelectNodes("//*[local-name()='t']")
            $noteContent = ($noteTexts | ForEach-Object { $_.InnerText }) -join ""
            # Ignorer tomme noter og standard-placeholders
            $cleaned = $noteContent -replace "Klik for at redigere.*$","" -replace "Click to edit.*$","" -replace "\s+",""
            if ($cleaned.Length -gt 5) { $notesCount++ }
        }
    }

    # --- Temaer ---
    $themeDir = Join-Path $tempDir "ppt\theme"
    $themes = @()
    if (Test-Path $themeDir) {
        $themeFiles = Get-ChildItem $themeDir -Filter "theme*.xml"
        foreach ($tf in $themeFiles) {
            $themeXml = [xml](Get-Content $tf.FullName -Raw -Encoding UTF8)
            $themeName = ""
            $majorFont = ""
            $minorFont = ""
            $accentColors = @()

            $themeElements = $themeXml.SelectNodes("//*[local-name()='themeElements']")
            if ($themeElements.Count -gt 0) {
                $te = $themeElements[0]
                $nameAttr = $themeXml.DocumentElement.GetAttribute("name")
                if ($nameAttr) { $themeName = $nameAttr }

                # Fonter
                $majorLatin = $te.SelectNodes(".//*[local-name()='majorFont']/*[local-name()='latin']")
                $minorLatin = $te.SelectNodes(".//*[local-name()='minorFont']/*[local-name()='latin']")
                if ($majorLatin.Count -gt 0) { $majorFont = $majorLatin[0].GetAttribute("typeface") }
                if ($minorLatin.Count -gt 0) { $minorFont = $minorLatin[0].GetAttribute("typeface") }

                # Accent-farver
                for ($i = 1; $i -le 6; $i++) {
                    $accentNode = $te.SelectNodes(".//*[local-name()='accent$i']/*[local-name()='srgbClr']")
                    if ($accentNode.Count -gt 0) {
                        $accentColors += "#$($accentNode[0].GetAttribute('val'))"
                    }
                }
            }

            $themes += @{
                Name = $themeName
                File = $tf.Name
                MajorFont = $majorFont
                MinorFont = $minorFont
                AccentColors = $accentColors
            }
        }
    }

    # --- Masters ---
    $masterDir = Join-Path $tempDir "ppt\slideMasters"
    $masterCount = 0
    if (Test-Path $masterDir) {
        $masterCount = (Get-ChildItem $masterDir -Filter "slideMaster*.xml").Count
    }

    # --- Layouts ---
    $layoutDir = Join-Path $tempDir "ppt\slideLayouts"
    $layoutCount = 0
    if (Test-Path $layoutDir) {
        $layoutCount = (Get-ChildItem $layoutDir -Filter "slideLayout*.xml").Count
    }

    # --- Fonter, billeder, tabeller, charts, diagrammer (fra slides) ---
    $fontCounts = @{}
    $imageCount = 0
    $tableCount = 0
    $chartCount = 0
    $diagramCount = 0

    foreach ($sf in $slideFiles) {
        $slideXml = [xml](Get-Content $sf.FullName -Raw -Encoding UTF8)

        # Fonter fra text runs
        $runs = $slideXml.SelectNodes("//*[local-name()='rPr']")
        foreach ($rp in $runs) {
            # Direkte font via latin-element
            $latin = $rp.SelectNodes("./*[local-name()='latin']")
            if ($latin.Count -gt 0) {
                $fontName = $latin[0].GetAttribute("typeface")
                if ($fontName -and $fontName -ne "") {
                    if ($fontCounts.ContainsKey($fontName)) { $fontCounts[$fontName]++ }
                    else { $fontCounts[$fontName] = 1 }
                }
            }
            # Font via cs-element (complex script)
            $cs = $rp.SelectNodes("./*[local-name()='cs']")
            if ($cs.Count -gt 0) {
                $csFont = $cs[0].GetAttribute("typeface")
                if ($csFont -and $csFont -ne "" -and $csFont -ne $fontName) {
                    if ($fontCounts.ContainsKey($csFont)) { $fontCounts[$csFont]++ }
                    else { $fontCounts[$csFont] = 1 }
                }
            }
        }

        # Billeder (blip-referencer)
        $blips = $slideXml.SelectNodes("//*[local-name()='blip']")
        $imageCount += $blips.Count

        # Tabeller
        $tables = $slideXml.SelectNodes("//*[local-name()='tbl']")
        $tableCount += $tables.Count

        # Charts (graphicFrame med chart-reference)
        $chartRefs = $slideXml.SelectNodes("//*[local-name()='chart']")
        $chartCount += $chartRefs.Count

        # Diagrammer (dgm:relIds eller SmartArt)
        $dgmRefs = $slideXml.SelectNodes("//*[local-name()='relIds']")
        $diagramCount += $dgmRefs.Count
    }

    # Fonter fra masters og layouts
    $extraDirs = @($masterDir, $layoutDir)
    foreach ($dir in $extraDirs) {
        if (Test-Path $dir) {
            foreach ($xf in (Get-ChildItem $dir -Filter "*.xml")) {
                $xXml = [xml](Get-Content $xf.FullName -Raw -Encoding UTF8)
                $runs = $xXml.SelectNodes("//*[local-name()='rPr']")
                foreach ($rp in $runs) {
                    $latin = $rp.SelectNodes("./*[local-name()='latin']")
                    if ($latin.Count -gt 0) {
                        $fn = $latin[0].GetAttribute("typeface")
                        if ($fn -and $fn -ne "") {
                            if ($fontCounts.ContainsKey($fn)) { $fontCounts[$fn]++ }
                            else { $fontCounts[$fn] = 1 }
                        }
                    }
                }
            }
        }
    }

    # Sortér fonter
    $sortedFonts = $fontCounts.GetEnumerator() | Sort-Object -Property Value -Descending

    # Kvalitetsflags
    $qualityFlags = @()
    $knownFlags = @("ＭＳ Ｐゴシック", "+mj-lt", "+mn-lt", "+mj-cs", "+mn-cs", "Aptos", "Aptos Serif")
    foreach ($flag in $knownFlags) {
        if ($fontCounts.ContainsKey($flag)) {
            $qualityFlags += "$flag ($($fontCounts[$flag]) forekomster)"
        }
    }

    # BDK compliance check
    $bdkOfficialFonts = @("Segoe UI")
    $nonCompliantFonts = $sortedFonts | Where-Object { $_.Name -notin $bdkOfficialFonts -and $_.Name -notlike "Wingdings*" -and $_.Name -ne "Symbol" }
    $complianceStatus = if ($nonCompliantFonts.Count -eq 0) { "COMPLIANT" } else { "NON-COMPLIANT" }

    # Ryd op
    Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

    return @{
        File = $fileName
        AnalysisDate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        BrandingStatus = $complianceStatus
        Stats = @{
            Slides = $slideCount
            Masters = $masterCount
            Themes = $themes.Count
            Layouts = $layoutCount
            Images = $imageCount
            Charts = $chartCount
            Diagrams = $diagramCount
            Tables = $tableCount
            Notes = $notesCount
            NotesCoverage = if ($slideCount -gt 0) { [math]::Round(($notesCount / $slideCount) * 100, 0) } else { 0 }
        }
        Fonts = ($sortedFonts | ForEach-Object { @{ Name = $_.Name; Count = $_.Value } })
        FontTotal = ($fontCounts.Values | Measure-Object -Sum).Sum
        Themes = $themes
        QualityFlags = $qualityFlags
        NonCompliantFonts = ($nonCompliantFonts | ForEach-Object { $_.Name }) | Select-Object -Unique
    }
}

# --- Hovedlogik ---

$files = @()
if (Test-Path $Path -PathType Container) {
    $files = Get-ChildItem $Path -Filter "*.pptx" | Where-Object { $_.Name -notlike "~*" }
} elseif (Test-Path $Path -PathType Leaf) {
    $files = @(Get-Item $Path)
} else {
    Write-Error "Stien '$Path' findes ikke."
    exit 1
}

if ($files.Count -eq 0) {
    Write-Error "Ingen PPTX-filer fundet i '$Path'."
    exit 1
}

$allResults = @()
$grandTotals = @{ Slides=0; Images=0; Charts=0; Diagrams=0; Tables=0; Notes=0; FontCounts=@{} }

foreach ($file in $files) {
    Write-Host "Analyserer: $($file.Name) ..." -ForegroundColor Cyan
    $result = Analyze-SinglePptx -FilePath $file.FullName
    if ($result) {
        $allResults += $result
        $grandTotals.Slides += $result.Stats.Slides
        $grandTotals.Images += $result.Stats.Images
        $grandTotals.Charts += $result.Stats.Charts
        $grandTotals.Diagrams += $result.Stats.Diagrams
        $grandTotals.Tables += $result.Stats.Tables
        $grandTotals.Notes += $result.Stats.Notes
        foreach ($f in $result.Fonts) {
            if ($grandTotals.FontCounts.ContainsKey($f.Name)) {
                $grandTotals.FontCounts[$f.Name] += $f.Count
            } else {
                $grandTotals.FontCounts[$f.Name] = $f.Count
            }
        }
    }
}

# Aggregeret rapport
$aggregate = @{
    TotalFiles = $allResults.Count
    TotalSlides = $grandTotals.Slides
    TotalImages = $grandTotals.Images
    TotalCharts = $grandTotals.Charts
    TotalDiagrams = $grandTotals.Diagrams
    TotalTables = $grandTotals.Tables
    TotalNotes = $grandTotals.Notes
    NotesCoverage = if ($grandTotals.Slides -gt 0) { [math]::Round(($grandTotals.Notes / $grandTotals.Slides) * 100, 0) } else { 0 }
    FontHierarchy = ($grandTotals.FontCounts.GetEnumerator() | Sort-Object -Property Value -Descending | ForEach-Object { @{ Name = $_.Name; Count = $_.Value } })
    TotalFontInstances = ($grandTotals.FontCounts.Values | Measure-Object -Sum).Sum
}

if ($OutputJson) {
    @{
        AnalysisDate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Files = $allResults
        Aggregate = $aggregate
    } | ConvertTo-Json -Depth 5
} else {
    Write-Host ""
    Write-Host "=== BDK PPTX Audit v2.1 ===" -ForegroundColor Green
    Write-Host "Dato: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-Host "Filer analyseret: $($allResults.Count)"
    Write-Host ""
    Write-Host "--- Aggregerede tal ---" -ForegroundColor Yellow
    Write-Host "Slides:     $($aggregate.TotalSlides)"
    Write-Host "Billeder:   $($aggregate.TotalImages)"
    Write-Host "Charts:     $($aggregate.TotalCharts)"
    Write-Host "Diagrammer: $($aggregate.TotalDiagrams)"
    Write-Host "Tabeller:   $($aggregate.TotalTables)"
    Write-Host "Noter:      $($aggregate.TotalNotes) ($($aggregate.NotesCoverage)% daekn.)"
    Write-Host ""
    Write-Host "--- Fonthierarki ---" -ForegroundColor Yellow
    foreach ($fh in $aggregate.FontHierarchy) {
        $status = if ($fh.Name -eq "Segoe UI") { " [OFFICIEL]" }
                  elseif ($fh.Name -in @("ＭＳ Ｐゴシック","+mj-lt","+mn-lt","+mj-cs","+mn-cs")) { " [KVALITETSFLAG]" }
                  elseif ($fh.Name -in @("Wingdings","Symbol")) { " [symbol]" }
                  else { " [uautoriseret]" }
        Write-Host "  $($fh.Name): $($fh.Count)$status"
    }
    Write-Host "  Total: $($aggregate.TotalFontInstances) forekomster"
    Write-Host ""

    foreach ($r in $allResults) {
        $statusColor = if ($r.BrandingStatus -eq "COMPLIANT") { "Green" } else { "Red" }
        Write-Host "--- $($r.File) ---" -ForegroundColor Cyan
        Write-Host "  Status: $($r.BrandingStatus)" -ForegroundColor $statusColor
        Write-Host "  Slides: $($r.Stats.Slides) | Billeder: $($r.Stats.Images) | Tabeller: $($r.Stats.Tables) | Charts: $($r.Stats.Charts) | Diag.: $($r.Stats.Diagrams) | Noter: $($r.Stats.Notes) ($($r.Stats.NotesCoverage)%)"
        if ($r.QualityFlags.Count -gt 0) {
            Write-Host "  Kvalitetsflags: $($r.QualityFlags -join ', ')" -ForegroundColor Yellow
        }
        if ($r.NonCompliantFonts.Count -gt 0) {
            Write-Host "  Uautoriserede fonter: $($r.NonCompliantFonts -join ', ')" -ForegroundColor Red
        }
    }
}
