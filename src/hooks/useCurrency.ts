import { useState, useCallback } from "react";
import { type Currency } from "@/types";
import { Currency as CurrencyConstant } from "@/constants";

export const DEFAULT_CURRENCY: Currency = CurrencyConstant.USD;

// Créer un Set à partir des valeurs du type Currency
const VALID_CURRENCIES: ReadonlySet<string> = new Set<Currency>(
  Object.values(CurrencyConstant)
);

export function isValidCurrency(value: unknown): value is Currency {
  return typeof value === "string" && VALID_CURRENCIES.has(value);
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem("currency");
    return isValidCurrency(saved) ? saved : DEFAULT_CURRENCY;
  });

  const updateCurrency = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);

    // Synchroniser avec chrome.storage pour le background script
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ currency: newCurrency });
    }
  }, []);

  return { currency, setCurrency: updateCurrency };
}
