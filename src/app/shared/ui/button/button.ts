import { Component, input, output} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-button',
  imports: [CommonModule, RouterLink, NgTemplateOutlet],
  standalone: true,
  template: ` 
    @if(element() === 'button') {
        <div class="font-dm font-semibold transition-all hover:translate-y-[2px] hover:opacity-90 active:translate-y-[3px] inline-block">
            <button 
                type="button"
                (click)="handleClick($event)"
                [disabled]="disabled()"
                [type]="buttonType()"
                class="px-6 py-3 text-md cursor-pointer text-white bg-orange rounded-lg outline-none border-none text-center transition-all shadow-md hover:shadow-lg"
            >
                <ng-container *ngTemplateOutlet="text"></ng-container>
            </button>
        </div>
    }

    @if(element() === 'anchor') {
        <div class="font-dm font-semibold transition-all hover:translate-y-[2px] hover:opacity-90 active:translate-y-[3px] inline-block">
            <a [routerLink]="url()" class="px-6 py-3 text-md cursor-pointer text-white bg-orange rounded-lg outline-none cursor-pointer border-none text-center transition-all shadow-md hover:shadow-lg">
                <ng-container *ngTemplateOutlet="text"></ng-container>
            </a>
        </div>
    }

    <ng-template #text>
        <ng-content></ng-content>
    </ng-template>
    
    
  `,
  styles: ``,
})
export class Button {
    element = input.required<'anchor' | 'button'>();
    /* Buttons Inputs */
    disabled = input<false>()
    buttonType = input<'button' | 'submit'>('button');
    buttonStyle = input<'button-sign-up' | 'normal-btn'>('normal-btn');
    /* Anchor Inputs */
    url = input<string>();
    /* Outputs */
    btnClick = output<MouseEvent>();

        handleClick(event: MouseEvent): void {
        if (!this.disabled()) {
            console.log('clicked in child')
            this.btnClick.emit(event);
        }
    }
}
