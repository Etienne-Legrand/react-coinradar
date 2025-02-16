import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeMode } from "../types/types";

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Récupérer le thème sauvegardé ou utiliser le thème par défaut
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (
      (localStorage.getItem("theme") as ThemeMode) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  // Appliquer le thème et le sauvegarder
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Changement de thème
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
