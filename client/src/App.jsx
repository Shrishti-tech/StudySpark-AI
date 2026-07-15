import { useTheme } from "./context/ThemeContext.jsx";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">StudySpark AI</h1>
      <p className="text-slate-500 dark:text-slate-400">Turn Notes into Interactive Learning</p>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700"
      >
        Toggle theme (currently {theme})
      </button>
    </div>
  );
}
