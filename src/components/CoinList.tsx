import { CoinRow } from "./CoinRow";
import { CurrencySelect } from "./CurrencySelect";
import { ThemeToggle } from "./ThemeToggle";
import { ExchangeSelect } from "./ExchangeSelect";
import { useCryptoData } from "../hooks/useCryptoData";
import { useCurrency } from "../hooks/useCurrency";
import { useExchange } from "../hooks/useExchange";
import { useTranslation } from "react-i18next";

export function CoinList() {
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const {
    exchanges,
    selectedExchange,
    selectedExchangeId,
    setExchange,
    isLoading,
  } = useExchange();
  const { coins } = useCryptoData(currency, selectedExchange);

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Top 10 Crypto</h1>
        <div className="flex items-center gap-3">
          <CurrencySelect value={currency} onChange={setCurrency} />
          <ExchangeSelect
            exchanges={exchanges}
            value={selectedExchangeId}
            onChange={setExchange}
            isLoading={isLoading}
          />
          <ThemeToggle />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <colgroup>
            <col className="w-16" />
            <col className="w-40" />
            <col className="w-32" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-36" />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="whitespace-nowrap px-4 py-2 text-left dark:text-white">
                #
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left dark:text-white">
                {t("table.name")}
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-right dark:text-white">
                {t("table.price")}
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-right dark:text-white">
                {t("table.1h")}
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-right dark:text-white">
                {t("table.24h")}
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-right dark:text-white">
                {t("table.7d")}
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-right dark:text-white">
                {t("table.chart")}
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
