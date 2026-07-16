import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const REQUEST_TIMEOUT_MS = 25000;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

export class ApiError extends Error {
  constructor({ message, code, status, isTimeout = false, isNetworkError = false }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.isTimeout = isTimeout;
    this.isNetworkError = isNetworkError;
  }
}

function normalizeError(err) {
  if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
    return err;
  }

  if (err.code === "ECONNABORTED") {
    return new ApiError({
      message: "The request took too long to respond. Please try again.",
      code: "CLIENT_TIMEOUT",
      isTimeout: true,
    });
  }

  if (!err.response) {
    return new ApiError({
      message: "Could not reach the server. Check your connection and try again.",
      code: "NETWORK_ERROR",
      isNetworkError: true,
    });
  }

  const { status, data } = err.response;
  return new ApiError({
    message: data?.error || "Something went wrong. Please try again.",
    code: data?.code || "SERVER_ERROR",
    status,
    isTimeout: status === 504,
  });
}

async function post(path, body, signal) {
  try {
    const response = await client.post(path, body, { signal });
    return response.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export function generateContent({ notes, topic, flashcardCount, quizCount }, signal) {
  return post("/generate", { notes, topic, flashcardCount, quizCount }, signal);
}

export function regenerateFlashcards({ notes, topic, count }, signal) {
  return post("/flashcards", { notes, topic, count }, signal);
}

export function regenerateQuiz({ notes, topic, count }, signal) {
  return post("/quiz", { notes, topic, count }, signal);
}
