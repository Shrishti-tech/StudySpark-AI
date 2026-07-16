export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <div className="w-10 h-10 border-4 border-indigo-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="w-full max-w-xl mx-auto rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse space-y-4">
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  );
}

export default function Loading({ label, skeleton = false }) {
  return skeleton ? <CardSkeleton /> : <Spinner label={label} />;
}
