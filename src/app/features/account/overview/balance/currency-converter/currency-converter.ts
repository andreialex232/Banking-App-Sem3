import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportedCurrency, SUPPORTED_CURRENCIES } from '@core/models/currency/currency.models';
import { CurrencyService } from '@core/services/bank-account/currency-converter.service';
import { differentCurrencies } from './validators/different-currencies.validator';
import { Button } from '@shared/ui/button/button';
import { AmountField } from '@shared/forms/amount-field/amount-field';
import { ExchangeService, Rate } from '@core/services/bank-account/exchange.service';
import { BankAccountService } from '@core/services/bank-account/bank-account.service';

@Component({
  selector: 'app-currency-converter',
  imports: [ReactiveFormsModule, Button, AmountField],
  templateUrl: `./currency-converter.html`,
  styles: ``
})
export class CurrencyConverter {
    private cc = inject(CurrencyService);
    private destroyRef = inject(DestroyRef);
    private exchangeService = inject(ExchangeService);
    private bankAccountService = inject(BankAccountService);

    readonly currencies: SupportedCurrency[] = SUPPORTED_CURRENCIES;
    rates = toSignal(this.exchangeService.getRateList(), { initialValue: [] as Rate[] });

    form = new FormGroup({
        amount: new FormControl<number | null>(null, {
                validators: [
                    Validators.required,
                    Validators.min(0.01),
                    Validators.max(1_000_000)
                ],
                updateOn: 'blur'
            }
        ),
        from: new FormControl<SupportedCurrency>('eur', {nonNullable: true}),
        to: new FormControl<SupportedCurrency>('pln', {nonNullable: true})
    },{validators: differentCurrencies})

    loading = signal(false);
    result = signal<string | null>(null);
    apiError = signal<string | null>(null);

    constructor() {
        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.result.set(null);
                this.apiError.set(null);
            });
    }

    get amount() {return this.form.controls.amount; }
    get from() {return this.form.controls.from; }
    get to() {return this.form.controls.to; }

    swap() {
        const { from, to } = this.form.getRawValue();
        this.form.patchValue({ from: to, to: from });
    };

    async convert() {
        if(this.form.invalid) {
            this.form.markAllAsTouched()
            return;
        }

        const { amount, from, to } = this.form.getRawValue();
        this.resetConversionFeedback();
        
        try {
            const account = this.bankAccountService.bankAccount();
            if (!account) throw new Error('No account loaded');
            const converted = await this.bankAccountService.transfer(account.$id, from, to, amount!);
            this.result.set(`${this.cc.format(amount!, from)} = ${this.cc.format(converted, to)}`);            
        } catch(err) {
            this.apiError.set(err instanceof Error ? err.message : 'Something went wrong. Try later.');
        } finally {
            this.loading.set(false);
        }
    }

    private resetConversionFeedback() {
        this.loading.set(true);
        this.result.set(null);
        this.apiError.set(null);
    }

}
