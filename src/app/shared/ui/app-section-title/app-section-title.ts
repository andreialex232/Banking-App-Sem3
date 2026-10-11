import { Component } from '@angular/core';

@Component({
  selector: 'app-app-section-title',
  template: `
    <div class="flex items-center gap-4">
        <div class="w-2 h-12 shrink-0 bg-primary"></div>
        <div class="text-xl">
            <ng-content></ng-content>
        </div>
    </div>
  `,
  styles: ``,
})
export class AppSectionTitle {}
