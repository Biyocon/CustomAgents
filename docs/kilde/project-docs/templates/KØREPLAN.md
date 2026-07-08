# KØREPLAN: {{PROJECT_NAME}} — Implementation Plan

> **Purpose:** the sequential execution plan. Answers *"What do we do now, and in
> what order?"* — phases, sprints, and per-task status. The *why* lives in
> `PROJEKT_PLAN.md`; this file is the *what-next*.
>
> At session start read **only** the relevant sprint, never the whole file.
> `primer.md` is the condensate that points here.

---

## STATUS PR. {{TODAY}} (authoritative)

- **Current phase:** {{CURRENT_PHASE}}
- **Current sprint:** {{CURRENT_SPRINT}}
- **Recently closed:** {{RECENTLY_CLOSED}}
- **Next up:** {{NEXT_UP}}

Status legend: ✅ DONE · ⏳ IN PROGRESS · ⚠️ PARTIAL (code exists, not E2E) · ⬜ NOT STARTED

> A sprint is only ✅ when: code on disk **and** type-check/build clean **and**
> tests green **and** the path is wired + exercised. "Code exists" ≠ operational.

---

## Overview: Phases

| Phase | Theme | Sprints | Status |
|-------|-------|---------|--------|
| A | {{PHASE_A_THEME}} | {{RANGE}} | {{STATUS}} |
| B | {{PHASE_B_THEME}} | {{RANGE}} | {{STATUS}} |
| C | {{PHASE_C_THEME}} | {{RANGE}} | {{STATUS}} |

---

## FASE A: {{PHASE_A_THEME}}

### Sprint {{N}} — {{SPRINT_TITLE}}  [{{STATUS}}]

**Goal:** {{SPRINT_GOAL}}

**Primary change areas:**
- `{{FILE}}` — {{WHAT}}

**Tasks:**
- [ ] {{N}}.1 {{TASK}}
- [ ] {{N}}.2 {{TASK}}
- [ ] {{N}}.3 {{TASK}}

**Acceptance criteria:**
- {{CRITERION_1}}
- {{CRITERION_2}}

**Verification:** {{VERIFY_CMD}}

---

## Dependency graph (critical path)

```
{{DEPENDENCY_DIAGRAM — e.g. Sprint 0 (prep) -> Sprint 1-3 (core) -> Sprint 4 (cleanup)}}
```

---

## Summary statistics

- Total sprints: {{TOTAL}}
- Done: {{DONE}} · In progress: {{WIP}} · Not started: {{TODO}}
