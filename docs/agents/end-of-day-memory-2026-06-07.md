# CustomAgents — End-of-day Memory

Dato: 2026-06-07
Repo: `Biyocon/CustomAgents`
Primær branch ved dagens afslutning: `main`

## 1. Hvad der blev gennemført i dag

Følgende er afsluttet og merged/pushet til `main`:

```text
PR #1 — runtime-status docs
Status: merged
Formål:
- Dokumenterede at .vscode/.codex/ er aktiv runtime.
- Dokumenterede at .agents/ er migration/reference.
- Dokumenterede snapshot-branchens rolle som auditmarkør.

PR #2 — QA report
Status: merged
Formål:
- Tilføjede reports/qa/QA_2026-06-07_CustomAgents.md.

PR #3 — mattpocock vendored copy
Status: merged
Formål:
- Konverterede .agents/vendor/mattpocock-skills fra defekt gitlink/submodule-entry til almindeligt tracked vendored copy.
- Tilføjede VENDOR.md.
- Opdaterede README.md og AGENTS.md.

Commit A — local Claude settings hygiene
Status: pushed/merged på main
Formål:
- Fjernede .claude/settings.local.json fra tracking.
- Tilføjede .gitignore-regler så lokale Claude Code settings ikke committes igen.

PR #4 — temp/backup_agents cleanup
Status: merged
Formål:
- Fjernede 52 tracked historiske agent-backupfiler fra temp/backup_agents/.
- Tilføjede .gitignore-regel for temp/backup_agents/.

PR #5 — local Codex config backup cleanup
Status: merged
Formål:
- Fjernede temp/codex-config-before-mcp-cleanup-20260509-133205.toml fra tracking.
- Tilføjede snævre .gitignore-regler for lokale TOML/config-backups.
```

PR #5 er verificeret som `closed` og `merged`, med merge commit `84975f63871933a45a26a786e2cb51175cf7235f`. 

`.gitignore` på `main` indeholder nu både B2.1-reglen `temp/backup_agents/` og B3.1-reglerne for lokale TOML/config-backups. 

## 2. Aktuel låst status

```text
main: 84975f63871933a45a26a786e2cb51175cf7235f

Merged:
- PR #1
- PR #2
- PR #3
- PR #4
- PR #5
- Commit A

Åben/pending:
- Ingen PR åbnet for B3.2.1 endnu.
- Branch findes lokalt/remote:
  chore/remove-temp-test-debug-junk
- HEAD:
  9ddf1299827bd543bea3687d2ecc3da1097ddcce
```

B3.2.1-branch er **ikke merged** og **ingen PR er oprettet endnu**.

## 3. Pending branch ved lukning

```text
Branch:
chore/remove-temp-test-debug-junk

Commit:
9ddf1299827bd543bea3687d2ecc3da1097ddcce

Scope:
- temp/agent2_debug.txt
- temp/commitmsg.txt
- temp/patch.py
- temp/test_fstring.txt
- temp/test_quote.txt
- temp/test_uv.py
- .gitignore
```

Formål:

```text
B3.2.1 — fjern midlertidige test/debug/patch artefakter fra temp/
```

Grok har lokalt verificeret:

```text
ahead_by: 1
behind_by: 0
changed files: 7
working tree clean
ingen forbidden paths rørt
```

Det er endnu **ikke verificeret af os via GitHub compare** i denne chat efter branch-push. Derfor er første handling næste gang kun verifikation.

## 4. Første handling i næste session

Næste session skal starte med præcis dette:

```text
Verify B3.2.1 branch on GitHub

Compare:
main...chore/remove-temp-test-debug-junk

Expected:
- ahead_by: 1
- behind_by: 0
- changed files: 7
- files only:
  - .gitignore
  - temp/agent2_debug.txt
  - temp/commitmsg.txt
  - temp/patch.py
  - temp/test_fstring.txt
  - temp/test_quote.txt
  - temp/test_uv.py

If clean:
- create PR #6 for B3.2.1
- do not merge until explicit approval

If polluted:
- stop
- delete/recreate branch from current main
```

## 5. Næste PR, hvis B3.2.1 verificeres ren

Forventet PR:

```text
Title:
chore: remove temp test and debug artifacts
```

Forventet body:

```md
## Summary

Removes obsolete temporary test, debug, patch, and commit-message artifacts from `temp/`.

## Rationale

These files are local development/test artifacts and are not part of the active runtime, migration layer, vendor material, or project documentation.

## Scope

- Remove selected temp test/debug artifacts.
- Add narrow `.gitignore` rules for similar artifacts.

## Out of scope

- No generation/migration script cleanup.
- No `temp/agents/` cleanup.
- No `temp/banedanmark-agents/` cleanup.
- No `.agents/` changes.
- No `.vscode/.codex/` changes.
- No `Avatar/` changes.
- No `reports/` changes.
- No `.claude/` changes.
- No vendor changes.
- No runtime migration.

## QA

- Verified diff contains only `.gitignore` and the six selected temp files.
- Verified no other `temp/` files or forbidden areas are touched.
```

## 6. Resterende arbejde efter B3.2.1

Følgende er stadig tilbage og må ikke blandes i samme PR:

```text
B3.2.2 — generation/migration scripts
Mulige filer:
- temp/add_missing_agents.py
- temp/create_agents.py
- temp/create_gap_agents.py
- temp/enrich_agents.py
- temp/generate_agent_harness.py
- temp/generate_agent_harness.ps1
- temp/generate_mapping.py
- temp/generate_reports.py
- temp/harness_build.py
- temp/integrate_iqra_prompts.py
- temp/sync_harness_roster.py

B3.2.3 — verify/inspect/roster/helper scripts
Mulige filer:
- temp/verify_agent_harness.py
- temp/verify_data.py
- temp/inspect_roster.py
- temp/roster_inspect.py
- temp/list_pdfs.py
- temp/gen_banedanmark.py
- temp/gen_banedanmark.bat
- temp/gitcommit.bat

B3.2.4 — draft agent markdown trees
Mulige områder:
- temp/agents/
- temp/banedanmark-agents/

B3.2.5 — planning/debug/report notes
Mulige filer:
- temp/agent2_catalog.md
- temp/agent3_mapping.md
- temp/agent4_gaps.md
- temp/coordinator_workplan.md
- temp/open-questions.md
- temp/all_pdfs.txt
- temp/fb_file_list.txt
```

Grok’s tidligere B-inventar klassificerede `temp/`-materialet som genereringsscripts, backups, duplikeret vendor-materiale, rapporter og historiske artefakter, og anbefalede små PR’er frem for bulk-oprydning. 

## 7. Regler for næste session

```text
1. Start ikke B3.2.2 før B3.2.1 er merged eller eksplicit parkeret.
2. Opret ikke PR uden GitHub compare-verifikation.
3. Merge ikke uden eksplicit ordre.
4. Ingen bulk-delete.
5. Hver cleanup-branch skal oprettes fra aktuel origin/main.
6. Før commit skal staged diff kun indeholde det aftalte scope.
7. .gitignore-regler må kun tilføjes snævert og må ikke overskrive tidligere regler.
8. Aktiv runtime forbliver .vscode/.codex/.
9. .agents/ forbliver migration/reference.
10. Vendor må ikke røres igen uden separat vendor-PR.
```

## 8. Statuslinje til næste opstart

Brug denne som første prompt næste gang:

```text
Fortsæt fra dagens memory.

Repo: Biyocon/CustomAgents
main: 84975f63871933a45a26a786e2cb51175cf7235f

Pending:
B3.2.1 branch chore/remove-temp-test-debug-junk
commit 9ddf1299827bd543bea3687d2ecc3da1097ddcce

Første handling:
Verificér GitHub compare main...chore/remove-temp-test-debug-junk.
Hvis ahead_by=1, behind_by=0 og kun de 7 aftalte filer er ændret, opret PR #6.
Ingen merge.
Ingen B3.2.2 endnu.
```

Dette er dagens memory.
