import { useState, useCallback } from "react";
import { Currency } from "../types/types";

const DEFAULT_CURRENCY: Currency = "USD";
// Créer un Set à partir des valeurs du type Currency
const VALID_CURRENCIES: ReadonlySet<string> = new Set<Currency>(
  Object.values(Currency)
);

function isValidCurrency(value: unknown): value is Currency {
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
  }, []);

  return { currency, setCurrency: updateCurrency };
}
