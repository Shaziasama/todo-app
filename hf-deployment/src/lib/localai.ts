import OpenAI from "openai";

const baseURL = process.env.LOCALAI_BASE_URL || process.env.OPENAI_API_BASE || "http://127.0.0.1:8080/v1";
const model = process.env.LOCALAI_MODEL || "gpt-3.5-turbo";
const temperature = parseFloat(process.env.LOCALAI_TEMPERATURE || "0.3");
const maxTokens = parseInt(process.env.LOCALAI_MAX_TOKENS || "1024", 10);
const apiKey = process.env.OPENAI_API_KEY || process.env.LOCALAI_API_KEY || "not-needed";

let clientInstance: OpenAI | null = null;

export function getLocalAIClient(): OpenAI {
  if (!clientInstance) {
    clientInstance = new OpenAI({
      baseURL,
      apiKey,
    });
  }
  return clientInstance;
}

export async function healthCheckLocalAI(): Promise<boolean> {
  try {
    const client = getLocalAIClient();
    // Attempt a simple API call to verify connectivity
    await client.models.list();
    return true;
  } catch (error) {
    console.error("LocalAI health check failed:", error);
    return false;
  }
}

export const localAIConfig = {
  baseURL,
  model,
  temperature,
  maxTokens,
};
