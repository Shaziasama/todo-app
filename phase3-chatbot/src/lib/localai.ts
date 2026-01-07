import OpenAI from "openai";

const baseURL = process.env.LOCALAI_BASE_URL || "http://127.0.0.1:8080/v1";
const model = process.env.LOCALAI_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct-Q4";
const temperature = parseFloat(process.env.LOCALAI_TEMPERATURE || "0.3");
const maxTokens = parseInt(process.env.LOCALAI_MAX_TOKENS || "1024", 10);

let clientInstance: OpenAI | null = null;

export function getLocalAIClient(): OpenAI {
  if (!clientInstance) {
    clientInstance = new OpenAI({
      baseURL,
      apiKey: "not-needed", // LocalAI doesn't require auth in default config
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
