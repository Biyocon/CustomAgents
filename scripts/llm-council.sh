#!/usr/bin/env bash
# scripts/llm-council.sh
# LLM Council — 3-stage deliberation wrapper for bash (VS Code terminal).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COUNCIL_PY="$SCRIPT_DIR/../.agents/skills/llm-council/scripts/llm-council.py"

if [ $# -lt 1 ]; then
  echo "Usage: bash llm-council.sh \"your question\" [--models m1,m2] [--chairman m1] [--verbose]"
  exit 1
fi

python3 "$COUNCIL_PY" "$@"
