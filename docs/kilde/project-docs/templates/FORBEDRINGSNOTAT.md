# Improvement Note: {{PROJECT_NAME}} vs {{REFERENCE_ARCHITECTURE}}

**Date:** {{TODAY}}
**Audience:** {{AUDIENCE — e.g. technical leadership + platform engineering}}
**Reference architecture:** `{{REFERENCE_PATH}}`
**Assessed codebase:** `{{ASSESSED_PATHS}}`

> A deep, evidence-based architecture critique that turns a reference
> architecture into a concrete, sequenced roadmap. Every claim cites `file:line`.
> Structure: (0) executive summary → (1) what to adopt → (2) what to avoid →
> (3) prioritised roadmap → (4) test & validation → (5) closing assessment.

---

## 0. Executive overview

{{2-4 sentences: current strengths, the core problem in one phrase, and the
thesis of the note. State plainly what should NOT be rewritten.}}

This note argues three things:
1. **What to adopt** from {{REFERENCE_ARCHITECTURE}} — principles anchored in
   existing files here.
2. **What to actively avoid** — patterns the reference shows become expensive.
3. **A concrete roadmap** — sequenced sprints anchored in real modules.

---

## 1. What to adopt

### 1.{{N}} {{PRINCIPLE_TITLE}}

**Reference:** {{WHERE_IN_REFERENCE}}
**Our situation today (with evidence):**
- `{{file.ts:lines}}` — {{FINDING}}

**Argument:** {{WHY_IT_MATTERS — marginal cost now vs retrofit cost later}}

**Recommendation:** {{CONCRETE_ACTION — new module path, contract shape, etc.}}

---

## 2. What to avoid

> The reference is valuable precisely because it is honest about its own
> weaknesses. Don't reproduce them.

### 2.{{N}} {{ANTIPATTERN_TITLE}}

**Negative reference:** {{WHERE}}
**Our situation today:** {{ARE_WE_AT_RISK_YET}}
**Argument:** {{WHY}}
**Recommendation:** {{GUARDRAIL — ADR, lint rule, CI check}}

---

## 3. Prioritised roadmap

> Deliberately narrower than the reference. Governance around what we already
> have, not new capability for its own sake. Sequence: prerequisites → core → cleanup.

### Sprint {{N}} — {{SPRINT_TITLE}} ({{DURATION}})
**Goal:** {{GOAL}}
**Primary change areas:** {{FILES}}
**Deliverables:** {{LIST}}
**Acceptance criteria:** {{LIST}}
**Risk reduction:** {{WHAT_TIME_BOMB_THIS_DEFUSES}}

---

## 4. Test & validation — how we know it works

> A roadmap without verification is a wishlist. Each sprint ships measurable
> evidence.

- **{{SPRINT}}:** {{TESTS_AND_GATES}}
- **Cross-cutting structural invariants:** {{CI_GATES — circular-dep check, max-lines, flag expiry}}

---

## 5. Closing assessment

{{Where the project's privileged starting position is, what it genuinely lacks
(usually governance, not capability), and which sprints deliver exactly that.}}

---

**References**
- Reference: `{{REFERENCE_PATH}}`
- Cited core files: {{LIST}}
