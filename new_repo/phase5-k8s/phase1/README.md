# Phase I: CLI Todo Application 📝

A powerful, feature-rich command-line interface (CLI) todo application built with Python. This is Phase I of the multi-phase todo application evolution project.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [Code Architecture](#code-architecture)
- [Testing](#testing)
- [Development](#development)
- [Examples](#examples)
- [Author](#author)

---

## 🎯 Overview

Phase I is a fully functional CLI-based todo application that demonstrates clean code architecture, separation of concerns, and proper software engineering practices. The application runs entirely in the terminal and stores tasks in a JSON file for persistence.

**Key Highlights:**
- 🚀 Fast and lightweight CLI interface
- 💾 Persistent storage using JSON files
- 🧪 Fully tested with pytest
- 🏗️ Clean architecture with layered design
- 📦 Zero external dependencies for core functionality
- 🔄 Interactive REPL (Read-Eval-Print Loop)
- ✨ Support for quoted and unquoted task titles

---

## ✨ Features

### Core Features

1. **Create Tasks**: Add new todos with single or multi-word titles
2. **List Tasks**: View all tasks in a formatted table with ID, status, and title
3. **Mark Complete**: Mark tasks as completed
4. **Toggle Status**: Toggle between complete/incomplete states
5. **Update Tasks**: Edit task titles
6. **Delete Tasks**: Remove tasks permanently
7. **Help System**: Built-in help command showing all available commands
8. **Graceful Exit**: Save tasks on exit (Ctrl+C or 'exit' command)

### Technical Features

- **Command Parsing**: Smart parsing of quoted strings using `shlex`
- **Error Handling**: Custom exception hierarchy for clear error messages
- **Input Validation**: Title length validation (1-200 characters)
- **Persistence**: Auto-save on exit, auto-load on startup
- **Task Counter**: Automatic ID assignment with persistence
- **Command Aliases**: Multiple aliases for common commands (e.g., `ls`/`list`, `rm`/`delete`)

---

## 🏗️ Architecture

The application follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│          Presentation Layer (CLI)           │
│  ┌────────────┐        ┌──────────────┐    │
│  │  Parser    │        │  Presenter   │    │
│  └────────────┘        └──────────────┘    │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│          Business Logic Layer               │
│  ┌──────────────────────────────────────┐  │
│  │       TaskService                    │  │
│  │  (Business Rules & Validation)       │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│          Data Access Layer                  │
│  ┌──────────────────────────────────────┐  │
│  │    InMemoryTaskRepository            │  │
│  │    (CRUD Operations)                 │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│          Persistence Layer                  │
│  ┌──────────────────────────────────────┐  │
│  │    JSON File Storage                 │  │
│  │    (tasks.json)                      │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Language** | Python | 3.13+ | Core programming language |
| **Package Manager** | uv (ultraviolet) | Latest | Fast Python package manager |
| **Build System** | Hatchling | Latest | PEP 517 build backend |
| **Testing** | pytest | 8.0.0+ | Unit testing framework |
| **Storage** | JSON | Built-in | Task persistence |
| **CLI Parsing** | shlex | Built-in | Command parsing |

**Why These Technologies?**

- **Python 3.13**: Latest features, pattern matching, improved error messages
- **uv**: 10-100x faster than pip, better dependency resolution
- **Zero external runtime dependencies**: Pure Python for maximum portability
- **JSON**: Simple, human-readable, easy to debug

---

## 📦 Installation

### Prerequisites

- Python 3.13 or higher
- uv package manager (recommended) or pip

### Install uv (if not already installed)

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Install the Application

```bash
# Navigate to phase1 directory
cd phase1

# Install dependencies using uv
uv sync

# Alternative: Install as editable package
uv pip install -e .
```

---

## 🚀 Usage

### Starting the Application

#### Method 1: Using uv run
```bash
cd phase1
uv run python -m src.main
```

#### Method 2: Activate virtual environment
```bash
cd phase1

# Activate virtual environment
# Linux/macOS:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# Run the application
python -m src.main
```

#### Method 3: Using installed script
```bash
cd phase1
uv sync  # Install package
todo     # Run the todo command
```

### First Run

When you start the application for the first time:

```
Welcome to Todo App!
Type 'help' for available commands.

todo>
```

---

## 📖 Available Commands

### Task Management Commands

| Command | Aliases | Arguments | Description | Example |
|---------|---------|-----------|-------------|---------|
| `add` | - | `<title>` | Create a new task | `add Buy groceries` |
| `list` | `ls` | - | Show all tasks | `list` |
| `done` | `complete` | `<id>` | Mark task as completed | `done 1` |
| `toggle` | - | `<id>` | Toggle completion status | `toggle 1` |
| `delete` | `del`, `rm` | `<id>` | Delete a task | `delete 1` |
| `update` | `edit` | `<id> <title>` | Update task title | `update 1 New title` |

### System Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `help` | `?` | Show available commands |
| `exit` | `quit`, `q` | Save and quit application |

### Command Tips

**Quoted Strings:**
```bash
# With quotes (recommended for special characters)
todo> add "Buy milk and eggs"

# Without quotes (multi-word support)
todo> add Buy milk and eggs
```

**Task IDs:**
```bash
# IDs are auto-assigned starting from 1
todo> add First task    # Gets ID 1
todo> add Second task   # Gets ID 2
```

---

## 📁 Project Structure

```
phase1/
├── src/                          # Source code directory
│   ├── __init__.py              # Package marker
│   ├── __main__.py              # Entry point for python -m
│   ├── main.py                  # Main REPL loop and CLI handlers
│   ├── cli.py                   # Command parsing and output formatting
│   │   ├── Command              # Parsed command dataclass
│   │   ├── CommandParser        # Parses user input
│   │   └── Presenter            # Formats output
│   ├── service.py               # Business logic layer
│   │   └── TaskService          # Task operations with validation
│   ├── repository.py            # Data access layer
│   │   └── InMemoryTaskRepository  # CRUD operations
│   ├── models.py                # Data models
│   │   └── Task                 # Task entity with validation
│   ├── persistence.py           # File I/O operations
│   │   ├── load_tasks()        # Load from JSON
│   │   └── save_tasks()        # Save to JSON
│   └── exceptions.py            # Custom exception hierarchy
│       ├── TodoAppError         # Base exception
│       ├── ValidationError      # Invalid input
│       ├── TaskNotFoundError   # Task doesn't exist
│       └── InvalidIdError      # Invalid task ID
│
├── tests/                       # Test directory
│   ├── __init__.py             # Test package marker
│   └── test_*.py               # Unit tests (pytest)
│
├── pyproject.toml              # Project configuration (PEP 621)
├── uv.lock                     # Dependency lock file
├── tasks.json                  # Task storage (created at runtime)
└── README.md                   # This file
```

---

## 🏛️ Code Architecture

### Layer Responsibilities

#### 1. Presentation Layer (`cli.py`, `main.py`)

**Responsibilities:**
- Parse user input into commands
- Format output for display
- Handle REPL loop
- Map commands to service calls

**Key Classes:**
- `CommandParser`: Parses raw input into `Command` objects
- `Presenter`: Formats all output (tables, messages, errors)
- `main.py`: Contains REPL and command handlers

#### 2. Business Logic Layer (`service.py`)

**Responsibilities:**
- Implement business rules
- Validate input (title length, ID validity)
- Coordinate operations
- Raise domain exceptions

**Key Class:**
- `TaskService`: Orchestrates all task operations

#### 3. Data Access Layer (`repository.py`)

**Responsibilities:**
- Manage in-memory task collection
- Implement CRUD operations
- Maintain ID counter
- No business logic

**Key Class:**
- `InMemoryTaskRepository`: Memory-based task storage

#### 4. Persistence Layer (`persistence.py`)

**Responsibilities:**
- Load tasks from JSON file
- Save tasks to JSON file
- Handle file I/O errors
- Serialize/deserialize tasks

**Key Functions:**
- `load_tasks()`: Returns (tasks, next_id)
- `save_tasks()`: Writes tasks to file

#### 5. Domain Layer (`models.py`)

**Responsibilities:**
- Define data structures
- Built-in validation
- Business entities

**Key Class:**
- `Task`: Immutable task with validation

---

## 🧪 Testing

### Running Tests

```bash
cd phase1

# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_service.py
```

### Test Coverage

The application has comprehensive test coverage:

- ✅ Unit tests for all layers
- ✅ Command parsing tests
- ✅ Business logic validation tests
- ✅ Repository CRUD tests
- ✅ Exception handling tests
- ✅ Edge case coverage

---

## 👨‍💻 Development

### Code Style

The project follows Python best practices:

- ✅ PEP 8 style guide
- ✅ Type hints everywhere
- ✅ Docstrings for all public APIs
- ✅ Descriptive variable names
- ✅ Single Responsibility Principle
- ✅ Dependency Injection

### Adding New Commands

1. Add handler function in `main.py`
2. Add case in match statement
3. Add presenter method in `cli.py`
4. Update help text
5. Write tests

### Design Patterns Used

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Dependency Injection**: Loose coupling
- **Command Pattern**: CLI command handling
- **Presenter Pattern**: Output formatting

---

## 📚 Examples

### Example Session

```bash
$ cd phase1
$ uv run python -m src.main

Welcome to Todo App!
Type 'help' for available commands.

todo> add Buy groceries
Task 1 created: Buy groceries

todo> add "Write documentation"
Task 2 created: Write documentation

todo> add Study Python
Task 3 created: Study Python

todo> list
ID    Status    Title
----  --------  --------------------------------------------------
1     [ ]       Buy groceries
2     [ ]       Write documentation
3     [ ]       Study Python

Total: 3 tasks (0 completed)

todo> done 1
Task 1 marked as complete

todo> list
ID    Status    Title
----  --------  --------------------------------------------------
1     [x]       Buy groceries
2     [ ]       Write documentation
3     [ ]       Study Python

Total: 3 tasks (1 completed)

todo> toggle 1
Task 1 marked as incomplete

todo> update 2 Write comprehensive documentation
Task 2 updated: Write comprehensive documentation

todo> delete 3
Task 3 deleted

todo> list
ID    Status    Title
----  --------  --------------------------------------------------
1     [ ]       Buy groceries
2     [ ]       Write comprehensive documentation

Total: 2 tasks (0 completed)

todo> help
Todo App - Available Commands
==============================
  add <title>         Create a new task
  list                Show all tasks
  done <id>           Mark task as completed
  toggle <id>         Toggle task completion status
  delete <id>         Remove a task
  update <id> <title> Update task title
  help                Show this help message
  exit                Quit the application

todo> exit
Saved 2 task(s) to file.
Goodbye!
```

### Persistence Example

Tasks are automatically saved to `tasks.json`:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Buy groceries",
      "completed": false
    },
    {
      "id": 2,
      "title": "Write comprehensive documentation",
      "completed": false
    }
  ],
  "next_id": 3
}
```

When you restart the app, tasks are automatically loaded:

```bash
$ uv run python -m src.main
Loaded 2 task(s) from file.
Welcome to Todo App!
```

---

## 🔄 Data Flow

### Adding a Task

```
User Input: "add Buy milk"
       ↓
CommandParser.parse() → Command(name='add', args=['Buy', 'milk'])
       ↓
handle_add() → Joins args: "Buy milk"
       ↓
TaskService.add_task("Buy milk") → Validates title
       ↓
InMemoryTaskRepository.add(task) → Stores in memory
       ↓
Presenter.task_created(task) → Displays confirmation
```

### Exiting the Application

```
User Input: "exit"
       ↓
TaskService.list_tasks() → Gets all tasks
       ↓
save_tasks(tasks, next_id) → Writes to tasks.json
       ↓
Presenter.show_goodbye() → Displays "Goodbye!"
```

---

## 🐛 Error Handling

The application provides clear error messages:

```bash
# Invalid task ID
todo> done abc
Error: Invalid ID 'abc'. ID must be a number.

# Task not found
todo> done 999
Error: Task with ID 999 not found

# Empty title
todo> add
Error: add requires <title>

# Title too long (>200 characters)
todo> add [201 character string]
Error: Task title must be between 1 and 200 characters

# Unknown command
todo> blah
Unknown command 'blah'. Type 'help' for available commands.
```

---

## 🚀 Next Phase

This CLI application (Phase I) is the foundation for:

**Phase II**: Full-stack web application
- Next.js 14+ with App Router
- Multi-user authentication
- PostgreSQL/SQLite database
- Beautiful gradient UI
- Real-time updates

See `../phase2/README.md` for Phase II documentation.

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👩‍💻 Author

**Shazia Zohaib**

Built with ❤️ using Python

---

## 🙏 Acknowledgments

- Python community for excellent documentation
- uv team for blazing-fast package management
- pytest team for robust testing framework

---

**Phase I Complete!** ✅

*Simple, fast, and reliable CLI todo management.*
