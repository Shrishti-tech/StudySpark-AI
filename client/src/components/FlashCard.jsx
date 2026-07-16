export default function FlashCard({ question, answer, flipped, onFlip }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="perspective h-64 cursor-pointer select-none" onClick={onFlip}>
        <div
          className={`relative w-full h-full preserve-3d transition-transform duration-500 ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          <div className="absolute inset-0 backface-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center p-6 text-center shadow-sm">
            <p className="text-lg font-medium">{question}</p>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center p-6 text-center shadow-sm">
            <p className="text-lg">{answer}</p>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">Click the card to flip</p>
    </div>
  );
}
