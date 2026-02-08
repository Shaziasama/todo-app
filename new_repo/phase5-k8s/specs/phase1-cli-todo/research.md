# Research: Phase I - In-Memory Python Console Todo App

**Feature**: phase1-cli-todo
**Date**: 2025-12-29
**Status**: Complete

## Research Summary

All technical decisions for Phase I have been resolved based on constitution requirements and best practices.

---

## Decision 1: Python Version and Type Hints

**Decision**: Python 3.13+ with full type annotations

**Rationale**:
- Constitution mandates Python 3.13+ for backend
- Modern type hints improve code quality and IDE support
- Dataclasses with `@dataclass` decorator for models

**Alternatives Considered**:
- Python 3.11/3.12: Rejected - constitution specifies 3.13+
- No type hints: Rejected - constitution requires type annotations

---

## Decision 2: Project Structure Pattern

**Decision**: Hexagonal/Clean Architecture with single-project layout

**Rationale**:
- Constitution Principle IV requires Clean & Hexagonal Architecture
- Phase I is a CLI app - single project structure appropriate
- Domain layer (models) → Application layer (services) → Infrastructure layer (repository, CLI)

**Alternatives Considered**:
- Flat structure: Rejected - violates separation of concerns
- Multi-package monorepo: Rejected - over-engineering for Phase I

---

## Decision 3: Package Manager

**Decision**: UV (as per constitution)

**Rationale**:
- Constitution mandates UV as Python package manager
- Fast, modern replacement for pip/poetry
- Simple `uv init` and `uv add` workflow

**Alternatives Considered**:
- pip: Rejected - constitution specifies UV
- poetry: Rejected - constitution specifies UV

---

## Decision 4: Storage Mechanism

**Decision**: In-memory list with optional JSON file persistence

**Rationale**:
- Phase I focus is on CLI and domain logic, not database
- In-memory keeps scope minimal
- JSON persistence prepares for Phase II migration to PostgreSQL
- Repository pattern enables easy swap to SQLModel later

**Alternatives Considered**:
- SQLite: Rejected - adds complexity, SQLModel/PostgreSQL in Phase II
- No persistence: Acceptable for MVP, but JSON adds minimal overhead

---

## Decision 5: CLI Command Parsing

**Decision**: Manual string parsing with simple split

**Rationale**:
- REPL loop with input() function
- Commands are simple: `<command> [arg1] [arg2]`
- argparse adds complexity unnecessary for 8 commands
- Keeps dependencies minimal (no external CLI libraries)

**Alternatives Considered**:
- argparse: Rejected - overkill for interactive REPL
- click/typer: Rejected - constitution doesn't allow additional frameworks without amendment
- rich: Could be used for pretty tables but adds dependency

---

## Decision 6: Output Formatting

**Decision**: Simple formatted string tables using Python f-strings

**Rationale**:
- No external dependencies required
- Sufficient for Phase I requirements
- Easy to read and maintain

**Alternatives Considered**:
- rich library: Rejected - adds dependency not in constitution
- tabulate: Rejected - same reason
- Plain print: Less readable, rejected

---

## Decision 7: ID Generation

**Decision**: Auto-incrementing integer starting from 1

**Rationale**:
- Simple and predictable for CLI users
- Track max_id in repository
- When loading from JSON, recalculate max_id from existing tasks

**Alternatives Considered**:
- UUID: Rejected - harder to type in CLI
- Timestamp-based: Rejected - not user-friendly

---

## Decision 8: Error Handling Strategy

**Decision**: Custom exceptions with user-friendly messages

**Rationale**:
- Constitution requires explicit, user-friendly error handling
- TaskNotFoundError, InvalidInputError, etc.
- Service layer catches and translates to user messages

**Alternatives Considered**:
- Generic exceptions: Rejected - not user-friendly
- Result types: Over-engineering for Phase I

---

## Resolved NEEDS CLARIFICATION Items

| Item | Resolution |
|------|------------|
| Language/Version | Python 3.13+ (constitution) |
| Primary Dependencies | None (stdlib only) |
| Storage | In-memory list + optional JSON |
| Testing | pytest (optional for hackathon) |
| Target Platform | Cross-platform CLI (Windows/Linux/macOS) |
| Project Type | Single project |
| Performance Goals | <100ms response per command |
| Constraints | Minimal dependencies, clean architecture |
| Scale/Scope | Single-user CLI, ~100 tasks max |
