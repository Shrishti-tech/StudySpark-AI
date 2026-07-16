import { useNavigate } from "react-router-dom";
import FlashCardList from "../components/FlashCardList.jsx";
import { Spinner } from "../components/Loading.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useStudy } from "../context/StudyContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Flashcards() {
  const { flashcards, loading, error, regenFlashcards, retry } = useStudy();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRegenerate = async () => {
    try {
      const result = await regenFlashcards();
      if (result) showToast("New flashcards generated!", "success");
    } catch {
      showToast("Couldn't regenerate flashcards.", "error");
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-12">
        <Spinner label="Generating flashcards…" />
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

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="px-4 py-12">
        <EmptyState
          icon="🗂️"
          title="No flashcards yet"
          subtitle="Generate flashcards from your notes first."
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
      <h1 className="text-2xl sm:text-3xl font-bold">Flashcards</h1>

      <FlashCardList flashcards={flashcards} />

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleRegenerate}
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          🔄 Regenerate Flashcards
        </button>
        <button
          onClick={() => navigate("/quiz")}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 transition-colors"
        >
          Start Quiz →
        </button>
      </div>
    </div>
  );
}
