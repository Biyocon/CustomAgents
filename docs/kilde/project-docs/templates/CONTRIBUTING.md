# Contributing to {{PROJECT_NAME}}

Thank you for your interest in contributing to {{PROJECT_NAME}}.

## Project structure

```
{{REPO_TREE_SHORT}}
```

## Development setup

```bash
cp .env.example .env   # fill in required keys
{{INSTALL_CMD}}        # install dependencies
{{DEV_CMD}}            # starts on {{DEV_URL}}
```

For optional integrations see [README.md](README.md).

## Running tests

```bash
{{TEST_CMD}}           # unit tests
{{E2E_TEST_CMD}}       # end-to-end tests (if applicable)
```

## Code conventions

- {{LANGUAGE_CONVENTION}}
- {{DB_CONVENTION}}
- {{STRUCTURE_CONVENTION_1}}
- {{STRUCTURE_CONVENTION_2}}
- Lazy `require(...)` to break a circular import is **not** a fix — it hides
  architectural debt. Raise it in PR review instead.

## Database migrations

```bash
{{DB_GENERATE_CMD}}    # generate migration from schema changes
{{DB_MIGRATE_CMD}}     # apply migrations
```

## Pull requests

- One logical change per PR.
- Include a short description of what changed and why.
- Tests are required for new {{TEST_REQUIRED_FOR}}.
- New {{RISK_SURFACE}} requires a documented owner and exit criteria.
