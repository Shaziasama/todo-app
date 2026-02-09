import { prisma } from "./prisma";
import type { Message, ToolInvocation } from "@prisma/client";

export type MessageWithTool = Message & {
  toolInvocation?: ToolInvocation | null;
};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export async function getMessages(
  userId: string,
  limit: number = 100
): Promise<ChatMessage[]> {
  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: limit,
    include: {
      toolInvocation: true,
    },
  });

  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    metadata: (msg.metadata as Record<string, unknown> | null) || undefined,
    createdAt: msg.createdAt,
  }));
}

export async function createMessage(
  userId: string,
  role: "user" | "assistant" | "tool" | "system",
  content: string,
  metadata?: Record<string, unknown>
) {
  return prisma.message.create({
    data: {
      userId,
      role,
      content,
      metadata: (metadata || undefined) as any,
    },
  });
}
