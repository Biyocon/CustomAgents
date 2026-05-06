import re

with open('lib/agents/src/index.ts', 'r') as f:
    lines = f.readlines()

# Filter out duplicate validation logic lines
new_lines = []
in_validation = False
for line in lines:
    if "const duplicateAgentIds = IQRA_AGENTS.reduce" in line:
        in_validation = True

    if not in_validation:
        new_lines.append(line)

    if in_validation and "  );" in line:
        in_validation = False
    elif in_validation and "  });" in line: # Alternative ending
        in_validation = False
    elif in_validation and "}" in line and "if (nonUniqueAgentIds.length > 0)" not in line:
        # Check if we are at the end of the if block
        if len(new_lines) > 0 and "if (nonUniqueAgentIds.length > 0)" in "".join(lines[max(0, lines.index(line)-10):lines.index(line)]):
             in_validation = False

# This is getting complex, let's just use a simpler approach.
