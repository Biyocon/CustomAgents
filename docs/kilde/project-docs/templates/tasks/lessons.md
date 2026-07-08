# Lessons

Durable rules from user corrections and hard-won discoveries.

Read this file at session start and apply it before touching code.

## How to use this file

- One rule per numbered line. Keep each rule concrete and actionable.
- Append-only: never silently delete a rule. If a rule is superseded, strike it
  through (`~~old~~`) and append **RESOLVED [date]:** with the new truth.
- For non-trivial rules, follow the rule with two lines:
  - **Why:** the incident or reasoning that produced the rule.
  - **How to apply:** the concrete action to take next time.
- Promote a lesson here whenever the user corrects your workflow, process, or
  preferences — or when you burn time on a mistake worth never repeating.

## Rules

1. {{RULE_1 — e.g. "Always run {{TEST_CMD}} before claiming a sprint complete; check code on disk, type-check clean, and tests green — not just one of the three."}}

2. {{RULE_2 — e.g. an import/API gotcha: "`X` is a default export — import it as `import X from '...'`, not `{ X }`."}}

3. {{RULE_3 — e.g. a process rule: "Update planning documents when a milestone is actually closed, before switching focus to the next sprint."}}

<!--
Template for a richer rule:

N. **Short imperative statement of the rule.**
**Why:** what went wrong / what we learned.
**How to apply:** the exact steps to take next time.
-->
