import { Currency } from "../types/types";

// Types
type HistoryDataPoint = {
  close: number;
  time: number;
};

// Constantes
const BASE_URL = "https://min-api.cryptocompare.com/data";

// Récupère les 10 cryptomonnaies les plus capitalisées
export const fetchTopCoins = async (currency: Currency) => {
  const response = await fetch(
    `${BASE_URL}/top/mktcapfull?limit=10&tsym=${currency}&exchange=Binance`
  );
  const data = await response.json();
  return data.Data || [];
};

// Récupère l'historique des prix sur 7 jours
export const fetchCoinHistory = async (symbol: string, currency: Currency) => {
  const nbOfHours = 7 * 24;
  const historyResponse = await fetch(
    `${BASE_URL}/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${nbOfHours}&exchange=Binance`
  );
  const historyData = await historyResponse.json();
  return historyData?.Data?.Data?.map((d: HistoryDataPoint) => d.close) || [];
};
