import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  template: `
    <div 
        class="font-quicksand flex justify-center items-center" 
        [class.flex-col]="variant === 'vertical'">
        <img src="assets/svgs/bank-orange.svg" alt="Bank Logo">
        <div 
            class="flex justify-center items-center flex-col" 
            [class.mt-2]="variant === 'vertical'" 
            [class.ml-2]="variant === 'horizontal'">
        <span class="text-grey {{ yourSize }} uppercase -mb-2">your</span>
        <span class="uppercase text-orange {{ bankSize }}">bank</span>
        </div>
    </div>
  `,
  styles: ``,
})
export class Logo {
    @Input({required: true}) variant!: "vertical" | "horizontal"
    @Input({required: true}) bankSize!: "text-sm" | "text-md" | "text-lg" | "text-xl" | "text-2xl"
    @Input({required: true}) yourSize!: "text-sm" | "text-md" | "text-lg" | "text-xl" | "text-2xl"
}
