"""Application service layer for Todo App.

This module contains the TaskService which orchestrates business logic,
validates inputs, and coordinates between the presentation and repository layers.
"""

from src.exceptions import TaskNotFoundError, ValidationError
from src.models import Task
from src.repository import TaskRepository


class TaskService:
    """Application service for task management.

    Orchestrates business logic and validation for all task operations.
    Uses dependency injection for the repository to enable testability.
    """

    MAX_TITLE_LENGTH = 200

    def __init__(self, repository: TaskRepository) -> None:
        """Initialize service with repository.

        Args:
            repository: The task repository implementation to use.
        """
        self._repository = repository

    def _validate_title(self, title: str) -> str:
        """Validate and normalize task title.

        Args:
            title: The title to validate.

        Returns:
            The normalized (stripped) title.

        Raises:
            ValidationError: If title is empty or too long.
        """
        if not title or not title.strip():
            raise ValidationError("Title cannot be empty")
        title = title.strip()
        if len(title) > self.MAX_TITLE_LENGTH:
            raise ValidationError(f"Title too long (max {self.MAX_TITLE_LENGTH} characters)")
        return title

    def add_task(self, title: str, description: str | None = None) -> Task:
        """Create a new task.

        Args:
            title: The task title (required, max 200 chars).
            description: Optional task description.

        Returns:
            The created task with assigned ID.

        Raises:
            ValidationError: If title is invalid.
        """
        title = self._validate_title(title)
        task = Task(id=0, title=title, description=description)
        return self._repository.add(task)

    def list_tasks(self) -> list[Task]:
        """Get all tasks.

        Returns:
            List of all tasks, ordered by ID.
        """
        return self._repository.get_all()

    def get_task(self, task_id: int) -> Task:
        """Get a specific task by ID.

        Args:
            task_id: The task ID.

        Returns:
            The task.

        Raises:
            TaskNotFoundError: If task doesn't exist.
        """
        task = self._repository.get(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)
        return task

    def complete_task(self, task_id: int) -> Task:
        """Mark a task as completed.

        Args:
            task_id: The ID of the task to complete.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundError: If task doesn't exist.
        """
        task = self._repository.get(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)

        updated_task = Task(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=True,
            created_at=task.created_at
        )
        return self._repository.update(updated_task)

    def delete_task(self, task_id: int) -> bool:
        """Delete a task.

        Args:
            task_id: The ID of the task to delete.

        Returns:
            True if deleted successfully.

        Raises:
            TaskNotFoundError: If task doesn't exist.
        """
        if not self._repository.delete(task_id):
            raise TaskNotFoundError(task_id)
        return True

    def update_task(self, task_id: int, new_title: str) -> Task:
        """Update a task's title.

        Args:
            task_id: The ID of the task to update.
            new_title: The new title for the task.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundError: If task doesn't exist.
            ValidationError: If new title is invalid.
        """
        task = self._repository.get(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)

        new_title = self._validate_title(new_title)
        updated_task = Task(
            id=task.id,
            title=new_title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at
        )
        return self._repository.update(updated_task)

    def toggle_task(self, task_id: int) -> Task:
        """Toggle a task's completion status.

        Args:
            task_id: The ID of the task to toggle.

        Returns:
            The updated task.

        Raises:
            TaskNotFoundError: If task doesn't exist.
        """
        task = self._repository.get(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)

        updated_task = Task(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=not task.completed,
            created_at=task.created_at
        )
        return self._repository.update(updated_task)

    @property
    def repository(self) -> TaskRepository:
        """Get the repository (for persistence operations)."""
        return self._repository
