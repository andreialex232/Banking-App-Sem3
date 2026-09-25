import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/auth-service';
import { Button } from '@shared/ui/button/button';
import { InputField } from '../components/input-field/input-field';
import { scrollToFirstInvalidField, getAppwriteError } from '@shared/utils/form.utils';
import { NavigationService } from '@core/services/navigation-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Button, InputField],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
    private fb = inject(NonNullableFormBuilder);
    private auth = inject(AuthService);
    private nav = inject(NavigationService);
    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal<string | null>(null);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    async tryLogin(): Promise<void> {
        this.loginForm.updateValueAndValidity();
        scrollToFirstInvalidField(this.loginForm);

        if(this.loginForm.invalid) return;

        this.startSubmission();

        const { email, password } = this.loginForm.getRawValue();
        try {
            await this.auth.logIn(email, password);
            await this.nav.redirectUser('user/overview');
        } catch(error: unknown) {
            getAppwriteError(error);
        } finally {
            this.isSubmitting.set(false);
        }
    }

    private startSubmission() {
        this.isSubmitting.set(true);
        this.errorMessage.set(null);
    }




}
