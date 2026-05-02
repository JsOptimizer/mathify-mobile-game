---
description: Read the current branch's task ID, load the project planning docs, implement the task end-to-end, spawn sub-agents to update docs and write tests, then push and open a PR.
argument-hint: (no arguments — task is derived from the current branch name)
---

# implement

You are implementing the feature task encoded in the current git branch name. Follow these steps exactly.

## 1. Derive the task ID from the branch name

Run `git rev-parse --abbrev-ref HEAD` to get the current branch.

Parse the task ID:
- Strip the `feature/` or `fix/` prefix.
- Extract the leading `t<N>-<N>-<N>` token (e.g. `t1-2-1`).
- Convert to canonical form: uppercase T, dashes → dots → `T1.2.1`.

If the branch does not start with a parseable task prefix (e.g. `main`, `dev`), **stop** and tell the user: "This branch name does not encode a task ID. Check out a feature branch created with /feature first."

## 2. Load context (read in parallel)

- `PROJECT_STATUS.md` — active phase, accomplished tasks, blockers.
- `planned.md` — locate the task by ID; read its full description and every acceptance criterion.
- `CLAUDE.md` — conventions, constraints, architecture rules.
- `CHANGELOG.md` — most recent entry (for style reference).

Also read `architecture.md` when the task touches stores, data model, routing, or Expo config.

## 3. Understand the acceptance criteria

From `planned.md` extract:
- The task title and every bullet under it.
- Any explicit file paths, commands, or constraints the task names.

If the task says "use `npx expo install`", use that exact command — do not substitute `pnpm add`.

## 4. Implement

Execute the task against every acceptance criterion. Rules:
- **pnpm only** — never npm or yarn (except `npx expo install` when the task calls for it).
- **TypeScript strict** — `noEmit` must pass after every file change.
- **New Architecture + React Compiler compatible** — no legacy bridge APIs.
- **No comments** unless the WHY is non-obvious; no docstrings.
- **No extra scope** — implement exactly the named task, nothing more.
- **No third-party SDKs** beyond what the task explicitly names.

## 5. Verify

Run the checks appropriate to the task:

| Task type | Verification command |
|---|---|
| Any install (T1.2.x, T1.3.x) | `pnpm install` then `npx tsc --noEmit` |
| New `.ts` / `.tsx` file | `npx tsc --noEmit` |
| Test infrastructure (T1.3.x) | `pnpm test` (once the script exists) |
| Reanimated install (T1.2.5) | Also confirm `babel.config.js` has `'react-native-reanimated/plugin'` |

**Stop and report to the user if any check fails** — do not proceed to Step 6.

## 6. Spawn doc-update sub-agent

Launch a **general-purpose sub-agent** to update the planning docs. Do NOT edit these files yourself — delegate entirely.

Give the agent this briefing (fill in the bracketed values):

> You are updating the Mathify project planning docs to record a completed task.
>
> **Task just completed:** [TASK_ID] — [task title]
> **What was done:** [one-sentence description of what was implemented]
> **Today's date:** [YYYY-MM-DD]
>
> Make two edits:
>
> **1. PROJECT_STATUS.md**
> - In the Phase 1 Accomplished section, add or tick the entry:
>   `- [x] **[TASK_ID]** — [task title]`
> - Recompute the phase % (ticked tasks in Phase 1 ÷ 24) and overall % (total ticked ÷ 80).
> - Update "Last updated" to [YYYY-MM-DD].
>
> **2. CHANGELOG.md**
> - Under `## [Unreleased]` → **Added** (create the subsection if it does not exist), prepend:
>   `- **[YYYY-MM-DD]** — [what was done] (completes [TASK_ID]).`
>
> Do not commit. Just write the files.

Wait for the sub-agent to finish before continuing.

## 7. Spawn test-writing sub-agent

Launch a **general-purpose sub-agent** to write tests for the work just implemented.

**Skip this step** if the task is a pure install or config task with no new TypeScript source files (e.g. T1.2.x installs, T1.3.x infrastructure setup, T1.1.x cleanup). For those, proceed directly to Step 8.

Give the agent this briefing (fill in the bracketed values):

> You are writing tests for a newly implemented feature in the Mathify React Native / Expo project.
>
> **Task:** [TASK_ID] — [task title]
> **Files created or modified:** [list every file path]
> **Acceptance criteria:**
> [paste the bullet list from planned.md]
>
> **Project test conventions:**
> - Test runner: jest-expo (preset). Run with `pnpm test`.
> - Component tests: @testing-library/react-native.
> - Test files live next to source as `<name>.test.ts` or `<name>.test.tsx`.
> - TypeScript strict mode — tests must pass `npx tsc --noEmit`.
> - No mocks of internal modules; only mock at system boundaries (AsyncStorage, expo APIs).
>
> Write tests that verify each acceptance criterion. Keep them minimal and focused.
> If a dedicated test task already exists in planned.md for this logic (e.g. T2.2.x covers T2.1.x lib functions), write a stub test file with `it.todo()` entries pointing to that task ID instead of full implementations.
> After writing tests, run `pnpm test` and confirm it exits 0.
>
> Do not commit. Just write the test files.

Wait for the sub-agent to finish before continuing.

## 8. Commit

Stage only the files changed by this task (implementation + updated docs + test files). Do **not** use `git add -A`.

Commit message format (use a HEREDOC):

```
<verb>: <short description> (TASK_ID)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Verb guide: `feat` for new capability, `chore` for install/config/tooling, `fix` for corrections.

## 9. Push and open PR

Push the branch: `git push -u origin <branch-name>`

Then create the PR with `gh pr create` using this body template. Replace all bracketed values:

```
gh pr create \
  --title "<verb>: <task title> ([TASK_ID])" \
  --body "$(cat <<'EOF'
## Summary

- [bullet: what was built or installed]
- [bullet: files created / modified]
- [bullet: any notable constraint or decision]

## Task

Implements **[TASK_ID]** from the Mathify MVP roadmap (Phase [N] — [phase name]).
Full acceptance criteria are defined in [planned.md](planned.md).

## Acceptance criteria

- [ ] [criterion 1]
- [ ] [criterion 2]
- [ ] [criterion N]

## Test plan

- [ ] `pnpm install` exits 0
- [ ] `npx tsc --noEmit` passes
- [ ] [task-specific verification step]

## Checklist

- [ ] Follows CLAUDE.md conventions (pnpm, strict TS, New Arch compatible)
- [ ] No third-party SDKs added beyond task scope
- [ ] PROJECT_STATUS.md and CHANGELOG.md updated

---

Completes **[TASK_ID]** · [planned.md](planned.md)

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
EOF
)"
```

## 10. Confirm

Reply with a short summary:
- Task ID, title, and branch.
- PR URL.
- Sub-agent outcomes: docs updated ✓ / tests written ✓ (or skipped with reason).
- Verification result.
- Any manual follow-up the user should know about.
