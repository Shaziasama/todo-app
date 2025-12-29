---
description: Create or update the feature specification from a natural language feature description. (project)
command: sp.specify
---

# Feature Specification Skill

This skill creates a comprehensive feature specification from a natural language feature description. It's the starting point of the Spec-Driven Development workflow.

## When to Use

- When starting a new feature
- When you have a feature idea that needs formal specification
- As the first step in the SDD workflow

## Invocation

```
/sp.specify [feature description]
```

Example:

```
/sp.specify Add user authentication with OAuth2 and JWT tokens
```

## What It Does

1. Generates a concise short name for the feature branch
2. Checks for existing branches and determines the next feature number
3. Creates the feature branch and initializes the spec file
4. Fills the specification template with:
   - Functional Requirements
   - Success Criteria
   - User Scenarios
   - Key Entities
5. Validates specification quality
6. Creates a requirements checklist

## Specification Guidelines

- Focus on **WHAT** users need and **WHY**
- Avoid **HOW** to implement (no tech stack, APIs, code structure)
- Written for business stakeholders, not developers
- Maximum 3 `[NEEDS CLARIFICATION]` markers

## Output

- Feature branch: `N-feature-name`
- Specification file: `specs/N-feature-name/spec.md`
- Requirements checklist: `specs/N-feature-name/checklists/requirements.md`

## Next Steps

After specification:
- `/sp.clarify` - Clarify ambiguous requirements
- `/sp.plan` - Create technical implementation plan
