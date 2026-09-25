import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { postalCodeValidator } from '../validators/postal-code.validators';
import { InputField } from '../components/input-field/input-field';
import { markIfInvalid, scrollToFirstInvalidField } from '@shared/utils/form.utils';
import { AuthService } from '@core/auth/auth-service';
import { NavigationService } from '@core/services/navigation-service';
import { RouterLink } from '@angular/router';
import { Button } from '@shared/ui/button/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputField, Button, RouterLink],
  templateUrl: `./register.html`,
  styles: ``,
})
export class Register implements OnInit {
    markIfInvalid = markIfInvalid;
    private fb = inject(NonNullableFormBuilder);
    private auth = inject(AuthService);
    private nav = inject(NavigationService);
    private destroyRef = inject(DestroyRef);
    protected isSubmitting = signal(false);

    ngOnInit(): void {
        const { country, postalCode } = this.registerForm.controls;
        
        country?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(country => {
                if (!country) {
                   postalCode?.reset();
                   postalCode?.disable();
                } else {
                   postalCode?.enable();
                   postalCode?.updateValueAndValidity();
                }
            });
    }

    registerForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, passwordMatchValidator]],
        country: ['', {validators: [Validators.required], updateOn: 'change'}],
        street: ['', {validators: [Validators.required], updateOn: 'change'}],
        postalCode: [{value: '', disabled: true}, [Validators.required, postalCodeValidator]]
    },
    {updateOn: 'blur'});

    async tryCreateAccount(){
        this.registerForm.updateValueAndValidity();
        scrollToFirstInvalidField(this.registerForm);

        if(this.registerForm.invalid) return;
        
        const {confirmPassword, ...payload} = this.registerForm.getRawValue();
        
        try {
            this.isSubmitting.set(true);
            await this.auth.register(payload);
            await this.nav.redirectUser('user/overview');
        } catch(error) {
            console.log('Registration failed', error)
        } finally {
            this.isSubmitting.set(false);
        }
    };



}
