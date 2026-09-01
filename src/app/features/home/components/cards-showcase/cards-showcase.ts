import { Component, inject } from '@angular/core';
import { Button } from "@/app/shared/ui/button/button";
import { FadeInOnScroll } from '@shared/directives/fade-in-on-scroll';

@Component({
  selector: 'app-cards-showcase',
  imports: [Button],
  standalone: true,
  hostDirectives: [
    {
        directive: FadeInOnScroll,
        inputs: ['thresholdInput: threshold']
    }
  ],
  template: `
<div class="font-dm text-grey md:grid-flow-col grid grid-cols-12 md:gap-12 sm:gap-12 lg:gap-8 items-center">
    <!-- Left Side Text -->
    <div class="w-full col-start-2 col-end-12 md:col-start-3 md:col-end-12 lg:col-start-2 lg:col-end-7 flex flex-col gap-6 items-start">
        <h2 class="text-3xl text-black sm:text-5xl font-bold capitalize">Cards for <span class="text-orange">your</span> lifestyle</h2>
        
        <p class="text-base lg:text-lg text-black font-medium">Pick the perfect card to gear up for your daily spending. Whether you are traveling, shopping online, or saving for the future, match your card to your goals.</p>

        <ul class="flex flex-col gap-2 md:text-md xl:text-base font-medium">
            <li class="flex items-center gap-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-orange">
                    <svg class="h-4 w-4 stroke-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                Real-time spending alerts on your phone
            </li>
            <li class="flex items-center gap-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-orange">
                    <svg class="h-4 w-4 stroke-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                Automatic cashback on everyday taps
            </li>
            <li class="flex items-center gap-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-orange">
                    <svg class="h-4 w-4 stroke-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                Zero hidden fees or surprise costs
            </li>
        </ul>

        <app-button element="anchor" url="/">
            Compare Cards
        </app-button>
    </div>

    <!-- Right Side Image -->
    <!-- <div class="w-full">
        <img src="assets/images/card_transparent.webp" alt="Cards Showcase" class="w-full h-auto object-contain">
    </div> -->
    <div class="col-start-2 col-end-12 md:col-start-3 md:col-end-11 lg:col-start-8 lg:col-end-12 flex justify-center lg:place-self-start">
        <div class="group card-stack relative hidden sm:block sm:h-[170px] sm:w-[260px] md:h-[170px] md:w-[260px] xl:h-[220px] xl:w-[320px]" [class.is-visible]="fadeIn.isVisible()">
            <!-- Mobile Images Below -->    
            <img src="assets/svgs/card_black.svg" aria-hidden="true" alt="" class="hidden lg:block card absolute left-0 top-0 z-30 h-auto w-full origin-bottom-left transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]"/>
            <img src="assets/svgs/card_orange.svg" aria-hidden="true" alt="" class="hidden lg:block card absolute left-0 top-0 z-20 h-auto w-full origin-bottom-left opacity-0 transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-[.is-visible]:translate-x-[40px] group-[.is-visible]:rotate-[15deg] group-[.is-visible]:opacity-100"/>
            <img src="assets/svgs/card_blue.svg" aria-hidden="true" alt="" class="hidden lg:block card absolute left-0 top-0 z-10 h-auto w-full origin-bottom-left opacity-0 transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] lg:group-[.is-visible]:translate-x-[50px] xl:group-[.is-visible]:translate-x-[80px] group-[.is-visible]:rotate-[30deg] group-[.is-visible]:opacity-100"/>
            <!-- Desktop Images -->
            <img src="assets/svgs/card_black.svg" aria-hidden="true" alt="" class="lg:hidden card absolute left-0 top-0 z-30 h-auto w-full origin-center rotate-[90deg] transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]"/>
            <img src="assets/svgs/card_orange.svg" aria-hidden="true" alt="" class="lg:hidden card absolute left-0 top-0 z-20 h-auto w-full origin-center rotate-[90deg] opacity-0 transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-[.is-visible]:-translate-x-[140px] group-[.is-visible]:rotate-[75deg] group-[.is-visible]:opacity-100"/>
            <img src="assets/svgs/card_blue.svg" aria-hidden="true" alt="" class="lg:hidden card absolute left-0 top-0 z-10 h-auto w-full origin-center rotate-[90deg] opacity-0 transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-[.is-visible]:translate-x-[140px] group-[.is-visible]:rotate-[105deg] group-[.is-visible]:opacity-100"/>
        </div>
    </div>
    
</div>
  `,
  styles: ``,
})
export class CardsShowcase {
    protected fadeIn = inject(FadeInOnScroll);
}
