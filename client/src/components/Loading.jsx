export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <div className="w-10 h-10 border-4 border-indigo-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function Bone({ className = "" }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`} />;
}

export function FlashcardSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-6" aria-label="Generating flashcards" role="status">
      <Bone className="h-4 w-24" />

      <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-64 flex items-center justify-center p-6">
        <div className="w-full space-y-3">
          <Bone className="h-4 w-3/4 mx-auto" />
          <Bone className="h-4 w-1/2 mx-auto" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Bone className="h-9 w-24 rounded-lg" />
        <Bone className="h-9 w-24 rounded-lg" />
        <Bone className="h-9 w-20 rounded-lg" />
        <Bone className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-6" aria-label="Generating quiz" role="status">
      <div className="w-full max-w-xl mx-auto">
        <Bone className="h-4 w-32 mb-2" />
        <Bone className="h-1.5 w-full rounded-full" />
      </div>

      <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-5">
        <Bone className="h-5 w-2/3" />
        <div className="flex flex-col gap-3">
          <Bone className="h-11 w-full rounded-lg" />
          <Bone className="h-11 w-full rounded-lg" />
          <Bone className="h-11 w-full rounded-lg" />
          <Bone className="h-11 w-full rounded-lg" />
        </div>
      </div>

      <Bone className="h-10 w-28 rounded-lg" />
    </div>
  );
}

export default function Loading({ label }) {
  return <Spinner label={label} />;
}
