# Phase I: CLI Todo Application

A command-line interface (CLI) based todo application built with Python.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Command-line interface for quick task management
- ✅ Persistent storage using JSON file
- ✅ Pure Python implementation with no external dependencies

## Technology Stack

- **Language**: Python 3.12+
- **Package Manager**: uv (ultraviolet)
- **Storage**: JSON file (`tasks.json`)
- **Testing**: pytest

## Installation

1. Install dependencies using uv:
```bash
cd phase1
uv sync
```

## Usage

Run the CLI application:

```bash
# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Run the todo CLI
python -m src.todo_cli
```

### Available Commands

- `add <task>` - Add a new todo
- `list` - List all todos
- `complete <id>` - Mark a todo as complete
- `delete <id>` - Delete a todo
- `exit` - Exit the application

## Project Structure

```
phase1/
├── src/
│   └── todo_cli.py       # Main CLI application
├── tests/
│   └── test_todo.py      # Unit tests
├── pyproject.toml        # Project configuration
├── uv.lock              # Dependency lock file
├── tasks.json           # Todo storage (created at runtime)
└── README.md            # This file
```

## Testing

Run tests:
```bash
pytest tests/
```

## Development

This is Phase I of the todo application evolution. See Phase II (`../phase2/`) for the full-stack web version with authentication and database.

---

**Created by**: Shazia Zohaib
**Phase**: I - CLI Application
