import { useTranslation } from "react-i18next";
import { Tooltip } from "./Tooltip";
import { type Coin } from "@/types";

interface CoinMarketCapLinkProps {
  readonly coin: Coin;
}

export function CoinMarketCapLink({ coin }: CoinMarketCapLinkProps) {
  const { t } = useTranslation();

  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const getCoinMarketCapUrl = () => {
    return `https://coinmarketcap.com/currencies/${formatSlug(coin.name)}`;
  };

  return (
    <Tooltip content={`${t("tooltips.viewOnCoinMarketCap")}`}>
      <a href={getCoinMarketCapUrl()} target="_blank" rel="noopener noreferrer">
        <img
          src={coin.imageUrl}
          alt={coin.symbol}
          title={coin.name}
          className="h-6 w-6 rounded-full transition-transform hover:scale-110"
        />
      </a>
    </Tooltip>
  );
}
