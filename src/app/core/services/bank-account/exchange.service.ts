import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, tap, map, Observable } from 'rxjs';

export interface Rate {
  code: string;
  rate: number;
  change: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
    private cachedData = signal<any>(null);
    private http = inject(HttpClient);

    private rateCurrencies = ['DKK', 'SEK', 'PLN'];
    
    getRates(forceRefresh = false) {
        const cached = this.cachedData();
        if(!forceRefresh && cached) {
            return of(cached);
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const startDate = sevenDaysAgo.toISOString().slice(0, 10);

        const url = 'https://api.frankfurter.dev/v1/' + startDate + '..?base=EUR&symbols=DKK,SEK,PLN';

        return this.http.get<any>(url)
            .pipe(tap((data) => (this.cachedData.set(data))))
    }
    
    getRateList(): Observable<Rate[]> {
        return this.getRates().pipe(
            map((data) => {
            const dates = Object.keys(data.rates).sort();
            const lastDate = dates[dates.length - 1];

            return this.rateCurrencies.map((code) => ({
                code,
                rate: data.rates[lastDate][code],
                change: Math.round(this.getChangePercent(data, code) * 100) / 100,
                }));
            })
        );
    }


    getChangePercent(data: any, currency: string) {
    const dates = Object.keys(data.rates).sort();
 
    const firstRate = data.rates[dates[0]][currency];
    const lastRate = data.rates[dates[dates.length - 1]][currency];
 
    return ((lastRate - firstRate) / firstRate) * 100;
  }

}
