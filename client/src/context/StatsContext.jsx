import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "studyspark-stats";

const DEFAULT_STATS = {
  flashcardsGenerated: 0,
  quizAttempts: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  highestScorePercent: 0,
  scoreHistory: [],
};

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

const StatsContext = createContext(null);

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(loadStats);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // best-effort persistence
    }
  }, [stats]);

  const recordFlashcardsGenerated = useCallback((count) => {
    if (count <= 0) return;
    setStats((prev) => ({ ...prev, flashcardsGenerated: prev.flashcardsGenerated + count }));
  }, []);

  const recordQuizAttempt = useCallback(({ correct, total }) => {
    if (total <= 0) return;
    const percent = Math.round((correct / total) * 100);
    setStats((prev) => ({
      ...prev,
      quizAttempts: prev.quizAttempts + 1,
      questionsAnswered: prev.questionsAnswered + total,
      correctAnswers: prev.correctAnswers + correct,
      highestScorePercent: Math.max(prev.highestScorePercent, percent),
      scoreHistory: [...prev.scoreHistory, percent],
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const derived = useMemo(() => {
    const averageScorePercent = stats.scoreHistory.length
      ? Math.round(stats.scoreHistory.reduce((sum, v) => sum + v, 0) / stats.scoreHistory.length)
      : 0;
    const accuracyPercent = stats.questionsAnswered > 0
      ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
      : 0;
    return { averageScorePercent, accuracyPercent };
  }, [stats.scoreHistory, stats.questionsAnswered, stats.correctAnswers]);

  const value = {
    ...stats,
    ...derived,
    recordFlashcardsGenerated,
    recordQuizAttempt,
    resetStats,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
  const context = useContext(StatsContext);
  if (!context) throw new Error("useStats must be used within a StatsProvider");
  return context;
}
