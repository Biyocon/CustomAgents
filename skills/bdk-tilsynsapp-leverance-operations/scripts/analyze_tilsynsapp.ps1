param(
  [Parameter(Mandatory=$true)]
  [string]$Folder
)

$py = @"
import os, re, json, zipfile
from datetime import datetime

root = r'''$Folder'''
results = []

for dirpath, _, filenames in os.walk(root):
    for fn in filenames:
        fp = os.path.join(dirpath, fn)
        rel = os.path.relpath(fp, root).replace('\\','/')
        ext = os.path.splitext(fn)[1].lower()
        st = os.stat(fp)
        rec = {
            'path': rel,
            'ext': ext,
            'size': st.st_size,
            'mtime': datetime.fromtimestamp(st.st_mtime).isoformat(timespec='seconds')
        }
        if ext == '.pptx':
            try:
                with zipfile.ZipFile(fp) as z:
                    names = z.namelist()
                    rec['slides'] = sum(1 for n in names if re.match(r'ppt/slides/slide\\d+\\.xml$', n))
                    rec['images'] = sum(1 for n in names if n.startswith('ppt/media/'))
                    rec['notes'] = sum(1 for n in names if re.match(r'ppt/notesSlides/notesSlide\\d+\\.xml$', n))
            except Exception as e:
                rec['error'] = str(e)
        results.append(rec)

print(json.dumps({'root': root, 'count': len(results), 'files': results}, ensure_ascii=False, indent=2))
"@

$tmp = Join-Path $env:TEMP 'tilsynsapp_scan.py'
Set-Content -LiteralPath $tmp -Value $py -Encoding UTF8
python -X utf8 $tmp
