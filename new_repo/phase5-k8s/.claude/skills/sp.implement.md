---
description: Execute the implementation plan by processing and executing all tasks defined in tasks.md (project)
command: sp.implement
---

# Implementation Execution Skill

This skill executes the implementation plan by processing and completing all tasks defined in `tasks.md`.

## When to Use

- After completing `/sp.tasks`
- When ready to implement the feature
- All planning artifacts should be in place

## Prerequisites

- Completed `spec.md` (required)
- Completed `plan.md` (required)
- Completed `tasks.md` (required)
- Optional: `data-model.md`, `contracts/`, `research.md`, `quickstart.md`
- All checklists should pass (or explicit override)

## Invocation

```
/sp.implement
```

## What It Does

1. **Validates Prerequisites**
   - Checks for required artifacts
   - Validates all checklists pass
   - Prompts if checklists are incomplete

2. **Loads Implementation Context**
   - Reads tasks.md for task list
   - Reads plan.md for tech stack and structure
   - Loads optional design documents

3. **Project Setup Verification**
   - Creates/verifies ignore files (.gitignore, .dockerignore, etc.)
   - Sets up project structure per plan

4. **Executes Tasks Phase-by-Phase**
   - Phase 1: Setup (project initialization)
   - Phase 2: Foundational (blocking prerequisites)
   - Phase 3+: User Stories (in priority order)
   - Final: Polish & cross-cutting concerns

5. **Follows Execution Rules**
   - Respects task dependencies
   - Runs parallel tasks [P] together
   - TDD approach (tests before implementation)
   - Validates each phase before proceeding

6. **Progress Tracking**
   - Reports after each completed task
   - Marks tasks as [X] in tasks.md
   - Handles errors appropriately

## Output

- Implemented feature code
- Passing tests
- Updated tasks.md with completed items
- Implementation summary

## Error Handling

- Halts on non-parallel task failures
- Reports failed parallel tasks
- Provides debugging context
- Suggests next steps
