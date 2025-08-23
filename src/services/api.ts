import { type Currency } from "@/types";
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

// Liste de fallback des 10 cryptomonnaies les plus populaires
const FALLBACK_COINS = ["BTC", "ETH", "XRP", "USDT", "BNB", "SOL", "USDC", "DOGE", "TRX", "ADA"];

// Métadonnées pour les coins de fallback
const FALLBACK_COIN_METADATA: Record<string, { fullName: string; imageUrl: string }> = {
  BTC: { fullName: "Bitcoin", imageUrl: "/media/37746251/btc.png" },
  ETH: { fullName: "Ethereum", imageUrl: "/media/37746238/eth.png" },
  XRP: { fullName: "XRP", imageUrl: "/media/38553096/xrp.png" },
  USDT: { fullName: "Tether", imageUrl: "/media/37746338/usdt.png" },
  BNB: { fullName: "BNB", imageUrl: "/media/40485170/bnb.png" },
  SOL: { fullName: "Solana", imageUrl: "/media/37747734/sol.png" },
  USDC: { fullName: "USD Coin", imageUrl: "/media/34835941/usdc.png" },
  DOGE: { fullName: "Dogecoin", imageUrl: "/media/37746339/doge.png" },
  TRX: { fullName: "TRON", imageUrl: "/media/37746879/trx.png" },
  ADA: { fullName: "Cardano", imageUrl: "/media/37746235/ada.png" },
};

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
  try {
    const response = await fetch(
      `${BASE_URL}/top/mktcapfull?limit=10&tsym=${currency}&exchange=${exchange}`
    );
    const data = await response.json();
    const coins = data.Data || [];
    
    // Vérifier si Bitcoin (BTC) est présent dans les résultats
    const hasBTC = coins.some((coin: { CoinInfo?: { Name?: string } }) => coin?.CoinInfo?.Name === "BTC");
    
    if (hasBTC && coins.length > 0) {
      return coins;
    }
    
    // Fallback: utiliser la liste prédéfinie si BTC n'est pas présent
    console.warn("BTC not found in top coins API response, using fallback list");
    return await fetchFallbackCoins(currency, exchange);
  } catch (error) {
    console.error("Error fetching top coins, using fallback list:", error);
    return await fetchFallbackCoins(currency, exchange);
  }
};

// Fonction de fallback pour récupérer les données des coins prédéfinis
const fetchFallbackCoins = async (currency: Currency, exchange: string) => {
  try {
    const symbols = FALLBACK_COINS.join(',');
    const response = await fetch(
      `${BASE_URL}/pricemultifull?fsyms=${symbols}&tsyms=${currency}&exchange=${exchange}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transformer les données pour correspondre au format attendu par useCryptoData
    const fallbackCoins = FALLBACK_COINS.map((symbol) => {
      const coinData = data.RAW?.[symbol]?.[currency];
      const metadata = FALLBACK_COIN_METADATA[symbol];
      
      if (!coinData || !metadata) {
        return null;
      }
      
      return {
        CoinInfo: {
          Name: symbol,
          FullName: metadata.fullName,
          ImageUrl: metadata.imageUrl,
        },
        RAW: {
          [currency]: {
            PRICE: coinData.PRICE || 0,
            CHANGEPCTHOUR: coinData.CHANGEPCTHOUR || 0,
            CHANGEPCT24HOUR: coinData.CHANGEPCT24HOUR || 0,
          },
        },
      };
    }).filter(Boolean);
    
    return fallbackCoins;
  } catch (error) {
    console.error("Error fetching fallback coins:", error);
    return [];
  }
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
