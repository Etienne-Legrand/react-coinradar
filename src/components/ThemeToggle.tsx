import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
      aria-label="Toggle theme"
    >
      <span className="text-lg leading-none -mt-0.5">
        {theme === "dark" ? "🔆" : "🔅"}
      </span>
    </button>
  );
}
