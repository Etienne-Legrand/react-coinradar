import { useQuery, useQueries } from "@tanstack/react-query";
import { Coin, Currency } from "../types/types";
import { fetchTopCoins, fetchCoinHistory } from "../services/api";

type CryptoCompareData = {
  CoinInfo: {
    Name: string;
    FullName: string;
    ImageUrl: string;
  };
  RAW: {
    [key in Currency]: {
      PRICE: number;
      CHANGEPCTHOUR: number;
      CHANGEPCT24HOUR: number;
    };
  };
};

export const useCryptoData = (currency: Currency, exchange: string) => {
  const { data: topCoinsData, isLoading } = useQuery<CryptoCompareData[]>({
    queryKey: ["topCoins", currency, exchange],
    queryFn: () => fetchTopCoins(currency, exchange),
    refetchInterval: 30000, // 30 secondes
  });

  // S'assurer que coins est toujours un tableau
  const coins = Array.isArray(topCoinsData) ? topCoinsData : [];

  const historicalQueries = useQueries({
    queries: coins
      .filter((coin): coin is CryptoCompareData =>
        Boolean(coin?.CoinInfo?.Name)
      )
      .map((coin) => ({
        queryKey: ["coinHistory", coin.CoinInfo.Name, currency, exchange],
        queryFn: () => fetchCoinHistory(coin.CoinInfo.Name, currency, exchange),
        staleTime: 3600000, // 1 heure
      })),
  });

  const processedCoins: Coin[] = coins
    .filter((coin) => coin?.CoinInfo?.Name && coin?.RAW?.[currency])
    .map((coin, index) => {
      const historicalData = historicalQueries[index]?.data ?? [];

      return {
        name: coin.CoinInfo.FullName,
        symbol: coin.CoinInfo.Name,
        imageUrl: `https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`,
        price: coin.RAW[currency].PRICE,
        change1h: coin.RAW[currency].CHANGEPCTHOUR,
        change24h: coin.RAW[currency].CHANGEPCT24HOUR,
        sparklineData: historicalData,
        change7j:
          historicalData.length > 1
            ? ((historicalData[historicalData.length - 1] - historicalData[0]) /
                historicalData[0]) *
              100
            : 0,
      };
    });

  return { coins: processedCoins, isLoading };
};
