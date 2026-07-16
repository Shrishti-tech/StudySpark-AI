export default function EmptyState({ icon = "📝", title, subtitle, action }) {
  return (
    <div className="w-full max-w-xl mx-auto text-center py-16 flex flex-col items-center gap-3">
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-lg">{title}</p>
      {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      {action}
    </div>
  );
}
