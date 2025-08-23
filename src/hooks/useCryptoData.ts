import { useQuery, useQueries } from "@tanstack/react-query";
import { type Coin, type Currency } from "@/types";
import { fetchTopCoins, fetchCoinHistory } from "@/services/api";

type RawCoinData = {
  PRICE: number;
  CHANGEPCTHOUR: number;
  CHANGEPCT24HOUR: number;
  IMAGEURL?: string;
};

export type ApiCoinData = {
  CoinInfo: {
    Name: string;
    FullName: string;
    ImageUrl: string;
  };
  RAW: {
    [currency: string]: RawCoinData;
  };
};

export const useCryptoData = (currency: Currency, exchange: string) => {
  const { data: topCoins, isLoading } = useQuery<ApiCoinData[]>({
    queryKey: ["topCoins", currency, exchange],
    queryFn: () => fetchTopCoins(currency, exchange),
    refetchInterval: 30000, // 30 secondes
  });

  // S'assurer que coins est toujours un tableau
  const coins = Array.isArray(topCoins) ? topCoins : [];

  const historicalQueries = useQueries({
    queries: coins
      .filter((coin): coin is ApiCoinData => Boolean(coin?.CoinInfo?.Name))
      .map((coin) => ({
        queryKey: ["coinHistory", coin.CoinInfo.Name, currency, exchange],
        queryFn: () => fetchCoinHistory(coin.CoinInfo.Name, currency, exchange),
        staleTime: 3600000, // 1 heure
      })),
  });

  const formattedCoins: Coin[] = coins
    .filter((coin) => coin?.CoinInfo?.Name && coin?.RAW?.[currency])
    .map((coin, index) => {
      const priceHistory = historicalQueries[index]?.data ?? [];

      return {
        name: coin.CoinInfo.FullName,
        symbol: coin.CoinInfo.Name,
        imageUrl: `https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`,
        price: coin.RAW[currency].PRICE,
        change1h: coin.RAW[currency].CHANGEPCTHOUR,
        change24h: coin.RAW[currency].CHANGEPCT24HOUR,
        sparklineData: priceHistory,
        change7j: calculateChange7j(priceHistory),
      };
    });

  return { coins: formattedCoins, isLoading };
};

/**
 * Calcule le pourcentage de variation du prix sur 7 jours
 */
function calculateChange7j(history: number[]): number {
  if (history.length > 1) {
    return ((history[history.length - 1] - history[0]) / history[0]) * 100;
  }
  return 0;
}
