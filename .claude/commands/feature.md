---
description: Create a new feature/ or fix/ branch from a prompt or the next planned task
argument-hint: "[fix] <short description>  |  (empty = pick next task from PROJECT_STATUS.md)"
---

You are creating a new git branch for the next unit of work in this Mathify repo. Follow these steps exactly.

## 1. Parse the input

The user invoked: `/feature $ARGUMENTS`

Decide the branch type and slug source:

- **If `$ARGUMENTS` is empty**: source the branch name from the project plan.
  - Read [PROJECT_STATUS.md](PROJECT_STATUS.md) and find the **next not-yet-done task** in the current phase (the first unchecked / pending task ID, e.g. `T1.1.1`).
  - Read [planned.md](planned.md) and locate that task to get its short title.
  - Branch type is **`feature/`** unless the task title contains "fix", "bug", "regression", or "patch".
  - Slug = `<task-id-lowercased-with-dashes>-<title-slug>`. Example: task `T1.1.1 Delete app-example/` → `feature/t1-1-1-delete-app-example`.

- **If `$ARGUMENTS` starts with `fix` / `fix:` / `fix ` (case-insensitive)**: branch type is **`fix/`**, slug = the rest of the prompt.
- **Otherwise**: branch type is **`feature/`**, slug = the full prompt.

Slugify rules: lowercase; replace any run of non-alphanumeric chars with `-`; trim leading/trailing `-`; collapse repeats; cap at 60 chars.

Final branch name: `<type>/<slug>`.

## 2. Pre-flight checks

Run these in parallel and report any failure to the user before proceeding:

- `git status --porcelain` — must be empty (no uncommitted changes). If dirty, **stop** and tell the user to commit, stash, or discard first.
- `git rev-parse --abbrev-ref HEAD` — capture the current branch (this becomes the base).
- `git rev-parse --verify <new-branch-name> 2>/dev/null` — must fail (branch must not already exist locally). If it exists, **stop** and ask the user for a different name.

## 3. Create the branch

- `git checkout -b <new-branch-name>` from the current branch.
- Do **not** push to origin yet — the user will push when there's a first commit.

## 4. Confirm

Reply with one short line containing:
- The new branch name
- The base branch it was cut from
- The source of the name (the user's prompt verbatim, or the planned-task ID it was derived from)

Do not run any other commands. Do not start implementing the task — branch creation is the entire job.
