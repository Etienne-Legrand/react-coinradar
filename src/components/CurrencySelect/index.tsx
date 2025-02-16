import { useState } from "react";
import { Currency } from "../../types/types";
import { currencies } from "./config";
import { CurrencyOption } from "./CurrencyOption";
import { useClickOutside } from "../../hooks/useClickOutside";

interface CurrencySelectProps {
  readonly value: Currency;
  readonly onChange: (currency: Currency) => void;
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    setIsOpen(false);
  };

  const { imageUrl, name } = currencies[value];

  return (
    <div className="relative min-w-[150px]" ref={ref}>
      {/* Currency select button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <div className="flex items-center truncate">
          <img
            src={imageUrl}
            alt={value}
            className="mr-2 h-5 w-5 flex-shrink-0 rounded-full"
          />
          <span className="truncate">{name}</span>
        </div>
        <svg
          className={`ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Currency options */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-12 z-10 space-y-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {(Object.keys(currencies) as Currency[]).map((code) => (
            <CurrencyOption
              key={code}
              code={code}
              isSelected={code === value}
              onClick={() => handleSelect(code)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
