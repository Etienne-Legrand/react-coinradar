import { Currency } from "../types/types";

interface CurrencySelectProps {
  readonly value: Currency;
  readonly onChange: (currency: Currency) => void;
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="h-10 cursor-pointer appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 pr-10 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="BTC">BTC</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
}
