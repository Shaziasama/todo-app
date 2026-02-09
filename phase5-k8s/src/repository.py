"""Repository layer for Todo App.

This module implements the Ports & Adapters (Hexagonal Architecture) pattern.
TaskRepository is the Port (abstract interface), and InMemoryTaskRepository
is the Adapter (concrete implementation).
"""

from abc import ABC, abstractmethod
from typing import Optional

from src.models import Task


class TaskRepository(ABC):
    """Port: Abstract interface for task persistence.

    This interface defines the contract for task storage operations.
    Implementations can use in-memory storage, databases, or file systems.
    """

    @abstractmethod
    def add(self, task: Task) -> Task:
        """Add a new task and return it with assigned ID.

        Args:
            task: The task to add (ID will be assigned by repository).

        Returns:
            The task with its assigned ID.
        """
        pass

    @abstractmethod
    def get(self, task_id: int) -> Optional[Task]:
        """Get task by ID.

        Args:
            task_id: The unique identifier of the task.

        Returns:
            The task if found, None otherwise.
        """
        pass

    @abstractmethod
    def get_all(self) -> list[Task]:
        """Get all tasks.

        Returns:
            List of all tasks, ordered by ID.
        """
        pass

    @abstractmethod
    def update(self, task: Task) -> Task:
        """Update an existing task.

        Args:
            task: The task with updated fields.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundError: If task with given ID doesn't exist.
        """
        pass

    @abstractmethod
    def delete(self, task_id: int) -> bool:
        """Delete task by ID.

        Args:
            task_id: The unique identifier of the task to delete.

        Returns:
            True if task was deleted, False if not found.
        """
        pass

    @abstractmethod
    def next_id(self) -> int:
        """Generate next available ID.

        Returns:
            The next unique ID for a new task.
        """
        pass

    @abstractmethod
    def set_next_id(self, next_id: int) -> None:
        """Set the next ID value (used when loading from persistence).

        Args:
            next_id: The next ID value to use.
        """
        pass


class InMemoryTaskRepository(TaskRepository):
    """Adapter: In-memory implementation of TaskRepository.

    Stores tasks in a dictionary with auto-incrementing integer IDs.
    Data is lost when the application exits unless persistence is used.
    """

    def __init__(self) -> None:
        """Initialize empty repository."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add(self, task: Task) -> Task:
        """Add a new task with auto-assigned ID."""
        task_id = self.next_id()
        # Create new task with assigned ID
        new_task = Task(
            id=task_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at
        )
        self._tasks[task_id] = new_task
        self._next_id += 1
        return new_task

    def get(self, task_id: int) -> Optional[Task]:
        """Get task by ID, or None if not found."""
        return self._tasks.get(task_id)

    def get_all(self) -> list[Task]:
        """Get all tasks, ordered by ID."""
        return sorted(self._tasks.values(), key=lambda t: t.id)

    def update(self, task: Task) -> Task:
        """Update existing task."""
        if task.id not in self._tasks:
            from src.exceptions import TaskNotFoundError
            raise TaskNotFoundError(task.id)
        self._tasks[task.id] = task
        return task

    def delete(self, task_id: int) -> bool:
        """Delete task by ID. Returns True if deleted."""
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def next_id(self) -> int:
        """Get next available ID."""
        return self._next_id

    def set_next_id(self, next_id: int) -> None:
        """Set next ID value."""
        self._next_id = next_id

    def load_tasks(self, tasks: list[Task]) -> None:
        """Load tasks from external source (used by persistence).

        Args:
            tasks: List of tasks to load into repository.
        """
        self._tasks.clear()
        for task in tasks:
            self._tasks[task.id] = task
