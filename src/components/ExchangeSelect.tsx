import { Exchange } from "@/types/types";
import { Select } from "./Select";
import { SelectOption } from "./Select/types";
import { useTranslation } from "react-i18next";

interface ExchangeSelectProps {
  readonly exchanges: Exchange[];
  readonly value: string;
  readonly onChange: (exchangeId: string) => void;
  readonly isLoading?: boolean;
}

export function ExchangeSelect({
  exchanges,
  value,
  onChange,
  isLoading,
}: ExchangeSelectProps) {
  const { t } = useTranslation();

  const options: SelectOption[] = exchanges.map((exchange) => ({
    id: exchange.id,
    label: exchange.name,
    imageUrl: exchange.image,
  }));

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
      title={t("tooltips.exchange")}
    />
  );
}
