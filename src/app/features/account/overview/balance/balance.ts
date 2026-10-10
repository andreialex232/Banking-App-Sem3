import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { SupportedCurrency } from '@core/models/currency/currency.models';
import { AuthService } from '@core/services/auth/auth.service';
import { BankAccountService } from '@core/services/bank-account/bank-account.service';
import { CurrencyConverter } from './currency-converter/currency-converter';
import { Button } from '@shared/ui/button/button';
import { FormControl, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AmountField } from '@shared/forms/amount-field/amount-field';
import { SendBalance } from './send-balance/send-balance';
import { formatMoney } from '@shared/utils/format-money';
import { DepositLimitChart } from '@shared/ui/chart/deposit-limit-chart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balance',
  imports: [Button, DecimalPipe, CurrencyConverter, AmountField, SendBalance, DepositLimitChart],
  templateUrl: `./balance.html`,
})
export class Balance implements OnInit {
    private authService = inject(AuthService);
    private bankAccountService = inject(BankAccountService);
    private router = inject(Router);

    depositAmount = new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0.01),
        Validators.max(1_000_000)
    ]);

    currency = input.required<SupportedCurrency>();
    bankAccount = this.bankAccountService.bankAccount;
    dailyLimit = this.bankAccountService.dailyLimit;
    depositedToday = this.bankAccountService.depositedToday;
    error = signal('');

    isDeleting = signal(false);
    isProcessing = signal(false);

    balance = computed(() => {
        const account = this.bankAccount();
        return account ? (account[this.currency()] ?? 0) : 0;
    });

    balanceText = computed(() => formatMoney(this.balance(), this.currency()));

    remaining = computed(() => Math.max(this.dailyLimit() - this.depositedToday(), 0));
    usedPercentage = computed(() =>
        this.dailyLimit()
            ? Math.min(Math.round((this.depositedToday() / this.dailyLimit()) * 100), 100)
            : 0
    );

    async ngOnInit(): Promise<void> {
        const user = await this.authService.restoreSession();
        if (user) {
            await this.bankAccountService.loadBankAccount(user.$id);
        }
    }

    async addFunds() {
        await this.runTransaction((curr, amount) =>
            this.bankAccountService.deposit(curr, amount)
        );
    }

    async removeFunds() {
        await this.runTransaction((curr, amount) =>
            this.bankAccountService.withdraw(curr, amount)
        );
    }
    
    private async runTransaction(action: (curr: SupportedCurrency, amount: number) => Promise<void>) {
        const amount = this.depositAmount.value;
        if (!this.bankAccount() || !amount) return;

        this.isProcessing.set(true);
        this.error.set('');
        try {
            await action(this.currency(), amount);
            this.depositAmount.reset();
        } catch (err) {
            this.error.set(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            this.isProcessing.set(false);
        }
    }

    async removeCurrency() {
        if (!this.bankAccount()) return;

        this.isDeleting.set(true);

        try {
            await this.bankAccountService.removeCurrency(this.currency());
            this.router.navigate(['/user/overview'])
        } catch(err) {
            console.error('Failed to remove currency', err);
        } finally {
            this.isDeleting.set(false);
        }
    }
}
