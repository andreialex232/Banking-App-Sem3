import { SupportedCurrency, currencyLocaleMap } from '@core/models/currency/currency.models';

// Turns 1234.5 and 'dkk' into a nice string like "1.234,5 DKK"
export function formatMoney(amount: number, currency: SupportedCurrency): string {
    const locale = currencyLocaleMap[currency];
    const parts = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).formatToParts(amount);

    return parts
        .map((part) => (part.type === 'currency' ? ` ${part.value} ` : part.value))
        .join('')
        .trim()
        .replace(/\s+/g, ' ');
}