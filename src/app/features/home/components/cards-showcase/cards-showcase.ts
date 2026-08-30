import { Component, ElementRef, signal, OnInit } from '@angular/core';
import { Button } from "@/app/shared/ui/button/button";

@Component({
  selector: 'app-cards-showcase',
  imports: [Button],
  standalone: true,
  template: `


<div class="font-dm text-grey max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <!-- Left Side Text -->
    <div class="flex flex-col gap-6 items-start">
        <h2 class="text-orange text-4xl font-bold">Choose the Card Built for Your Lifestyle</h2>
        
        <p class="text-lg">Pick the perfect card to gear up for your daily spending. Whether you are traveling, shopping online, or saving for the future, match your card to your goals.</p>

        <ul class="flex flex-col gap-2 text-base font-medium">
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
    <div class="flex justify-center place-self-start w-full">
        <div class="group card-stack relative h-[220px] w-[320px]" [class.is-visible]="isVisible()">
            <img src="assets/svgs/card_black.svg" aria-hidden="true" alt="" class="card absolute left-0 top-0 z-30 h-auto w-full origin-bottom-left transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]"/>
            <img src="assets/svgs/card_orange.svg" aria-hidden="true" alt="" class="card absolute left-0 top-0 z-20 h-auto w-full origin-bottom-left opacity-0 transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-[.is-visible]:translate-x-[40px] group-[.is-visible]:rotate-[15deg] group-[.is-visible]:opacity-100"/>
            <img src="assets/svgs/card_blue.svg" aria-hidden="true" alt="" class="card absolute left-0 top-0 z-10 h-auto w-full origin-bottom-left opacity-0 transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-[.is-visible]:translate-x-[80px] group-[.is-visible]:rotate-[30deg] group-[.is-visible]:opacity-100"/>
        </div>
    </div>
    
</div>
  `,
  styles: ``,
})
export class CardsShowcase {
    isVisible = signal(false);
    private observer!: IntersectionObserver;

    constructor(private el: ElementRef<HTMLElement>) {}
    ngOnInit(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.isVisible.set(true);
        this.observer.disconnect();
      }
    }, { threshold: 1 });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
