param(
  [Parameter(Mandatory=$true)]
  [string]$Root
)

Add-Type -AssemblyName System.Drawing

Get-ChildItem -LiteralPath $Root -Recurse -File |
  Where-Object { $_.Extension -in '.png','.ai','.pdf' } |
  ForEach-Object {
    $w=$null; $h=$null
    if($_.Extension -eq '.png'){
      try {
        $img=[System.Drawing.Image]::FromFile($_.FullName)
        $w=$img.Width; $h=$img.Height
        $img.Dispose()
      } catch {}
    }
    [PSCustomObject]@{
      File=$_.FullName
      Ext=$_.Extension
      SizeKB=[math]::Round($_.Length/1KB,1)
      Width=$w
      Height=$h
    }
  } | Sort-Object File | Format-Table -AutoSize
