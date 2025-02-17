import { useState, useCallback, useEffect } from "react";
import { Exchange } from "../types/types";

const DEFAULT_EXCHANGE = "Binance";

type ExchangeApiResponse = {
  Data: Record<string, ExchangeData>;
};

type ExchangeData = {
  Name: string;
  Url: string;
  LogoUrl: string;
};

export function useExchange() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState(
    () => localStorage.getItem("exchange") ?? DEFAULT_EXCHANGE
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
            exchange_id: id,
            name: details.Name,
            url: details.Url,
            image: `https://www.cryptocompare.com${details.LogoUrl}`,
          })
        );
        setExchanges(exchangesList);
      } catch (error) {
        console.error("Erreur lors du chargement des exchanges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  // Mettre à jour l'exchange sélectionné
  const updateExchange = useCallback(
    (exchangeId: string) => {
      const exchange = exchanges.find((e) => e.exchange_id === exchangeId);
      if (exchange) {
        setSelectedExchangeId(exchangeId);
        localStorage.setItem("exchange", exchange.name); // Sauvegarder le nom pour l'API
      }
    },
    [exchanges]
  );

  const selectedExchange =
    exchanges.find((e) => e.exchange_id === selectedExchangeId)?.name ??
    DEFAULT_EXCHANGE;

  return {
    exchanges,
    selectedExchange, // Retourne le nom pour l'API
    selectedExchangeId, // Retourne l'ID pour le select
    setExchange: updateExchange,
    isLoading,
  };
}
