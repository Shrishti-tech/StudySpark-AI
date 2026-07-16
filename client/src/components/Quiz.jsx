import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "./QuizCard.jsx";
import { useStudy } from "../context/StudyContext.jsx";

export default function Quiz() {
  const { activeQuiz, answerQuestion, submitQuiz, isRetryMode } = useStudy();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const question = activeQuiz[index];
  if (!question) return null;

  const isLast = index === activeQuiz.length - 1;
  const progress = ((index + (submitted ? 1 : 0)) / activeQuiz.length) * 100;

  const handleSubmit = () => {
    if (!selected) return;
    answerQuestion(index, selected);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (isLast) {
      submitQuiz();
      navigate("/results");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-xl mx-auto">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>
            {isRetryMode ? "Retry — " : ""}Question {index + 1} of {activeQuiz.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <QuizCard
        question={question.question}
        options={question.options}
        correctAnswer={question.answer}
        selected={selected}
        submitted={submitted}
        onSelect={(option) => setSelected(option)}
      />

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium px-8 py-2.5 transition-colors"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-2.5 transition-colors"
        >
          {isLast ? "Finish Quiz →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}
