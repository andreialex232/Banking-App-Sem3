import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { COUNTRY_BY_NAME } from '@core/models/country/countries';

export const postalCodeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const postalCode = control.value;
    if (!postalCode) return null;

    const country = COUNTRY_BY_NAME.get(control.parent?.get('country')?.value);
    if (!country) return null;

    return country.postalPattern.test(postalCode) ? null : { invalidPostalCode: true };
};