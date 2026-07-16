import Groq from "groq-sdk";

const REQUEST_TIMEOUT_MS = 20000;
const MODEL_NAME = "llama-3.3-70b-versatile";

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

export class RateLimitError extends Error {
  constructor(message = "The AI service is rate-limited or out of quota. Please wait a moment and try again.") {
    super(message);
    this.name = "RateLimitError";
    this.statusCode = 429;
  }
}

function extractMessage(err) {
  const raw = err?.error?.message || err?.message;
  if (typeof raw !== "string") return "Unknown error calling the AI service.";
  // groq-sdk prefixes messages with the numeric status, e.g. "429 Rate limit reached...".
  return raw.replace(/^\d{3}\s/, "");
}

let client = null;

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    const err = new Error("GROQ_API_KEY is not configured on the server.");
    err.name = "ConfigError";
    err.statusCode = 500;
    throw err;
  }
  if (!client) {
    client = new Groq({ apiKey });
  }
  return client;
}

export async function generateContent(prompt) {
  const groq = getClient();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const completion = await groq.chat.completions.create(
      {
        model: MODEL_NAME,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "Return ONLY valid JSON. Do not include markdown code fences, explanations, or any text outside the JSON object.",
          },
          { role: "user", content: prompt },
        ],
      },
      { signal: controller.signal }
    );
    return completion.choices[0]?.message?.content ?? "";
  } catch (err) {
    if (controller.signal.aborted) {
      throw new TimeoutError();
    }
    if (err.status === 429) {
      throw new RateLimitError(extractMessage(err));
    }
    throw new AIServiceError(extractMessage(err));
  } finally {
    clearTimeout(timer);
  }
}
