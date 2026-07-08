# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other coding
agents when working in this repository. **These instructions override default
behavior — follow them exactly.**

> Replace every `{{PLACEHOLDER}}`. Delete sections that don't apply. Keep it
> dense and factual — this file is loaded into context on every session.

---

# {{PROJECT_NAME}}

{{ONE_LINE_PITCH}}

## Source-of-truth order

When sources conflict, trust them in this order:

```
code > primer.md > .claude-memory.md > tasks/lessons.md > CLAUDE.md
```

## Session Memory Workflow

At the start of every session, read these files in order before planning or
touching code:

1. `primer.md`
2. `.claude-memory.md`
3. `tasks/lessons.md`

Rules:

- Treat `tasks/lessons.md` as durable operating rules, not optional notes.
- When the user corrects workflow, process, preferences, or a recurring mistake,
  add or update a concise rule in `tasks/lessons.md`.
- At the end of the session, **rewrite `primer.md` completely** so the next
  session can resume without re-explanation. Keep it concrete: current focus,
  what is done, what is in progress, blockers, next steps, key files.
- `.claude-memory.md` is append-only and is updated by the git post-commit hook
  (`{{INSTALL_HOOK_CMD}}`).

## Planning Documents

This project uses two planning documents with distinct purposes:

| | PROJEKT_PLAN.md | KØREPLAN.md |
|---|---|---|
| **Purpose** | Idea bank, design decisions, history | Sequential execution plan |
| **Answers** | "What are we building and why?" | "What do we do now, and in what order?" |
| **When to read** | Understanding *context* behind a task | Knowing *what to implement next* |

**Never read the entire KØREPLAN.md or PROJEKT_PLAN.md at session start** — read
only the relevant sprint/section. `primer.md` is the condensate.

---

## Commands

```bash
{{DEV_CMD}}          # Start dev server
{{BUILD_CMD}}        # Production build
{{TEST_CMD}}         # Run tests
{{LINT_CMD}}         # Lint
{{MIGRATE_CMD}}      # DB migrations (if applicable)
```

### Testing

```bash
{{TEST_CMD}}                    # Run all tests
{{TEST_SINGLE_CMD}}            # Run a single test file
{{TEST_PATTERN_CMD}}          # Run tests matching a name pattern
```

Test files live {{TEST_LOCATION}} ({{TEST_COUNT}} across the codebase).

### Path Alias

`{{PATH_ALIAS}}` maps to `{{PATH_ALIAS_TARGET}}`.

---

## Architecture

```
{{REPO_TREE}}
```

### Dataflow: {{MAIN_FLOW_NAME}}

```
{{MAIN_FLOW_DIAGRAM}}
```

### Critical Files

| File | Purpose |
|------|---------|
| `{{FILE_1}}` | {{PURPOSE_1}} |
| `{{FILE_2}}` | {{PURPOSE_2}} |
| `{{FILE_3}}` | {{PURPOSE_3}} |

---

## Database / Persistence

- **ORM / driver:** {{ORM}}
- **Store:** {{DB_FILE}}
- **Schema:** `{{SCHEMA_PATH}}` — **Migrations:** `{{MIGRATIONS_PATH}}`

### Migration GOTCHA
{{MIGRATION_GOTCHA}}

---

## Code Style

- **UI language:** {{UI_LANGUAGE}}
- **Code language:** English (identifiers, comments, commits)
- **Fonts / design system:** {{DESIGN_SYSTEM}}
- **State / framework conventions:** {{FRAMEWORK_CONVENTIONS}}

## Key Gotchas

> The most expensive lessons. Each line should save a future agent an hour.

- **{{GOTCHA_1}}**
- **{{GOTCHA_2}}**
- **{{GOTCHA_3}}**

---

## Extension Points — How-To

### New {{EXTENSION_TYPE_1}}
1. {{STEP}}
2. {{STEP}}
3. {{STEP}}

### New API Route
1. Create `{{API_ROUTE_PATTERN}}`
2. Validate input ({{VALIDATION_LIB}})
3. Return JSON / stream

---

## Reference Documentation

Read on-demand, not at session start.

| File | Contents |
|------|----------|
| `{{REF_DOC_1}}` | {{REF_DESC_1}} |
| `{{REF_DOC_2}}` | {{REF_DESC_2}} |

---

## Agent Conventions

- Confirm hard-to-reverse / outward-facing actions before doing them.
- Commit or push only when asked. {{GIT_REMOTE_NOTE}}
- Prefer dedicated file/search tools over shell `grep`/`find`/`cat`.
- Run the relevant verification ({{VERIFY_CMD}}) before claiming a task complete.
