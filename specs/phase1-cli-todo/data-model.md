# Data Model: Phase I - In-Memory Python Console Todo App

**Feature**: phase1-cli-todo
**Date**: 2025-12-29
**Status**: Complete

## Entities

### Task

The core domain entity representing a todo item.

```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class Task:
    """Domain entity representing a todo task."""
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)
```

**Fields**:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | int | Yes | Auto-generated | Unique identifier, auto-incrementing |
| title | str | Yes | - | Task title, max 200 characters |
| description | Optional[str] | No | None | Optional detailed description |
| completed | bool | No | False | Completion status |
| created_at | datetime | No | Now | Timestamp of creation |

**Validation Rules**:
- `id` MUST be positive integer
- `title` MUST be non-empty string, max 200 characters
- `title` MUST be stripped of leading/trailing whitespace

**State Transitions**:

```
[Created] --> completed=False
    |
    v (done command)
[Completed] --> completed=True
    |
    v (delete command)
[Deleted] --> removed from repository
```

---

## Repository Interface

Abstraction for task storage (Ports & Adapters pattern).

```python
from abc import ABC, abstractmethod
from typing import Optional

class TaskRepository(ABC):
    """Port: Abstract interface for task persistence."""

    @abstractmethod
    def add(self, task: Task) -> Task:
        """Add a new task and return it with assigned ID."""
        pass

    @abstractmethod
    def get(self, task_id: int) -> Optional[Task]:
        """Get task by ID, or None if not found."""
        pass

    @abstractmethod
    def get_all(self) -> list[Task]:
        """Get all tasks."""
        pass

    @abstractmethod
    def update(self, task: Task) -> Task:
        """Update existing task."""
        pass

    @abstractmethod
    def delete(self, task_id: int) -> bool:
        """Delete task by ID. Returns True if deleted."""
        pass

    @abstractmethod
    def next_id(self) -> int:
        """Generate next available ID."""
        pass
```

---

## In-Memory Implementation

```python
class InMemoryTaskRepository(TaskRepository):
    """Adapter: In-memory implementation of TaskRepository."""

    def __init__(self) -> None:
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    # ... implementation details in tasks.md
```

---

## JSON Persistence Schema (Optional)

For optional file-based persistence between sessions:

```json
{
  "version": "1.0",
  "next_id": 5,
  "tasks": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": null,
      "completed": false,
      "created_at": "2025-12-29T10:30:00"
    },
    {
      "id": 2,
      "title": "Write report",
      "description": "Q4 financial summary",
      "completed": true,
      "created_at": "2025-12-29T11:00:00"
    }
  ]
}
```

**File Location**: `~/.todo-app/tasks.json` or `./tasks.json` (configurable)

---

## Relationships

Phase I has a single entity (Task). No relationships.

Future phases will add:
- **Phase II**: User entity with one-to-many relationship to Tasks
- **Phase III+**: Categories, Tags, etc.
