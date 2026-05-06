import json, os, re

# Load agent roster
with open('.vscode/.codex/agents/agent-roster.json', 'r', encoding='utf-8') as f:
    roster = json.load(f)

# Load PDF filenames
with open('temp/fb_file_list.txt', 'r', encoding='utf-8') as f:
    pdfs = [line.strip() for line in f if line.strip()]

print(f'Loaded {len(roster)} agents and {len(pdfs)} PDFs')

# Show sample PDFs for reference
for i, p in enumerate(pdfs[:20]):
    print(f'  {i+1}. {p}')
