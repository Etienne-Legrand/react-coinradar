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
        className="h-10 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 pr-8 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="BTC">BTC</option>
      </select>
      <div className="pointer-events-none absolute inset-0 right-2.5 mt-0.5 flex items-center justify-end text-gray-500 dark:text-gray-500">
        <svg
          className="h-4 w-4"
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
