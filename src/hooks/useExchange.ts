import { useState, useCallback, useEffect } from "react";
import { Exchange } from "../types/types";

type ExchangeApiResponse = {
  Data: Record<string, ExchangeData>;
};

type ExchangeData = {
  Name: string;
  Url: string;
  LogoUrl: string;
};

const DEFAULT_EXCHANGE: string = "Binance";

export function useExchange() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(
    () => localStorage.getItem("exchangeId")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Charger la liste des exchanges
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/exchanges/general"
        );
        const data = (await response.json()) as ExchangeApiResponse;
        const exchangesList = Object.entries(data.Data).map(
          ([id, details]: [string, ExchangeData]) => ({
            id: id,
            name: details.Name,
            url: details.Url,
            image: `https://www.cryptocompare.com${details.LogoUrl}`,
          })
        );
        setExchanges(exchangesList);

        // Si aucun exchange n'est sélectionné, chercher Binance
        if (!selectedExchangeId) {
          const defaultExchange = exchangesList.find(
            (exchange) => exchange.name === DEFAULT_EXCHANGE
          );
          if (defaultExchange) {
            setSelectedExchangeId(defaultExchange.id);
            localStorage.setItem("exchangeId", defaultExchange.id);
            localStorage.setItem("exchange", defaultExchange.name);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des exchanges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchanges();
  }, [selectedExchangeId]);

  const updateExchange = useCallback(
    (newExchangeId: string) => {
      const newExchange = exchanges.find(
        (exchange) => exchange.id === newExchangeId
      );
      if (newExchange) {
        setSelectedExchangeId(newExchangeId);
        localStorage.setItem("exchangeId", newExchangeId);
        localStorage.setItem("exchange", newExchange.name);
      }
    },
    [exchanges]
  );

  const selectedExchange =
    exchanges.find((e) => e.id === selectedExchangeId)?.name ?? "";

  return {
    exchanges,
    selectedExchange,
    selectedExchangeId: selectedExchangeId ?? "",
    setExchange: updateExchange,
    isLoading,
  };
}
