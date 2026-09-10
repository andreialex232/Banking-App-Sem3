import { Component, computed, inject, viewChild } from '@angular/core';
import { AuthFormComponent } from '../components/auth-form-component/auth-form-component';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { postalCodeValidator } from '../validators/postal-code.validators';
import { InputField } from '../components/input-field/input-field';
import { markIfInvalid } from '@shared/utils/form.utils';
import { Button } from '@shared/ui/button/button';

@Component({
  selector: 'app-register',
  imports: [Button, ReactiveFormsModule, InputField],
  template: `
<!-- <app-auth-form-component 
    variant="register" 
    [form]="registerForm" 
    (formSubmit)="createAccount()"
    [messages]="signingUpBenefits">
    <span sidebar-title class="text-orange">Get access to</span>
</app-auth-form-component> -->
<div class="bg-[url('/assets/images/test-register-2.jpg')] min-h-screen bg-cover bg-center grid grid-cols-12 items-start gap-4 py-10 min-h-screen h-auto">
    <form [formGroup]="registerForm" class="px-8 py-8 col-start-2 col-end-8 text-black bg-white rounded-xl h-fit">
            <div class="space-y-12">
                <div class="border-b border-white/10 pb-6 flex justify-start gap-2 flex-col">
                
                    <h2 class="text-3xl text-black sm:text-5xl font-bold capitalize"><span class="text-orange">One step closer</span> to financial freedom</h2>
                    <p class="font-medium text-xl">Create an account and start saving smart today</p>

                <!-- First name -->
                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    @let firstName = this.registerForm.controls.firstName;
                    <app-input-field
                        id="first-name"
                        [control]="firstName"
                        label="First name"
                        autocomplete="given-name">
                        <ng-container errors>
                            @if (firstName.hasError('required')) {
                                First name is required
                            }
                            @if (firstName.hasError('minlength')) {
                                First name needs at least 2 char
                            }
                        </ng-container>
                    </app-input-field>

                    <!-- Last name -->
                    @let lastName = this.registerForm.controls.lastName;
                    <app-input-field
                        id="last-name"
                        [control]="lastName"
                        label="Last name"
                        autocomplete="family-name">
                        <ng-container errors>
                            @if (lastName.hasError('required')) {
                                Last name is required
                            }
                            @if (lastName.hasError('minlength')) {
                                Last name needs at least 2 char
                            }
                        </ng-container>
                    </app-input-field>

                    <!-- Email -->
                    @let email = this.registerForm.controls.email;
                    <app-input-field
                        colSpan="sm:col-span-4"
                        id="email"
                        [control]="email"
                        label="Email Address">
                        <ng-container errors>
                            @if (email.hasError('required')) {
                                Email is required
                            }
                            @if (email.hasError('email')) {
                                Email needs to be valid
                            }
                        </ng-container>
                    </app-input-field>

                    <!-- Password -->
                    @let password = this.registerForm.controls.password;
                    <app-input-field
                        id="password"
                        [control]="password"
                        label="Password"
                        autocomplete="password"
                        type="password">
                        <ng-container errors>
                            @if (password.hasError('required')) {
                                Password is required
                            }
                            @if (password.hasError('minlength')) {
                                Password needs at least 8 char
                            }
                        </ng-container>
                    </app-input-field>

                    <!-- Confirm Password -->
                    @let confirmPassword = this.registerForm.controls.confirmPassword;
                    <app-input-field
                        id="confirm-password"
                        [control]="confirmPassword"
                        label="Confirm Password"
                        autocomplete="password"
                        type="password">
                        <ng-container errors>
                            @if (confirmPassword.hasError('required')) {
                                Password is required
                            }
                            @if (confirmPassword.hasError('passwordMismatch')) {
                                Passwords don't match
                            }
                        </ng-container>
                    </app-input-field>

                    <!-- Country -->
                    @let country = this.registerForm.controls.country;
                    <div class="sm:col-span-3">
                            <label for="country" class="grid grid-cols-1 text-sm/6 font-medium">
                                <span [class.opacity-0]="country.invalid && country.touched" class="col-start-1 row-start-1 transition-opacity duration-150">Select country</span>
                                <span [class.opacity-0]="country.invalid && country.untouched" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
                                    @if(country.hasError('required')) {
                                        Country is required
                                    }
                                </span>
                            </label>
                            <div class="group mt-2 grid grid-cols-1">
                                <select 
                                    formControlName="country"
                                    id="country"
                                    name="country" 
                                    (blur)="markIfInvalid(country)"
                                    (change)="markIfInvalid(country)"
                                    [class.outline-red-500]="country.invalid && country.touched"
                                    autocomplete="country-name" 
                                    class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base outline-1 -outline-offset-1 outline-[var(--color-input-border,#D1D5DB)] focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 [&>option]:bg-white/5 [&>option]:text-black"
                                >
                                    <option value="" disabled selected>Select</option>
                                    <option value="Denmark">Denmark</option>
                                    <option value="Sweden">Sweden</option>
                                    <option value="Poland">Poland</option>
                                </select>
                                <svg 
                                viewBox="0 0 16 16" 
                                fill="currentColor" 
                                data-slot="icon" 
                                aria-hidden="true" 
                                class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 transition-transform duration-200 group-focus-within:rotate-180 group-has-[:open]:rotate-180 sm:size-4"
                                >
                                <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <!-- Postal code -->
                    @let postalCode = this.registerForm.controls.postalCode;
                    <app-input-field
                        [disabled]="isPostalCodeDisabled()"
                        colSpan="sm:col-span-2"
                        id="postal-code"
                        [control]="postalCode"
                        label="Postal Code">
                        <ng-container errors>
                            @if (postalCode.hasError('required')) {
                                Postal code is required
                            }
                            @if (postalCode.hasError('invalidPostalCode')) {
                                Postal code is invalid
                            }
                        </ng-container>
                    </app-input-field>
                    
                    <!-- Street -->
                    @let street = this.registerForm.controls.street;
                    <app-input-field
                        colSpan="col-span-full"
                        id="street-address"
                        [control]="street"
                        label="Street Address">
                        <ng-container errors>
                            @if (street.hasError('required')) {
                                Street Address is required
                            }
                        </ng-container>
                    </app-input-field>
                </div>

                
                <!-- Sign in / Create account button -->
                    <div class="mt-4">
                        <app-button buttonType="submit" element="button">
                            Sign in
                        </app-button>
                    </div>
                </div>
            </div>
        </form>

        <!-- Right side text -->
        <!-- @if(messages()) {
            <div class="flex flex-col gap-4 col-start-8 col-end-12 rounded-xl bg-white p-4">
                <div>
                    <h2 class="text-2xl text-black sm:text-3xl font-bold capitalize">
                        <ng-content select="[sidebar-title]"></ng-content>
                    </h2>
                </div>
                <ul class="flex flex-col gap-4">
                    @for (message of messages(); track message.title) {
                        <li class="flex flex-col">
                            <h3 class="text-orange font-bold">{{message.title}}</h3>
                            <p class="text-sm">{{message.description}}</p>
                        </li>
                    }
                </ul>
            </div>
        } -->
    </div>
  `,
  styles: ``,
})
export class Register {
    markIfInvalid = markIfInvalid;
    private fb = inject(FormBuilder);
    private readonly authForm = viewChild.required(AuthFormComponent);

    registerForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, passwordMatchValidator]],
        country: ['', Validators.required],
        street: ['', Validators.required],
        postalCode: ['', [Validators.required, postalCodeValidator]]
    });

    createAccount(){
        this.authForm().scrollToFirstInvalidField();
    };

    isPostalCodeDisabled(): boolean {
        return !this.registerForm.controls.country.value;
    }

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
