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

export type RawCoinData = {
  PRICE: number;
  CHANGEPCTHOUR: number;
  CHANGEPCT24HOUR: number;
  IMAGEURL?: string;
};

export type ApiCoinData = {
  CoinInfo: {
    Name: string;
    FullName: string;
    ImageUrl: string;
  };
  RAW: {
    [currency: string]: RawCoinData;
  };
};

export type HistoryDataPoint = {
  close: number;
  time: number;
};

export type PriceData = {
  PRICE: number;
  CHANGEPCTHOUR: number;
};
