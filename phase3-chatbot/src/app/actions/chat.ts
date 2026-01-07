"use server";

import { getLocalAIClient, localAIConfig } from "@/lib/localai";
import { prisma } from "@/lib/prisma";
import { logTelemetryEvent, measureDurationAsync } from "@/lib/telemetry";
import type { ChatMessage } from "@/lib/messages";
import {
  addTodo,
  listTodos,
  updateTodo,
  toggleComplete,
  deleteTodo,
} from "./tools";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface RunChatTurnInput {
  userId: string;
  userMessage: string;
  conversationHistory: ConversationMessage[];
}

interface RunChatTurnResult {
  success: boolean;
  messages: ChatMessage[];
  error?: string;
}

// Tool definitions for LocalAI function calling
const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "addTodo",
      description: "Add a new todo item to the user's list",
      parameters: {
        type: "object" as const,
        properties: {
          title: {
            type: "string",
            description: "The title of the todo (required)",
          },
          description: {
            type: "string",
            description: "Optional description for the todo",
          },
        },
        required: ["title"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "listTodos",
      description: "List todos for the user, optionally filtered by status",
      parameters: {
        type: "object" as const,
        properties: {
          status: {
            type: "string",
            enum: ["all", "completed", "incomplete"],
            description: "Filter by completion status (default: all)",
          },
          limit: {
            type: "number",
            description: "Maximum number of todos to return (1-100, default: 10)",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "updateTodo",
      description: "Update the title and/or description of an existing todo",
      parameters: {
        type: "object" as const,
        properties: {
          id: {
            type: "string",
            description: "The ID of the todo to update",
          },
          title: {
            type: "string",
            description: "The new title for the todo",
          },
          description: {
            type: "string",
            description: "The new description for the todo",
          },
        },
        required: ["id", "title"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "toggleComplete",
      description: "Mark a todo as complete or incomplete",
      parameters: {
        type: "object" as const,
        properties: {
          id: {
            type: "string",
            description: "The ID of the todo to toggle",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "deleteTodo",
      description: "Delete a todo from the user's list",
      parameters: {
        type: "object" as const,
        properties: {
          id: {
            type: "string",
            description: "The ID of the todo to delete",
          },
        },
        required: ["id"],
      },
    },
  },
];

async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    switch (toolName) {
      case "addTodo":
        return await addTodo(userId, toolInput as { title: string; description?: string });
      case "listTodos":
        return await listTodos(userId, toolInput as { status?: "all" | "completed" | "incomplete"; limit?: number });
      case "updateTodo":
        return await updateTodo(userId, toolInput as { id: string; title: string; description?: string });
      case "toggleComplete":
        return await toggleComplete(userId, toolInput as { id: string });
      case "deleteTodo":
        return await deleteTodo(userId, toolInput as { id: string });
      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    return {
      success: false,
      error: `Tool execution failed: ${String(error)}`,
    };
  }
}

export async function runChatTurn({
  userId,
  userMessage,
  conversationHistory,
}: RunChatTurnInput): Promise<RunChatTurnResult> {
  const messages: ChatMessage[] = [];

  try {
    // Check LocalAI health
    const client = getLocalAIClient();

    // Save user message
    const savedUserMessage = await prisma.message.create({
      data: {
        userId,
        role: "user",
        content: userMessage,
      },
    });

    messages.push({
      id: savedUserMessage.id,
      role: "user",
      content: userMessage,
      createdAt: savedUserMessage.createdAt,
    });

    // Build messages for API call
    const apiMessages = [
      ...conversationHistory,
      { role: "user" as const, content: userMessage },
    ];

    // Call LocalAI with tools
    const { result: response, durationMs } = await measureDurationAsync(
      async () => {
        return await client.chat.completions.create({
          model: localAIConfig.model,
          messages: apiMessages,
          tools: TOOLS as any,
          tool_choice: "auto",
          temperature: localAIConfig.temperature,
          max_tokens: localAIConfig.maxTokens,
        });
      }
    );

    await logTelemetryEvent({
      userId,
      category: "localai",
      name: "chat_completion",
      metadata: { toolCalls: response.choices[0]?.message?.tool_calls?.length || 0 },
      durationMs,
    });

    const assistantMessage = response.choices[0]?.message;
    if (!assistantMessage) {
      return {
        success: false,
        messages,
        error: "No response from LocalAI",
      };
    }

    // Save assistant message
    const savedAssistantMessage = await prisma.message.create({
      data: {
        userId,
        role: "assistant",
        content: assistantMessage.content || "",
      },
    });

    messages.push({
      id: savedAssistantMessage.id,
      role: "assistant",
      content: assistantMessage.content || "",
      createdAt: savedAssistantMessage.createdAt,
    });

    // Process tool calls if any
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== "function") continue;

        const { name, arguments: argsStr } = toolCall.function;
        const { id } = toolCall;

        try {
          const toolArgs = typeof argsStr === "string" ? JSON.parse(argsStr) : argsStr;
          const toolResult = await executeTool(name, toolArgs as Record<string, unknown>, userId);

          // Save tool invocation
          await prisma.toolInvocation.create({
            data: {
              userId,
              toolName: name as any,
              requestId: id,
              inputPayload: toolArgs as any,
              resultPayload: toolResult.data as any,
              status: toolResult.success ? "SUCCESS" : "FAILED",
              errorMessage: toolResult.error || undefined,
            },
          });

          // Save tool result as message
          const toolResultMessage = await prisma.message.create({
            data: {
              userId,
              role: "tool",
              content: JSON.stringify(toolResult.data || { error: toolResult.error }),
              metadata: {
                toolName: name,
                result: toolResult.data,
              } as any,
            },
          });

          messages.push({
            id: toolResultMessage.id,
            role: "tool",
            content: JSON.stringify(toolResult.data || { error: toolResult.error }),
            metadata: {
              toolName: name,
              result: toolResult.data,
            },
            createdAt: toolResultMessage.createdAt,
          });
        } catch (error) {
          console.error(`Error processing tool call ${name}:`, error);
        }
      }
    }

    return {
      success: true,
      messages,
    };
  } catch (error) {
    console.error("Error in runChatTurn:", error);

    await logTelemetryEvent({
      userId,
      category: "localai",
      name: "chat_error",
      metadata: { error: String(error) },
    });

    return {
      success: false,
      messages,
      error: error instanceof Error ? error.message : "Failed to process message",
    };
  }
}
