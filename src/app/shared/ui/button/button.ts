import { Component, input, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-button',
  imports: [CommonModule, RouterLink],
  standalone: true,
  template: ` 
    @if(element() === 'button') {
        <button
            [type]="buttonType()"
            [disabled]="disabled()"
            (click)="handleClick($event)"
            [ngClass]="buttonStyle()"
        >
            <ng-content></ng-content>
        </button>
    }

    @if(element() === 'anchor') {
        <div class="font-dm font-semibold transition-all hover:translate-y-[2px] hover:opacity-90 active:translate-y-[3px] inline-block">
            <a [routerLink]="url()" class="px-6 py-3 text-md cursor-pointer text-white bg-orange rounded-lg outline-none cursor-pointer border-none text-center transition-all shadow-md hover:shadow-lg">
                <ng-content></ng-content>
            </a>
        </div>
    }
    
  `,
  styles: ``,
})
export class Button {
    element = input.required<'anchor' | 'button'>();
    /* Buttons Inputs */
    disabled = input<false>()
    buttonType = input<'button' | 'submit'>();
    buttonStyle = input<'button-sign-up' | 'normal-btn'>('normal-btn');
    /* Anchor Inputs */
    url = input<string>();
    /* Outputs */
    btnClick = output<MouseEvent>();

        handleClick(event: MouseEvent): void {
        if (!this.disabled) {
            console.log('clicked in child')
            this.btnClick.emit(event);
        }
    }
}
