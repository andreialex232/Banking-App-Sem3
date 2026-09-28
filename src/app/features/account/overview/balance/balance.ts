import { AfterViewInit, Component, computed, DestroyRef, effect, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyService } from '@core/services/bank-account/currency-converter.service';
import { BankAccount } from '@core/models/bank-account/bank-account.models';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportedCurrency } from '@core/models/currency/currency.models';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '@core/services/auth/auth.service';
import { BankAccountService } from '@core/services/bank-account/bank-account.service';
import { Button } from '@shared/ui/button/button';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-balance',
  imports: [Button, FormsModule, DecimalPipe],
  templateUrl: `./balance.html`,
  styles: ``,
})
export class Balance implements OnInit, AfterViewInit {
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private bankAccountService = inject(BankAccountService);
    private destroyRef = inject(DestroyRef);
    private currencyService = inject(CurrencyService);
    private router = inject(Router);

    @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;
    chart!: Chart;

    depositAmount = signal<number | null>(null);
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

    remaining = computed(() => Math.max(this.dailyLimit() - this.depositedToday(), 0));
    usedPercentage = computed(() =>
        this.dailyLimit()
            ? Math.min(Math.round((this.depositedToday() / this.dailyLimit()) * 100), 100)
            : 0
    );

    constructor() {
        effect(() => {
            this.currency();
            this.balance();
            this.depositedToday();

            if(this.viewReady) {
                this.createChart();
            }
        });
    }
    
    async ngOnInit(): Promise<void> {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(params => {
                this.currency.set(params.get('currency')! as SupportedCurrency);
            });

        const user = await this.authService.getCurrentUser();
        if (user) {
            await this.bankAccountService.loadBankAccount(user.$id);
        }
    }

    ngAfterViewInit(): void {
        this.viewReady = true;
        if (this.currency()) {
            this.createChart();
        }
    };

    async addFunds() {
        await this.runTransaction((account, curr, amount) =>
            this.bankAccountService.deposit(account.$id, curr, amount)
        );
    }

    async removeFunds() {
        await this.runTransaction((account, curr, amount) =>
            this.bankAccountService.withdraw(account.$id, curr, amount)
        );
    }
    

    private async runTransaction(action: (account: BankAccount, curr: SupportedCurrency, amount: number) => Promise<void>) {
        const account = this.bankAccount();
        const curr = this.currency();
        const amount = this.depositAmount();
        if (!account || !curr || !amount) return;

        this.isProcessing.set(true);
        this.error.set('');
        try {
            await action(account, curr, amount);
            this.depositAmount.set(null);
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
            await this.bankAccountService.removeCurrency(account.$id, curr);
            this.router.navigate(['/user/overview'])
        } catch(err) {
            console.error('Failed to remove currency', err);
        } finally {
            this.isDeleting.set(false);
        }
    }


    //Chart stuff below
    createChart() {
        const rootStyles = getComputedStyle(document.documentElement);
        const primaryColor = rootStyles.getPropertyValue('--color-primary').trim();

        this.chart?.destroy();

        this.chart = new Chart<'doughnut'>(this.donutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Deposited today', 'Remaining today'],
                datasets: [{
                    data: [this.depositedToday(), this.remaining()],
                    backgroundColor: [primaryColor, '#e5e7eb'],
                    borderWidth: 2,
                    cutout: '70%'
                }] as any
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },
            plugins: [this.centerTextPlugin]
        })
    }

    centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart: Chart) => {
            const { ctx } = chart;
            const { width, height } = chart;
            ctx.save();

            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000';

            const text = this.currencyService.format(this.balance(), this.currency()!);
            ctx.fillText(text, width / 2, height / 2);
            ctx.restore();
        }
    }
}
