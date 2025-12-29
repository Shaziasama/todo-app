---
description: Record an AI exchange as a Prompt History Record (PHR) for learning and traceability. (project)
command: sp.phr
---

# Prompt History Record Skill

This skill records AI exchanges as structured Prompt History Records (PHRs) for learning, traceability, and knowledge sharing.

## When to Use

- After completing significant work
- To capture important AI exchanges for future reference
- For team knowledge sharing
- For compliance and audit requirements
- To build a searchable corpus of effective prompts

## Invocation

```
/sp.phr [description of work to record]
```

Example:

```
/sp.phr Implemented user authentication with JWT tokens
```

## What It Does

1. **Determines Stage**: Classifies the work type
   - constitution, spec, plan, tasks
   - red, green, refactor
   - explainer, misc, general

2. **Generates Title**: Creates 3-7 word descriptive title

3. **Routes Correctly**:
   - Constitution work -> `history/prompts/constitution/`
   - Feature work -> `history/prompts/<feature-name>/`
   - General work -> `history/prompts/general/`

4. **Creates PHR File**: Fills template with:
   - Full prompt (verbatim, never truncated)
   - Response summary
   - Metadata (date, model, branch, user)
   - Files modified
   - Tests involved
   - Next steps

## PHR Structure

```yaml
---
id: PHR-NNNN
title: "Descriptive Title"
stage: spec|plan|tasks|...
date: YYYY-MM-DD
surface: agent
feature: feature-name
---

## Prompt
[Complete user input verbatim]

## Response
[Key assistant output]

## Outcome
[What was accomplished]
```

## Output

- PHR file in appropriate directory
- Confirmation: "PHR-NNNN recorded"
- Path to created file
