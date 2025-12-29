---
description: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec. (project)
command: sp.clarify
---

# Specification Clarification Skill

This skill identifies underspecified areas in the current feature specification and asks targeted clarification questions to reduce ambiguity.

## When to Use

- After `/sp.specify` when the spec has unclear areas
- Before `/sp.plan` to ensure requirements are complete
- When you notice ambiguities in the specification

## Prerequisites

- Completed `spec.md` in the feature directory

## Invocation

```
/sp.clarify
```

Or with focus area:

```
/sp.clarify Focus on security requirements
```

## What It Does

1. **Loads Current Spec**
   - Reads the feature specification
   - Parses existing requirements

2. **Performs Ambiguity Scan**
   - Analyzes across taxonomy categories:
     - Functional Scope & Behavior
     - Domain & Data Model
     - Interaction & UX Flow
     - Non-Functional Quality Attributes
     - Integration & External Dependencies
     - Edge Cases & Failure Handling
     - Constraints & Tradeoffs
     - Terminology & Consistency
     - Completion Signals

3. **Generates Clarification Questions**
   - Maximum 5 questions per session
   - Prioritized by impact (scope > security > UX > technical)
   - Each question is answerable with:
     - Multiple choice (2-5 options), OR
     - Short answer (<=5 words)

4. **Sequential Questioning**
   - Presents ONE question at a time
   - Provides recommended answer with reasoning
   - Validates and records each answer
   - Stops when ambiguities resolved or 5 questions asked

5. **Integrates Answers**
   - Updates spec immediately after each answer
   - Creates `## Clarifications` section
   - Updates relevant spec sections
   - Removes contradictory statements

## Question Format

```markdown
**Recommended:** Option [X] - <reasoning>

| Option | Description |
|--------|-------------|
| A | <Option A description> |
| B | <Option B description> |
| C | <Option C description> |
```

## Output

- Updated `spec.md` with clarifications
- Coverage summary table
- Sections touched
- Recommendation for next command

## Next Steps

After clarification:
- `/sp.plan` - Create technical implementation plan
