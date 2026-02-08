# CLI Command Contracts: Phase I

**Feature**: phase1-cli-todo
**Date**: 2025-12-29
**Status**: Complete

## Command Interface

All commands follow the pattern: `<command> [arguments...]`

---

## Commands

### `add <title>`

**Purpose**: Create a new task

**Input**:
- `title` (string, required): Task title, max 200 characters

**Output (Success)**:
```
Task <id> created: <title>
```

**Output (Error)**:
```
Error: Title cannot be empty
Error: Title too long (max 200 characters)
```

**Example**:
```
> add Buy groceries
Task 1 created: Buy groceries

> add "Write quarterly report"
Task 2 created: Write quarterly report
```

---

### `list`

**Purpose**: Display all tasks

**Input**: None

**Output (With Tasks)**:
```
ID    Status    Title
----  --------  --------------------------------------------------
1     [ ]       Buy groceries
2     [x]       Write quarterly report
3     [ ]       Call mom

Total: 3 tasks (1 completed)
```

**Output (Empty)**:
```
No tasks found. Use 'add <title>' to create one.
```

---

### `done <id>`

**Purpose**: Mark task as completed

**Input**:
- `id` (integer, required): Task ID

**Output (Success)**:
```
Task <id> marked as complete
```

**Output (Error)**:
```
Error: Task <id> not found
Error: ID must be a number
```

---

### `delete <id>`

**Purpose**: Remove a task permanently

**Input**:
- `id` (integer, required): Task ID

**Output (Success)**:
```
Task <id> deleted
```

**Output (Error)**:
```
Error: Task <id> not found
Error: ID must be a number
```

---

### `update <id> <new_title>`

**Purpose**: Update task title

**Input**:
- `id` (integer, required): Task ID
- `new_title` (string, required): New title

**Output (Success)**:
```
Task <id> updated: <new_title>
```

**Output (Error)**:
```
Error: Task <id> not found
Error: ID must be a number
Error: New title cannot be empty
```

---

### `help`

**Purpose**: Display available commands

**Output**:
```
Todo App - Available Commands
==============================
  add <title>         Create a new task
  list                Show all tasks
  done <id>           Mark task as completed
  delete <id>         Remove a task
  update <id> <title> Update task title
  help                Show this help message
  exit                Quit the application
```

---

### `exit`

**Purpose**: Quit the application

**Output**:
```
Goodbye!
```

---

## Error Taxonomy

| Error Type | Message Pattern | Exit Code |
|------------|-----------------|-----------|
| Invalid Command | "Unknown command '<cmd>'. Type 'help' for available commands." | N/A (continues) |
| Missing Argument | "Error: <command> requires <argument>" | N/A (continues) |
| Invalid ID | "Error: ID must be a number" | N/A (continues) |
| Not Found | "Error: Task <id> not found" | N/A (continues) |
| Validation | "Error: <field> <reason>" | N/A (continues) |
| Keyboard Interrupt | "Goodbye!" | 0 |

---

## REPL Prompt

```
todo>
```

The prompt indicates the app is ready for input.
