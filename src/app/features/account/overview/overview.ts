import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { SUPPORTED_CURRENCIES, SupportedCurrency } from '@core/models/currency/currency.models';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BankAccountService } from '@core/services/bank-account/bank-account.service';
import { Button } from '@shared/ui/button/button';
import { AppSectionTitle } from '@shared/ui/app-section-title/app-section-title';
@Component({
  selector: 'app-overview',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Button, AppSectionTitle],
  standalone: true,
  templateUrl: `./overview.html`,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu(true)'
  }
})
export class Overview {
    private bankAcc = inject(BankAccountService);

    private addBtn = viewChild<ElementRef<HTMLButtonElement>>('addBtn');
    private menuRoot = viewChild<ElementRef<HTMLElement>>('menuRoot');

    account = this.bankAcc.bankAccount;
    
    isAdding = signal(false);
    
    isMenuOpen = signal(false);
    selectedCurrency = signal<SupportedCurrency | null>(null);

    private currencyBalances = computed(() => {
        const account = this.account();
        if (!account) return [];

        return SUPPORTED_CURRENCIES.map(currency => ({
            currency,
            amount: account[currency],
            hasAccount: account[currency] !== null
        }));
    });

    ownedCurrencies = computed(() =>
        this.currencyBalances().filter(item => item.hasAccount)
    );

    missingCurrencies = computed(() =>
        this.currencyBalances().filter(item => !item.hasAccount)
    );

    toggleMenu() {
        this.isMenuOpen.update(open => !open);
    }

    closeMenu(returnFocus = false) {
        const wasOpen = this.isMenuOpen();
        this.isMenuOpen.set(false);
        this.selectedCurrency.set(null);
        if(wasOpen && returnFocus) this.addBtn()?.nativeElement.focus();
    }

    onDocumentClick(event: MouseEvent) {
        if (!this.isMenuOpen()) return;
        const root = this.menuRoot()?.nativeElement;
        if (root && !root.contains(event.target as Node)) {
            this.closeMenu();
        }
    }

    onCurrencySelected(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        const match = this.missingCurrencies().find(item => item.currency === value);
        this.selectedCurrency.set(match?.currency ?? null);
    }

    async addSelectedCurrency() {
        const currency = this.selectedCurrency();
        if (!currency) return;

        this.isAdding.set(true);
        try {
            await this.bankAcc.addCurrency(currency);
            this.closeMenu(true);
        } catch(err) {
            console.error('Failed to add currency', err);
        } finally {
            this.isAdding.set(false);
        }

    }


}
