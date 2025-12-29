---
description: Reverse engineer a codebase into SDD-RI artifacts (spec, plan, tasks, intelligence) (project)
command: sp.reverse-engineer
---

# Codebase Reverse Engineering Skill

This skill reverse engineers an existing codebase into Spec-Driven Development artifacts, extracting the implicit knowledge embedded in code into explicit specifications.

## When to Use

- When inheriting a legacy codebase without documentation
- When analyzing third-party code for patterns
- When you need to understand and document an existing system
- For extracting reusable intelligence from implementations

## Invocation

```
/sp.reverse-engineer [codebase-path]
```

Example:

```
/sp.reverse-engineer ./src/legacy-auth-module
```

## What It Does

### Phase 1: Codebase Reconnaissance
- Maps directory structure
- Discovers entry points
- Analyzes dependencies
- Assesses test coverage
- Reads existing documentation

### Phase 2: Deep Analysis
1. **Intent Archaeology**: Extracts WHAT and WHY
2. **Architectural Pattern Recognition**: Identifies HOW
3. **Code Structure Decomposition**: Breaks down into task units
4. **Intelligence Extraction**: Extracts reusable patterns
5. **Gap Analysis**: Identifies missing pieces
6. **Regeneration Blueprint**: Ensures specs can recreate system

### Phase 3: Synthesis & Documentation
- Generates comprehensive artifacts

## Output Artifacts

Located in `[codebase-path]/docs/reverse-engineered/`:

1. **spec.md** - The specification this codebase SHOULD have been built from
2. **plan.md** - The implementation plan that would produce this architecture
3. **tasks.md** - The task breakdown for systematic development
4. **intelligence-object.md** - Reusable skills, patterns, and ADRs

## Key Capabilities

- Extracts functional and non-functional requirements
- Identifies architectural patterns (MVC, Hexagonal, Event-Driven, etc.)
- Documents design decisions as ADRs
- Creates reusable skills from code patterns
- Identifies technical debt and improvement opportunities
