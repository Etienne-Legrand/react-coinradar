import { Currency } from "@/types/types";

type CurrencyConfig = {
  symbol: string;
  name: string;
  imageUrl: string;
};

export const currencies: Record<Currency, CurrencyConfig> = {
  USD: {
    symbol: "$",
    name: "US Dollar",
    imageUrl:
      "https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/USD.svg",
  },
  EUR: {
    symbol: "€",
    name: "Euro",
    imageUrl:
      "https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/EUR.svg",
  },
  BTC: {
    symbol: "₿",
    name: "Bitcoin",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/32x32/1.png",
  },
};
