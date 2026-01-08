import { prisma } from "./prisma";

export type TelemetryCategory = "localai" | "tool" | "ui";

interface LogEventParams {
  userId?: string;
  category: TelemetryCategory;
  name: string;
  metadata?: Record<string, unknown>;
  durationMs?: number;
}

export async function logTelemetryEvent({
  userId,
  category,
  name,
  metadata,
  durationMs,
}: LogEventParams): Promise<void> {
  try {
    await prisma.telemetryEvent.create({
      data: {
        userId: userId || undefined,
        category,
        name,
        metadata: (metadata as any) || undefined,
        durationMs: durationMs || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log telemetry event:", error);
    // Don't throw; telemetry failures should not block main flow
  }
}

export function measureDuration<T>(
  fn: () => T
): { result: T; durationMs: number } {
  const startTime = Date.now();
  const result = fn();
  const durationMs = Date.now() - startTime;
  return { result, durationMs };
}

export async function measureDurationAsync<T>(
  fn: () => Promise<T>
): Promise<{ result: T; durationMs: number }> {
  const startTime = Date.now();
  const result = await fn();
  const durationMs = Date.now() - startTime;
  return { result, durationMs };
}
