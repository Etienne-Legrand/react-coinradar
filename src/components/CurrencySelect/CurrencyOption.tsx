import { Currency } from "../../types/types";
import { currencies } from "./config";

type CurrencyOptionProps = {
  readonly code: Currency;
  readonly isSelected: boolean;
  readonly onClick: () => void;
};

export function CurrencyOption({
  code,
  isSelected,
  onClick,
}: CurrencyOptionProps) {
  const { imageUrl, name, symbol } = currencies[code];

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors
        ${
          isSelected
            ? "bg-gray-100 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
    >
      <img
        src={imageUrl}
        alt={code}
        className="mr-2 h-5 w-5 flex-shrink-0 rounded-full"
      />
      <span className="truncate dark:text-white">{name}</span>
      <span className="ml-2 flex-shrink-0 text-gray-500 dark:text-gray-400">
        {symbol}
      </span>
    </button>
  );
}
