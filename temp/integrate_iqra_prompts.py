import json
import re
from pathlib import Path
from textwrap import dedent

ROOT = Path(".")
IQRA = ROOT / "Avatar/Iqra-main/Iqra-main/lib/agents/src/index.ts"
AGENTS_DIR = ROOT / "Avatar/agents"
ROSTER_PATH = ROOT / ".vscode/.codex/agents/agent-roster.json"

# 1. Extract all Iqra system prompts
iqra_text = IQRA.read_text(encoding="utf-8")
pattern = re.compile(r"const ([A-Z_]+)_SYSTEM_PROMPT = `([\s\S]*?)`;", re.MULTILINE)
prompts = {m.group(1): m.group(2).strip() for m in pattern.finditer(iqra_text)}
print(f"Extracted {len(prompts)} prompts from Iqra: {list(prompts.keys())}")

# 2. Mapping from Iqra constant prefix to agent slug
MAPPING = {
    "YUNUS": "yunus-udbudskonsulent",
    "SIBGHA": "sibgha-finance-analytics-specialist",
    "ABDI_ASIS": "abdi-asis-produkt-manager",
    "AHMAD_EL_WALI": "ahmad-el-wali",
    "HASSAN_DAHIR": "hassan-dahir",
    "MEHTAP": "mehtap-udbudskonsulent",
    "JOEL": "joel-mulongo-udbudsjurist",
    "WILLIAM": "william-udbudskonsulent",
    "IFRAH": "ifrah-farmaceut",
    "MOHAMMAD": "mohammad-udbudskonsulent",
    "SABINA": "sabina-udbudskonsulent-chefkonsulent",
}

# 3. Load roster
roster = json.loads(ROSTER_PATH.read_text(encoding="utf-8"))
roster_by_id = {a["id"]: a for a in roster}

# 4. Shared skills that appear in every agent
SHARED_SKILLS = ["karpathy-guidelines", "shared-quality", "shared-docx", "bdk-brand-governance", "bdk-gdpr-praksis"]

# 5. Helper to write agent file
TEMPLATE = dedent("""\
---
id: {id}
name: {name}
role: {role}
category: {category}
avatar: ../{avatar}
accent: {accent}
status: active
source: "Iqra-main/lib/agents/src/index.ts ({const_name}_SYSTEM_PROMPT)"
primary_models:
  - Codex
  - Kimi
  - Qwen Code
  - Gemini Code
skills:
{skills_yaml}
---

# Agent: {name} – {role}

## System Prompt

```text
{prompt}
```

## Kernekompetencer

{capabilities_md}

## Tilknyttede Subskills

{skills_md}

## Standard Testprompts

- "Gennemgå denne opgave som {role} og giv de vigtigste risici, antagelser og næste handlinger."
- "Lav en kort beslutningsklar leverance baseret på det vedhæftede materiale."
- "Hvilke subskills skal anvendes, før vi kan kalde dette kvalitetssikret?"

## Vedligeholdelse

Kilde: Iqra-main `lib/agents/src/index.ts` — `{const_name}_SYSTEM_PROMPT`. Opdateres hvis Iqra-source ændres eller ny domæneviden tilføjes.
""").strip() + "\n"

def build_agent_file(agent, prompt, const_name):
    skills = agent.get("skills", [])
    # Ensure shared skills are present
    for s in SHARED_SKILLS:
        if s not in skills:
            skills.insert(0, s)
    # Deduplicate while preserving order
    seen = set()
    skills = [s for s in skills if not (s in seen or seen.add(s))]

    skills_yaml = "\n".join(f"  - {s}" for s in skills)
    skills_md = "\n".join(f"- `{s}`" for s in skills)
    capabilities_md = "\n".join(f"- {c}" for c in agent.get("capabilities", []))

    avatar = agent.get("avatar", "")
    if avatar.startswith("Avatar/"):
        avatar = avatar.replace("Avatar/", "")
    elif avatar.startswith("../"):
        avatar = avatar.replace("../", "")

    return TEMPLATE.format(
        id=agent["id"],
        name=agent["name"],
        role=agent["role"],
        category=agent.get("category", "Ukendt"),
        avatar=avatar,
        accent=agent.get("accent", "blue"),
        skills_yaml=skills_yaml,
        capabilities_md=capabilities_md,
        skills_md=skills_md,
        prompt=prompt,
        const_name=const_name,
    )

# 6. Process each Iqra prompt
updated = 0
created = 0
missing_in_roster = []

for const_name, slug in MAPPING.items():
    prompt = prompts.get(const_name)
    if not prompt:
        print(f"WARNING: No prompt found for {const_name}")
        continue

    agent = roster_by_id.get(slug)
    if not agent:
        missing_in_roster.append(const_name)
        print(f"MISSING in roster: {const_name} -> {slug}")
        continue

    content = build_agent_file(agent, prompt, const_name)
    path = AGENTS_DIR / f"System_Prompt_Agent_{slug}.md"
    path.write_text(content, encoding="utf-8")
    if path.exists() and path.stat().st_size > 0:
        print(f"{'CREATED' if slug not in roster_by_id else 'UPDATED'} {path}")
        updated += 1
    else:
        print(f"ERROR writing {path}")

print(f"\nDone: {updated} files written. Missing roster entries for: {missing_in_roster}")
