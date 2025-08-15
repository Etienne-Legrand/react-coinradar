import { useCallback, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Exchange } from "@/types";
import { fetchExchanges } from "@/services/api";

const DEFAULT_EXCHANGE = "Binance";
const STORAGE_KEY = "exchange";

export function useExchange() {
  // État local pour le nom de l'exchange actif
  const [activeExchangeName, setActiveExchangeName] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_EXCHANGE
  );

  const { data: exchanges = [], isLoading } = useQuery<Exchange[]>({
    queryKey: ["exchanges"],
    queryFn: fetchExchanges,
    staleTime: 1000 * 60 * 60,
    select: (data) => [...data].sort((a, b) => a.name.localeCompare(b.name)),
  });

  const activeExchange =
    exchanges.find((e) => e.name === activeExchangeName) ||
    exchanges.find((e) => e.name === DEFAULT_EXCHANGE) ||
    exchanges[0];

  const updateExchange = useCallback(
    (exchangeId: string) => {
      const exchange = exchanges.find((e) => e.id === exchangeId);
      if (exchange) {
        localStorage.setItem(STORAGE_KEY, exchange.name);
        setActiveExchangeName(exchange.name); // Met à jour l'état local
      }
    },
    [exchanges]
  );

  // Si l'exchange actif n'existe pas dans la liste, revenir à Binance
  useEffect(() => {
    if (
      exchanges.length > 0 &&
      !exchanges.some((e) => e.name === activeExchangeName)
    ) {
      const defaultExchange = exchanges.find(
        (e) => e.name === DEFAULT_EXCHANGE
      );
      if (defaultExchange) {
        setActiveExchangeName(DEFAULT_EXCHANGE);
        localStorage.setItem(STORAGE_KEY, DEFAULT_EXCHANGE);
      }
    }
  }, [exchanges, activeExchangeName]);

  return {
    exchanges,
    selectedExchange: activeExchange?.name ?? DEFAULT_EXCHANGE,
    selectedExchangeId: activeExchange?.id ?? "",
    setExchange: updateExchange,
    isLoading,
  };
}
