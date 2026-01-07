"use server";

import { prisma } from "@/lib/prisma";
import { logTelemetryEvent } from "@/lib/telemetry";

interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export async function addTodo(
  userId: string,
  input: { title: string; description?: string }
): Promise<ToolResult> {
  try {
    if (!input.title || typeof input.title !== "string") {
      return { success: false, error: "Title is required" };
    }

    const title = input.title.trim();
    if (title.length === 0 || title.length > 200) {
      return {
        success: false,
        error: "Title must be between 1 and 200 characters",
      };
    }

    const description = input.description
      ? input.description.trim().slice(0, 1000)
      : null;

    const todo = await prisma.todo.create({
      data: {
        userId,
        title,
        description: description || undefined,
        completed: false,
      },
    });

    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "addTodo_success",
    });

    return {
      success: true,
      data: { id: todo.id, title: todo.title, description: todo.description },
    };
  } catch (error) {
    console.error("Error in addTodo:", error);
    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "addTodo_error",
      metadata: { error: String(error) },
    });
    return {
      success: false,
      error: "Failed to add todo. Please try again.",
    };
  }
}

export async function listTodos(
  userId: string,
  input: { status?: "all" | "completed" | "incomplete"; limit?: number }
): Promise<ToolResult> {
  try {
    const limit = Math.min(input.limit || 10, 100);
    const status = input.status || "all";

    const todos = await prisma.todo.findMany({
      where: {
        userId,
        ...(status === "completed" && { completed: true }),
        ...(status === "incomplete" && { completed: false }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "listTodos_success",
      metadata: { count: todos.length },
    });

    return {
      success: true,
      data: todos.map((t: typeof todos[0]) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        completed: t.completed,
      })),
    };
  } catch (error) {
    console.error("Error in listTodos:", error);
    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "listTodos_error",
      metadata: { error: String(error) },
    });
    return {
      success: false,
      error: "Failed to list todos. Please try again.",
    };
  }
}

export async function updateTodo(
  userId: string,
  input: { id: string; title: string; description?: string }
): Promise<ToolResult> {
  try {
    if (!input.id || !input.title) {
      return {
        success: false,
        error: "Todo ID and new title are required",
      };
    }

    const title = input.title.trim();
    if (title.length === 0 || title.length > 200) {
      return {
        success: false,
        error: "Title must be between 1 and 200 characters",
      };
    }

    const description = input.description
      ? input.description.trim().slice(0, 1000)
      : undefined;

    // Verify ownership
    const existing = await prisma.todo.findUnique({
      where: { id: input.id },
    });

    if (!existing || existing.userId !== userId) {
      return {
        success: false,
        error: "Todo not found or access denied",
      };
    }

    const updated = await prisma.todo.update({
      where: { id: input.id },
      data: {
        title,
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      },
    });

    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "updateTodo_success",
    });

    return {
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
      },
    };
  } catch (error) {
    console.error("Error in updateTodo:", error);
    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "updateTodo_error",
      metadata: { error: String(error) },
    });
    return {
      success: false,
      error: "Failed to update todo. Please try again.",
    };
  }
}

export async function toggleComplete(
  userId: string,
  input: { id: string }
): Promise<ToolResult> {
  try {
    if (!input.id) {
      return {
        success: false,
        error: "Todo ID is required",
      };
    }

    const existing = await prisma.todo.findUnique({
      where: { id: input.id },
    });

    if (!existing || existing.userId !== userId) {
      return {
        success: false,
        error: "Todo not found or access denied",
      };
    }

    const updated = await prisma.todo.update({
      where: { id: input.id },
      data: {
        completed: !existing.completed,
        updatedAt: new Date(),
      },
    });

    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "toggleComplete_success",
      metadata: { newStatus: updated.completed },
    });

    return {
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        completed: updated.completed,
      },
    };
  } catch (error) {
    console.error("Error in toggleComplete:", error);
    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "toggleComplete_error",
      metadata: { error: String(error) },
    });
    return {
      success: false,
      error: "Failed to toggle todo. Please try again.",
    };
  }
}

export async function deleteTodo(
  userId: string,
  input: { id: string }
): Promise<ToolResult> {
  try {
    if (!input.id) {
      return {
        success: false,
        error: "Todo ID is required",
      };
    }

    const existing = await prisma.todo.findUnique({
      where: { id: input.id },
    });

    if (!existing || existing.userId !== userId) {
      return {
        success: false,
        error: "Todo not found or access denied",
      };
    }

    await prisma.todo.delete({
      where: { id: input.id },
    });

    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "deleteTodo_success",
    });

    return {
      success: true,
      data: { id: input.id, deleted: true },
    };
  } catch (error) {
    console.error("Error in deleteTodo:", error);
    await logTelemetryEvent({
      userId,
      category: "tool",
      name: "deleteTodo_error",
      metadata: { error: String(error) },
    });
    return {
      success: false,
      error: "Failed to delete todo. Please try again.",
    };
  }
}
