import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BankAccount } from '@core/models/bank-account/bank-account.models';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportedCurrency } from '@core/models/currency/currency.models';
import { AuthService } from '@core/services/auth/auth.service';
import { BankAccountService } from '@core/services/bank-account/bank-account.service';
import { CurrencyConverter } from './currency-converter/currency-converter';
import { Button } from '@shared/ui/button/button';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AmountField } from '@shared/forms/amount-field/amount-field';
import { SendBalance } from './send-balance/send-balance';
import { formatMoney } from '@shared/utils/format-money';
import { DepositLimitChart } from '@shared/ui/chart/deposit-limit-chart';

@Component({
  selector: 'app-balance',
  imports: [Button, FormsModule, DecimalPipe, CurrencyConverter, AmountField, SendBalance, DepositLimitChart],
  templateUrl: `./balance.html`,
  styles: ``,
})
export class Balance implements OnInit {
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private bankAccountService = inject(BankAccountService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    form = new FormGroup({
        depositAmount: new FormControl<number | null>(null, [
            Validators.required,
            Validators.min(0.01),
            Validators.max(1_000_000)
        ])
    })
    get depositAmount() {return this.form.controls.depositAmount; }

    currency = signal<SupportedCurrency | null>(null);
    bankAccount = this.bankAccountService.bankAccount;
    dailyLimit = this.bankAccountService.dailyLimit;
    depositedToday = this.bankAccountService.depositedToday;
    error = signal('');

    isDeleting = signal(false);
    private viewReady = false;
    isProcessing = signal(false);

    balance = computed(() => {
        const account = this.bankAccount();
        const curr = this.currency();
        return account && curr ? (account[curr] ?? 0) : 0;
    });
    balanceText = computed(() => {
        const curr = this.currency();
        return curr ? formatMoney(this.balance(), curr) : '';
    });

    remaining = computed(() => Math.max(this.dailyLimit() - this.depositedToday(), 0));
    usedPercentage = computed(() =>
        this.dailyLimit()
            ? Math.min(Math.round((this.depositedToday() / this.dailyLimit()) * 100), 100)
            : 0
    );

    async ngOnInit(): Promise<void> {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(params => {
                this.currency.set(params.get('currency')! as SupportedCurrency);
            });

        const user = await this.authService.restoreSession();
        if (user) {
            await this.bankAccountService.loadBankAccount(user.$id);
        }
    }

    async addFunds() {
        await this.runTransaction((account, curr, amount) =>
            this.bankAccountService.deposit(curr, amount)
        );
    }

    async removeFunds() {
        await this.runTransaction((account, curr, amount) =>
            this.bankAccountService.withdraw(curr, amount)
        );
    }
    
    private async runTransaction(action: (account: BankAccount, curr: SupportedCurrency, amount: number) => Promise<void>) {
        const account = this.bankAccount();
        const curr = this.currency();
        const { depositAmount } = this.form.getRawValue();
        /* const amount = this.depositAmount(); */
        if (!account || !curr || !depositAmount) return;

        this.isProcessing.set(true);
        this.error.set('');
        try {
            await action(account, curr, depositAmount);
            this.form.reset();
            /* this.depositAmount.set(null); */
        } catch (err) {
            this.error.set(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            this.isProcessing.set(false);
        }
    }

    async removeCurrency() {
        const account = this.bankAccount();
        const curr = this.currency();
        if(!account || !curr) return;

        this.isDeleting.set(true);

        try {
            await this.bankAccountService.removeCurrency(curr);
            this.router.navigate(['/user/overview'])
        } catch(err) {
            console.error('Failed to remove currency', err);
        } finally {
            this.isDeleting.set(false);
        }
    }
}
