---
description: Execute the implementation planning workflow using the plan template to generate design artifacts. (project)
command: sp.plan
---

# Implementation Planning Skill

This skill executes the implementation planning workflow, transforming the feature specification into detailed technical design artifacts.

## When to Use

- After completing `/sp.specify` (or `/sp.clarify`)
- When you need to design the technical architecture for a feature
- Before generating implementation tasks

## Prerequisites

- Completed `spec.md` in the feature directory
- Project constitution at `.specify/memory/constitution.md`

## Invocation

```
/sp.plan
```

Or with tech stack context:

```
/sp.plan I am building with Next.js and FastAPI
```

## What It Does

### Phase 0: Outline & Research
- Extracts unknowns from Technical Context
- Generates and dispatches research tasks
- Consolidates findings in `research.md`

### Phase 1: Design & Contracts
- Extracts entities from spec -> `data-model.md`
- Generates API contracts -> `contracts/`
- Creates quickstart guide -> `quickstart.md`
- Updates agent context

### Constitution Check
- Validates design against project principles
- Evaluates gates for violations
- Ensures compliance before proceeding

## Output Artifacts

In the feature directory:
- `plan.md` - Implementation plan with architecture decisions
- `research.md` - Research findings and decisions
- `data-model.md` - Entity definitions and relationships
- `contracts/` - API specifications (OpenAPI/GraphQL)
- `quickstart.md` - Getting started guide

## Next Steps

After planning:
- `/sp.tasks` - Generate implementation tasks
- `/sp.adr` - Document architectural decisions
