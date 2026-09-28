import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap, map, of } from 'rxjs';
import { SupportedCurrency, currencyLocaleMap, ConvertableCurrency } from '@core/models/currency/currency.models';

interface FrankfurterResponse {
    base: string;
    date: string;
    rates: Record<string,number>
}
@Injectable({
  providedIn: 'root',
})

export class CurrencyService {
    private http = inject(HttpClient);
    private ff = 'https://api.frankfurter.dev/v1/latest';

    ffData = signal<any>(null);
    rates = signal<Record<string, number> | null>(null);

    /* loadRates() {
        if(this.rates()) return;

        this.http
            .get<{rates: Record<string, number>}>(
                'https://api.frankfurter.app/latest?from=EUR&to=PLN,SEK,DKK'
            )
            .pipe(tap(res => this.rates.set({... res.rates, EUR: 1})))
            .subscribe();
    }

    convert(amount: number, from: SupportedCurrency, to: SupportedCurrency): number | null {
        const rates = this.rates();
        if(!rates) return null;
        
        const amountInEur = amount / rates[from];
        return amountInEur * rates[to];
    } */

    toEur(amount: number, currency: SupportedCurrency): Observable<number> {
        if (currency === 'eur') return of(amount);
        const code = currency.toUpperCase();
        return this.http
            .get<FrankfurterResponse>(`${this.ff}?base=EUR&symbols=${code}`)
            .pipe(map(({ rates }) => amount / rates[code]));
    }

    format(amount: number, currency: SupportedCurrency): string {
        const locale = currencyLocaleMap[currency];
        const parts = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).formatToParts(amount);
        return parts
                .map(part => part.type === 'currency' ? ` ${part.value} ` : part.value)
                .join('')
                .trim()
                .replace(/\s+/g, ' ');
    }
}
