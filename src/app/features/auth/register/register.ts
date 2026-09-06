import { Component, inject, viewChild } from '@angular/core';
import { AuthFormComponent } from '../components/auth-form-component/auth-form-component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  selector: 'app-register',
  imports: [AuthFormComponent, ReactiveFormsModule],
  template: `
<app-auth-form-component 
    variant="register" 
    [form]="registerForm" 
    (formSubmit)="createAccount()"
    [messages]="signingUpBenefits">
    <span sidebar-title class="text-orange">Get access to</span>
</app-auth-form-component>
  `,
  styles: ``,
})
export class Register {
    private fb = inject(FormBuilder);
    private readonly authForm = viewChild.required(AuthFormComponent);

    registerForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, passwordMatchValidator]],
        country: ['', Validators.required],
        postalCode: ['', Validators.required]
    });

    createAccount(){
        this.authForm().scrollToFirstInvalidField();
    };

    protected readonly signingUpBenefits = [
        {
            title: 'Seamless Everyday Transactions',
            description: 'Easily receive salary payments, pay bills via direct debit, and transfer funds instantly to friends or businesses.'
        },
        {
            title: 'Interest Earnings',
            description: 'Earn passive yield on your balance through high-interest savings accounts or fixed-term deposits.'
        },
        {
            title: 'Fraud & Theft Protection',
            description: 'Keep your money safe behind multi-factor authentication, encryption, and institutional security measures rather than storing physical cash.'
        },
        {
            title: 'Government Deposit Insurance',
            description: 'Protect your hard-earned funds against institutional failure through government-backed insurance schemes.'
        },
        {
            title: 'Access to Credit & Loans',
            description: 'Build a recognized financial history and credit profile, making it significantly easier to qualify for mortgages, car loans, or personal lines of credit.'
        },
        {
            title: '24/7 Digital Management',
            description: 'Monitor your spending, track balances, and manage your assets anytime through web dashboards and mobile applications.'
        },
        {
            title: 'Global Payment Networks',
            description: 'Spend money worldwide online or in person using debit or credit cards tied to global payment networks like Visa or Mastercard.'
        },
        {
            title: 'Automated Budgeting & Insights',
            description: 'Gain instant visibility into your monthly cash flow with automated category tagging, real-time spending notifications, and analytics.'
        },
        {
            title: 'Financial Services Ecosystem',
            description: 'Unlock direct access to broader financial products under one roof, including investment portfolios, retirement accounts, and insurance policies.'
        },
        {
            title: 'Rewards & Cashback Perks',
            description: 'Earn credit card points, cashback on daily purchases, or sign-up bonuses just for opening an account and maintaining direct deposits.'
        }
    ];
}
