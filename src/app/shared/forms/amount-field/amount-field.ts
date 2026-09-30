import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
 
@Component({
  selector: 'app-amount-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
<div class="flex flex-col gap-1.5">
    @if (label()) {
        <label [for]="id()" class="text-sm text-gray-500">{{ label() }}</label>
    }
    <input
        [id]="id()"
        type="number"
        inputmode="decimal"
        min="0"
        step="any"
        [formControl]="control()"
        [placeholder]="placeholder()"
        [attr.aria-label]="label() ? null : placeholder()"
        [attr.aria-invalid]="control().touched && control().invalid"
        (blur)="control().markAsTouched()"
        class="input w-full aria-invalid:border-red-500" />

    @if (control().touched && control().invalid) {
        <p class="m-0 text-sm text-red-600" role="alert">
            <ng-content select="[errors]" />
        </p>
    }   
</div>
  `,
})
export class AmountField {
  id = input.required<string>();
  control = input.required<FormControl<number | null>>();
  label = input<string>('');
  placeholder = input<string>('Amount');
}

