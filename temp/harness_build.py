#!/usr/bin/env python3
"""Harness-byggeri: Fase 1 + Fase 5 + Fase 6"""

import json, shutil, os
from pathlib import Path
from datetime import datetime

ROOT = Path("C:/Users/Biyocon/OneDrive - Biyocon/Desktop/Kvalifikationsordning Entreprenør")
KOMBI = ROOT / "Kombi"
AGENTS = ROOT / ".agents"
REPORTS_INVENTORY = AGENTS / "reports" / "inventory"
REPORTS_ANALYSIS = AGENTS / "reports" / "analysis"
VENDOR = AGENTS / "vendor"
SKILLS_DIR = AGENTS / "skills"

for d in [REPORTS_INVENTORY, REPORTS_ANALYSIS, VENDOR, SKILLS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

TOP_LEVEL_DIRS = [
    "agency-agents-main", "agentic-stack-master", "andrej-karpathy-skills-main",
    "caveman-main", "claude-code-main", "claude-mem-main", "deer-flow-main",
    "everything-claude-code-main", "get-shit-done-main", "graphify-6",
    "Iqra-main", "oh-my-openagent-dev", "planning-with-files-master",
    "skills-main", "system_prompts_leaks-main",
]

TARGET_SKILLS = {
    "tdd": "skills/engineering/tdd",
    "diagnose": "skills/engineering/diagnose",
    "to-prd": "skills/engineering/to-prd",
    "to-issues": "skills/engineering/to-issues",
    "grill-me": "skills/productivity/grill-me",
    "grill-with-docs": "skills/engineering/grill-with-docs",
    "improve-codebase-architecture": "skills/engineering/improve-codebase-architecture",
    "zoom-out": "skills/engineering/zoom-out",
    "write-a-skill": "skills/productivity/write-a-skill",
    "setup-pre-commit": "skills/misc/setup-pre-commit",
}

def rm_tree(path: Path):
    if not path.exists():
        return
    def onexc(func, p, exc_info):
        import stat, os
        os.chmod(p, stat.S_IWRITE)
        func(p)
    shutil.rmtree(path, onexc=onexc)

def file_info(p: Path) -> dict:
    stat = p.stat()
    if p.is_file():
        size = stat.st_size
    else:
        size = sum(f.stat().st_size for f in p.rglob("*") if f.is_file())
    mtime = datetime.fromtimestamp(stat.st_mtime).isoformat()
    ext = p.suffix.lower()
    purpose = "ukendt"
    if p.is_dir():
        purpose = "mappe"
        if (p / "SKILL.md").exists():
            purpose = "skill-pakke"
        elif (p / "README.md").exists() or (p / "README").exists():
            purpose = "projektrod"
    elif ext == ".md":
        purpose = "dokumentation"
        if p.name == "SKILL.md":
            purpose = "skill-definition"
        elif p.name == "AGENTS.md":
            purpose = "agent-instruktioner"
    elif ext in [".json", ".yaml", ".yml", ".toml"]:
        purpose = "konfiguration"
    elif ext in [".py", ".js", ".ts", ".sh", ".ps1", ".bat"]:
        purpose = "script"
    elif ext in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]:
        purpose = "billede"
    elif ext == ".txt":
        purpose = "tekst"
    return {
        "path": str(p.relative_to(ROOT)).replace("\\", "/"),
        "name": p.name,
        "filetype": "directory" if p.is_dir() else ext,
        "size_bytes": size,
        "last_modified": mtime,
        "purpose": purpose,
    }

def deep_scan(name: str) -> list:
    base = KOMBI / name
    if not base.exists():
        return []
    if (base / name).is_dir():
        base = base / name
    files = []
    for p in base.rglob("*"):
        if ".git" in p.parts:
            continue
        try:
            files.append(file_info(p))
        except Exception:
            continue
    return files

def guess_classification(name: str, purpose: str) -> tuple:
    n = name.lower()
    if "skill" in n or purpose == "skill-pakke":
        return "skill", "direkte genbrug"
    if "agent" in n or "prompt" in n:
        return "agent prompt", "kræver omskrivning"
    if n.endswith(".md") or purpose in ["dokumentation", "agent-instruktioner"]:
        return "dokumentation", "direkte genbrug"
    if n.endswith((".json", ".yaml", ".yml", ".toml")):
        return "konfiguration", "kræver omskrivning"
    if n.endswith((".py", ".js", ".ts", ".sh", ".ps1", ".bat")):
        return "script", "kræver omskrivning"
    if "template" in n:
        return "template", "direkte genbrug"
    if purpose == "billede":
        return "billede", "arkivér"
    return "ukendt", "kræver manuel afklaring"

def build_inventory():
    inventory = {"scan_date": datetime.now().isoformat(), "top_level": [], "deep_scans": {}}
    for name in TOP_LEVEL_DIRS:
        p = KOMBI / name
        if not p.exists():
            inventory["top_level"].append({
                "path": f"Kombi/{name}", "name": name, "type": "directory",
                "size_bytes": 0, "last_modified": "", "purpose": "findes ikke", "file_count": 0,
            })
            continue
        info = file_info(p)
        info["file_count"] = sum(1 for _ in p.rglob("*") if _.is_file() and ".git" not in _.parts)
        inventory["top_level"].append(info)
    for deep in ["skills-main", "andrej-karpathy-skills-main", "Iqra-main"]:
        inventory["deep_scans"][deep] = deep_scan(deep)
    out = REPORTS_INVENTORY / "kombi_inventory.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(inventory, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out}")

def build_analysis():
    lines = [
        "# Kombi-analyse",
        "",
        f"_Genereret: {datetime.now().isoformat()}_",
        "",
        "## Top-level klassifikation",
        "",
        "| Mappe | Klassifikation | Vurdering | Bemærkning |",
        "|---|---|---|---|",
    ]
    for name in TOP_LEVEL_DIRS:
        p = KOMBI / name
        if not p.exists():
            lines.append(f"| {name} | — | findes ikke | Stien mangler i Kombi/ |")
            continue
        purpose = file_info(p)["purpose"]
        cls, assessment = guess_classification(name, purpose)
        note = ""
        if name == "skills-main":
            note = "mattpocock/skills – primær kilde til generelle engineering-skills"
        elif name == "andrej-karpathy-skills-main":
            note = "Persona-skills baseret på Andrej Karpathy – kan arkiveres som reference"
        elif name == "Iqra-main":
            note = "Iqra-projekt – app-kode og dokumentation, ikke direkte genbrugelig som skill"
        elif name == "claude-code-main":
            note = "Claude Code-specifikke scripts – kræver omskrivning til model-agnostisk brug"
        elif name == "everything-claude-code-main":
            note = "Claude Code guides – kan genbruges delvist efter omskrivning"
        lines.append(f"| {name} | {cls} | {assessment} | {note} |")

    lines += [
        "",
        "## Deep-scan bemærkninger",
        "",
        "### skills-main",
        "- Indeholder skills under `skills/` fordelt på engineering, productivity, misc.",
        "- Har også `.claude-plugin/` og `scripts/` som er værktøjsspecifikke.",
        "",
        "### andrej-karpathy-skills-main",
        "- Primært persona-skills og prompt-templates.",
        "- Mindre direkte værdi for Banedanmark-harness, men kan inspirere agent-personaer.",
        "",
        "### Iqra-main",
        "- Fuld app-kodebase (Next.js, scripts, docs).",
        "- Ikke en skill-samling; dokumentation og scripts kan dog studeres for patterns.",
        "",
        "## Vendor-kopiering",
        "",
    ]
    src = KOMBI / "skills-main"
    dst = VENDOR / "mattpocock-skills"
    if src.exists():
        if dst.exists():
            rm_tree(dst)
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns('.git'))
        lines.append(f"- **mattpocock-skills** kopieret fra `{src.relative_to(ROOT)}` til `{dst.relative_to(ROOT)}`.")
    else:
        lines.append("- **mattpocock-skills** fandtes ikke i Kombi/.")
    src2 = KOMBI / "andrej-karpathy-skills-main"
    dst2 = VENDOR / "andrej-karpathy-skills"
    if src2.exists():
        if dst2.exists():
            rm_tree(dst2)
        shutil.copytree(src2, dst2, ignore=shutil.ignore_patterns('.git'))
        lines.append(f"- **andrej-karpathy-skills** kopieret fra `{src2.relative_to(ROOT)}` til `{dst2.relative_to(ROOT)}`.")
    else:
        lines.append("- **andrej-karpathy-skills** fandtes ikke i Kombi/.")
    lines.append("")
    out = REPORTS_ANALYSIS / "kombi_analysis.md"
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"[OK] {out}")

def adapt_skill(text: str) -> str:
    text = text.replace("Claude Code", "AI-kodningsagent")
    text = text.replace("Claude", "AI-agent")
    text = text.replace("claude code", "AI-kodningsagent")
    text = text.replace("claude", "AI-agent")
    return text

def curate_skills():
    src_base = VENDOR / "mattpocock-skills"
    if (src_base / "skills-main").is_dir():
        src_base = src_base / "skills-main"
    curation_lines = [
        "# Skills-kuratering",
        "",
        f"_Genereret: {datetime.now().isoformat()}_",
        "",
        "## Valgte skills",
        "",
    ]
    missing = []
    for skill_name, rel_path in TARGET_SKILLS.items():
        src_skill = src_base / rel_path
        if not src_skill.exists():
            missing.append(skill_name)
            continue
        src_file = src_skill / "SKILL.md"
        if not src_file.exists():
            candidates = list(src_skill.rglob("SKILL.md"))
            if candidates:
                src_file = candidates[0]
            else:
                missing.append(skill_name)
                continue
        dst_skill = SKILLS_DIR / skill_name
        dst_skill.mkdir(parents=True, exist_ok=True)
        text = src_file.read_text(encoding="utf-8")
        adapted = adapt_skill(text)
        (dst_skill / "SKILL.md").write_text(adapted, encoding="utf-8")
        source_md = f"""# Kilde

Denne skill er kurateret fra **mattpocock/skills**.
Original sti: `{rel_path}/SKILL.md`
Kopieret: {datetime.now().isoformat()}
Tilpasning: Model-agnostiske erstatninger (Claude → AI-agent, Claude Code → AI-kodningsagent).
"""
        (dst_skill / "source.md").write_text(source_md, encoding="utf-8")
        curation_lines.append(f"- `{skill_name}` – kopieret fra `{rel_path}` og tilpasset.")
    if missing:
        curation_lines += ["", "## Manglende skills", ""]
        for m in missing:
            curation_lines.append(f"- `{m}` – fandtes ikke i repoet.")
    curation_lines += [
        "",
        "## Vurdering",
        "",
        "De valgte skills dækker kernekompetencer for et Banedanmark-projekt-harness:",
        "- **tdd** og **diagnose**: Kvalitetssikring og fejlfinding.",
        "- **to-prd** / **to-issues**: Planlægning og backlog-håndtering.",
        "- **grill-me** / **grill-with-docs**: Kritisk gennemgang og afklaring.",
        "- **improve-codebase-architecture**: Strukturel forbedring.",
        "- **zoom-out**: Overblik og kontekst.",
        "- **write-a-skill**: Evnen til at udvide harnesset selv.",
        "- **setup-pre-commit**: Kodekvalitet fra starten.",
        "",
        "Eventuelle Claude-specifikke antagelser er fjernet eller generaliseret.",
    ]
    out = REPORTS_ANALYSIS / "skills_curation.md"
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(curation_lines))
    print(f"[OK] {out}")

def main():
    print("[START] Harness-byggeri: Fase 1 + Fase 5 + Fase 6")
    build_inventory()
    build_analysis()
    curate_skills()
    print("[FERDIG] Alle rapporter og kopier er oprettet under .agents/")

if __name__ == "__main__":
    main()
