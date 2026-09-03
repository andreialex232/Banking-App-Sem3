import { Directive, OnInit, OnDestroy, ElementRef, signal, input } from '@angular/core';

@Directive({
  selector: '[appFadeInOnScroll]',
  standalone: true
})
export class FadeInOnScroll implements OnInit, OnDestroy {
    constructor(private el: ElementRef<HTMLElement>) {}
    private observer!: IntersectionObserver;

    isVisible = signal(false);

    thresholdInput = input<number>(0.5);
    rootMarginInput = input<string>("0px");
    rootInput = input<Element | null>();

    ngOnInit(): void {
    /* Options */
        const options = {
            threshold: this.thresholdInput(),
            rootMargin: this.rootMarginInput(),
            root: this.rootInput()
        };
        
        this.observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting) {
                this.isVisible.set(true);
                this.observer.disconnect();
            }
        }, options);

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }
}

