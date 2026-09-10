import { Component, effect, input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { markIfInvalid, showSuccess } from '@shared/utils/form.utils';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule],
  standalone: true,
  host: {
    '[class]': 'colSpan()'
  },
  template: `
<div>
    <label [for]="id()" class="grid grid-cols-1 text-sm/6 font-medium">
        <span [class.opacity-0]="control().invalid && control().touched" class="col-start-1 row-start-1 transition-opacity duration-150">{{ label() }}</span>
        <span [class.opacity-0]="control().invalid && control().untouched" class="col-start-1 row-start-1 text-red-500 transition-opacity duration-150">
            <ng-content select="[errors]"></ng-content>
        </span>
    </label>
    <div class="mt-2">
        <input 
            [formControl]="control()"
            [id]="id()" 
            [type]="type()" 
            [name]="id()" 
            [autocomplete]="autocomplete()" 
            (blur)="markIfInvalid(control())"
            [class.input-success]="showSuccess(control())"
            class="input">
    </div>
</div>
  `,
  styles: ``,
})
export class InputField {
    constructor() {
        effect(() => {
            if(this.disabled()) {
                this.control().disable();
            } else {
                this.control().enable();
            }
        })
    }

    markIfInvalid = markIfInvalid;
    showSuccess = showSuccess;

    disabled = input<boolean>(false);
    label = input.required<string>();
    colSpan = input<string>('sm:col-span-3');
    type = input<string>('text');
    control = input.required<FormControl>();
    id = input.required<string>();
    autocomplete = input<string>('off');
}
