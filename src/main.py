"""Main entry point for Todo App.

This module contains the REPL (Read-Eval-Print Loop) that drives
the interactive command-line interface.
"""

import sys

from src.cli import CommandParser, Presenter
from src.exceptions import (
    InvalidIdError,
    TaskNotFoundError,
    TodoAppError,
    ValidationError,
)
from src.persistence import load_tasks, save_tasks
from src.repository import InMemoryTaskRepository
from src.service import TaskService


def parse_id(value: str) -> int:
    """Parse and validate task ID from string.

    Args:
        value: String value to parse.

    Returns:
        Integer task ID.

    Raises:
        InvalidIdError: If value is not a valid integer.
    """
    try:
        return int(value)
    except ValueError:
        raise InvalidIdError(value)


def handle_add(service: TaskService, args: list[str]) -> None:
    """Handle 'add' command."""
    if not args:
        Presenter.show_missing_argument("add", "<title>")
        return

    # Join all args as title (allows unquoted multi-word titles)
    title = " ".join(args)
    task = service.add_task(title)
    Presenter.task_created(task)


def handle_list(service: TaskService) -> None:
    """Handle 'list' command."""
    tasks = service.list_tasks()
    if tasks:
        Presenter.task_list(tasks)
    else:
        Presenter.empty_list()


def handle_done(service: TaskService, args: list[str]) -> None:
    """Handle 'done' command."""
    if not args:
        Presenter.show_missing_argument("done", "<id>")
        return

    task_id = parse_id(args[0])
    task = service.complete_task(task_id)
    Presenter.task_completed(task)


def handle_toggle(service: TaskService, args: list[str]) -> None:
    """Handle 'toggle' command."""
    if not args:
        Presenter.show_missing_argument("toggle", "<id>")
        return

    task_id = parse_id(args[0])
    task = service.toggle_task(task_id)
    Presenter.task_toggled(task)


def handle_delete(service: TaskService, args: list[str]) -> None:
    """Handle 'delete' command."""
    if not args:
        Presenter.show_missing_argument("delete", "<id>")
        return

    task_id = parse_id(args[0])
    service.delete_task(task_id)
    Presenter.task_deleted(task_id)


def handle_update(service: TaskService, args: list[str]) -> None:
    """Handle 'update' command."""
    if len(args) < 2:
        Presenter.show_missing_argument("update", "<id> <title>")
        return

    task_id = parse_id(args[0])
    new_title = " ".join(args[1:])
    task = service.update_task(task_id, new_title)
    Presenter.task_updated(task)


def run_repl(service: TaskService, enable_persistence: bool = True) -> None:
    """Run the main REPL loop.

    Args:
        service: The TaskService instance to use.
        enable_persistence: Whether to save tasks on exit.
    """
    Presenter.welcome()

    while True:
        try:
            user_input = Presenter.prompt()
            command = CommandParser.parse(user_input)

            if command is None:
                # Empty input, just show prompt again
                continue

            # Route command to handler
            match command.name:
                case "add":
                    handle_add(service, command.args)
                case "list" | "ls":
                    handle_list(service)
                case "done" | "complete":
                    handle_done(service, command.args)
                case "toggle":
                    handle_toggle(service, command.args)
                case "delete" | "del" | "rm":
                    handle_delete(service, command.args)
                case "update" | "edit":
                    handle_update(service, command.args)
                case "help" | "?":
                    Presenter.show_help()
                case "exit" | "quit" | "q":
                    if enable_persistence:
                        tasks = service.list_tasks()
                        repo = service.repository
                        if save_tasks(tasks, repo.next_id()):
                            Presenter.show_tasks_saved(len(tasks))
                    Presenter.show_goodbye()
                    break
                case _:
                    Presenter.show_unknown_command(command.name)

        except KeyboardInterrupt:
            print()  # Newline after ^C
            if enable_persistence:
                tasks = service.list_tasks()
                repo = service.repository
                if save_tasks(tasks, repo.next_id()):
                    Presenter.show_tasks_saved(len(tasks))
            Presenter.show_goodbye()
            break

        except InvalidIdError as e:
            Presenter.show_error(str(e))

        except TaskNotFoundError as e:
            Presenter.show_error(str(e))

        except ValidationError as e:
            Presenter.show_error(str(e))

        except TodoAppError as e:
            Presenter.show_error(str(e))


def main() -> int:
    """Main entry point.

    Returns:
        Exit code (0 for success).
    """
    # Initialize repository
    repository = InMemoryTaskRepository()

    # Load persisted tasks
    tasks, next_id = load_tasks()
    if tasks:
        repository.load_tasks(tasks)
        repository.set_next_id(next_id)
        Presenter.show_tasks_loaded(len(tasks))

    # Initialize service
    service = TaskService(repository)

    # Run REPL
    run_repl(service, enable_persistence=True)

    return 0


if __name__ == "__main__":
    sys.exit(main())
