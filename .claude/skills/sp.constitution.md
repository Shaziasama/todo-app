---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync. (project)
command: sp.constitution
---

# Project Constitution Skill

This skill creates or updates the project constitution, which defines the foundational principles, quality standards, and governance rules for the project.

## When to Use

- At project initialization
- When establishing or updating project principles
- When onboarding team to project standards
- When governance rules need amendment

## Invocation

```
/sp.constitution
```

Or with specific principles:

```
/sp.constitution Add principle: All APIs must be documented with OpenAPI
```

## What It Does

1. **Loads Constitution Template**
   - Reads `.specify/memory/constitution.md`
   - Identifies all placeholder tokens

2. **Collects/Derives Values**
   - Uses provided user input
   - Infers from repository context
   - Sets governance dates and version

3. **Version Management**
   - MAJOR: Backward incompatible changes
   - MINOR: New principles/sections added
   - PATCH: Clarifications, wording fixes

4. **Drafts Updated Constitution**
   - Replaces placeholders with concrete text
   - Preserves heading hierarchy
   - Ensures each principle has name, rules, rationale

5. **Consistency Propagation**
   - Updates plan-template.md
   - Updates spec-template.md
   - Updates tasks-template.md
   - Updates related command files

6. **Produces Sync Impact Report**
   - Version change summary
   - Modified principles
   - Added/removed sections
   - Templates requiring updates

## Constitution Structure

- **Project Identity**: Name, version, dates
- **Principles**: Non-negotiable rules with rationale
- **Governance**: Amendment procedure, versioning policy
- **Compliance**: Review expectations

## Output

- Updated `.specify/memory/constitution.md`
- Sync Impact Report
- Suggested commit message
- List of files requiring manual follow-up

## Next Steps

After constitution:
- `/sp.specify` - Create feature specifications
