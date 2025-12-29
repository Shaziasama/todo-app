"""CLI presentation layer for Todo App.

This module handles command parsing and output formatting.
It provides a clean separation between user interaction and business logic.
"""

import shlex
from dataclasses import dataclass
from typing import Optional

from src.models import Task


@dataclass
class Command:
    """Parsed command from user input.

    Attributes:
        name: The command name (e.g., 'add', 'list', 'done').
        args: List of arguments provided with the command.
    """
    name: str
    args: list[str]


class CommandParser:
    """Parses user input into Command objects."""

    @staticmethod
    def parse(user_input: str) -> Optional[Command]:
        """Parse user input into a Command.

        Handles quoted strings properly:
        - 'add "Buy groceries"' -> Command(name='add', args=['Buy groceries'])
        - 'add Buy groceries' -> Command(name='add', args=['Buy', 'groceries'])

        Args:
            user_input: Raw input string from user.

        Returns:
            Command object, or None if input is empty.
        """
        user_input = user_input.strip()
        if not user_input:
            return None

        try:
            # Use shlex to handle quoted strings
            parts = shlex.split(user_input)
        except ValueError:
            # If shlex fails (unbalanced quotes), fall back to simple split
            parts = user_input.split()

        if not parts:
            return None

        command_name = parts[0].lower()
        args = parts[1:]

        return Command(name=command_name, args=args)


class Presenter:
    """Formats output for display to the user.

    All output methods print directly to stdout following
    the contracts defined in cli-commands.md.
    """

    # Column widths for table formatting
    ID_WIDTH = 4
    STATUS_WIDTH = 8
    TITLE_WIDTH = 50

    @classmethod
    def welcome(cls) -> None:
        """Display welcome message."""
        print("Welcome to Todo App!")
        print("Type 'help' for available commands.")
        print()

    @classmethod
    def prompt(cls) -> str:
        """Display prompt and get user input.

        Returns:
            User input string.
        """
        try:
            return input("todo> ")
        except EOFError:
            return "exit"

    @classmethod
    def task_created(cls, task: Task) -> None:
        """Display task creation confirmation."""
        print(f"Task {task.id} created: {task.title}")

    @classmethod
    def task_list(cls, tasks: list[Task]) -> None:
        """Display formatted task list.

        Shows a table with ID, Status, and Title columns,
        plus a summary line with total and completed counts.
        """
        # Header
        print(f"{'ID':<{cls.ID_WIDTH}}  {'Status':<{cls.STATUS_WIDTH}}  {'Title':<{cls.TITLE_WIDTH}}")
        print(f"{'-' * cls.ID_WIDTH}  {'-' * cls.STATUS_WIDTH}  {'-' * cls.TITLE_WIDTH}")

        # Tasks
        for task in tasks:
            status = "[x]" if task.completed else "[ ]"
            # Truncate title if too long
            title = task.title[:cls.TITLE_WIDTH] if len(task.title) > cls.TITLE_WIDTH else task.title
            print(f"{task.id:<{cls.ID_WIDTH}}  {status:<{cls.STATUS_WIDTH}}  {title:<{cls.TITLE_WIDTH}}")

        # Summary
        print()
        completed_count = sum(1 for t in tasks if t.completed)
        print(f"Total: {len(tasks)} tasks ({completed_count} completed)")

    @classmethod
    def empty_list(cls) -> None:
        """Display message for empty task list."""
        print("No tasks found. Use 'add <title>' to create one.")

    @classmethod
    def task_completed(cls, task: Task) -> None:
        """Display task completion confirmation."""
        print(f"Task {task.id} marked as complete")

    @classmethod
    def task_toggled(cls, task: Task) -> None:
        """Display task toggle confirmation."""
        status = "complete" if task.completed else "incomplete"
        print(f"Task {task.id} marked as {status}")

    @classmethod
    def task_deleted(cls, task_id: int) -> None:
        """Display task deletion confirmation."""
        print(f"Task {task_id} deleted")

    @classmethod
    def task_updated(cls, task: Task) -> None:
        """Display task update confirmation."""
        print(f"Task {task.id} updated: {task.title}")

    @classmethod
    def show_help(cls) -> None:
        """Display help message with all available commands."""
        print("Todo App - Available Commands")
        print("=" * 30)
        print("  add <title>         Create a new task")
        print("  list                Show all tasks")
        print("  done <id>           Mark task as completed")
        print("  toggle <id>         Toggle task completion status")
        print("  delete <id>         Remove a task")
        print("  update <id> <title> Update task title")
        print("  help                Show this help message")
        print("  exit                Quit the application")

    @classmethod
    def show_error(cls, message: str) -> None:
        """Display error message."""
        print(f"Error: {message}")

    @classmethod
    def show_unknown_command(cls, command: str) -> None:
        """Display unknown command error."""
        print(f"Unknown command '{command}'. Type 'help' for available commands.")

    @classmethod
    def show_missing_argument(cls, command: str, argument: str) -> None:
        """Display missing argument error."""
        print(f"Error: {command} requires {argument}")

    @classmethod
    def show_goodbye(cls) -> None:
        """Display goodbye message."""
        print("Goodbye!")

    @classmethod
    def show_tasks_loaded(cls, count: int) -> None:
        """Display tasks loaded message."""
        if count > 0:
            print(f"Loaded {count} task(s) from file.")

    @classmethod
    def show_tasks_saved(cls, count: int) -> None:
        """Display tasks saved message."""
        if count > 0:
            print(f"Saved {count} task(s) to file.")
