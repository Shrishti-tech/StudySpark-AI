import { generateContent } from "../services/geminiService.js";
import { buildFullPrompt, buildFlashcardsPrompt, buildQuizPrompt } from "../utils/promptBuilder.js";
import { parseJSON, validateFlashcards, validateQuiz } from "../utils/validateResponse.js";

function requireSource(req) {
  const { notes, topic } = req.body;
  const hasNotes = typeof notes === "string" && notes.trim().length > 0;
  const hasTopic = typeof topic === "string" && topic.trim().length > 0;

  if (!hasNotes && !hasTopic) {
    const err = new Error("Provide either \"notes\" or \"topic\" in the request body.");
    err.name = "BadRequestError";
    err.statusCode = 400;
    throw err;
  }

  return { notes, topic };
}

export async function generate(req, res, next) {
  try {
    const { notes, topic } = requireSource(req);
    const { flashcardCount, quizCount } = req.body;

    const prompt = buildFullPrompt({ notes, topic, flashcardCount, quizCount });
    const rawText = await generateContent(prompt);
    const data = parseJSON(rawText);

    const flashcards = validateFlashcards(data.flashcards);
    const quiz = validateQuiz(data.quiz);

    res.json({ flashcards, quiz });
  } catch (err) {
    next(err);
  }
}

export async function generateFlashcards(req, res, next) {
  try {
    const { notes, topic } = requireSource(req);
    const { count } = req.body;

    const prompt = buildFlashcardsPrompt({ notes, topic, count });
    const rawText = await generateContent(prompt);
    const data = parseJSON(rawText);

    const flashcards = validateFlashcards(data.flashcards);

    res.json({ flashcards });
  } catch (err) {
    next(err);
  }
}

export async function generateQuiz(req, res, next) {
  try {
    const { notes, topic } = requireSource(req);
    const { count } = req.body;

    const prompt = buildQuizPrompt({ notes, topic, count });
    const rawText = await generateContent(prompt);
    const data = parseJSON(rawText);

    const quiz = validateQuiz(data.quiz);

    res.json({ quiz });
  } catch (err) {
    next(err);
  }
}
