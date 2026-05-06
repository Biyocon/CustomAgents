#!/usr/bin/env python3
"""Agent-invokationsscript — slår en agent op ved navn og returnerer dens profil.

Brug:
    python invoke-agent.py -l                    # List alle agenter
    python invoke-agent.py Hassan                # Vis Hassans profil
    python invoke-agent.py projektleder -p       # Kun prompt (copy-paste)
    python invoke-agent.py ahmad -j              # JSON output
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

# ── Resolve project root ──────────────────────────────────────────────
# Script is at .vscode/.codex/scripts/ → go up 3 levels to project root
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent

# ── Agent sources ─────────────────────────────────────────────────────
SOURCES = [
    {
        "path": PROJECT_ROOT / "Avatar" / "agents",
        "type": "Avatar",
        "pattern": "System_Prompt_Agent_*.md",
    },
    {
        "path": PROJECT_ROOT / ".vscode" / ".codex" / "agents" / "banedanmark",
        "type": "Banedanmark",
        "pattern": "*/profile.md",
    },
    {
        "path": PROJECT_ROOT / ".agents" / "agents",
        "type": "Banedanmark (agents)",
        "pattern": "*/profile.md",
    },
]


def extract_yaml_frontmatter(text: str) -> dict:
    """Extract YAML frontmatter from markdown text."""
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    yaml_text = parts[1].strip()
    result = {}
    for line in yaml_text.split("\n"):
        if ":" in line:
            key, val = line.split(":", 1)
            result[key.strip()] = val.strip().strip('"').strip("'")
    return result


def load_agents():
    """Load all agents from all sources."""
    agents = []
    for src in SOURCES:
        base_path = src["path"]
        if not base_path.exists():
            continue

        if src["pattern"].startswith("*/"):
            # Directory-based agents
            for subdir in base_path.iterdir():
                if not subdir.is_dir():
                    continue
                profile = subdir / "profile.md"
                if not profile.exists():
                    continue
                text = read_file_robust(profile)
                fm = extract_yaml_frontmatter(text)
                agents.append({
                    "name": fm.get("name", subdir.name.replace("-", " ").title()),
                    "id": fm.get("id", subdir.name),
                    "type": src["type"],
                    "path": str(profile),
                    "role": fm.get("role", ""),
                    "category": fm.get("category", ""),
                    "status": fm.get("status", ""),
                    "prompt_path": str(profile),
                })
        else:
            # File-based agents (Avatar)
            for file in base_path.glob(src["pattern"]):
                text = read_file_robust(file)
                fm = extract_yaml_frontmatter(text)
                name = fm.get("name", file.stem.replace("System_Prompt_Agent_", "").replace("-", " ").title())
                agent_id = fm.get("id", file.stem.replace("System_Prompt_Agent_", ""))
                agents.append({
                    "name": name,
                    "id": agent_id,
                    "type": src["type"],
                    "path": str(file),
                    "role": fm.get("role", ""),
                    "category": fm.get("category", ""),
                    "status": fm.get("status", ""),
                    "prompt_path": str(file),
                })
    return agents


def fuzzy_match(agents, query):
    """Fuzzy match agent names."""
    query = query.lower()
    matches = []
    for agent in agents:
        score = None
        name_lower = agent["name"].lower()
        id_lower = agent["id"].lower()
        if name_lower == query or id_lower == query:
            score = 0
        elif name_lower.startswith(query) or id_lower.startswith(query):
            score = 1
        elif query in name_lower or query in id_lower:
            score = 2
        if score is not None:
            matches.append((score, agent))
    matches.sort(key=lambda x: x[0])
    result = []
    for score, agent in matches:
        agent["_score"] = score
        result.append(agent)
    return result


def read_file_robust(path: Path) -> str:
    """Read a file trying multiple encodings."""
    if not path.exists():
        return ""
    for enc in ["utf-8", "utf-8-sig", "latin-1", "cp1252"]:
        try:
            return path.read_text(encoding=enc)
        except UnicodeDecodeError:
            continue
    return path.read_text(encoding="utf-8", errors="replace")


def read_prompt(agent):
    """Read the full prompt text for an agent."""
    path = Path(agent["prompt_path"])
    return read_file_robust(path) if path.exists() else "[Prompt ikke fundet]"


def list_agents(agents):
    """Print all agents in a table."""
    print()
    print("=" * 72)
    print(f"  TILGAENGELIGE AGENTER ({len(agents)})")
    print("=" * 72)
    print()

    # Group by type
    by_type = {}
    for a in agents:
        by_type.setdefault(a["type"], []).append(a)

    for type_name, type_agents in sorted(by_type.items()):
        print(f"\n  [{type_name}]")
        print("  " + "-" * 66)
        for a in sorted(type_agents, key=lambda x: x["name"]):
            status = f" ({a['status']})" if a.get("status") else ""
            print(f"    {a['name']:<35}  id: {a['id']}{status}")

    print()
    print("  Brug: python invoke-agent.py <navn>      # vis profil")
    print("  Brug: python invoke-agent.py <navn> -p   # kopier prompt")
    print()


def show_agent(agent, prompt_only=False):
    """Display agent profile."""
    if prompt_only:
        print(read_prompt(agent))
        return

    print()
    print("=" * 72)
    print(f"  AGENT: {agent['name']}")
    print("=" * 72)
    print(f"  ID:       {agent['id']}")
    print(f"  Type:     {agent['type']}")
    if agent.get("role"):
        print(f"  Rolle:    {agent['role']}")
    if agent.get("category"):
        print(f"  Kategori: {agent['category']}")
    if agent.get("status"):
        print(f"  Status:   {agent['status']}")
    print(f"  Sti:      {agent['path']}")
    print("=" * 72)
    print()
    print("  --- SYSTEM PROMPT (kopier til din AI) ---")
    print()
    print(read_prompt(agent))
    print()
    print("  --- SÅDAN AKTIVÉRER DU ---")
    print()
    print("  1. Kopier system prompten ovenfor")
    print("  2. Indsaet den som din foerste besked til AIen")
    print("  3. Skriv derefter din opgave")
    print()


def main():
    parser = argparse.ArgumentParser(description="Agent-invokation")
    parser.add_argument("name", nargs="?", help="Agent-navn at slå op")
    parser.add_argument("-l", "--list", action="store_true", help="List alle agenter")
    parser.add_argument("-p", "--prompt", action="store_true", help="Kun prompt-output")
    parser.add_argument("-j", "--json", action="store_true", help="JSON output")
    args = parser.parse_args()

    agents = load_agents()

    # Deduplicate by ID — prefer .vscode/.codex over .agents/
    seen = {}
    for a in agents:
        aid = a["id"]
        if aid not in seen:
            seen[aid] = a
        elif "Banedanmark" in a["type"] and "agents)" in seen[aid]["type"]:
            seen[aid] = a  # prefer non-(agents) source
    agents = list(seen.values())

    if args.list or not args.name:
        list_agents(agents)
        return

    matches = fuzzy_match(agents, args.name)

    if not matches:
        print(f"FEJL: Ingen agent matcher '{args.name}'")
        print("Brug -l for at se alle agenter.")
        sys.exit(1)

    # If multiple matches, auto-pick the best-scored one
    if len(matches) > 1 and not args.json:
        best_score = matches[0]["_score"]
        best_matches = [m for m in matches if m["_score"] == best_score]
        if len(best_matches) == 1:
            agent = best_matches[0]
        else:
            print(f"Flere agenter matcher '{args.name}':")
            for m in best_matches:
                print(f"  * {m['name']} [{m['type']}] (id: {m['id']})")
            print()
            print(f"Vaeg en specifik: python invoke-agent.py '{best_matches[0]['name']}'")
            sys.exit(1)
    else:
        agent = matches[0]

    if args.json:
        print(json.dumps(agent, indent=2, ensure_ascii=False))
    else:
        show_agent(agent, prompt_only=args.prompt)


if __name__ == "__main__":
    main()
