import { GoogleGenAI } from "@google/genai";

const REQUEST_TIMEOUT_MS = 20000;
const MODEL_NAME = "gemini-2.0-flash";

export class TimeoutError extends Error {
  constructor(message = "The AI request timed out.") {
    super(message);
    this.name = "TimeoutError";
    this.statusCode = 504;
  }
}

export class AIServiceError extends Error {
  constructor(message = "The AI service failed to respond.") {
    super(message);
    this.name = "AIServiceError";
    this.statusCode = 502;
  }
}

let client = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    const err = new Error("GEMINI_API_KEY is not configured on the server.");
    err.name = "ConfigError";
    err.statusCode = 500;
    throw err;
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export async function generateContent(prompt) {
  const ai = getClient();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { abortSignal: controller.signal },
    });
    return response.text;
  } catch (err) {
    if (controller.signal.aborted) {
      throw new TimeoutError();
    }
    throw new AIServiceError(err.message || "Unknown error calling the AI service.");
  } finally {
    clearTimeout(timer);
  }
}
