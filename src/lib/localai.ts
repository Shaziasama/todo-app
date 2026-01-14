import Groq from 'groq-sdk';

const isVercel = process.env.LOCAL_MODE === 'false';
const groqApiKey = process.env.GROQ_API_KEY;
const localAiUrl = process.env.LOCAL_AI_URL;

let groq: Groq | null = null;

if (isVercel && groqApiKey) {
  // Vercel (Groq API)
  groq = new Groq({ apiKey: groqApiKey });
} else if (!isVercel && localAiUrl) {
  // Local (LocalAI)
  groq = new Groq({ baseURL: localAiUrl, apiKey: "not-needed" });
}

export const ai = groq;
