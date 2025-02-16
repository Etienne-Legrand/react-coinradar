// Initialisation du thème en fonction du thème sauvegardé ou sinon du thème préféré par l'utilisateur
export function initTheme() {
  const theme =
    localStorage.getItem("theme") ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  document.documentElement.classList.add(theme);
}

// Exécution immédiate pour éviter le flash
initTheme();
