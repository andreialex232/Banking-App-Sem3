export interface FrankfurterResponse {
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export interface Rate {
  code: string;
  rate: number;
  change: number;
}