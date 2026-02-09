"""Persistence layer for Todo App.

This module provides JSON file-based persistence for tasks.
Tasks are automatically loaded on startup and saved on exit.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any

from src.models import Task


# Default file path for task storage
DEFAULT_FILE_PATH = Path("./tasks.json")

# JSON schema version for forward compatibility
SCHEMA_VERSION = "1.0"


def _task_to_dict(task: Task) -> dict[str, Any]:
    """Convert Task to JSON-serializable dictionary.

    Args:
        task: The task to convert.

    Returns:
        Dictionary representation of the task.
    """
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "created_at": task.created_at.isoformat()
    }


def _dict_to_task(data: dict[str, Any]) -> Task:
    """Convert dictionary to Task object.

    Args:
        data: Dictionary with task data.

    Returns:
        Task object.
    """
    return Task(
        id=data["id"],
        title=data["title"],
        description=data.get("description"),
        completed=data.get("completed", False),
        created_at=datetime.fromisoformat(data["created_at"])
    )


def load_tasks(filepath: Path = DEFAULT_FILE_PATH) -> tuple[list[Task], int]:
    """Load tasks from JSON file.

    Args:
        filepath: Path to the JSON file.

    Returns:
        Tuple of (list of tasks, next_id value).
        Returns ([], 1) if file doesn't exist or is invalid.
    """
    if not filepath.exists():
        return [], 1

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Validate schema version
        version = data.get("version", "1.0")
        if not version.startswith("1."):
            print(f"Warning: Unknown schema version {version}, attempting to load anyway")

        tasks = [_dict_to_task(t) for t in data.get("tasks", [])]
        next_id = data.get("next_id", 1)

        # Ensure next_id is at least max(task.id) + 1
        if tasks:
            max_id = max(t.id for t in tasks)
            next_id = max(next_id, max_id + 1)

        return tasks, next_id

    except (json.JSONDecodeError, KeyError, TypeError, ValueError) as e:
        print(f"Warning: Could not load tasks from {filepath}: {e}")
        return [], 1


def save_tasks(
    tasks: list[Task],
    next_id: int,
    filepath: Path = DEFAULT_FILE_PATH
) -> bool:
    """Save tasks to JSON file.

    Args:
        tasks: List of tasks to save.
        next_id: Next ID value to persist.
        filepath: Path to the JSON file.

    Returns:
        True if saved successfully, False otherwise.
    """
    data = {
        "version": SCHEMA_VERSION,
        "next_id": next_id,
        "tasks": [_task_to_dict(t) for t in tasks]
    }

    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except (OSError, TypeError) as e:
        print(f"Warning: Could not save tasks to {filepath}: {e}")
        return False
