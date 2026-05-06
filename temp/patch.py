import shutil
from pathlib import Path

p = Path("temp/harness_build.py")
text = p.read_text(encoding="utf-8")

# Indsæt rm_tree før file_info
helper = '''def rm_tree(path: Path):
    if not path.exists():
        return
    def onexc(func, p, exc_info):
        import stat, os
        os.chmod(p, stat.S_IWRITE)
        func(p)
    shutil.rmtree(path, onexc=onexc)

'''

text = text.replace("def file_info(p: Path) -> dict:", helper + "def file_info(p: Path) -> dict:")

# Erstat rmtree+copytree med ignore=.git
old1 = '''    if src.exists():
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        lines.append(f"- **mattpocock-skills** kopieret fra `{src.relative_to(ROOT)}` til `{dst.relative_to(ROOT)}`.")'''
new1 = '''    if src.exists():
        if dst.exists():
            rm_tree(dst)
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns('.git'))
        lines.append(f"- **mattpocock-skills** kopieret fra `{src.relative_to(ROOT)}` til `{dst.relative_to(ROOT)}`.")'''
text = text.replace(old1, new1)

old2 = '''    if src2.exists():
        if dst2.exists():
            shutil.rmtree(dst2)
        shutil.copytree(src2, dst2)
        lines.append(f"- **andrej-karpathy-skills** kopieret fra `{src2.relative_to(ROOT)}` til `{dst2.relative_to(ROOT)}`.")'''
new2 = '''    if src2.exists():
        if dst2.exists():
            rm_tree(dst2)
        shutil.copytree(src2, dst2, ignore=shutil.ignore_patterns('.git'))
        lines.append(f"- **andrej-karpathy-skills** kopieret fra `{src2.relative_to(ROOT)}` til `{dst2.relative_to(ROOT)}`.")'''
text = text.replace(old2, new2)

p.write_text(text, encoding="utf-8")
print("[OK] Patched harness_build.py")
