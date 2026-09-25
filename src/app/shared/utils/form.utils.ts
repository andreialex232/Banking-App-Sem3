import { signal } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { AppwriteException } from "appwrite";

export function markIfInvalid(control: AbstractControl) {
    if (control.invalid) {
            control.markAsTouched();
    };
}

export function showSuccess(control: AbstractControl, hasBeenInvalid: boolean): boolean {
    return control.valid && control.touched && hasBeenInvalid;
}

export function scrollToFirstInvalidField(form: FormGroup): void {
    form.markAllAsTouched();

    if(form.invalid) {
        const invalidInput = document.querySelector<HTMLElement>('input.ng-invalid, select.ng-invalid, textarea.ng-invalid');

        if(invalidInput) {
            invalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            invalidInput.focus();
        }
    }
};

export function getAppwriteError(error:unknown): string | null {
    const errorMessage = signal<string | null>(null);

    if(error instanceof AppwriteException) {
        errorMessage.set(mapErrorMessage(error.type))
    } else {
        errorMessage.set('An unexpected error occured');
    }

    return errorMessage();
}

function mapErrorMessage(type: string, fallbackMessage?: string): string {
    switch(type) {
        case 'user_invalid_credentials':
            return 'Invalid email or password';
        case 'user_blocked':
            return 'Account banned or suspended';
        case 'general_rate_limit_exceeded':
            return 'Too many failed login attempts';
        case 'user_email_already_exists':
            return 'Email already in use';
        default: 
            return fallbackMessage || 'Authentication failed';
    }
};
