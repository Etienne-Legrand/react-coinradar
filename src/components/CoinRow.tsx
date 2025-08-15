import { Coin, Currency } from "@/types/types";
import { SparklineChart } from "./SparklineChart";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@/components/Tooltip";

interface CoinRowProps {
  readonly coin: Coin;
  readonly index: number;
  readonly currency: Currency;
}

export function CoinRow({ coin, index, currency }: CoinRowProps) {
  const { t } = useTranslation();

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return "N/A";
    const locale = currency === "USD" ? "en-US" : "fr-FR";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: Math.abs(num) >= 1 ? 2 : 4,
    }).format(num);
  };

  const formatPercent = (num: number | null | undefined) => {
    if (num == null) return "N/A";
    const arrow = num >= 0 ? "⏶" : "⏷";
    return `${arrow}${Math.abs(num).toFixed(2)}%`;
  };

  // Helper pour vérifier si un nombre est positif
  const isPositive = (num: number | null | undefined) => {
    return num != null && num >= 0;
  };

  const formatUrlSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <tr className="border-b border-gray-300 font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
      <td className="px-4 py-2 text-gray-500 dark:text-gray-300">
        {index + 1}
      </td>
      {/* Nom */}
      <td className="px-4 py-2">
        <div className="flex items-center">
          <Tooltip content={t("tooltips.viewOnCoinMarketCap")}>
            <a
              href={`https://coinmarketcap.com/currencies/${formatUrlSlug(
                coin.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={coin.imageUrl}
                alt={coin.symbol}
                className="mr-2 h-6 w-6 rounded-full transition-transform hover:scale-110"
              />
            </a>
          </Tooltip>
          <span className="dark:text-white">{coin.name}</span>
          <span className="text- ml-2 font-normal text-gray-500 dark:text-gray-400">
            {coin.symbol}
          </span>
        </div>
      </td>
      {/* Prix */}
      <td className="px-4 py-2 text-right dark:text-white">
        {formatNumber(coin.price)}
      </td>
      {/* 1h % */}
      <td
        className={`py-2 px-4 text-right ${
          isPositive(coin.change1h)
            ? "text-emerald-500 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-500"
        }`}
      >
        {formatPercent(coin.change1h)}
      </td>
      {/* 24h % */}
      <td
        className={`py-2 px-4 text-right ${
          isPositive(coin.change24h)
            ? "text-emerald-500 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-500"
        }`}
      >
        {formatPercent(coin.change24h)}
      </td>
      {/* 7j % */}
      <td
        className={`py-2 px-4 text-right ${
          isPositive(coin.change7j)
            ? "text-emerald-500 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-500"
        }`}
      >
        {formatPercent(coin.change7j)}
      </td>
      {/* 7 Derniers Jours */}
      <td className="flex items-center justify-end px-4 py-2">
        <SparklineChart data={coin.sparklineData} change={coin.change7j} />
      </td>
    </tr>
  );
}
