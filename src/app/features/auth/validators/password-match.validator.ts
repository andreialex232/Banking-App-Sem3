import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/* export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // If controls aren't initialized yet, return null
    if (!password || !confirmPassword) {
        return null;
    }

    // If confirmPassword is empty, let the 'required' validator handle it
    if (!confirmPassword.value) {
        return null;
    }

    // If values don't match, set the error on the confirmPassword control directly
    if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ ...confirmPassword.errors, mismatch: true });
        return { passwordMismatch: true };
    } else {
        // If they do match, clear the mismatch error while keeping any other errors
        if (confirmPassword.errors) {
            delete confirmPassword.errors['mismatch'];
            if (Object.keys(confirmPassword.errors).length === 0) {
                confirmPassword.setErrors(null);
            }
        }
        return null;
    }
}; */

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value

    if(!password || !confirmPassword) return null;

    if(password === confirmPassword) {
        return null;
    } else {
        return {
            passwordMismatch: true
        };
    };
}