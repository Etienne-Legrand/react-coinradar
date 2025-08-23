import {
  type RawCoinData,
  type Currency,
  PriceData,
  HistoryDataPoint,
  ExchangeApiResponse,
  ExchangeData,
  ApiCoinData,
} from "@/types";
import { DEFAULT_CURRENCY, isValidCurrency } from "@/hooks/useCurrency";
import { API_URL, CRYPTOCOMPARE_BASE_URL } from "@/constants";

// Liste de fallback des 10 cryptomonnaies les plus populaires
const FALLBACK_COINS = [
  { symbol: "BTC", fullName: "Bitcoin" },
  { symbol: "ETH", fullName: "Ethereum" },
  { symbol: "XRP", fullName: "XRP" },
  { symbol: "USDT", fullName: "Tether" },
  { symbol: "BNB", fullName: "BNB" },
  { symbol: "SOL", fullName: "Solana" },
  { symbol: "USDC", fullName: "USD Coin" },
  { symbol: "DOGE", fullName: "Dogecoin" },
  { symbol: "TRX", fullName: "TRON" },
  { symbol: "ADA", fullName: "Cardano" },
];

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
    `${API_URL}/pricemultifull?fsyms=BTC&tsyms=${currency}`
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.RAW.BTC[currency];
};

// Récupère les 10 cryptomonnaies les plus capitalisées
export const fetchTopCoins = async (
  currency: Currency,
  exchange: string
): Promise<ApiCoinData[]> => {
  const response = await fetch(
    `${API_URL}/top/mktcapfull?limit=10&tsym=${currency}&exchange=${exchange}`
  );
  const data = await response.json();
  const coins: ApiCoinData[] = data.Data || [];

  // Vérifier si Bitcoin (BTC) est présent dans les résultats
  const hasBTC = coins.some((coin) => coin?.CoinInfo?.Name === "BTC");

  if (hasBTC && coins.length > 0) {
    return coins;
  }

  // Fallback: utiliser la liste prédéfinie si BTC n'est pas présent
  return await fetchFallbackCoins(currency, exchange);
};

// Fonction de fallback pour récupérer les données des coins prédéfinis
const fetchFallbackCoins = async (
  currency: Currency,
  exchange: string
): Promise<ApiCoinData[]> => {
  const symbols = FALLBACK_COINS.map((c) => c.symbol).join(",");
  const response = await fetch(
    `${API_URL}/pricemultifull?fsyms=${symbols}&tsyms=${currency}&exchange=${exchange}`
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const coins = await response.json();

  // Transformer les données pour correspondre au format attendu par useCryptoData
  const fallbackCoins: ApiCoinData[] = FALLBACK_COINS.map(
    ({ symbol, fullName }): ApiCoinData | null => {
      const coinData: RawCoinData = coins.RAW?.[symbol]?.[currency];
      if (!coinData) return null;

      return {
        CoinInfo: {
          Name: symbol,
          FullName: fullName,
          ImageUrl: coinData.IMAGEURL ?? "",
        },
        RAW: {
          [currency]: {
            PRICE: coinData.PRICE,
            CHANGEPCTHOUR: coinData.CHANGEPCTHOUR,
            CHANGEPCT24HOUR: coinData.CHANGEPCT24HOUR,
          },
        },
      };
    }
  ).filter((coin): coin is ApiCoinData => coin !== null);

  return fallbackCoins;
};

// Récupère l'historique des prix sur 7 jours
export const fetchCoinHistory = async (
  symbol: string,
  currency: Currency,
  exchange: string
) => {
  const nbOfHours = 7 * 24;
  const historyResponse = await fetch(
    `${API_URL}/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${nbOfHours}&exchange=${exchange}`
  );
  const historyData = await historyResponse.json();
  return historyData?.Data?.Data?.map((d: HistoryDataPoint) => d.close) || [];
};

// Récupère la liste des exchanges
export const fetchExchanges = async () => {
  const response = await fetch(`${API_URL}/exchanges/general`);
  const data = (await response.json()) as ExchangeApiResponse;
  return Object.entries(data.Data).map(
    ([id, details]: [string, ExchangeData]) => ({
      id,
      name: details.Name,
      url: details.Url,
      image: `${CRYPTOCOMPARE_BASE_URL}${details.LogoUrl}`,
    })
  );
};
