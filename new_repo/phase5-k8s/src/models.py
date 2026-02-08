"""Domain models for Todo App.

This module contains the core domain entities following Clean Architecture principles.
The Task dataclass represents the fundamental unit of work in the todo system.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Task:
    """Domain entity representing a todo task.

    Attributes:
        id: Unique identifier, auto-incrementing positive integer.
        title: Task title, max 200 characters, required.
        description: Optional detailed description.
        completed: Completion status, defaults to False.
        created_at: Timestamp of creation, defaults to current time.
    """
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self) -> None:
        """Validate task data after initialization."""
        if self.id < 0:
            raise ValueError("Task ID must be non-negative")
        if not self.title or not self.title.strip():
            raise ValueError("Task title cannot be empty")
        if len(self.title) > 200:
            raise ValueError("Task title cannot exceed 200 characters")
        # Normalize title by stripping whitespace
        object.__setattr__(self, 'title', self.title.strip())
