import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SUPPORTED_CURRENCIES, SupportedCurrency } from '@core/models/currency/currency.models';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BankAccountService } from '@core/services/bank-account/bank-account.service';
import { AuthService } from '@core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Button } from '@shared/ui/button/button';
@Component({
  selector: 'app-overview',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, FormsModule, Button],
  standalone: true,
  providers: [],
  templateUrl: `./overview.html`,
  styles: ``,
})
export class Overview implements OnInit {
    private bankAcc = inject(BankAccountService);
    private authService = inject(AuthService);

    protected currencies = SUPPORTED_CURRENCIES;
    account = this.bankAcc.bankAccount;

    isAdding = signal(false);
    
    isMenuOpen = signal(false);
    selectedCurrency = signal<SupportedCurrency | null>(null);

    async ngOnInit(): Promise<void> {
        const user = await this.authService.getCurrentUser();
        if(user) {
            await this.bankAcc.loadBankAccount(user.$id);
        } else {
            console.log('No user logged in. (overview.ts)')
        }
    }
    currencyBalances = computed(() => {
        const account = this.account();
        if (!account) return [];

        return SUPPORTED_CURRENCIES.map(currency => ({
            currency,
            amount: account[currency],
            hasAccount: account[currency] !== null
        }));
    });

    missingCurrencies = computed(() =>
        this.currencyBalances().filter(item => !item.hasAccount)
    );

    toggleMenu() {
        this.isMenuOpen.update(open => !open);
    }

    async addSelectedCurrency() {
        const currency = this.selectedCurrency();
        const account = this.account();
        if (!currency || !account) return;

        this.isAdding.set(true);
        try {
            await this.bankAcc.addCurrency(account.$id, currency);
            this.selectedCurrency.set(null);
            this.isMenuOpen.set(false);
        } catch(err) {
            console.error('Failed to add currency', err);
        } finally {
            this.isAdding.set(false);
        }

    }









}
