import { Component, effect, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
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
        <span [class.opacity-0]="control().invalid && control().touched" class="col-start-1 row-start-1 ">{{ label() }}</span>
        <span [class.opacity-0]="control().invalid && control().untouched" class="col-start-1 row-start-1 text-danger">
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

    trackInvalidState(): void {
        if(this.control().invalid) {
            this.hasBeenInvalid.set(true);
        }
    }

    onBlur(): void {
        this.trackInvalidState();
        markIfInvalid(this.control());
    }
}
