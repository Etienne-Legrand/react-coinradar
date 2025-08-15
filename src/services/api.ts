import { Currency } from "@/types";
import { DEFAULT_CURRENCY, isValidCurrency } from "@/hooks/useCurrency";

// Types
type HistoryDataPoint = {
  close: number;
  time: number;
};

type ExchangeApiResponse = {
  Data: Record<string, ExchangeData>;
};

type ExchangeData = {
  Name: string;
  Url: string;
  LogoUrl: string;
};

type PriceData = {
  PRICE: number;
  CHANGEPCTHOUR: number;
};

// Constantes
const BASE_URL = "https://min-api.cryptocompare.com/data";

// Fonction utilitaire pour récupérer la devise depuis le chrome.storage
const getCurrencyFromStorage = async (): Promise<Currency> => {
  const result = await chrome.storage.local.get(["currency"]);
  const currency = result.currency;
  return isValidCurrency(currency) ? currency : DEFAULT_CURRENCY;
};

// Récupère les données de prix pour le badge (BTC uniquement)
export const fetchPriceData = async (): Promise<PriceData> => {
  const currency = await getCurrencyFromStorage();
  const response = await fetch(
    `${BASE_URL}/pricemultifull?fsyms=BTC&tsyms=${currency}`
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.RAW.BTC[currency];
};

// Récupère les 10 cryptomonnaies les plus capitalisées
export const fetchTopCoins = async (currency: Currency, exchange: string) => {
  const response = await fetch(
    `${BASE_URL}/top/mktcapfull?limit=10&tsym=${currency}&exchange=${exchange}`
  );
  const data = await response.json();
  return data.Data || [];
};

// Récupère l'historique des prix sur 7 jours
export const fetchCoinHistory = async (
  symbol: string,
  currency: Currency,
  exchange: string
) => {
  const nbOfHours = 7 * 24;
  const historyResponse = await fetch(
    `${BASE_URL}/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${nbOfHours}&exchange=${exchange}`
  );
  const historyData = await historyResponse.json();
  return historyData?.Data?.Data?.map((d: HistoryDataPoint) => d.close) || [];
};

// Récupère la liste des exchanges
export const fetchExchanges = async () => {
  const response = await fetch(
    "https://min-api.cryptocompare.com/data/exchanges/general"
  );
  const data = (await response.json()) as ExchangeApiResponse;
  return Object.entries(data.Data).map(
    ([id, details]: [string, ExchangeData]) => ({
      id,
      name: details.Name,
      url: details.Url,
      image: `https://www.cryptocompare.com${details.LogoUrl}`,
    })
  );
};
