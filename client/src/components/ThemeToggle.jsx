import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-700 text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
