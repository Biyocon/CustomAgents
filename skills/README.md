# `skills/` (root-level) — audit note

**status: unresolved — needs owner decision on canonical location, see docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md**

## What this directory is

35 skill subdirectories (e.g. `skills/bdk-brand-governance/`, `skills/diagnose/`, ...) added in
commit `9783ccdb` ("Custom Agents", 2026-05-06), the same commit that bulk-imported
`.agents/skills/`. It is **not referenced** in `AGENTS.md`, `ADR-0001-agent-harness.md`, or any
README, and there is no code, script, or docs pointer that treats it as a live source — it looks
orphaned from the moment it landed.

Roughly a third of the skill dirs here (16/35) still use the per-skill `agents/openai.yaml`
adapter pattern. ADR-0001 explicitly says that pattern should be replaced by shared adapters
under `.agents/model-adapters/`. `.agents/skills/` has zero `openai.yaml` files left — it has
fully moved off the old pattern. That alone marks this directory as pre-migration content.

## Relationship to `.agents/skills/` and `.vscode/.codex/skills/`

Diffed 5 skills that exist in both `skills/` and `.agents/skills/`
(`bdk-brand-governance`, `bdk-gdpr-praksis`, `bdk-legal-mapping`, `diagnose`, `write-a-skill`).
Findings:

1. **`skills/` == `.vscode/.codex/skills/`, essentially byte-for-byte.** For all 5 sampled
   skills, `skills/<name>/` is identical to `.vscode/.codex/skills/<name>/` (only difference
   found: a stripped UTF-8 BOM on two files). `git log --follow` on
   `skills/bdk-brand-governance/SKILL.md` traces straight back through a rename to
   `.vscode/.codex/skills/bdk-brand-governance/SKILL.md`, which already existed in the very
   first commit (`33b51afe`, "Initial_commit") — i.e. this content predates the "Custom Agents"
   import and root `skills/` is a copy of the `.codex` runtime tree, not an independent draft.

2. **`.agents/skills/` diverges in two different directions depending on skill origin:**
   - For the BDK compliance skills (`bdk-brand-governance`, `bdk-gdpr-praksis`,
     `bdk-legal-mapping`), `.agents/skills/` has been **substantially rewritten** relative to
     `skills/` / `.codex`: different frontmatter (`trigger: [...]` arrays instead of
     `name`/`version`/`metadata`), a `TL;DR` + explicit "hvad er aktivt / hvad er UKENDT /
     FORELØBIG" section, and generally more defensive, hedged content. So `.agents/skills/` is
     **ahead** here — it has real independent edits root does not have.
   - But `.agents/skills/` **lost the `references/` subdirectories** in the process
     (`references/source-map.md`, and for brand-governance also
     `references/bdk-brand-designsystem.md`) — supporting source material that only survives in
     `skills/` and `.codex`. So root `skills/` is **ahead** on that axis.
   - For the two skills sourced from `mattpocock/skills` (`diagnose`, `write-a-skill`), `SKILL.md`
     content in `skills/` and `.agents/skills/` is **identical** — but they were not copied from
     one another. Each side carries its own provenance marker: `skills/diagnose/.mp-skill` records
     an `install-mp-skills.py` install from the upstream repo; `.agents/skills/diagnose/source.md`
     records a separate manual copy-and-Claude-ify pass, both dated 2026-05-06. These are
     **parallel independent imports of the same upstream**, not a fork of each other.

3. **Net verdict:** root `skills/` is not simply "the original `.agents/skills` was copied from"
   (case a) in a clean sense, nor a fork with its own edits (case b) — it's closer to
   **(c) a stale, pre-migration duplicate that shares its content with `.vscode/.codex/skills/`**,
   while `.agents/skills/` is a partially-rewritten, partially-regressed descendant: newer prose
   for the BDK compliance skills, but missing reference material those same skills still cite.
   Neither directory is a strict superset of the other — they are **diverged**, and reconciling
   them (deciding whether `.agents/skills/` should re-absorb the missing `references/` files, and
   whether root `skills/` / `.vscode/.codex/skills/` should be retired) is an owner decision, not
   something to resolve by guessing here.

## Do not

Do not delete, move, or merge anything in this directory based on this note alone. This file only
records what was found during the 2026-07-09 48-agent deep audit so a future reader does not have
to re-derive it. See `docs/audit/AUDIT-2026-07-09-48-agent-dybdeaudit.md` for the full audit and
open the canonicalization decision there before acting.
