import { Injectable, computed, inject, signal } from '@angular/core';
import { AppwriteService } from '@core/services/appwrite.service';
import { Query } from 'appwrite';
import { environment } from '@/environments/environment';
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
    }

    addCurrency(currency: SupportedCurrency) {
        if (this.requireAccount()[currency] !== null) {
            throw new Error(`${currency.toUpperCase()} account already exists`);
        }
        return this.setCurrencyAmount(currency, 0);
    }

    removeCurrency(currency: SupportedCurrency) {
        if(currency === 'eur') throw new Error('Cannot remove the base EUR account.');
        /* const balance = this.requireBalance(currency);
        if (balance > 0) throw new Error(`Withdraw or transfer your ${currency.toUpperCase()} balance first`); */
        return this.setCurrencyAmount(currency, null);
    }

    async deposit(currency: SupportedCurrency, amount: number) {
        this.assertPositive(amount);
        const currentAmount = this.requireBalance(currency);

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

        await this.updateAccount({
            [currency]: this.round2(currentAmount + amount),
            dailyDepositedEur: this.round2(usedToday + amountEur),
            dailyDepositDate: this.today(),
        });
    }

    private async setCurrencyAmount(currency: SupportedCurrency, amount: number | null) {
        await this.updateAccount({[currency]: amount });
    }

    private async updateAccount(data: Partial<BankAccount>) {
        const account = this.requireAccount();

        await this.appwrite.tablesDB.updateRow({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteBankAccountsId,
            rowId: account.$id,
            data,
        })
        this.bankAccount.update(a => a && {... a, ...data});
    }

    async withdraw(currency: SupportedCurrency, amount: number) {
        this.assertPositive(amount);
        const currentAmount = this.requireBalance(currency);

        if (amount > currentAmount) throw new Error('Insufficient funds');

        await this.setCurrencyAmount(currency, this.round2(currentAmount - amount));
    }

    async transfer(from: SupportedCurrency, to: SupportedCurrency, amount: number) {
        this.assertPositive(amount);
        if (from === to) throw new Error('Choose two different currencies');

        const fromAmount = this.requireBalance(from);
        const toAmount = this.requireBalance(to);
        if (amount > fromAmount) throw new Error('Insufficient funds');
        
        let converted: number;
        try {
            converted = await firstValueFrom(this.cc.convert(amount, from, to));
        } catch {
            throw new Error('Could not fetch the exchange rate. Try again later.');
        }

        await this.updateAccount({
            [from]: this.round2(fromAmount - amount),
            [to]: this.round2(toAmount + converted)
        });

        return converted;
    }


    async send(toUserId: string, currency: SupportedCurrency, amount: number) {
        this.assertPositive(amount);
        const account = this.requireAccount();
        if (toUserId === account.userId) throw new Error('Cannot send money to yourself');

        const currentAmount = this.requireBalance(currency);
        if (amount > currentAmount) throw new Error('Insufficient funds');

        const res = await this.appwrite.tablesDB.listRows({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteBankAccountsId,
            queries: [Query.equal('userId', toUserId), Query.limit(1)]
        });

        const receiver = res.rows[0];
        if (!receiver) throw new Error('Recipient has no bank account');

        const receiverAmount = receiver[currency] as number | null;
        if (receiverAmount === null) throw new Error(`Recipient has no ${currency.toUpperCase()} account`);

        await this.withdraw(currency, amount);

        try {
            await this.appwrite.tablesDB.updateRow({
                databaseId: environment.appwriteDatabaseId,
                tableId: environment.appwriteBankAccountsId,
                rowId: receiver.$id,
                data: { [currency]: this.round2(receiverAmount + amount) }
            });
        } catch {
            const live = this.requireBalance(currency);
            await this.setCurrencyAmount(currency, this.round2(live + amount));
            throw new Error('Transfer failed, you were refunded');
        }
    }

    private round2(value: number): number {
        return Math.round(value * 100) / 100;
    }

    private requireAccount(): BankAccount {
        const account = this.bankAccount();
        if (!account) throw new Error('No account loaded');
        return account;
    }

    private requireBalance(currency: SupportedCurrency): number {
        const balance = this.requireAccount()[currency];
        if (balance === null) throw new Error(`${currency.toUpperCase()} account has not been added yet`);
        return balance;
    }

    private assertPositive(amount: number): void {
        if (amount <= 0) throw new Error('Amount must be positive');
    }
}
