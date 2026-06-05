import json
import os
import shutil
import re
from pathlib import Path

def main():
    print("=== SYNCHRONIZING HARNESS ROSTER ===")
    
    # Paths
    root_dir = Path(__file__).resolve().parent.parent
    roster_path = root_dir / ".vscode" / ".codex" / "agents" / "agent-roster.json"
    agents_dir = root_dir / ".agents" / "agents"
    registry_path = root_dir / ".agents" / "registry.yaml"
    skills_dir = root_dir / ".agents" / "skills"
    backup_dir = root_dir / "temp" / "backup_agents"
    
    # 1. Load active roster
    if not roster_path.exists():
        print(f"Error: Active roster not found at {roster_path}")
        return
        
    with open(roster_path, "r", encoding="utf-8") as f:
        roster = json.load(f)
        
    print(f"Loaded {len(roster)} agents from active roster.")
    roster_ids = {agent["id"] for agent in roster}
    
    # 2. Backup existing undocumented folders under .agents/agents
    if agents_dir.exists():
        for item in agents_dir.iterdir():
            if item.is_dir() and item.name not in roster_ids:
                backup_target = backup_dir / item.name
                print(f"Backing up undocumented folder {item.name} to {backup_target}")
                backup_dir.mkdir(parents=True, exist_ok=True)
                if backup_target.exists():
                    shutil.rmtree(backup_target)
                shutil.move(str(item), str(backup_target))
                
    # 3. Create folders and files for each roster agent
    agents_dir.mkdir(parents=True, exist_ok=True)
    
    for agent in roster:
        agent_id = agent["id"]
        agent_dir = agents_dir / agent_id
        agent_dir.mkdir(parents=True, exist_ok=True)
        
        # Determine profile file path
        profile_source = None
        
        # Check explicit profile key from roster
        if "profile" in agent and agent["profile"]:
            explicit_path = root_dir / agent["profile"]
            if explicit_path.exists():
                profile_source = explicit_path
                
        # Try fallbacks in Avatar/agents/
        if not profile_source:
            avatar_agents_dir = root_dir / "Avatar" / "agents"
            if avatar_agents_dir.exists():
                # Try exact matches
                md_fallback = avatar_agents_dir / f"System_Prompt_Agent_{agent_id}.md"
                txt_fallback = avatar_agents_dir / f"System_Prompt_Agent_{agent_id}.txt"
                if md_fallback.exists():
                    profile_source = md_fallback
                elif txt_fallback.exists():
                    profile_source = txt_fallback
                else:
                    # Search by agent name (fuzzy)
                    name_clean = agent["name"].replace(" ", "_")
                    for file in avatar_agents_dir.glob("*"):
                        if name_clean.lower() in file.name.lower() and file.suffix in [".md", ".txt"]:
                            profile_source = file
                            break
                            
        # Write profile.md
        profile_target = agent_dir / "profile.md"
        if profile_source:
            print(f"Copying profile for {agent_id} from {profile_source.name}")
            shutil.copy(str(profile_source), str(profile_target))
        else:
            print(f"Warning: No profile source found for {agent_id}. Creating default profile.md.")
            default_profile_content = f"""---
id: {agent_id}
name: {agent['name']}
role: {agent['role']}
category: {agent['category']}
status: draft
source: ingen
---

# Profil: {agent['name']} - {agent['role']}

## Beskrivelse
Agent til understøttelse af {agent['role']} i BaneByg-projekter.
"""
            with open(profile_target, "w", encoding="utf-8") as pf:
                pf.write(default_profile_content)
                
        # Write skills.yaml
        skills_target = agent_dir / "skills.yaml"
        skills_yaml_content = f"""skills:
{chr(10).join(f"  - {s}" for s in agent.get('skills', []))}

capabilities:
{chr(10).join(f"  - {c}" for c in agent.get('capabilities', []))}
"""
        with open(skills_target, "w", encoding="utf-8") as sf:
            sf.write(skills_yaml_content)
            
    # 4. Find all skills under .agents/skills
    skills = []
    if skills_dir.exists():
        for item in skills_dir.iterdir():
            if item.is_dir():
                skills.append(item.name)
    skills.sort()
    print(f"Found {len(skills)} skills under .agents/skills/.")
    
    # 5. Update .agents/registry.yaml
    if registry_path.exists():
        with open(registry_path, "r", encoding="utf-8") as rf:
            reg_content = rf.read()
            
        # Build YAML blocks
        agents_yaml_block = "agents:\n"
        for agent in roster:
            agents_yaml_block += f"  - id: {agent['id']}\n"
            agents_yaml_block += f"    name: {agent['name']}\n"
            agents_yaml_block += f"    role: {agent['role']}\n"
            agents_yaml_block += f"    category: {agent['category']}\n"
            
        skills_yaml_block = "skills:\n"
        for skill in skills:
            skills_yaml_block += f"  - id: {skill}\n"
            
        # Replace empty/existing blocks
        # We replace the lines 'agents: []' and 'skills: []' or replace existing 'agents:\n  ...' blocks
        # To be safe, we match 'agents: ...' until the next top-level key or empty line, or replace simple lines
        reg_content = re.sub(r"agents:\s*\[\]", agents_yaml_block.strip(), reg_content)
        reg_content = re.sub(r"skills:\s*\[\]", skills_yaml_block.strip(), reg_content)
        
        # Save updated registry
        with open(registry_path, "w", encoding="utf-8") as wf:
            wf.write(reg_content)
        print("Updated .agents/registry.yaml successfully.")
    else:
        print(f"Error: .agents/registry.yaml not found.")
        
    print("=== HARNESS ROSTER SYNCHRONIZATION COMPLETE ===")

if __name__ == "__main__":
    main()
