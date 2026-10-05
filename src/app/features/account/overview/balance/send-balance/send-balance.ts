import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BankAccountService } from '@core/services/bank-account/bank-account.service';
import { AmountField } from '@shared/forms/amount-field/amount-field';
import { FormsModule, FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@shared/ui/button/button';
import { ProfileBadge } from '@shared/ui/profile-badge/profile-badge';
import { ProfileService, Recipient } from '@core/services/profile.service';

@Component({
  selector: 'app-send-balance',
  imports: [AmountField, FormsModule, Button, ProfileBadge, ReactiveFormsModule],
  templateUrl: './send-balance.html',
  styles: ``,
})
export class SendBalance {
    private profileService = inject(ProfileService);
    private bankAccount = inject(BankAccountService);
    private destroyRef = inject(DestroyRef);
    
    protected readonly avatarUrl = computed(() => this.profileService.avatarUrl());

    protected profile = this.profileService.profile;
    protected readonly fullName = this.profileService.fullName;

    private lastLookup: string | null = null;
    protected recipient = signal<Recipient | null>(null);
    protected state = signal<string | null>(null);
    protected isLooking = signal(false);
    protected isSending = signal(false);

    constructor() {
        this.email.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.recipient.set(null);
                this.state.set(null);
                this.lastLookup = null;
            })
    }

    userForm = new FormGroup({
        amount: new FormControl<number | null>(null, {
            validators: [Validators.required, Validators.min(0.01), Validators.max(1_000_000)], updateOn: 'blur',
        })
    })

    recipientForm = new FormGroup({
        email: new FormControl<string | null>(null, {
            validators: [Validators.required, Validators.email]
        })
    })

    get email() {return this.recipientForm.controls.email}
    get amount() {return this.userForm.controls.amount}

    async lookup() {
        if(this.email.invalid || !this.email.value) return;
        const req = this.email.value.trim().toLowerCase();
        if (req === this.lastLookup) return;
        if (this.isLooking()) return;

        this.lastLookup = req;
        this.isLooking.set(true);
        this.state.set(null);

        try {
            const result = await this.profileService.findRecipientByEmail(req);
            if (this.email.value?.trim().toLowerCase() !== req) return; // user kept typing, drop stale result
            if (result.userId === this.profile()?.userId) throw new Error('You cannot send money to yourself');
            this.recipient.set(result);
        } catch(err:any) {
            this.state.set(err.message);
        } finally {
            this.isLooking.set(false);
        }
    }

    async send() {
        const recipient = this.recipient();
        const account = this.bankAccount.bankAccount();
        if(!recipient || !account) return;

        this.amount.markAsTouched();
        if (this.amount.invalid || this.amount.value === null) return;

        this.isSending.set(true);
        this.state.set(null);

        try {
            await this.bankAccount.send(account.$id, recipient.userId, 'eur', this.amount.value);
            this.state.set(`Sent to ${recipient.name}`);
            this.amount.reset();
        } catch(e:any) {
            this.state.set(e.message);
        } finally {
            this.isSending.set(false);
        }
    };
}
