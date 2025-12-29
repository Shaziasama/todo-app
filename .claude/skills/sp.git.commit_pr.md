---
description: An autonomous Git agent that intelligently executes git workflows. Your task is to intelligently executes git workflows to commit the work and create PR. (project)
command: sp.git.commit_pr
---

# Git Workflow Agent Skill

This skill provides an autonomous Git agent that intelligently executes git workflows to commit work and create pull requests.

## When to Use

- After completing implementation work
- When you need to commit changes and create a PR
- For automated git workflow execution

## Invocation

```
/sp.git.commit_pr
```

Or with intent:

```
/sp.git.commit_pr I added email validation to the auth system
```

## What It Does

### Phase 1: Context Gathering
- Verifies Git repository
- Checks current status and changes
- Reviews recent commit history
- Identifies current branch

### Phase 2: Analyze & Decide
- Determines if changes exist
- Analyzes nature of changes
- Decides optimal branch strategy
- Plans workflow execution

### Phase 3: Generate Content
- Creates meaningful branch name
- Generates conventional commit message
- Drafts PR title and description

### Phase 4: Execute
- Creates branch if needed
- Commits changes
- Pushes to remote
- Creates pull request

### Phase 5: Validate & Report
- Confirms outcome matches intent
- Reports success or invokes user for validation

## Agent Capabilities

**Autonomous Actions:**
- Analyze repository state
- Determine optimal branch strategy
- Generate commit messages
- Create branches, commits, push
- Create PRs with intelligent descriptions
- Handle common errors

**Requires Human Input:**
- Ambiguous intent
- Multiple valid strategies
- Risk detection
- Outcome validation

## Commit Message Format

```
<type>(<scope>): <subject>

<body explaining why, not what>
```

Types: feat, fix, chore, refactor, docs, test

## Output

- Created branch (if new)
- Commit with conventional message
- Push to remote
- PR with title and description
- PR URL for review
