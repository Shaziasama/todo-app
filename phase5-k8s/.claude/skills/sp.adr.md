---
description: Review planning artifacts for architecturally significant decisions and create ADRs. (project)
command: sp.adr
---

# Architecture Decision Records Skill

This skill reviews planning artifacts and creates Architecture Decision Records (ADRs) for significant technical decisions.

## When to Use

- After `/sp.plan` when architectural decisions are made
- When significant technical choices need documentation
- To capture decision rationale for future reference

## Prerequisites

- Completed `plan.md` (required)
- Optional: `research.md`, `data-model.md`, `contracts/`

## Invocation

```
/sp.adr
```

Or with specific decision:

```
/sp.adr Document the choice of PostgreSQL over MongoDB
```

## What It Does

1. **Loads Planning Context**
   - Reads plan.md for decisions
   - Reads research.md for alternatives
   - Reads data-model.md for entity decisions
   - Scans contracts/ for API decisions

2. **Extracts Architectural Decisions**
   - Groups related choices into clusters
   - Avoids over-granular ADRs
   - Example: "Frontend Stack" not separate ADRs for Next.js, Tailwind, Vercel

3. **Checks Existing ADRs**
   - Scans `history/adr/` directory
   - Identifies covered decisions
   - Flags conflicts with existing ADRs

4. **Applies Significance Test**
   - Does it impact how engineers write code?
   - Are there notable tradeoffs?
   - Will it be questioned later?

5. **Creates ADRs**
   - Generates clustered titles
   - Fills ADR template with:
     - Context and constraints
     - Decision details
     - Consequences (positive/negative)
     - Alternatives considered
     - References to artifacts

## ADR Clustering Rules

**GOOD (Clustered):**
- "Frontend Technology Stack"
- "Authentication Approach"
- "Data Architecture"

**BAD (Over-granular):**
- Separate ADRs for Next.js, Tailwind, Vercel

## ADR Quality Criteria

- Decisions are clustered (not atomic)
- Explicit alternatives with rationale
- Clear pros and cons
- Consequences cover both outcomes
- References link to source documents

## Output

```
ADR Review Complete
Created ADRs: N
  - ADR-001: Frontend Technology Stack
  - ADR-002: Authentication Strategy
Referenced Existing: M
Conflicts Detected: P
```

## ADR Location

ADRs are stored in: `history/adr/`
