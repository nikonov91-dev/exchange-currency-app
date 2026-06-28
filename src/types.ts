export interface RateItem {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export interface HistoryPoint {
  date: string; // "DD.MM" label
  rate: number;
  fullDate: string; // "YYYYMMDD"
}

export interface CacheData {
  updatedAt: string;
  dateStr: string;
  currentRates: RateItem[];
  history: Record<string, HistoryPoint[]>;
}

export interface ConversionState {
  fromCC: string;
  toCC: string;
  fromAmount: number;
  toAmount: number;
}
