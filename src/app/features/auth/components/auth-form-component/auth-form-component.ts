import { Component, input, output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Button } from '@shared/ui/button/button';
import { TitleDescription } from '@core/models/title-description';

@Component({
  selector: 'app-auth-form-component',
  imports: [ReactiveFormsModule, Button],
  standalone: true,
  template: `
<div class="bg-[url('/assets/images/test-register-2.jpg')] min-h-screen bg-cover bg-center grid grid-cols-12 items-start gap-4 py-10 min-h-screen h-auto">
    <form [formGroup]="form()" (ngSubmit)="formSubmit.emit($event)" class="px-8 py-8 col-start-2 col-end-8 text-black bg-white rounded-xl h-fit">
            <div class="space-y-12">
                <div class="border-b border-white/10 pb-6 flex justify-start gap-2 flex-col">
                @if(variant() === 'register') {
                    <h2 class="text-3xl text-black sm:text-5xl font-bold capitalize"><span class="text-orange">One step closer</span> to financial freedom</h2>
                    <p class="font-medium text-xl">Create an account and start saving smart today</p>
                } @else if (variant() === 'login') {
                    <h2 class="text-3xl text-black sm:text-5xl font-bold capitalize">Happy to<span class="text-orange"> see you </span>again</h2>
                    <p class="font-medium text-xl">Resume your banking</p>
                }
                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <!-- Register only - first name input - -->
                    @if (variant() === 'register') {
                        @let firstName = getControl('firstName');
                            <div class="sm:col-span-3">
                                <label id="label-first-name" for="first-name" class="grid grid-cols-1 text-sm/6 font-medium">
                                    <span [class.opacity-0]="firstName.invalid && firstName.touched" class="col-start-1 row-start-1 transition-opacity duration-150">First name</span>
                                    <span [class.opacity-0]="firstName.invalid && firstName.untouched" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
                                        @if(firstName.hasError('required')) {
                                            First name is required
                                        } @else if(firstName.hasError('minlength')) {
                                            First name must be longer 
                                        } @else if(firstName.hasError('maxlength')) {
                                            First name is too long
                                        }
                                    </span>
                                </label>
                            <div class="mt-2">
                                <input 
                                    id="first-name" 
                                    formControlName="firstName" 
                                    type="text" name="first-name" 
                                    autocomplete="given-name" 
                                    (blur)="markIfInvalid(firstName)"
                                    [class.input-success]="showSuccess(firstName)"
                                    class="input"/>
                            </div>
                        </div>
                    }

                    <!-- Register only - last name input - -->
                    @if (variant() === 'register') {
                        @let lastName = getControl('lastName');
                            <div class="sm:col-span-3">
                                <label for="last-name" class="grid grid-cols-1 text-sm/6 font-medium">
                                    <span [class.opacity-0]="lastName.invalid && lastName.touched" class="col-start-1 row-start-1 transition-opacity duration-150">Last name</span>
                                    <span [class.opacity-0]="lastName.invalid && lastName.untouched" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
                                        @if(lastName.hasError('required')) {
                                            Last name is required
                                        } @else if(lastName.hasError('minlength')) {
                                            Last name must be longer 
                                        } @else if(lastName.hasError('maxlength')) {
                                            Last name is too long
                                        }
                                    </span>
                                </label>
                                <div class="mt-2">
                                    <input 
                                        formControlName="lastName" 
                                        id="last-name" 
                                        type="text" 
                                        name="last-name" 
                                        autocomplete="family-name" 
                                        (blur)="markIfInvalid(lastName)"
                                        [class.input-success]="showSuccess(lastName)"
                                        class="input">
                                </div>
                            </div>
                    }
                    

                    <!-- Login and register email address input -->
                    @let email = getControl('email');
                    <div class="sm:col-span-4">
                    <label for="email" class="grid grid-cols-1 text-sm/6 font-medium">
                        <span [class.opacity-0]="email.invalid && email.touched" class="col-start-1 row-start-1 transition-opacity duration-150">Email address</span>
                        <span [class.opacity-0]="email.invalid && email.untouched" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
                            @if(email.hasError('required')) {
                                Email address is required
                            } @else if(email.hasError('email')) {
                                Email address must be valid 
                            }
                        </span>
                    </label>
                    <div class="mt-2">
                        <input 
                            id="email" 
                            formControlName="email" 
                            type="email" name="email" 
                            autocomplete="email" 
                            (blur)="markIfInvalid(email)"
                            [class.input-success]="showSuccess(email)"
                            class="input"/>
                    </div>
                    </div>

                    <!-- Login and register password input -->
                    @let password = getControl('password');
                    <div class="sm:col-span-3">
                        <label for="password" class="grid grid-cols-1 text-sm/6 font-medium">
                            <span [class.opacity-0]="password.invalid && password.touched" class="col-start-1 row-start-1 transition-opacity duration-150">Password</span>
                            <span [class.opacity-0]="password.invalid && password.untouched" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
                                @if(password.hasError('required')) {
                                    Password is required
                                } @else if(password.hasError('minlength')) {
                                    Password must be longer than 8
                                }
                            </span>
                        </label>
                        <div class="mt-2">
                            <input 
                                id="password" 
                                formControlName="password" 
                                autocomplete="new-password" 
                                type="password" 
                                name="password" 
                                (blur)="markIfInvalid(password)"
                                [class.input-success]="showSuccess(password)"
                                class="input"/>
                        </div>
                        @if(variant() === 'login') {
                            <a class="hover:underline text-xs" href="">Forgot password?</a>
                        }  
                    </div>

                    <!-- Register only - confirm password input - -->
                    @if (variant() === 'register') {
                        @let confirmPassword = getControl('confirmPassword');
                        <div class="sm:col-span-3">
                            <label for="confirm-password" class="grid grid-cols-1 text-sm/6 font-medium">
                                <span [class.opacity-0]="confirmPassword.invalid && confirmPassword.touched" class="col-start-1 row-start-1 transition-opacity duration-150">Confirm password</span>
                                <span [class.opacity-0]="!(confirmPassword.invalid && confirmPassword.touched)" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
                                    @if(confirmPassword.hasError('required')) {
                                        Confirming password is required
                                    } @else if(confirmPassword.hasError('passwordMismatch')) {
                                        Passwords don't match
                                    }
                                </span>
                            </label>
                            <div class="mt-2">
                            <input 
                                id="confirm-password" 
                                formControlName="confirmPassword" 
                                type="password" 
                                name="confirm-password" 
                                (blur)="markIfInvalid(confirmPassword)"
                                [class.input-success]="showSuccess(confirmPassword)"
                                class="input-confirm-password"/>
                            </div>
                        </div>
                    }

                    
                    <!-- Register only - country options input - -->
                    @if(variant() === 'register') {
                        @let country = getControl('country');
                        <!-- @let country = getControl('country'); -->
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
                                    [class.outline-green-500]="showSuccess(country)"
                                    autocomplete="country-name" 
                                    class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base outline-1 -outline-offset-1 outline-[var(--color-input-border,#D1D5DB)] focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 [&>option]:bg-white/5 [&>option]:text-black"
                                >
                                    <option value="" disabled selected>Select</option>
                                    <option value="Denmark">Denmark</option>
                                    <option value="Sweden">Sweden</option>
                                    <option value="Norway">Poland</option>
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
                    }

                    <!-- Register only - street address input -->
                    @if(variant() === 'register') {
                        <div class="col-span-full">
                            <label for="street-address" class="block text-sm/6 font-medium">Street address</label>
                            <div class="mt-2">
                                <input id="street-address" type="text" name="street-address" autocomplete="street-address" class="input"/>
                            </div>
                        </div>
                    }
                    

                    <!-- Register only - city - -->
                    @if(variant() === 'register') {
                        <div class="sm:col-span-2 sm:col-start-1">
                            <label for="city" class="block text-sm/6 font-medium">City</label>
                            <div class="mt-2">
                                <input id="city" type="text" name="city" autocomplete="address-level2" class="input"/>
                            </div>
                        </div>
                    }
                    

                    <!-- Register only - postal code -->
                    @if(variant() === 'register') {
                        @let postalCode = getControl('postalCode');
                        <div class="sm:col-span-2">
                            <label for="postal-code" class="grid grid-cols-1 text-sm/6 font-medium">
                                <span [class.opacity-0]="postalCode.invalid && postalCode.touched" class="col-start-1 row-start-1 transition-opacity duration-150">ZIP / Postal code</span>
                                <span [class.opacity-0]="!(postalCode.invalid && postalCode.touched)" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
                                    @if(postalCode.hasError('required')) {
                                        Zip / Postal code is required
                                    } @else if (postalCode.hasError('invalidPostalCode')) {
                                        Zip / Postal code doesn't match the country
                                    }
                                </span>
                            </label>
                            <div class="mt-2">
                                <input 
                                    id="postal-code" 
                                    type="text" 
                                    name="postal-code"
                                    formControlName="postalCode"
                                    autocomplete="postal-code" 
                                    (blur)="markIfInvalid(postalCode)"
                                    [class.input-success]="showSuccess(postalCode)"
                                    class="input"/>
                            </div>
                        </div>
                    }
                </div>

                <!-- Sign in / Create account button -->
                <div class="mt-4">
                    <app-button buttonType="submit" element="button">
                        @if(variant() === 'register') {
                            Create account
                        } @else if(variant() === 'login') {
                            Sign in
                        }
                    </app-button>
                </div>
                </div>
            </div>
        </form>

        <!-- Right side text -->
        @if(messages()) {
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
        }
    </div>
  `,
  styles: ``,
})
export class AuthFormComponent {
    form = input.required<FormGroup>();
    variant = input.required<'register' | 'login'>();
    formSubmit = output<MouseEvent>();
    messages = input<TitleDescription[]>();

    protected getControl(name: string): FormControl {
        return this.form().get(name) as FormControl;
    };

    protected markIfInvalid(control: AbstractControl): void {
        if (control.invalid) {
            control.markAsTouched();
        };
    };

    protected showSuccess(control: AbstractControl): boolean {
        return control.valid && control.touched;
    };

    public scrollToFirstInvalidField(): void {
        this.form().markAllAsTouched();

        if (this.form().invalid) {
            const firstInvalidInput = document.querySelector<HTMLElement>('.ng-invalid[formControlName]');

            if (firstInvalidInput) {
            firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidInput.focus();
        };
    }};
}
