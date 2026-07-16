export default function QuizCard({ question, options, correctAnswer, selected, submitted, onSelect }) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-5">
      <p className="text-lg font-medium">{question}</p>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === correctAnswer;

          let stateClass = "border-slate-300 dark:border-slate-600 hover:border-indigo-400";
          if (submitted) {
            if (isCorrect) {
              stateClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            } else if (isSelected) {
              stateClass = "border-red-500 bg-red-50 dark:bg-red-950/40";
            } else {
              stateClass = "border-slate-200 dark:border-slate-700 opacity-60";
            }
          } else if (isSelected) {
            stateClass = "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40";
          }

          return (
            <button
              key={option}
              type="button"
              disabled={submitted}
              onClick={() => onSelect(option)}
              className={`flex items-center gap-3 text-left rounded-lg border-2 px-4 py-3 transition-colors disabled:cursor-default ${stateClass}`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-400 dark:border-slate-500"
                }`}
              />
              <span>{option}</span>
              {submitted && isCorrect && <span className="ml-auto text-emerald-600 dark:text-emerald-400">✓</span>}
              {submitted && isSelected && !isCorrect && <span className="ml-auto text-red-600 dark:text-red-400">✕</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
