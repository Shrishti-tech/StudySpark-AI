export default function Result({ score, wrongQuestions, onRetryWrong, onBackHome }) {
  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8 text-center">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Score</p>
        <p className="text-5xl font-bold mt-1">
          {score.correct} / {score.total}
        </p>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{percentage}% correct</p>
      </div>

      {wrongQuestions.length > 0 ? (
        <div className="w-full text-left">
          <p className="font-semibold mb-3">Wrong Answers</p>
          <ul className="space-y-2">
            {wrongQuestions.map((q, i) => (
              <li
                key={i}
                className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-4 py-3"
              >
                <p className="font-medium">{q.question}</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                  Correct answer: {q.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-emerald-600 dark:text-emerald-400 font-medium">🎉 Perfect score! Great job.</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {wrongQuestions.length > 0 && (
          <button
            onClick={onRetryWrong}
            className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 transition-colors"
          >
            Retry Wrong Questions
          </button>
        )}
        <button
          onClick={onBackHome}
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 px-6 py-3 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
