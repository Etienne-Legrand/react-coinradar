import { useEffect, useState } from "react";
import { Coin, Currency } from "../types/types";
import { CoinRow } from "./CoinRow";
import { CurrencySelect } from "./CurrencySelect";
import { ThemeToggle } from "./ThemeToggle";

export function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=${currency}&exchange=Binance`
        );
        const data = await response.json();

        const coinsPromises = data.Data.map(async (coin: any) => {
          // Récupérer l'historique des prix pour les 7 derniers jours par heure
          const nbOfHours = 7 * 24;
          const historyResponse = await fetch(
            `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${coin.CoinInfo.Name}&tsym=${currency}&limit=${nbOfHours}&exchange=Binance`
          );
          const historyData = await historyResponse.json();
          const prices = historyData.Data.Data.map((d: any) => d.close);

          // Calculer le changement de prix basé sur les données historiques
          const change7j =
            prices.length > 0
              ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
              : 0;

          return {
            name: coin.CoinInfo.FullName,
            symbol: coin.CoinInfo.Name,
            imageUrl: `https://www.cryptocompare.com${coin.CoinInfo.ImageUrl}`,
            price: coin.RAW[currency].PRICE,
            change1h: coin.RAW[currency].CHANGEPCTHOUR,
            change24h: coin.RAW[currency].CHANGEPCT24HOUR,
            sparklineData: prices,
            change7j: change7j,
          };
        });

        const formattedCoins = await Promise.all(coinsPromises);
        setCoins(formattedCoins);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, [currency]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Top 10 Crypto</h1>
        <div className="flex items-center gap-3">
          <CurrencySelect value={currency} onChange={setCurrency} />
          <ThemeToggle />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 px-4 text-left dark:text-white">#</th>
              <th className="py-2 px-4 text-left dark:text-white">Nom</th>
              <th className="py-2 px-4 text-right dark:text-white">Prix</th>
              <th className="py-2 px-4 text-right dark:text-white">1h %</th>
              <th className="py-2 px-4 text-right dark:text-white">24h %</th>
              <th className="py-2 px-4 text-right dark:text-white">7j %</th>
              <th className="py-2 px-4 text-right dark:text-white">
                7 Derniers Jours
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <CoinRow
                key={coin.symbol}
                coin={coin}
                index={index}
                currency={currency}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
