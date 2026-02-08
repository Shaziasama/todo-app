---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts. (project)
command: sp.tasks
---

# Task Generation Skill

This skill generates a comprehensive, actionable `tasks.md` file for implementing a feature based on the specification and plan artifacts.

## When to Use

- After completing `/sp.plan` (implementation planning)
- When you need a detailed task breakdown for implementation
- Before starting `/sp.implement`

## Prerequisites

- Completed `spec.md` (required)
- Completed `plan.md` (required)
- Optional: `data-model.md`, `contracts/`, `research.md`, `quickstart.md`

## Invocation

```
/sp.tasks
```

Or with context:

```
/sp.tasks [additional context or requirements]
```

## What It Does

1. Runs prerequisite check to validate available artifacts
2. Loads design documents from the feature directory
3. Extracts tech stack, user stories, and priorities
4. Generates tasks organized by user story
5. Creates dependency graph and parallel execution examples
6. Writes `tasks.md` with the complete implementation plan

## Task Format

Each task follows this strict format:

```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

- **TaskID**: Sequential (T001, T002, T003...)
- **[P]**: Parallelizable marker (optional)
- **[Story]**: User story label (e.g., [US1], [US2])

## Output

- `tasks.md` file in the feature directory
- Task count per user story
- Parallel opportunities identified
- MVP scope suggestions
