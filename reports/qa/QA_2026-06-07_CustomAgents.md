# QA Report — CustomAgents

Generated: 2026-06-07  
Repo: `Biyocon/CustomAgents`  
Scope: GitHub branch state, runtime documentation, `.vscode/.codex/` versus `.agents/`, vendor hygiene, temp/backup hygiene, and obvious secrets risk.

## Executive Summary

GitHub `main` is safe as the tracked source state. The docs-only runtime clarification has been merged into `main` as commit `92279fa01ec9aa4af2b1a278d3f8c641d0aa0771`.

The prior snapshot branch `snapshot/local-pc-2026-06-07` is only an audit marker for tracked Git state. It is not a backup of local ignored files, local temp files, or incomplete vendor working-copy content.

The most important remaining risks are:

1. **High:** `.agents/vendor/mattpocock-skills` is a gitlink/submodule entry without `.gitmodules`.
2. **High:** `.agents/` is not ready as active runtime. `.vscode/.codex/` remains the active source of truth.
3. **Medium:** tracked `temp/` and historical config files need classification before cleanup.
4. **Medium:** validation reports and migration docs are historically useful but not all represent current state.

No vendor fix, temp cleanup, runtime migration, or history rewrite is included in this report.

## Branch Verification

| Branch | Commit | Status | Assessment |
|---|---:|---|---|
| `main` | `92279fa01ec9aa4af2b1a278d3f8c641d0aa0771` | Updated with docs-only runtime clarification | Current tracked baseline |
| `qa/runtime-status-docs-2026-06-07` | `92279fa01ec9aa4af2b1a278d3f8c641d0aa0771` | Same commit as `main` after fast-forward | PR #1 content is on `main` |
| `snapshot/local-pc-2026-06-07` | `7626c697afd6b5950cb976b62ee67d97bf35f0ed` | Audit marker for pre-clarification tracked state | Safe but not a backup of ignored/local-only files |

## Findings

### Finding 1 — High

**`.agents/vendor/mattpocock-skills` is a concrete Git hygiene defect**

Evidence:

```text
160000 commit b843cb5... .agents/vendor/mattpocock-skills
```

The repository has a gitlink/submodule-style entry for `.agents/vendor/mattpocock-skills`, but `.gitmodules` is missing.

Why it matters:

Normal GitHub ZIP downloads and standard clones cannot reliably reconstruct this vendor directory. This contradicts README guidance that vendor sources are already cloned under `.agents/vendor/`.

Recommended action:

Choose one strategy before any larger cleanup:

- Correct submodule with `.gitmodules`.
- Git subtree.
- Vendored copy with source/license attribution.

Do not use a pure install-step strategy unless the tracked gitlink is removed or converted deliberately.

### Finding 2 — High

**`.agents/` is not ready as active runtime**

Evidence:

- Root `AGENTS.md` and `.vscode/.codex/AGENTS.md` define `.vscode/.codex/` as active runtime.
- `.agents/` is documented as migration/reference.
- Local file audit found 37 `.agents/agents` directories matching registry/roster, but only `projekteringsleder` had the full expected file package:
  - `AGENTS.md`
  - `profile.md`
  - `skills.yaml`
  - `avatar.md`
- The remaining 36 agent directories lacked `AGENTS.md` and `avatar.md`.

Why it matters:

Activating `.agents/` prematurely would create runtime ambiguity and incomplete agent behavior.

Recommended action:

Keep `.vscode/.codex/` as source of truth until `.agents/` has a current validation report, a schema contract, and explicit activation approval.

### Finding 3 — Medium

**Runtime drift was real and has now been clarified in docs**

Evidence:

Commit `92279fa01ec9aa4af2b1a278d3f8c641d0aa0771` updates `AGENTS.md` and `README.md` to state:

- `.vscode/.codex/` is active runtime.
- `.agents/` is migration/reference.
- `snapshot/local-pc-2026-06-07` is only an audit marker for tracked Git state.
- `.agents/vendor/mattpocock-skills` is a known gitlink/submodule issue.

Why it matters:

Future agents and developers now have a clearer first-read instruction. This reduces the risk of editing the wrong runtime tree.

Recommended action:

Keep future docs and scripts aligned with this runtime status until a formal activation decision changes it.

### Finding 4 — Medium

**Validation report paths and dates need clearer historical labeling**

Evidence:

Relevant validation artifacts include:

- `.agents/reports/validation_report.md`
  - Generated: `2026-06-03 21:10:28`
  - OK: 3
  - Warnings: 79
  - Errors: 0
  - Critical: 0
- `validation-report.json`
  - Generated: `2026-05-06T12:40:21`
  - Errors: 0
  - Warnings: 0
  - Infos: 2

Why it matters:

Older reports can be mistaken for current runtime certification. The repo has moved since those reports were generated.

Recommended action:

Add an index or note that labels validation reports as historical snapshots unless regenerated after the current commit.

### Finding 5 — Medium

**Tracked `temp/` contains migration scripts and local config material**

Evidence:

Tracked `temp/` content includes migration/generation scripts and local backup/config material such as:

- `temp/sync_harness_roster.py`
- `temp/generate_agent_harness.py`
- `temp/create_agents.py`
- `temp/codex-config-before-mcp-cleanup-20260509-133205.toml`

Why it matters:

Some tracked temp files may be useful migration artifacts. Others are local operational residue. Bulk deletion would be risky, but leaving them unclassified keeps repo hygiene weak.

Recommended action:

Classify tracked `temp/` into:

- Preserve as migration scripts under `scripts/migration/`.
- Preserve as historical reports under `reports/archive/`.
- Stop tracking and ignore going forward.

### Finding 6 — Medium

**Local config backup should not remain in tracked temp long term**

Evidence:

`temp/codex-config-before-mcp-cleanup-20260509-133205.toml` contains MCP configuration, trusted local Windows paths, and placeholder `YOUR_API_KEY`.

Why it matters:

The visible key is a placeholder, not a verified leaked secret. However, local trusted paths and operational config do not belong in a reusable harness baseline.

Recommended action:

Redact and move the file to an archive if it has historical value, or remove it from tracking in a dedicated cleanup PR. Do not rewrite history unless a real secret is found.

### Finding 7 — Low/Medium

**Encoding drift is known and should be handled separately**

Evidence:

Project docs already acknowledge mixed encoding and fallback reading rules. Some generated/historical files show mojibake in terminal output depending on decoding path.

Why it matters:

Encoding normalization can create large diffs and should not be mixed with runtime docs, vendor fixes, or temp cleanup.

Recommended action:

Run a separate encoding audit and normalize only after review.

### Finding 8 — Low

**Secrets scan found templates and placeholders, not verified active secrets**

Evidence:

Observed matches are primarily `.env.example`, auth examples in archived upstream skills, and placeholder `YOUR_API_KEY`.

Why it matters:

There is no current evidence of an active leaked credential, but the repo would benefit from automated secret scanning.

Recommended action:

Add `gitleaks` or GitHub secret scanning policy. Treat templates with placeholders as allowed; real tokens are forbidden.

### Finding 9 — Low

**Git LFS policy is narrow**

Evidence:

`.gitattributes` tracks only ZIP files with LFS:

```text
*.zip filter=lfs diff=lfs merge=lfs -text
```

Why it matters:

The repo contains binary/avatar/document assets. If large binaries grow, clone size can increase.

Recommended action:

Run a size analysis before changing LFS policy. Do not add broad LFS patterns without checking current and expected asset usage.

## Runtime Assessment

`.vscode/.codex/` is the active runtime and source of truth.

`.agents/` is a migration/reference harness. It has useful structure, but it is not ready for activation because agent file packages are incomplete and vendor strategy is unresolved.

| Area | Status |
|---|---|
| `.vscode/.codex/` | Active runtime |
| `.agents/registry.yaml` | Structured migration registry |
| `.agents/skills/` | Present, but not active runtime |
| `.agents/agents/` | Partially populated; incomplete per-agent file packages |
| `.agents/vendor/` | Blocked by `mattpocock-skills` gitlink issue |
| `.agents/scripts/` | Present; validation writes report artifacts |

## Recommended Next Steps

1. **Do next:** Review this QA report PR separately.
2. **Then decide:** Choose vendor strategy for `.agents/vendor/mattpocock-skills`.
3. **Then cleanup:** Classify tracked `temp/` and backup files.
4. **Then verify:** Regenerate validation reports after vendor/temp decisions.
5. **Later:** Consider encoding normalization and LFS policy expansion as separate PRs.

## Safe Action Plan

Use separate branches and PRs:

1. `qa/add-customagents-report-2026-06-07`
   - Add only this report.
2. `fix/mattpocock-vendor-strategy-2026-06-07`
   - Decide and implement submodule/subtree/vendored copy.
3. `chore/classify-temp-backups-2026-06-07`
   - Move, archive, or untrack temp/backup files after review.
4. `qa/regenerate-validation-2026-06-07`
   - Regenerate validation artifacts after structural decisions.

Do not combine these workstreams in one PR.
