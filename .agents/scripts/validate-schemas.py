#!/usr/bin/env python3
"""Validate the canonical .agents/ layer against the canonical JSON Schemas.

PR B "schema-modning": the schemas in .agents/schema/ define the target contract
for the model-agnostic canonical layer. This script makes them *checkable* — it
validates the real canonical data against them and reports non-conformance.

It is ADDITIVE and read-only: it changes no data, only reports. Fixing reported
gaps is separate follow-up work (canonical conformance).

Scope:
  - .agents/registry.yaml            vs registry.schema.json
  - .agents/agents/<id>/profile.md   vs agent-profile.schema.json (frontmatter)
  - .agents/skills/<id>/SKILL.md      vs skill.schema.json (frontmatter)

Run:
  uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py [ROOT]

Exit code: 0 if all conform, 1 if any non-conformance (so it can gate CI later).
"""
import json
import glob
import os
import re
import sys

try:
    import yaml
    from jsonschema import Draft202012Validator
except ModuleNotFoundError:
    sys.stderr.write(
        "Mangler afhaengigheder. Koer med:\n"
        "  uv run --with jsonschema --with pyyaml python .agents/scripts/validate-schemas.py\n"
    )
    sys.exit(2)

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
SCHEMA_DIR = os.path.join(ROOT, ".agents", "schema")


def load_schema(name):
    with open(os.path.join(SCHEMA_DIR, name), encoding="utf-8") as f:
        return json.load(f)


def frontmatter(path):
    """Parse YAML frontmatter from a markdown file (tolerates a leading BOM)."""
    with open(path, encoding="utf-8") as f:
        txt = f.read()
    m = re.match(r"^﻿?---\s*\n(.*?)\n---", txt, re.S)
    if not m:
        return None
    return yaml.safe_load(m.group(1))


def validate_one(validator, data):
    return [f"{list(e.path) or '(root)'}: {e.message}" for e in validator.iter_errors(data)]


def main():
    total_errors = 0
    print("=== VALIDER CANONICAL DATA MOD SKEMAER ===")
    print(f"Rod: {ROOT}\n")

    # 1. Registry
    reg_v = Draft202012Validator(load_schema("registry.schema.json"))
    reg = yaml.safe_load(open(os.path.join(ROOT, ".agents", "registry.yaml"), encoding="utf-8"))
    reg_errs = validate_one(reg_v, reg)
    total_errors += len(reg_errs)
    print(f"[registry] .agents/registry.yaml: {'OK' if not reg_errs else str(len(reg_errs)) + ' fejl'}")
    for e in reg_errs:
        print(f"    - {e}")

    # 2. Agent profiles
    ap_v = Draft202012Validator(load_schema("agent-profile.schema.json"))
    profiles = sorted(glob.glob(os.path.join(ROOT, ".agents", "agents", "*", "profile.md")))
    ap_bad = 0
    print(f"\n[agent-profiler] {len(profiles)} profile.md")
    for p in profiles:
        agent = os.path.basename(os.path.dirname(p))
        fm = frontmatter(p)
        errs = ["ingen frontmatter"] if fm is None else validate_one(ap_v, fm)
        if errs:
            ap_bad += 1
            total_errors += len(errs)
            print(f"    {agent}: {'; '.join(errs)}")
    print(f"    -> {ap_bad} med fejl, {len(profiles) - ap_bad} OK")

    # 3. Skills
    sk_v = Draft202012Validator(load_schema("skill.schema.json"))
    skills = sorted(glob.glob(os.path.join(ROOT, ".agents", "skills", "*", "SKILL.md")))
    sk_bad = 0
    print(f"\n[skills] {len(skills)} SKILL.md")
    for p in skills:
        skill = os.path.basename(os.path.dirname(p))
        fm = frontmatter(p)
        errs = ["ingen frontmatter"] if fm is None else validate_one(sk_v, fm)
        if errs:
            sk_bad += 1
            total_errors += len(errs)
            print(f"    {skill}: {'; '.join(errs)}")
    print(f"    -> {sk_bad} med fejl, {len(skills) - sk_bad} OK")

    print(f"\n=== RESUME: {total_errors} skema-overtraedelser i alt ===")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.exit(main())
