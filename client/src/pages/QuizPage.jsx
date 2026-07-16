import { useNavigate } from "react-router-dom";
import Quiz from "../components/Quiz.jsx";
import { Spinner } from "../components/Loading.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useStudy } from "../context/StudyContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function QuizPage() {
  const { quiz, activeQuiz, loading, error, regenQuiz, retry } = useStudy();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRegenerate = async () => {
    try {
      const result = await regenQuiz();
      if (result) showToast("New quiz generated!", "success");
    } catch {
      showToast("Couldn't regenerate the quiz.", "error");
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-12">
        <Spinner label="Generating quiz…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-12">
        <ErrorBox error={error} onRetry={retry} />
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return (
      <div className="px-4 py-12">
        <EmptyState
          icon="❓"
          title="No quiz yet"
          subtitle="Generate a quiz from your notes first."
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
      <h1 className="text-2xl sm:text-3xl font-bold">Quiz</h1>

      <Quiz key={activeQuiz} />

      <button
        onClick={handleRegenerate}
        className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        🔄 Regenerate Quiz
      </button>
    </div>
  );
}
