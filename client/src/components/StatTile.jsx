const TONE_CLASSES = {
  neutral: "text-slate-900 dark:text-slate-100",
  good: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  critical: "text-red-600 dark:text-red-400",
};

export default function StatTile({ icon, label, value, tone = "neutral" }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>
      <p className={`text-3xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</p>
    </div>
  );
}
