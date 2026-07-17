import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateContent, regenerateFlashcards, regenerateQuiz } from "../services/api.js";
import { parseIfString, validateFlashcards, validateQuiz } from "../utils/validateJSON.js";
import { useAI } from "../hooks/useAI.js";
import { useStats } from "./StatsContext.jsx";

const STORAGE_KEY = "studyspark-session";

const StudyContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

let idCounter = 0;
function withIds(cards) {
  return cards.map((card) => (card.id ? card : { ...card, id: `card-${Date.now()}-${idCounter++}` }));
}

function transformGenerateResult(raw) {
  return {
    flashcards: withIds(validateFlashcards(parseIfString(raw?.flashcards))),
    quiz: validateQuiz(parseIfString(raw?.quiz)),
  };
}

function transformFlashcardsResult(raw) {
  return withIds(validateFlashcards(parseIfString(raw?.flashcards)));
}

function transformQuizResult(raw) {
  return validateQuiz(parseIfString(raw?.quiz));
}

export function StudyProvider({ children }) {
  const saved = loadSession();
  const stats = useStats();

  const [notes, setNotes] = useState(saved?.notes || "");
  const [topic, setTopic] = useState(saved?.topic || "");
  const [flashcards, setFlashcards] = useState(() => (saved?.flashcards ? withIds(saved.flashcards) : null));
  const [quiz, setQuiz] = useState(saved?.quiz || null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const ai = useAI();

  useEffect(() => {
    if (!flashcards && !quiz) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, topic, flashcards, quiz }));
    } catch {
      // localStorage unavailable (e.g. private mode) - session save is best-effort
    }
  }, [notes, topic, flashcards, quiz]);

  const applyResult = useCallback(
    (action, result) => {
      if (!result) return;
      if (action === "generate") {
        setFlashcards(result.flashcards);
        setQuiz(result.quiz);
        setQuizAnswers({});
        setScore(null);
        setWrongQuestions([]);
        setIsRetryMode(false);
        stats.recordFlashcardsGenerated(result.flashcards.length);
      } else if (action === "flashcards") {
        setFlashcards(result);
        stats.recordFlashcardsGenerated(result.length);
      } else if (action === "quiz") {
        setQuiz(result);
        setQuizAnswers({});
        setScore(null);
        setWrongQuestions([]);
        setIsRetryMode(false);
      }
    },
    [stats]
  );

  const generate = useCallback(
    async ({ notes: n, topic: t }) => {
      setNotes(n);
      setTopic(t);
      setLastAction("generate");
      const result = await ai.run(generateContent, { notes: n, topic: t }, transformGenerateResult);
      applyResult("generate", result);
      return result;
    },
    [ai, applyResult]
  );

  const regenFlashcards = useCallback(async () => {
    setLastAction("flashcards");
    const result = await ai.run(regenerateFlashcards, { notes, topic }, transformFlashcardsResult);
    applyResult("flashcards", result);
    return result;
  }, [ai, notes, topic, applyResult]);

  const regenQuiz = useCallback(async () => {
    setLastAction("quiz");
    const result = await ai.run(regenerateQuiz, { notes, topic }, transformQuizResult);
    applyResult("quiz", result);
    return result;
  }, [ai, notes, topic, applyResult]);

  const retry = useCallback(async () => {
    const result = await ai.retry();
    applyResult(lastAction, result);
    return result;
  }, [ai, lastAction, applyResult]);

  const answerQuestion = useCallback((index, selectedOption) => {
    setQuizAnswers((prev) => ({ ...prev, [index]: selectedOption }));
  }, []);

  const activeQuiz = useMemo(() => {
    if (isRetryMode) return wrongQuestions;
    return quiz || [];
  }, [isRetryMode, wrongQuestions, quiz]);

  const submitQuiz = useCallback(() => {
    const list = activeQuiz;
    let correct = 0;
    const wrong = [];

    list.forEach((question, index) => {
      const userAnswer = quizAnswers[index];
      if (userAnswer === question.answer) {
        correct += 1;
      } else {
        wrong.push(question);
      }
    });

    setScore({ correct, total: list.length });
    setWrongQuestions(wrong);
    stats.recordQuizAttempt({ correct, total: list.length });
    return { correct, total: list.length, wrong };
  }, [activeQuiz, quizAnswers, stats]);

  const updateFlashcard = useCallback((id, updates) => {
    setFlashcards((prev) => (prev ? prev.map((card) => (card.id === id ? { ...card, ...updates } : card)) : prev));
  }, []);

  const deleteFlashcard = useCallback((id) => {
    setFlashcards((prev) => (prev ? prev.filter((card) => card.id !== id) : prev));
  }, []);

  const retryWrongQuestions = useCallback(() => {
    setIsRetryMode(true);
    setQuizAnswers({});
    setScore(null);
  }, []);

  const clearSession = useCallback(() => {
    setNotes("");
    setTopic("");
    setFlashcards(null);
    setQuiz(null);
    setQuizAnswers({});
    setScore(null);
    setWrongQuestions([]);
    setIsRetryMode(false);
    ai.reset();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [ai]);

  const value = {
    notes,
    topic,
    flashcards,
    quiz,
    quizAnswers,
    score,
    wrongQuestions,
    isRetryMode,
    activeQuiz,
    loading: ai.loading,
    error: ai.error,
    generate,
    regenFlashcards,
    regenQuiz,
    retry,
    answerQuestion,
    submitQuiz,
    retryWrongQuestions,
    clearSession,
    updateFlashcard,
    deleteFlashcard,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error("useStudy must be used within a StudyProvider");
  return context;
}
