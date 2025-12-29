---
description: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts. (project)
command: sp.taskstoissues
---

# Tasks to GitHub Issues Skill

This skill converts the tasks defined in `tasks.md` into GitHub issues for project management and team coordination.

## When to Use

- After completing `/sp.tasks` and having a fully defined task breakdown
- When you want to create trackable GitHub issues from the implementation plan
- For team collaboration and progress tracking

## Prerequisites

- A completed `tasks.md` file in the feature directory
- GitHub remote configured for the repository
- GitHub CLI (`gh`) authenticated

## Invocation

```
/sp.taskstoissues
```

Or with arguments:

```
/sp.taskstoissues [additional context]
```

## What It Does

1. Validates the repository has a GitHub remote
2. Reads the tasks from `tasks.md`
3. Creates GitHub issues for each task with proper labels and descriptions
4. Maintains task dependencies in issue relationships

## Output

- GitHub issues created for each task
- Issue URLs and IDs reported
- Summary of created issues
