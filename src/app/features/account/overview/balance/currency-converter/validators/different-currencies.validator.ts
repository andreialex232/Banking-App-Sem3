import { AbstractControl, ValidationErrors } from "@angular/forms";

export function differentCurrencies(group: AbstractControl): ValidationErrors | null {
    const from = group.get('from')?.value;
    const to = group.get('to')?.value;
    return from && to && from === to ? { sameCurrency: true } : null;
}