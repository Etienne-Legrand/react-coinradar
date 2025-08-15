import { useState, useEffect } from "react";
import { type ThemeMode } from "@/types";

export function useTheme() {
  // Récupérer le thème sauvegardé ou utiliser le thème par défaut
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (
      (localStorage.getItem("theme") as ThemeMode) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  // Met à jour le thème
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Inverse le thème actuel
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
