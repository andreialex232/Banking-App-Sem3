import { Component, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { markIfInvalid, showSuccess } from '@shared/utils/form.utils';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule],
  standalone: true,
  host: {
    '[class]': 'colSpan()',
    '[attr.id]': 'null'
  },
  template: `
<div>
    <div class="grid grid-cols-1 text-sm/6 font-medium">
        <label [for]="id()" [class.opacity-0]="showError()" class="col-start-1 row-start-1">{{ label() }}</label>
        <div [id]="id() + '-error'" aria-live="polite" class="col-start-1 row-start-1 text-danger">
            @if (showError()) {
                <ng-content select="[errors]"></ng-content>
            }
        </div>
    </div>
    <div class="mt-2">
        <input
            [formControl]="control()"
            [id]="id()"
            [type]="type()"
            [name]="id()"
            [autocomplete]="autocomplete()"
            [attr.aria-required]="isRequired()"
            [attr.aria-invalid]="showError() ? 'true' : null"
            [attr.aria-describedby]="showError() ? id() + '-error' : null"
            (blur)="onBlur()"
            [class.input-success]="showSuccess(control(), hasBeenInvalid())"
            class="input">
    </div>
</div>
  `,
  styles: ``,
})
export class InputField {

    markIfInvalid = markIfInvalid;
    showSuccess = showSuccess;

    hasBeenInvalid = signal(false);
    disabled = input<boolean>(false);
    label = input.required<string>();
    colSpan = input<string>('sm:col-span-3');
    type = input<string>('text');
    control = input.required<FormControl>();
    id = input.required<string>();
    autocomplete = input<string>('off');

    showError(): boolean {
        return this.control().invalid && this.control().touched;
    }

    isRequired(): boolean {
        return this.control().hasValidator(Validators.required);
    }

    trackInvalidState(): void {
        if (this.control().invalid) {
            this.hasBeenInvalid.set(true);
        }
    }

    onBlur(): void {
        this.trackInvalidState();
        markIfInvalid(this.control());
    }
}