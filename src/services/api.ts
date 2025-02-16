import { Currency } from "../types/types";

const BASE_URL = "https://min-api.cryptocompare.com/data";

export const fetchTopCoins = async (currency: Currency) => {
  const response = await fetch(
    `${BASE_URL}/top/mktcapfull?limit=10&tsym=${currency}&exchange=Binance`
  );
  const data = await response.json();
  return data.Data || [];
};

export const fetchCoinHistory = async (symbol: string, currency: Currency) => {
  const nbOfHours = 7 * 24;
  const historyResponse = await fetch(
    `${BASE_URL}/v2/histohour?fsym=${symbol}&tsym=${currency}&limit=${nbOfHours}&exchange=Binance`
  );
  const historyData = await historyResponse.json();
  return historyData?.Data?.Data?.map((d: any) => d.close) || [];
};
