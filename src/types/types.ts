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
export type Currency = "USD" | "EUR" | "BTC";
