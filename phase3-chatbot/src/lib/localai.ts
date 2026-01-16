import OpenAI from "openai";
import Groq from "groq-sdk";

// Determine which client to use based on environment
const useGroq = process.env.USE_GROQ === "true";
const isLocalMode = process.env.LOCAL_MODE === "true";

let clientInstance: OpenAI | Groq | null = null;

export function getLLMClient() {
  if (clientInstance) {
    return clientInstance;
  }

  if (useGroq) {
    // Use Groq client
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is required when USE_GROQ=true");
    }

    clientInstance = new Groq({
      apiKey: apiKey,
    });
  } else {
    // Use OpenAI-compatible client (LocalAI)
    const baseURL = process.env.LOCALAI_BASE_URL || "http://127.0.0.1:8080/v1";
    const apiKey = process.env.LOCALAI_API_KEY || "not-needed"; // LocalAI doesn't require auth in default config

    clientInstance = new OpenAI({
      baseURL,
      apiKey,
    });
  }

  return clientInstance;
}

export async function healthCheckLLM(): Promise<boolean> {
  try {
    const client = getLLMClient();

    if (useGroq) {
      // Health check for Groq
      await (client as Groq).models.list();
    } else {
      // Health check for LocalAI
      await (client as OpenAI).models.list();
    }

    return true;
  } catch (error) {
    console.error("LLM health check failed:", error);
    return false;
  }
}

// Export configuration based on which client is being used
export const llmConfig = {
  model: useGroq
    ? process.env.GROQ_MODEL || "llama3-8b-8192"
    : process.env.LOCALAI_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct-Q4",
  temperature: parseFloat(useGroq
    ? process.env.GROQ_TEMPERATURE || "0.3"
    : process.env.LOCALAI_TEMPERATURE || "0.3"),
  maxTokens: parseInt(useGroq
    ? process.env.GROQ_MAX_TOKENS || "1024"
    : process.env.LOCALAI_MAX_TOKENS || "1024", 10),
};
