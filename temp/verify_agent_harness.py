from __future__ import annotations

import json
from pathlib import Path


paths = list(Path("Avatar/agents").glob("System_Prompt_Agent_*.md"))
paths.extend(
    [
        Path(".vscode/.codex/prompts/master-system.md"),
        Path(".vscode/.codex/agents/banedanmark/interface-manager-banebyg.md"),
        Path(".vscode/.codex/Brain/context.md"),
    ]
)

bad_patterns = ["Ã", "Â", "\x08", "`\text"]
bad_files: list[str] = []
for path in paths:
    text = path.read_text(encoding="utf-8")
    if any(pattern in text for pattern in bad_patterns):
        bad_files.append(str(path))

roster = json.loads(Path(".vscode/.codex/agents/agent-roster.json").read_text(encoding="utf-8"))

print(f"avatar_profiles={len(list(Path('Avatar/agents').glob('System_Prompt_Agent_*.md')))}")
print(f"roster_items={len(roster)}")
print(f"encoding_bad_files={len(bad_files)}")
if bad_files:
    print("\n".join(bad_files[:20]))

sample = Path("Avatar/agents/System_Prompt_Agent_yunus-udbudskonsulent.md").read_text(encoding="utf-8")
print("sample_has_code_fence=" + str("```text" in sample and "```" in sample))
print("first_id=" + roster[0]["id"])
print("last_id=" + roster[-1]["id"])
