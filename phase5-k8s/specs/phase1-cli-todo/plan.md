# Implementation Plan: Phase I - In-Memory Python Console Todo App

**Branch**: `phase1-cli-todo` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/phase1-cli-todo/spec.md`

## Summary

Build a Python 3.13+ console-based todo application with full CRUD operations (Create, Read, Update, Delete) following Clean/Hexagonal Architecture principles. The app provides an interactive REPL interface for managing tasks stored in memory, with optional JSON file persistence. This is Phase I of the 5-phase Evolution of Todo project.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: None (stdlib only - dataclasses, datetime, json, typing)
**Storage**: In-memory dict with optional JSON file persistence
**Testing**: pytest (optional for hackathon scope)
**Target Platform**: Cross-platform CLI (Windows/Linux/macOS)
**Project Type**: Single project
**Performance Goals**: <100ms response per command
**Constraints**: No external dependencies, Clean Architecture, type annotations required
**Scale/Scope**: Single-user CLI, ~100 tasks max in memory

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Strict Spec-Driven Development | PASS | All code will be generated via sp.tasks → sp.implement |
| II. Single Source of Truth | PASS | spec.md defines all requirements |
| III. Progressive Evolution | PASS | Phase I: CLI foundation for future phases |
| IV. Clean & Hexagonal Architecture | PASS | Domain → Application → Infrastructure layers |
| V. Statelessness & Scalability | N/A | Single-user CLI, no server components yet |
| VI. Security by Default | N/A | No authentication in Phase I (single-user local) |
| VII. MCP Standard | N/A | Phase III+ requirement |
| VIII. Dapr Abstraction | N/A | Phase V requirement |
| IX. Portability & Zero Vendor Lock-in | PASS | stdlib only, no vendor dependencies |
| X. Observability & Reproducibility | N/A | Phase IV+ requirement |

**Quality Standards Check**:
- Type annotations: PASS (Python type hints required)
- Error handling: PASS (User-friendly messages planned)
- Confirmation of actions: PASS (All commands provide feedback)

**Gate Result**: PASS - No violations. Proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/phase1-cli-todo/
├── spec.md              # Feature specification (approved)
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # User guide
├── contracts/
│   └── cli-commands.md  # Command interface contracts
└── tasks.md             # Task list (created by /sp.tasks)
```

### Source Code (repository root)

```text
src/
├── __init__.py          # Package marker
├── main.py              # Entry point, REPL loop
├── cli.py               # Command parser and presenter
├── models.py            # Task dataclass (domain layer)
├── repository.py        # TaskRepository interface + InMemoryTaskRepository
├── service.py           # TaskService (application layer)
└── persistence.py       # Optional JSON load/save

tests/
├── __init__.py
├── test_models.py       # Task model tests
├── test_repository.py   # Repository tests
└── test_service.py      # Service layer tests
```

**Structure Decision**: Single project with layered architecture. Domain models in `models.py`, application logic in `service.py`, infrastructure (repository, CLI, persistence) in separate files. Dependencies point inward: CLI → Service → Repository → Models.

## Architecture Overview

### Hexagonal Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    cli.py                           │ │
│  │  - CommandParser: parse user input                  │ │
│  │  - Presenter: format output for display             │ │
│  │  - REPL loop in main.py                             │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                    APPLICATION                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   service.py                        │ │
│  │  - TaskService: business logic orchestration        │ │
│  │  - Validation rules                                 │ │
│  │  - Error handling                                   │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                      DOMAIN                              │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   models.py                         │ │
│  │  - Task dataclass                                   │ │
│  │  - Domain types                                     │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  repository.py          │    persistence.py         │ │
│  │  - TaskRepository (ABC) │    - load_tasks()         │ │
│  │  - InMemoryTaskRepo     │    - save_tasks()         │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input
    │
    ▼
┌─────────────┐
│   main.py   │ ─── REPL: input() → parse → execute → display
└─────────────┘
    │
    ▼
┌─────────────┐
│   cli.py    │ ─── CommandParser.parse(input) → Command object
└─────────────┘
    │
    ▼
┌─────────────┐
│ service.py  │ ─── TaskService.add/list/done/delete/update()
└─────────────┘
    │
    ▼
┌─────────────┐
│repository.py│ ─── InMemoryTaskRepository CRUD operations
└─────────────┘
    │
    ▼
┌─────────────┐
│  models.py  │ ─── Task dataclass instances
└─────────────┘
```

### Command Execution Flow Example: `add "Buy groceries"`

1. **main.py**: `input()` receives "add Buy groceries"
2. **cli.py**: `CommandParser.parse()` returns `Command(name="add", args=["Buy groceries"])`
3. **main.py**: Routes to `TaskService.add_task(title="Buy groceries")`
4. **service.py**: Validates title, creates Task, calls `repository.add(task)`
5. **repository.py**: Assigns ID, stores in `_tasks` dict, returns Task
6. **service.py**: Returns Task to caller
7. **main.py**: Calls `Presenter.task_created(task)`
8. **cli.py**: Prints "Task 1 created: Buy groceries"

## Key Implementation Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Python Version | 3.13+ | Constitution mandate |
| Package Manager | UV | Constitution mandate |
| Dependencies | stdlib only | Minimal, portable |
| Architecture | Hexagonal | Constitution Principle IV |
| ID Generation | Auto-increment int | User-friendly for CLI |
| Command Parsing | Manual split | Simple, no dependencies |
| Output Format | f-string tables | No external deps needed |
| Error Handling | Custom exceptions | Clear, typed errors |
| Persistence | Optional JSON | Prepares for Phase II |

## Non-Functional Considerations

### Error Messages
- All errors start with "Error: "
- Include actionable guidance
- Example: "Error: Task 5 not found. Use 'list' to see available tasks."

### User Experience
- Clear prompt: `todo> `
- Immediate feedback on every action
- `help` command always available
- Graceful Ctrl+C handling

### Edge Cases Handled
- Empty task list → friendly message
- Invalid ID → clear error
- Non-numeric ID → type error
- Empty title → validation error
- Long title → truncate or error at 200 chars
- Unknown command → suggest help

## Artifacts Generated

| Artifact | Path | Status |
|----------|------|--------|
| Specification | specs/phase1-cli-todo/spec.md | Complete |
| Research | specs/phase1-cli-todo/research.md | Complete |
| Data Model | specs/phase1-cli-todo/data-model.md | Complete |
| CLI Contracts | specs/phase1-cli-todo/contracts/cli-commands.md | Complete |
| Quickstart | specs/phase1-cli-todo/quickstart.md | Complete |
| Implementation Plan | specs/phase1-cli-todo/plan.md | Complete |
| Tasks | specs/phase1-cli-todo/tasks.md | Pending (run /sp.tasks) |

## Next Steps

1. Run `/sp.tasks` to generate task list from this plan
2. Run `/sp.implement` to execute tasks and generate code
3. Validate with quickstart.md tutorial
4. Proceed to Phase II specification

## Complexity Tracking

> **No violations - no complexity justification required**

This plan adheres to all constitution principles applicable to Phase I.
