"""Custom exceptions for Todo App.

This module defines domain-specific exceptions for clear error handling
following the constitution's requirement for explicit, user-friendly errors.
"""


class TodoAppError(Exception):
    """Base exception for all Todo App errors."""
    pass


class TaskNotFoundError(TodoAppError):
    """Raised when a task with the specified ID does not exist."""

    def __init__(self, task_id: int) -> None:
        self.task_id = task_id
        super().__init__(f"Task {task_id} not found")


class ValidationError(TodoAppError):
    """Raised when input validation fails."""

    def __init__(self, message: str) -> None:
        super().__init__(message)


class InvalidCommandError(TodoAppError):
    """Raised when an unknown or malformed command is entered."""

    def __init__(self, command: str) -> None:
        self.command = command
        super().__init__(f"Unknown command '{command}'. Type 'help' for available commands.")


class InvalidIdError(TodoAppError):
    """Raised when a non-numeric ID is provided."""

    def __init__(self, value: str) -> None:
        self.value = value
        super().__init__("ID must be a number")
