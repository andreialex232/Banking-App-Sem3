import { Injectable, computed, inject, signal } from '@angular/core';
import { AppwriteService } from '@core/services/appwrite.service';
import { Query } from 'appwrite';
import { environment } from '@/environments/environment.development';
import { SupportedCurrency } from '@core/models/currency/currency.models';
import { BankAccount } from '@core/models/bank-account/bank-account.models';
import { CurrencyService } from './currency-converter.service';
import { PlansService } from './plans.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
    private appwrite = inject(AppwriteService);
    private plans = inject(PlansService);
    private cc = inject(CurrencyService);

    bankAccount = signal<BankAccount | null>(null);
    dailyLimit = computed(() => this.plans.dailyDepositLimitFor(this.bankAccount()?.plan));
    depositedToday = computed(() => {
        const a = this.bankAccount();
        return a?.dailyDepositDate === this.today() ? (a.dailyDepositedEur ?? 0) : 0;
    });

    private today(): string {
        return new Date().toISOString().slice(0, 10); // UTC day
    }

    async loadBankAccount(userId: string, forceRefresh = false): Promise<BankAccount | null> {
        const cached = this.bankAccount();
        if (!forceRefresh && cached && cached.userId === userId) {
            return cached;
        }

        const result = await this.appwrite.tablesDB.listRows({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteBankAccountsId,
            queries: [Query.equal('userId', userId)]
        });

        const account = result.rows.length > 0 ? (result.rows[0] as unknown as BankAccount) : null;
        this.bankAccount.set(account);
        return account;
    };

    addCurrency(accountRowId: string, currency: SupportedCurrency) {
        return this.setCurrencyAmount(accountRowId, currency, 0);
    }

    removeCurrency(accountRowId: string, currency: SupportedCurrency) {
        if(currency === 'eur') {
            throw new Error('Cannot remove the base EUR account.');
        }
        
        return this.setCurrencyAmount(accountRowId, currency, null);
    }

    async deposit(accountRowId: string, currency: SupportedCurrency, amount: number) {
        if (amount <= 0) throw new Error('Amount must be positive');

        const account = this.bankAccount();
        if (!account) throw new Error('No account loaded');

        const currentAmount = account[currency];
        if (currentAmount === null) throw new Error(`${currency.toUpperCase()} account has not been added yet`);

        let amountEur: number;
        try {
            amountEur = await firstValueFrom(this.cc.toEur(amount, currency));
        } catch {
            throw new Error('Could not fetch the exchange rate. Try again later.');
        }

        const usedToday = this.depositedToday();

        if (usedToday + amountEur > this.dailyLimit()) {
            const left = Math.max(this.dailyLimit() - usedToday, 0);
            throw new Error(`Daily deposit limit reached. You can still deposit ${left.toFixed(2)} EUR today.`);
        }

        await this.updateAccount(accountRowId, {
            [currency]: currentAmount + amount,
            dailyDepositedEur: Math.round((usedToday + amountEur) * 100) / 100,
            dailyDepositDate: this.today(),
        });
    }

    async setCurrencyAmount(accountRowId: string, currency: SupportedCurrency, amount: number | null) {
        await this.updateAccount(accountRowId, { [currency]: amount });
    }

    private async updateAccount(rowId: string, data: Partial<BankAccount>) {
        await this.appwrite.tablesDB.updateRow({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteBankAccountsId,
            rowId,
            data
        })

        const current = this.bankAccount();
        if (current) this.bankAccount.set({ ...current, ...data });
    }

    async withdraw(accountRowId: string, currency: SupportedCurrency, amount: number) {
        if (amount <= 0) throw new Error('Amount must be positive');

        const account = this.bankAccount();
        if (!account) throw new Error('No account loaded');

        const currentAmount = account[currency];
        if (currentAmount === null) throw new Error(`${currency.toUpperCase()} account has not been added yet`);
        if (amount > currentAmount) throw new Error('Insufficient funds');

        await this.setCurrencyAmount(accountRowId, currency, currentAmount - amount);
    }
}
