export interface Coin {
  name: string;
  symbol: string;
  imageUrl: string;
  price: number;
  change1h: number | null;
  change24h: number | null;
  change7j: number;
  sparklineData: number[];
}

export type ThemeMode = "light" | "dark";

export const Currency = {
  USD: "USD",
  EUR: "EUR",
  BTC: "BTC",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export type Exchange = {
  exchange_id: string;
  name: string;
  url: string;
  image: string;
};
