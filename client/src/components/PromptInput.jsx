import { useRef } from "react";

const MAX_LENGTH = 6000;

export default function PromptInput({ notes, topic, onNotesChange, onTopicChange, onGenerate, onClear, loading }) {
  const textareaRef = useRef(null);

  const canGenerate = (notes.trim().length > 0 || topic.trim().length > 0) && !loading;
  const charCount = notes.length;
  const nearLimit = charCount > MAX_LENGTH * 0.9;

  const handleClear = () => {
    onClear();
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        placeholder="Or just enter a topic, e.g. Photosynthesis"
        maxLength={200}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Paste your notes..."
          rows={10}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span
          className={`absolute bottom-3 right-3 text-xs ${
            nearLimit ? "text-red-500" : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {charCount} / {MAX_LENGTH}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 transition-colors"
        >
          {loading ? "Generating…" : "Generate Flashcards & Quiz"}
        </button>
        <button
          onClick={handleClear}
          disabled={loading}
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-6 py-3 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
