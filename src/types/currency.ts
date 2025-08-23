import { Currency as CurrencyConstant } from "@/constants";

export type Currency = (typeof CurrencyConstant)[keyof typeof CurrencyConstant];
