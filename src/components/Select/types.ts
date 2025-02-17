export interface SelectOption {
  id: string;
  label: string;
  imageUrl?: string;
  suffix?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}
