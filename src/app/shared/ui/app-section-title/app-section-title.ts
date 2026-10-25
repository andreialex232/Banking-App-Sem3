import { Component, input } from '@angular/core';

@Component({
  selector: 'app-app-section-title',
  template: `
    <div class="flex items-center gap-4">
        <div aria-hidden="true" class="w-2 h-12 shrink-0 bg-primary"></div>
        <div 
            role="heading"
            [attr.aria-level]="level()"
            [attr.tabindex]="level() === 1 ? -1 : null"
            class="text-xl focus:outline-none">
            <ng-content></ng-content>
        </div>
    </div>
  `,
  styles: ``,
})
export class AppSectionTitle {
    level = input<1 | 2 | 3>(2);
}
