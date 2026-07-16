import { useNavigate } from "react-router-dom";
import Result from "../components/Result.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useStudy } from "../context/StudyContext.jsx";

export default function Results() {
  const { score, wrongQuestions, retryWrongQuestions } = useStudy();
  const navigate = useNavigate();

  if (!score) {
    return (
      <div className="px-4 py-12">
        <EmptyState
          icon="📊"
          title="No results yet"
          subtitle="Complete a quiz first to see your score."
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

  const handleRetryWrong = () => {
    retryWrongQuestions();
    navigate("/quiz");
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-12 animate-[fadeIn_0.2s_ease-out]">
      <h1 className="text-2xl sm:text-3xl font-bold">Results</h1>
      <Result
        score={score}
        wrongQuestions={wrongQuestions}
        onRetryWrong={handleRetryWrong}
        onBackHome={() => navigate("/")}
      />
    </div>
  );
}
