# Quickstart: Phase I - In-Memory Python Console Todo App

**Feature**: phase1-cli-todo
**Date**: 2025-12-29

## Prerequisites

- Python 3.13+
- UV package manager

## Installation

```bash
# Clone repository (if not already done)
cd todo-app

# Initialize UV project (first time only)
uv init

# No external dependencies required for Phase I
```

## Running the Application

```bash
# Run the todo app
uv run python src/main.py
```

You'll see:
```
Welcome to Todo App!
Type 'help' for available commands.

todo>
```

## Quick Tutorial

### 1. Create your first task

```
todo> add Buy groceries
Task 1 created: Buy groceries
```

### 2. Add more tasks

```
todo> add Write quarterly report
Task 2 created: Write quarterly report

todo> add Call mom
Task 3 created: Call mom
```

### 3. View all tasks

```
todo> list
ID    Status    Title
----  --------  --------------------------------------------------
1     [ ]       Buy groceries
2     [ ]       Write quarterly report
3     [ ]       Call mom

Total: 3 tasks (0 completed)
```

### 4. Mark a task as done

```
todo> done 2
Task 2 marked as complete

todo> list
ID    Status    Title
----  --------  --------------------------------------------------
1     [ ]       Buy groceries
2     [x]       Write quarterly report
3     [ ]       Call mom

Total: 3 tasks (1 completed)
```

### 5. Update a task

```
todo> update 1 Buy organic groceries
Task 1 updated: Buy organic groceries
```

### 6. Delete a task

```
todo> delete 3
Task 3 deleted
```

### 7. Get help

```
todo> help
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

### 8. Exit the app

```
todo> exit
Goodbye!
```

Or press `Ctrl+C` to exit.

## Troubleshooting

### "Command not found" error
Make sure you're typing the command correctly. Use `help` to see available commands.

### "Task not found" error
Check the task ID using `list` command.

### "ID must be a number" error
Task IDs are numbers. Use `list` to see valid IDs.

## Next Steps

- **Phase II**: Web interface with FastAPI backend and Next.js frontend
- **Phase III**: AI-powered task management with MCP tools
