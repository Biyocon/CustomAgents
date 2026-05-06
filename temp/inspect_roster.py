import json
with open('.vscode/.codex/agents/agent-roster.json', 'r', encoding='utf-8') as f:
    roster = json.load(f)
for a in roster:
    print(f"{a['id']} | {a['name']} | {a['role']} | {a['category']}")
