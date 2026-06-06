from pathlib import Path
import re
import sys


REQUIRED_ARCHITECTURE_HEADINGS = [
    "# Project Architecture",
    "## Current Architecture",
    "## Planned Architecture",
    "## Architecture Decisions",
    "## Architecture Change Log",
]

REQUIRED_TODO_HEADINGS = [
    "# Project TODO",
    "## Active",
    "## Recently Completed",
]


def find_repo_root() -> Path:
    current = Path.cwd().resolve()
    for candidate in [current, *current.parents]:
        if (candidate / ".git").exists():
            return candidate
    raise RuntimeError("Run this script from inside the project repository.")


def validate_headings(path: Path, headings: list[str]) -> list[str]:
    if not path.exists():
        return [f"Missing required file: {path.name}"]

    text = path.read_text(encoding="utf-8")
    return [
        f"{path.name} is missing heading: {heading}"
        for heading in headings
        if heading not in text
    ]


def validate_todo_ids(path: Path) -> list[str]:
    if not path.exists():
        return []

    text = path.read_text(encoding="utf-8")
    ids = re.findall(r"\bKC-\d{3}\b", text)
    duplicates = sorted({item_id for item_id in ids if ids.count(item_id) > 1})
    return [f"TODO ID appears more than once: {item_id}" for item_id in duplicates]


def main() -> int:
    root = find_repo_root()
    architecture = root / "ARCHITECTURE.md"
    todo = root / "TODO.md"

    errors = []
    errors.extend(validate_headings(architecture, REQUIRED_ARCHITECTURE_HEADINGS))
    errors.extend(validate_headings(todo, REQUIRED_TODO_HEADINGS))
    errors.extend(validate_todo_ids(todo))

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print("Project architecture and TODO documents are valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
