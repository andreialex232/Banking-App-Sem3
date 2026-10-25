import { AbstractControl, FormGroup } from "@angular/forms";
import { AppwriteException } from "appwrite";

export function markIfInvalid(control: AbstractControl): void {
    if (control.invalid) {
        control.markAsTouched();
    }
}

export function showSuccess(control: AbstractControl, hasBeenInvalid: boolean): boolean {
    return control.valid && control.touched && hasBeenInvalid;
}

export function scrollToFirstInvalidField(form: FormGroup, formElement: HTMLElement): void {
    form.markAllAsTouched();

    if (form.invalid) {
        const invalidInput = formElement.querySelector<HTMLElement>(
            'input.ng-invalid, select.ng-invalid, textarea.ng-invalid'
        );

        invalidInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidInput?.focus();
    }
}

export function getAppwriteError(error: unknown): string {
    if (error instanceof AppwriteException) {
        return mapErrorMessage(error.type);
    }
    return 'An unexpected error occurred';
}

function mapErrorMessage(type: string): string {
    switch (type) {
        case 'user_invalid_credentials':
            return 'Invalid email or password';
        case 'user_blocked':
            return 'Account banned or suspended';
        case 'general_rate_limit_exceeded':
            return 'Too many failed login attempts';
        case 'user_already_exists':
            return 'User already exists';
        default:
            return 'Authentication failed, try again later';
    }
}