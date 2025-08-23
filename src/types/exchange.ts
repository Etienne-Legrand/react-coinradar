export type Exchange = {
  id: string;
  name: string;
  url: string;
  image: string;
};

export type ExchangeApiResponse = {
  Data: Record<string, ExchangeData>;
};

export type ExchangeData = {
  Name: string;
  Url: string;
  LogoUrl: string;
};
