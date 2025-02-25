import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label={t("tooltips.theme")}
      title={t("tooltips.theme")}
    >
      <span className="-mt-0.5 text-lg leading-none">
        {theme === "dark" ? "🔆" : "🔅"}
      </span>
    </button>
  );
}
