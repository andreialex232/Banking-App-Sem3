import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const postalCodeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const countryInput = control.get('country')?.value;
    const postalCodeInput = control.value;

    if(!countryInput || !postalCodeInput) return null;

    const regexPattern: Record<string,RegExp> = {
        Denmark: /^\d{4}$/,
        Sweden: /^\d{3}\s?\d{2}$/,
        Poland: /^\d{2}-\d{3}$/
    };
    const targetPattern = regexPattern[countryInput];
    if(!targetPattern) return null;

    const isValid = targetPattern.test(postalCodeInput);
    if (isValid) {
        return null;
    } else {
        return {
            invalidPostalCode: true 
        }
    }
}