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

export const useCryptoData = (currency: Currency) => {
  const { data: topCoinsData } = useQuery<CryptoCompareData[]>({
    queryKey: ["topCoins", currency],
    queryFn: () => fetchTopCoins(currency),
    refetchInterval: 10000, // 10 secondes
  });

  const historicalQueries = useQueries({
    queries: (topCoinsData ?? [])
      .filter((coin) => coin?.CoinInfo?.Name)
      .map((coin) => ({
        queryKey: ["coinHistory", coin.CoinInfo.Name, currency],
        queryFn: () => fetchCoinHistory(coin.CoinInfo.Name, currency),
        staleTime: 3600000, // 1 heure
      })),
  });

  const coins: Coin[] = (topCoinsData ?? [])
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

  return { coins };
};
