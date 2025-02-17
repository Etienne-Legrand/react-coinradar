import { Exchange } from "../../types/types";
import { Select } from "../Select";
import { SelectOption } from "../Select/types";

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
  const options: SelectOption[] = exchanges.map((exchange) => ({
    id: exchange.exchange_id,
    label: exchange.name,
    imageUrl: exchange.image,
  }));

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
    />
  );
}
