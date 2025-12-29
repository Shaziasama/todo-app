# Tasks: Phase I - In-Memory Python Console Todo App

**Input**: Design documents from `/specs/phase1-cli-todo/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/cli-commands.md
**Tests**: Optional (hackathon scope per constitution)
**Organization**: Tasks organized by architectural layer, then by user story

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths included in descriptions

## Path Conventions

- **Project Type**: Single project
- **Source**: `src/` at repository root
- **Tests**: `tests/` at repository root (optional)

---

## Phase 1: Setup (Project Infrastructure)

**Purpose**: Initialize Python project with UV and create directory structure

- [ ] T-001 [P] Initialize UV project with `pyproject.toml` at repository root
  - **Preconditions**: None
  - **Outputs**: `pyproject.toml` with Python 3.13+ requirement
  - **Artifacts**: `pyproject.toml`

- [ ] T-002 [P] Create source directory structure with package markers
  - **Preconditions**: None
  - **Outputs**: `src/__init__.py`, `tests/__init__.py` directories created
  - **Artifacts**: `src/__init__.py`, `tests/__init__.py`

**Checkpoint**: Project structure ready for implementation

---

## Phase 2: Domain Layer (Models)

**Purpose**: Core domain entity - foundation for all other layers

- [ ] T-003 [US1] Create Task dataclass in `src/models.py`
  - **Preconditions**: T-002 complete
  - **Outputs**: Task dataclass with id, title, description, completed, created_at fields
  - **Artifacts**: `src/models.py`
  - **Spec Reference**: data-model.md Task entity
  - **Validation**:
    - Type hints on all fields
    - @dataclass decorator
    - Optional[str] for description
    - datetime default factory for created_at

- [ ] T-004 [US1] Create custom exceptions in `src/exceptions.py`
  - **Preconditions**: T-002 complete
  - **Outputs**: TaskNotFoundError, ValidationError, InvalidCommandError classes
  - **Artifacts**: `src/exceptions.py`
  - **Spec Reference**: contracts/cli-commands.md Error Taxonomy

**Checkpoint**: Domain layer complete - Task entity and exceptions defined

---

## Phase 3: Infrastructure Layer (Repository)

**Purpose**: Data access abstraction following Ports & Adapters pattern

- [ ] T-005 [US1] Create TaskRepository abstract base class in `src/repository.py`
  - **Preconditions**: T-003 complete
  - **Outputs**: ABC with add, get, get_all, update, delete, next_id abstract methods
  - **Artifacts**: `src/repository.py`
  - **Spec Reference**: data-model.md Repository Interface

- [ ] T-006 [US1] Implement InMemoryTaskRepository in `src/repository.py`
  - **Preconditions**: T-005 complete
  - **Outputs**: Concrete implementation with dict storage and auto-increment ID
  - **Artifacts**: `src/repository.py` (extend)
  - **Validation**:
    - `_tasks: dict[int, Task]` internal storage
    - `_next_id: int` counter starting at 1
    - All abstract methods implemented

**Checkpoint**: Repository layer complete - in-memory storage operational

---

## Phase 4: Application Layer (Service)

**Purpose**: Business logic orchestration with validation

- [ ] T-007 [US1] Create TaskService class in `src/service.py`
  - **Preconditions**: T-006 complete
  - **Outputs**: TaskService with repository injection and add_task, list_tasks methods
  - **Artifacts**: `src/service.py`
  - **Validation**:
    - Constructor takes TaskRepository
    - add_task(title: str) -> Task with validation
    - list_tasks() -> list[Task]
    - Title validation: non-empty, max 200 chars, stripped

- [ ] T-008 [US2] Add complete_task and delete_task methods to TaskService
  - **Preconditions**: T-007 complete
  - **Outputs**: complete_task(id) and delete_task(id) methods
  - **Artifacts**: `src/service.py` (extend)
  - **Validation**:
    - Raise TaskNotFoundError if ID doesn't exist
    - complete_task sets completed=True
    - delete_task removes from repository

- [ ] T-009 [US3] Add update_task method to TaskService
  - **Preconditions**: T-007 complete
  - **Outputs**: update_task(id, new_title) method
  - **Artifacts**: `src/service.py` (extend)
  - **Validation**:
    - Raise TaskNotFoundError if ID doesn't exist
    - Validate new_title same as add_task

**Checkpoint**: Application layer complete - all CRUD operations available

---

## Phase 5: Presentation Layer (CLI)

**Purpose**: Command parsing, output formatting, REPL interface

- [ ] T-010 [US4] Create Command dataclass and CommandParser in `src/cli.py`
  - **Preconditions**: T-004 complete
  - **Outputs**: Command(name, args) dataclass, CommandParser.parse(input) -> Command
  - **Artifacts**: `src/cli.py`
  - **Spec Reference**: contracts/cli-commands.md Command Interface
  - **Validation**:
    - Handle quoted strings: `add "Buy groceries"`
    - Handle unquoted: `add Buy groceries` -> single arg
    - Return Command with name and args list

- [ ] T-011 [US1] Create Presenter class with task output methods in `src/cli.py`
  - **Preconditions**: T-010 complete
  - **Outputs**: Presenter with task_created, task_list, empty_list methods
  - **Artifacts**: `src/cli.py` (extend)
  - **Spec Reference**: contracts/cli-commands.md list and add outputs
  - **Validation**:
    - Formatted table with ID, Status, Title columns
    - Status shows [ ] or [x]
    - Total count with completed count

- [ ] T-012 [US2] Add complete/delete output methods to Presenter
  - **Preconditions**: T-011 complete
  - **Outputs**: task_completed, task_deleted methods
  - **Artifacts**: `src/cli.py` (extend)

- [ ] T-013 [US3] Add update output method to Presenter
  - **Preconditions**: T-011 complete
  - **Outputs**: task_updated method
  - **Artifacts**: `src/cli.py` (extend)

- [ ] T-014 [US4] Add help and error output methods to Presenter
  - **Preconditions**: T-011 complete
  - **Outputs**: show_help, show_error, show_unknown_command, show_goodbye methods
  - **Artifacts**: `src/cli.py` (extend)
  - **Spec Reference**: contracts/cli-commands.md help output

**Checkpoint**: CLI layer complete - all output formatting ready

---

## Phase 6: Main Entry Point (REPL Loop)

**Purpose**: Wire everything together with interactive loop

- [ ] T-015 [US4] Create REPL loop in `src/main.py`
  - **Preconditions**: T-007, T-010, T-014 complete
  - **Outputs**: Main entry point with welcome message, prompt loop, command routing
  - **Artifacts**: `src/main.py`
  - **Validation**:
    - Print welcome message on start
    - Show `todo> ` prompt
    - Parse input with CommandParser
    - Route to appropriate service method
    - Display output with Presenter
    - Handle empty input (show prompt again)
    - Handle unknown commands

- [ ] T-016 [US4] Add graceful exit handling to REPL
  - **Preconditions**: T-015 complete
  - **Outputs**: Handle `exit` command and Ctrl+C (KeyboardInterrupt)
  - **Artifacts**: `src/main.py` (extend)
  - **Validation**:
    - `exit` command prints "Goodbye!" and exits
    - Ctrl+C prints "Goodbye!" and exits with code 0

- [ ] T-017 [US1,US2,US3] Wire all commands to service methods in REPL
  - **Preconditions**: T-008, T-009, T-015 complete
  - **Outputs**: Complete command routing for add, list, done, delete, update, help
  - **Artifacts**: `src/main.py` (extend)
  - **Validation**:
    - Each command calls appropriate service method
    - Errors caught and displayed via Presenter
    - ID parsing with error handling for non-numeric

**Checkpoint**: Core application complete and functional

---

## Phase 7: Optional Persistence

**Purpose**: JSON file save/load for session persistence (optional enhancement)

- [ ] T-018 [P] Create JSON persistence module in `src/persistence.py`
  - **Preconditions**: T-006 complete
  - **Outputs**: load_tasks(filepath) and save_tasks(filepath, tasks, next_id) functions
  - **Artifacts**: `src/persistence.py`
  - **Spec Reference**: data-model.md JSON Persistence Schema
  - **Validation**:
    - JSON schema with version, next_id, tasks array
    - Handle file not found (return empty)
    - Handle invalid JSON (return empty with warning)

- [ ] T-019 Add persistence integration to main.py
  - **Preconditions**: T-017, T-018 complete
  - **Outputs**: Load tasks on startup, save on exit
  - **Artifacts**: `src/main.py` (extend)
  - **Validation**:
    - Default file: `./tasks.json`
    - Load silently on start
    - Save automatically on `exit`

**Checkpoint**: Persistence complete - tasks survive between sessions

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Domain) ──────────────────┐
    ↓                              │
Phase 3 (Repository)               │
    ↓                              │
Phase 4 (Application) ◄────────────┘
    ↓
Phase 5 (CLI)
    ↓
Phase 6 (Main/REPL)
    ↓
Phase 7 (Persistence) [Optional]
```

### Task Dependencies Graph

```
T-001 ──┬──► T-003 ──► T-005 ──► T-006 ──► T-007 ──► T-008 ──┐
        │                                      │              │
T-002 ──┤                                      ├──► T-009 ──┐│
        │                                      │            ││
        └──► T-004 ──► T-010 ──► T-011 ──┬──► T-012        ││
                                         │                  ││
                                         ├──► T-013        ││
                                         │                  ││
                                         └──► T-014 ──► T-015 ──► T-016 ──► T-017
                                                                      │
                                         T-018 ◄──────────────────────┴──► T-019
```

### Parallel Opportunities

- **T-001, T-002**: Setup tasks can run in parallel
- **T-003, T-004**: Both in Phase 2, different files, can run in parallel
- **T-011, T-012, T-013, T-014**: Presenter methods can be parallelized after T-010
- **T-018**: Can start after T-006, independent of CLI work

---

## Implementation Strategy

### MVP First (User Stories 1 + 4)

1. Complete Phase 1: Setup (T-001, T-002)
2. Complete Phase 2: Domain (T-003, T-004)
3. Complete Phase 3: Repository (T-005, T-006)
4. Complete Phase 4: Core Service (T-007 only)
5. Complete Phase 5: Core CLI (T-010, T-011, T-014)
6. Complete Phase 6: REPL (T-015, T-016)
7. **STOP and VALIDATE**: Test add, list, help, exit

### Full CRUD

8. Add complete/delete: T-008, T-012
9. Add update: T-009, T-013
10. Wire all commands: T-017
11. **VALIDATE**: Full CRUD cycle working

### Optional Persistence

12. Add persistence: T-018, T-019
13. **VALIDATE**: Tasks survive restart

---

## Validation Checklist

After each phase, verify:

- [ ] All files created at specified paths
- [ ] Type hints on all functions and classes
- [ ] Imports resolve correctly
- [ ] No external dependencies added
- [ ] Error messages match contracts/cli-commands.md

### Final Acceptance Test

Run through quickstart.md tutorial:
1. `uv run python src/main.py`
2. `add Buy groceries` → Task 1 created
3. `list` → Shows task table
4. `done 1` → Task marked complete
5. `update 1 Buy organic groceries` → Task updated
6. `delete 1` → Task deleted
7. `help` → Shows all commands
8. `exit` → Goodbye message

---

## Notes

- All tasks reference spec artifacts for validation
- [P] = parallel execution safe
- [US#] = user story mapping for traceability
- Commit after each phase completion
- Run `uv run python src/main.py` to test incrementally
