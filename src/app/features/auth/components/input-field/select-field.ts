import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { markIfInvalid } from '@shared/utils/form.utils';

export interface SelectOption { value: string; label: string; }

@Component({
  selector: 'app-select-field',
  imports: [ReactiveFormsModule],
  host: { '[class]': 'colSpan()' },
  template: `
<div>
    <label [for]="id()" class="grid grid-cols-1 text-sm/6 font-medium">
        <span [class.opacity-0]="control().invalid && control().touched" class="col-start-1 row-start-1 transition-opacity duration-150">{{ label() }}</span>
        <span [class.opacity-0]="control().invalid && control().untouched" class="col-start-1 row-start-1 text-danger transition-opacity duration-150">
            <ng-content select="[errors]"></ng-content>
        </span>
    </label>
    <div class="group mt-2 grid grid-cols-1">
        <select
            [formControl]="control()"
            [id]="id()"
            [name]="id()"
            [autocomplete]="autocomplete()"
            (blur)="onTouched()"
            (change)="onTouched()"
            class="select">
            <option value="" disabled>{{ placeholder() }}</option>
            @for (opt of options(); track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
            }
        </select>
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 transition-transform duration-200 group-focus-within:rotate-180 group-has-[:open]:rotate-180 sm:size-4">
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
        </svg>
    </div>
</div>
  `,
})
export class SelectField {
    label = input.required<string>();
    id = input.required<string>();
    control = input.required<FormControl>();
    options = input.required<readonly SelectOption[]>();
    placeholder = input<string>('Select');
    autocomplete = input<string>('off');
    colSpan = input<string>('sm:col-span-3');

    onTouched(): void {
        markIfInvalid(this.control());
    }
}