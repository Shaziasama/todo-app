---
description: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation. (project)
command: sp.analyze
---

# Cross-Artifact Analysis Skill

This skill performs a non-destructive consistency and quality analysis across the three core SDD artifacts: spec.md, plan.md, and tasks.md.

## When to Use

- After completing `/sp.tasks`
- Before starting `/sp.implement`
- To validate artifact consistency and quality
- To identify gaps before implementation

## Prerequisites

- Completed `spec.md` (required)
- Completed `plan.md` (required)
- Completed `tasks.md` (required)
- Project constitution at `.specify/memory/constitution.md`

## Invocation

```
/sp.analyze
```

## What It Does

1. **Loads All Artifacts**
   - Reads spec.md (requirements)
   - Reads plan.md (architecture)
   - Reads tasks.md (implementation)
   - Reads constitution (principles)

2. **Builds Semantic Models**
   - Requirements inventory with stable keys
   - User story/action inventory
   - Task coverage mapping
   - Constitution rule set

3. **Detection Passes**
   - **Duplication**: Near-duplicate requirements
   - **Ambiguity**: Vague adjectives, unresolved placeholders
   - **Underspecification**: Missing outcomes, criteria
   - **Constitution Alignment**: Principle violations
   - **Coverage Gaps**: Requirements without tasks
   - **Inconsistency**: Terminology drift, conflicts

4. **Severity Assignment**
   - CRITICAL: Constitution violations, blocking issues
   - HIGH: Duplicates, conflicts, untestable criteria
   - MEDIUM: Terminology drift, missing NFR coverage
   - LOW: Style, minor redundancy

5. **Produces Analysis Report**

## Report Structure

```markdown
## Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|

**Coverage Summary Table**
**Constitution Alignment Issues**
**Unmapped Tasks**
**Metrics**
```

## Metrics Tracked

- Total Requirements
- Total Tasks
- Coverage % (requirements with tasks)
- Ambiguity Count
- Duplication Count
- Critical Issues Count

## Output

- Markdown analysis report (no file writes)
- Next action recommendations
- Optional remediation suggestions

## Key Constraints

- **READ-ONLY**: Does not modify any files
- **Constitution Authority**: Violations are always CRITICAL
- **Token-Efficient**: Limited to 50 findings
- **Deterministic**: Consistent results on reruns
