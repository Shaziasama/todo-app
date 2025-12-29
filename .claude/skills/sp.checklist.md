---
description: Generate a custom checklist for the current feature based on user requirements. (project)
command: sp.checklist
---

# Checklist Generation Skill

This skill generates custom checklists that validate the quality of requirements writing. Checklists are "unit tests for English" - they test if specifications are complete, clear, and consistent.

## When to Use

- After `/sp.specify` to validate specification quality
- To create domain-specific quality checks (UX, API, Security, etc.)
- Before `/sp.plan` to ensure requirements are ready

## Prerequisites

- Completed `spec.md` in the feature directory

## Invocation

```
/sp.checklist [checklist type or domain]
```

Examples:

```
/sp.checklist ux
/sp.checklist api contracts
/sp.checklist security requirements
```

## What It Does

1. **Clarifies Intent**
   - Asks up to 3 contextual questions
   - Derives checklist theme and focus
   - Understands depth and audience

2. **Loads Feature Context**
   - Reads spec.md, plan.md, tasks.md
   - Extracts relevant requirements

3. **Generates Checklist**
   - Creates `checklists/[domain].md`
   - Items test REQUIREMENTS QUALITY, not implementation
   - Organized by quality dimensions

## Checklist Quality Dimensions

- **Completeness**: Are all necessary requirements present?
- **Clarity**: Are requirements specific and unambiguous?
- **Consistency**: Do requirements align without conflicts?
- **Measurability**: Can requirements be objectively verified?
- **Coverage**: Are all scenarios/edge cases addressed?

## Correct Checklist Item Format

**CORRECT** (tests requirements):
- "Are visual hierarchy requirements defined with measurable criteria?"
- "Is 'fast loading' quantified with specific timing thresholds?"
- "Are error handling requirements specified for all API failure modes?"

**WRONG** (tests implementation):
- "Verify landing page displays 3 cards"
- "Test hover states work correctly"
- "Confirm API returns 200"

## Item Structure

```markdown
- [ ] CHK001 - Are [requirement type] defined for [scenario]? [Quality Dimension, Spec §X.Y]
```

## Output

- Checklist file: `specs/[feature]/checklists/[domain].md`
- Item count
- Focus areas covered
- Traceability references

## Common Checklist Types

- `ux.md` - UX requirements quality
- `api.md` - API contract quality
- `security.md` - Security requirements quality
- `performance.md` - Performance requirements quality
