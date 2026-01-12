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
import { ToolName } from "@prisma/client";

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
            description: "The ID of the todo to update (optional if title is provided)",
          },
          title: {
            type: "string",
            description: "The current title of the todo to update (optional if id is provided)",
          },
          newTitle: {
            type: "string",
            description: "The new title for the todo (optional)",
          },
          description: {
            type: "string",
            description: "The new description for the todo (optional)",
          },
        },
        required: [],
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
            description: "The ID of the todo to toggle (optional if title is provided)",
          },
          title: {
            type: "string",
            description: "The title of the todo to toggle (optional if id is provided)",
          },
        },
        required: [],
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
            description: "The ID of the todo to delete (optional if title is provided)",
          },
          title: {
            type: "string",
            description: "The title of the todo to delete (optional if id is provided)",
          },
        },
        required: [],
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
        return await updateTodo(userId, toolInput as { id?: string; title: string; newTitle?: string; description?: string });
      case "toggleComplete":
        return await toggleComplete(userId, toolInput as { id?: string; title?: string });
      case "deleteTodo":
        return await deleteTodo(userId, toolInput as { id?: string; title?: string });
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

    // Mock Mode Logic (If connection likely to fail)
    // Try to connect with short timeout, if fails, return mock response instead of hanging
    const isLocalAIRunning = await fetch(`${localAIConfig.baseURL}/models`)
      .then(() => true)
      .catch(() => false);

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

    if (!isLocalAIRunning) {
      console.warn("⚠️ LocalAI is not reachable. Using Smart Mock Response.");

      // SMART MOCK LOGIC: Regex-based intent detection
      const lowerMsg = userMessage.toLowerCase();
      let toolName = "";
      let toolArgs: any = {};
      let responseText = "";
      let mockToolResultData: any = null;

      if (lowerMsg.startsWith("add ") || lowerMsg.startsWith("create ")) {
        toolName = "addTodo";
        const match = userMessage.match(/^(add|create)\s+(.*?)(?:\s+with description\s+(.*))?$/i);
        if (match) {
          const title = match[2].trim();
          const description = match[3] ? match[3].trim() : undefined;
          toolArgs = { title, description };
          responseText = `I've added "${title}"${description ? ` with description "${description}"` : ""} to your list.`;
        } else {
          toolName = ""; // Invalid "add" command
        }
      } else if (lowerMsg.includes("show my todos") || lowerMsg.includes("list my todos") || lowerMsg.includes("what are my todos") || lowerMsg.includes("list") || lowerMsg.includes("show list")) {
        toolName = "listTodos";
        toolArgs = {};
        // Placeholder, will be replaced with actual list if tool execution succeeds
        responseText = "Here are your todos:";
      } else if (lowerMsg.startsWith("delete ") || lowerMsg.startsWith("remove ")) {
        // Extract the title of the todo to delete
        const match = userMessage.match(/^(delete|remove)\s+(.+)$/i);
        if (match) {
          const title = match[2].trim();
          toolArgs = { title };
          toolName = "deleteTodo";
          responseText = `I've deleted "${title}" from your list.`;
        } else {
          responseText = "Please specify which todo you'd like to delete.";
        }
      } else if (lowerMsg.includes("update ") || lowerMsg.includes("change ")) {
        // Extract the title of the todo to update and the new details
        const match = userMessage.match(/^(update|change)\s+"?([^"]+)"?\s+to\s+"?([^"]+)"?/i);
        if (match) {
          const currentTitle = match[2].trim();
          const newTitle = match[3].trim();
          toolArgs = { title: currentTitle, newTitle };
          toolName = "updateTodo";
          responseText = `I've updated "${currentTitle}" to "${newTitle}".`;
        } else {
          responseText = "Please specify which todo you'd like to update and what to change it to.";
        }
      } else if (lowerMsg.includes("complete ") || lowerMsg.includes("toggle ") || lowerMsg.includes("mark as complete") || lowerMsg.includes("mark complete")) {
        // Extract the title of the todo to mark as complete
        const match = userMessage.match(/^(complete|toggle|mark as complete|mark complete)\s+"?([^"]+)"?/i);
        if (match) {
          const title = match[2].trim();
          toolArgs = { title };
          toolName = "toggleComplete";
          responseText = `I've marked "${title}" as complete.`;
        } else {
          responseText = "Please specify which todo you'd like to mark as complete.";
        }
      } else {
        responseText = `I received: "${userMessage}". I can help you manage your tasks by adding, listing, updating, or deleting todos.`;
      }

      // If we detected a tool, execute it!
      if (toolName) {
        try {
          const toolResult = await executeTool(toolName, toolArgs, userId);

          if (toolResult.success && toolName === "listTodos") {
            mockToolResultData = toolResult.data;
            if (Array.isArray(mockToolResultData) && mockToolResultData.length > 0) {
              // Format response for listTodos to indicate that it contains todos
              responseText = "Here are your todos:"; // This will be followed by the tool result card
            } else {
              responseText = "You don't have any todos yet!";
            }
          } else if (!toolResult.success) {
            responseText = `Failed to execute action locally: ${toolResult.error}`;
          }

          // Save tool result as message
          const savedToolMessage = await prisma.message.create({
            data: {
              userId,
              role: "tool",
              content: JSON.stringify(toolResult.data),
              metadata: {
                toolName,
                result: toolResult.data,
              } as any,
            },
          });

          // Append to messages array to show immediately
          messages.push({
            id: savedToolMessage.id,
            role: "tool",
            content: JSON.stringify(toolResult.data),
            metadata: { toolName, result: toolResult.data },
            createdAt: savedToolMessage.createdAt,
          });
        } catch (e) {
          console.error("Smart mock tool failed", e);
          responseText += "\n(Failed to execute action locally)";
        }
      }

      const savedMockMessage = await prisma.message.create({
        data: {
          userId,
          role: "assistant",
          content: responseText,
        },
      });

      messages.push({
        id: savedMockMessage.id,
        role: "assistant",
        content: responseText,
        createdAt: savedMockMessage.createdAt,
      });

      return { success: true, messages };
    }

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
          tools: TOOLS,
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
              toolName: name as ToolName,
              requestId: id,
              inputPayload: toolArgs,
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
