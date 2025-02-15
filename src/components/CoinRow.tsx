import { Coin, Currency } from "../types/types";
import { SparklineChart } from "./SparklineChart";

interface CoinRowProps {
  readonly coin: Coin;
  readonly index: number;
  readonly currency: Currency;
}

export function CoinRow({ coin, index, currency }: CoinRowProps) {
  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return "N/A";
    const locale = currency === "USD" ? "en-US" : "fr-FR";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPercent = (num: number | null | undefined) => {
    if (num == null) return "N/A";
    return num.toFixed(2) + "%";
  };

  // Helper pour vérifier si un nombre est positif
  const isPositive = (num: number | null | undefined) => {
    return num != null && num >= 0;
  };

  return (
    <tr className="border-b font-medium dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="py-2 px-4 dark:text-gray-300">{index + 1}</td>
      <td className="py-2 px-4">
        <div className="flex items-center">
          <img src={coin.imageUrl} alt={coin.symbol} className="w-6 h-6 mr-2" />
          <span className="dark:text-white">{coin.name}</span>
          <span className="ml-2 text-gray-400 text-sm">{coin.symbol}</span>
        </div>
      </td>
      <td className="py-2 px-4 text-right dark:text-white">
        {formatNumber(coin.price)}
      </td>
      <td
        className={`py-2 px-4 text-right ${
          isPositive(coin.change1h) ? "text-green-500" : "text-red-500"
        }`}
      >
        {formatPercent(coin.change1h)}
      </td>
      <td
        className={`py-2 px-4 text-right ${
          isPositive(coin.change24h) ? "text-green-500" : "text-red-500"
        }`}
      >
        {formatPercent(coin.change24h)}
      </td>
      <td
        className={`py-2 px-4 text-right ${
          isPositive(coin.change7j) ? "text-green-500" : "text-red-500"
        }`}
      >
        {formatPercent(coin.change7j)}
      </td>
      <td className="py-2 px-4 flex items-center justify-end">
        <SparklineChart data={coin.sparklineData} change={coin.change7j} />
      </td>
    </tr>
  );
}
