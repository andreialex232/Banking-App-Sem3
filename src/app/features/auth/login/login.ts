import { Component, inject } from '@angular/core';
import { AuthFormComponent } from '../components/auth-form-component/auth-form-component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  template: `
<app-auth-form-component 
    [messages]="news" 
    variant="login"
    [form]="loginForm">
    <span sidebar-title class="text-orange">Latest news</span>
</app-auth-form-component>
  `,
  styles: ``,
})
export class Login {
    private fb = inject(FormBuilder);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    protected readonly news = [
        {
            title: 'Instant SEPA',
            description: 'Send and receive funds across Europe in under 10 seconds with zero execution fees.'
        },
        {
            title: 'Biometric & Passkey Support',
            description: 'Log in securely using Face ID or your fingerprint—no passwords required.'
        },
        {
            title: 'High-Yield Vault Rates',
            description: 'Interest on flexible savings vaults has been bumped to 3.5% p.a., paid out monthly.'
        },
        {
            title: 'Single-Use Virtual Cards',
            description: 'Instantly lock, freeze, or regenerate temporary cards directly from your settings.'
        },
        {
            title: 'Tap & Pay Integration',
            description: 'Connect your banking cards to Apple Pay and Google Wallet with a single tap.'
        },
    ]
}
