import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, map, tap } from 'rxjs';
import { SupportedCurrency, currencyLocaleMap, SUPPORTED_CURRENCIES } from '@core/models/currency/currency.models';
import { FrankfurterResponse, Rate } from '@core/models/bank-account/exchange-rate.models';

const FRANKFURTER_URL = 'https://api.frankfurter.dev/v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const OTHER_CURRENCIES = SUPPORTED_CURRENCIES
    .filter((currency) => currency !== 'eur')
    .map((currency) => currency.toUpperCase());

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
    private http = inject(HttpClient);
    private cachedData: FrankfurterResponse | null = null;
    private cachedAt = 0; // time (in ms) when the cache was filled


    private loadRates(forceRefresh = false): Observable<FrankfurterResponse> {
    const cached = this.cachedData;
    const cacheIsFresh = Date.now() - this.cachedAt < CACHE_TTL_MS;

    if (cached && cacheIsFresh && !forceRefresh) {
        return of(cached);
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().slice(0, 10);

    const params = new HttpParams()
        .set('base', 'EUR')
        .set('symbols', OTHER_CURRENCIES.join(','));

    return this.http
        .get<FrankfurterResponse>(`${FRANKFURTER_URL}/${startDate}..`, { params })
        .pipe(
            tap((data) => {
            this.cachedData = data;
            this.cachedAt = Date.now();
            })
        );
    }

    private getLatestRates(data: FrankfurterResponse): Record<string, number> {
        const dates = Object.keys(data.rates).sort();
        const lastDate = dates[dates.length - 1];
        return { ...data.rates[lastDate], EUR: 1 };
    }

    convert(amount: number, from: SupportedCurrency, to: SupportedCurrency): Observable<number> {
        if (from === to) return of(amount);

        return this.loadRates().pipe(
            map((data) => {
                const rates = this.getLatestRates(data);
                const fromRate = rates[from.toUpperCase()];
                const toRate = rates[to.toUpperCase()];

            if (fromRate === undefined || toRate === undefined) {
                throw new Error(`No rate available for ${from} -> ${to}`);
            }

            // All rates mean "how much of this currency is 1 EUR".
            // So: go to EUR first (divide by the from-rate), then to the target (multiply by the to-rate).
            const amountInEur = amount / fromRate;
            return amountInEur * toRate;
            })
        );
    }

    toEur(amount: number, currency: SupportedCurrency): Observable<number> {
        return this.convert(amount, currency, 'eur');
    }

    getRateList(forceRefresh = false): Observable<Rate[]> {
        return this.loadRates(forceRefresh).pipe(
        map((data) => {
            const latestRates = this.getLatestRates(data);

            return OTHER_CURRENCIES.map((code) => ({
                code,
                rate: latestRates[code],
                change: Math.round(this.getChangePercent(data, code) * 100) / 100,
                }));
            })
        );
    }

    private getChangePercent(data: FrankfurterResponse, currency: string): number {
        const dates = Object.keys(data.rates).sort();

        const firstRate = data.rates[dates[0]][currency];
        const lastRate = data.rates[dates[dates.length - 1]][currency];

        return ((lastRate - firstRate) / firstRate) * 100;
    }

    format(amount: number, currency: SupportedCurrency): string {
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
}
