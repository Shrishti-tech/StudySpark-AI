import { GoogleGenerativeAI } from "@google/generative-ai";

const REQUEST_TIMEOUT_MS = 20000;
const MODEL_NAME = "gemini-1.5-flash";

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
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError()), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function generateContent(prompt) {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    const result = await withTimeout(model.generateContent(prompt), REQUEST_TIMEOUT_MS);
    return result.response.text();
  } catch (err) {
    if (err instanceof TimeoutError) throw err;
    throw new AIServiceError(err.message || "Unknown error calling the AI service.");
  }
}
