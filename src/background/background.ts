import { fetchPriceData } from "@/services/api";

// Configuration
const CONFIG = {
  ALARM_NAME: "updateBadge",
  UPDATE_INTERVAL_MINUTES: 1,
};

// Couleurs du badge (même que CoinRow.tsx)
const BADGE_COLORS = {
  positive: {
    // light: "#10B981", // emerald-500
    light: "#34D399", // emerald-400
    dark: "#34D399", // emerald-400
  },
  negative: {
    light: "#E11D48", // rose-600
    dark: "#F43F5E", // rose-500
  },
};

/**
 * Formate le prix pour l'affichage dans le badge sur 4 caractères
 */
function formatPriceForBadge(price: number): string {
  // Millions (≥ 1,000,000)
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    // Si c'est un nombre entier de millions
    if (millions >= 10 || millions % 1 === 0) {
      return Math.floor(millions) + "M";
    }
    // Sinon on garde une décimale
    return millions.toFixed(1) + "M";
  }

  // Milliers (≥ 10,000)
  if (price >= 10_000) {
    return Math.floor(price / 1000) + "k";
  }

  // En dessous de 10k, on affiche le nombre entier
  return Math.floor(price).toString();
}

/**
 * Détermine si le thème actuel est sombre
 * TODO: Récupérer le thème du navigateur (prefers-color-scheme: dark)
 */
function isDarkTheme(): boolean {
  return false;
}

/**
 * Sélectionne la couleur du badge selon la variation du prix et le thème
 */
function getBadgeColor(changePercent: number, isDark: boolean = false): string {
  const isPositive = changePercent >= 0;
  const colorSet = isPositive ? BADGE_COLORS.positive : BADGE_COLORS.negative;
  return isDark ? colorSet.dark : colorSet.light;
}

/**
 * Met à jour le badge avec les dernières données de prix
 */
async function updateBadge(): Promise<void> {
  try {
    const priceData = await fetchPriceData();
    const formattedPrice = formatPriceForBadge(priceData.PRICE);
    const isDark = isDarkTheme();
    const badgeColor = getBadgeColor(priceData.CHANGEPCTHOUR, isDark);

    // Mise à jour du badge
    await Promise.all([
      chrome.action.setBadgeText({ text: formattedPrice }),
      chrome.action.setBadgeBackgroundColor({ color: badgeColor }),
    ]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du badge:", error);
    await chrome.action.setBadgeText({ text: "error" });
  }
}

/**
 * Crée ou recrée l'alarme pour les mises à jour périodiques
 */
async function createUpdateAlarm(): Promise<void> {
  await chrome.alarms.create(CONFIG.ALARM_NAME, {
    delayInMinutes: CONFIG.UPDATE_INTERVAL_MINUTES,
    periodInMinutes: CONFIG.UPDATE_INTERVAL_MINUTES,
  });
}

// Mise à jour lors de l'installation de l'extension
chrome.runtime.onInstalled.addListener(async () => {
  await updateBadge();
  await createUpdateAlarm();
});

// Mise à jour au démarrage du service worker (après réouverture du navigateur)
chrome.runtime.onStartup.addListener(async () => {
  const existingAlarm = await chrome.alarms.get(CONFIG.ALARM_NAME);

  if (!existingAlarm) {
    await createUpdateAlarm();
  }

  await updateBadge();
});

// Gestionnaire pour l'alarme
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === CONFIG.ALARM_NAME) {
    updateBadge();
  }
});

// Écouter les changements de devise dans chrome.storage
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.currency) {
    updateBadge();
  }
});
