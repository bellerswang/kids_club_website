---
name: project-architecture-keeper
description: Keep this repository's implemented architecture, architecture decisions, completed work, and pending refactors synchronized with code changes. Use for every feature, bug fix, refactor, dependency change, file or module move, API or data-flow change, deployment change, or technical planning task in the kids_club_website project.
---

# Project Architecture Keeper

Treat documentation maintenance as part of the implementation, not as optional follow-up.

## Required Files

- `ARCHITECTURE.md`: source of truth for the current implemented system and explicitly separated future architecture.
- `TODO.md`: source of truth for unfinished engineering work, refactors, risks, and recently completed tasks.
- `docs/archive/LEGACY_BACKEND_ARCHITECTURE.md`: archived backend exploration. Preserve it for history; do not describe it as implemented or authoritative.
- `docs/TARGET_ARCHITECTURE.md`: proposed content, frontend, API, backend, and Cloudflare target architecture.
- `docs/UPDATE_SOP.md`: required workflow for branches, previews, production releases, and rollbacks.
- `docs/RELEASE_CHECKLIST.md`: release verification checklist.
- `docs/CONTENT_RULES.md`: public content, bilingual, brand, privacy, and child-image rules.

Resolve these paths from the repository root.

## Start Every Task

1. Read `ARCHITECTURE.md` and `TODO.md` before editing code.
2. Inspect the relevant implementation and Git status.
3. Read `docs/CONTENT_RULES.md` for public content changes and `docs/UPDATE_SOP.md` for work that may be released.
4. Identify whether the requested work changes any of:
   - components, modules, files, or ownership boundaries;
   - runtime dependencies or external services;
   - data flow, storage, APIs, security, deployment, or build/test workflow;
   - an existing TODO item's status, scope, priority, or acceptance criteria.
5. Select existing TODO IDs that the task addresses. Create new IDs only for newly discovered unfinished work.

## During Implementation

- Keep current behavior and future plans separate.
- Record newly discovered follow-up work immediately in `TODO.md`; do not leave it only in chat, code comments, or memory.
- Do not mark work complete until implementation and reasonable verification are complete.
- Update an existing TODO instead of creating a duplicate.
- Use IDs in the form `KC-###`. Never reuse an ID.

## Finish Every Task

Before reporting completion:

1. Update `ARCHITECTURE.md` when the implemented structure or an architecture decision changed.
2. Add a dated entry to its Architecture Change Log for architectural changes.
3. Update all affected TODO items:
   - move verified work to `Recently Completed`;
   - keep partial work in `Active` and state exactly what remains;
   - add newly discovered refactors, risks, missing tests, and deferred work.
4. Give every active TODO a priority, area, concrete next action, and acceptance criteria.
5. Run:

```powershell
python .agents/skills/project-architecture-keeper/scripts/validate_project_docs.py
```

6. Inspect `git diff` and confirm documentation matches the actual code.
7. For release work, complete the checks relevant to the change in `docs/RELEASE_CHECKLIST.md`.

Documentation-only wording changes do not require an architecture log entry unless they change a decision or system description.

## Architecture Rules

- Describe only code and infrastructure that exist under `Current Architecture`.
- Put approved but unimplemented design under `Planned Architecture`.
- Include file paths for important modules and entry points.
- Document boundaries and data flow, not a file-by-file narration.
- Record decisions with date, decision, status, and rationale.
- Never silently delete a superseded decision; mark it superseded and reference the replacement.

## TODO Rules

- Allowed active statuses: `Ready`, `In Progress`, `Blocked`.
- Use priority `P0` through `P3`.
- A TODO must be executable by a future contributor without needing hidden chat context.
- `Blocked` items must name the blocking condition.
- Keep at most 20 items in `Recently Completed`; Git history preserves older work.
- Never use vague entries such as "clean up code" or "improve architecture".

## Completion Report

Mention:

- code or behavior changed;
- architecture documentation changed, or explicitly that no architecture update was required;
- TODO IDs completed, updated, or added;
- validation performed and its result.
