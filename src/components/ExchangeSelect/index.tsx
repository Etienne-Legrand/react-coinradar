import { useState } from "react";
import { Exchange } from "../../types/types";
import { useClickOutside } from "../../hooks/useClickOutside";

interface ExchangeSelectProps {
  readonly exchanges: Exchange[];
  readonly value: string;
  readonly onChange: (exchange: string) => void;
  readonly isLoading?: boolean;
}

export function ExchangeSelect({
  exchanges,
  value,
  onChange,
  isLoading,
}: ExchangeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const selectedExchange = exchanges.find((e) => e.name === value);

  if (isLoading) {
    return (
      <div className="h-10 w-[150px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <div className="relative min-w-[150px]" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <div className="flex items-center truncate">
          {selectedExchange && (
            <img
              src={selectedExchange.image}
              alt={selectedExchange.name}
              className="mr-2 h-5 w-5 flex-shrink-0 rounded-full"
            />
          )}
          <span className="truncate">{selectedExchange?.name ?? value}</span>
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

      {isOpen && (
        <div className="absolute left-0 right-0 top-12 z-10 max-h-60 space-y-1 overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {exchanges.map((exchange) => (
            <button
              key={exchange.exchange_id}
              onClick={() => {
                onChange(exchange.name);
                setIsOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm transition-colors
                ${
                  exchange.name === value
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              <img
                src={exchange.image}
                alt={exchange.name}
                className="mr-2 h-5 w-5 flex-shrink-0 rounded-full"
              />
              <span className="truncate dark:text-white">{exchange.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
