export type SupportedCurrency = 'eur' | 'dkk' | 'sek' | 'pln';

export const currencyLocaleMap: Record<SupportedCurrency, string> = {
    eur: 'en-IE',
    dkk: 'da-DK',
    sek: 'sv-SE',
    pln: 'pl-PL',
};

export const SUPPORTED_CURRENCIES = Object.keys(currencyLocaleMap) as SupportedCurrency[];
export const CONVERTABLE_CURRENCIES = ['DKK', 'SEK', 'PLN'];
