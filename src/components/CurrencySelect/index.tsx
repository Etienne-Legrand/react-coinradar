import { Currency } from "@/types";
import { currencies } from "./config";
import { Select } from "../Select";
import { SelectOption } from "../Select/types";
import { useTranslation } from "react-i18next";

interface CurrencySelectProps {
  readonly value: Currency;
  readonly onChange: (currency: Currency) => void;
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const { t } = useTranslation();

  const options: SelectOption[] = Object.entries(currencies).map(
    ([code, data]) => ({
      id: code,
      label: data.name,
      imageUrl: data.imageUrl,
      suffix: data.symbol,
    })
  );

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange as (value: string) => void}
      title={t("tooltips.currency")}
    />
  );
}
