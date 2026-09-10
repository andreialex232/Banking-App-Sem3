import { AbstractControl } from "@angular/forms";

export function markIfInvalid(control: AbstractControl) {
    if (control.invalid) {
            control.markAsTouched();
        };
}

export function showSuccess(control: AbstractControl) {
    return control.valid && control.touched;
}