import { useNavigate } from "react-router-dom";
import StatTile from "../components/StatTile.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useStats } from "../context/StatsContext.jsx";

function scoreTone(percent, hasData) {
  if (!hasData) return "neutral";
  if (percent >= 80) return "good";
  if (percent >= 50) return "warning";
  return "critical";
}

export default function Stats() {
  const {
    flashcardsGenerated,
    quizAttempts,
    questionsAnswered,
    correctAnswers,
    highestScorePercent,
    averageScorePercent,
    accuracyPercent,
    resetStats,
  } = useStats();
  const navigate = useNavigate();

  const hasActivity = flashcardsGenerated > 0 || quizAttempts > 0;

  if (!hasActivity) {
    return (
      <div className="px-4 py-12">
        <EmptyState
          icon="📊"
          title="No study activity yet"
          subtitle="Generate flashcards and take a quiz to start building your stats."
          action={
            <button
              onClick={() => navigate("/")}
              className="mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2"
            >
              Go to Home
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-12 animate-[fadeIn_0.2s_ease-out]">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">📚 Study Statistics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your lifetime progress in StudySpark AI</p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatTile icon="🗂️" label="Flashcards generated" value={flashcardsGenerated} />
        <StatTile icon="📝" label="Quiz attempts" value={quizAttempts} />
        <StatTile
          icon="📈"
          label="Average score"
          value={`${averageScorePercent}%`}
          tone={scoreTone(averageScorePercent, quizAttempts > 0)}
        />
        <StatTile
          icon="🏆"
          label="Highest score"
          value={`${highestScorePercent}%`}
          tone={scoreTone(highestScorePercent, quizAttempts > 0)}
        />
        <StatTile icon="❓" label="Questions answered" value={questionsAnswered} />
        <StatTile icon="✅" label="Correct answers" value={correctAnswers} />
        <StatTile
          icon="🎯"
          label="Accuracy"
          value={`${accuracyPercent}%`}
          tone={scoreTone(accuracyPercent, questionsAnswered > 0)}
        />
      </div>

      <button
        onClick={resetStats}
        className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm text-slate-500 dark:text-slate-400"
      >
        Reset statistics
      </button>
    </div>
  );
}
