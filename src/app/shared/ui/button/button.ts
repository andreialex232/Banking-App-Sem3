import { Component, input, output} from '@angular/core';

@Component({
  selector: 'button[appButton]',
  imports: [],
  standalone: true,
  host: {
    'class': 'btn-base',
    '[class.btn-primary]': 'variant() === "primary"',
    '[class.btn-secondary]': 'variant() === "secondary"',
    '[class.btn-loading]': 'loading()',
    '[attr.aria-busy]': 'loading()',
    '[disabled]': 'disabled() || loading()',
    '[type]': 'buttonType()',
  },
  template: `
    @if(loading()) {
        <span 
            aria-hidden="true" 
            class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent">
        </span>
        <span>Working...</span>
    } @else {
        <ng-content></ng-content>
    }

  `,
  styles: ``,
})
export class Button {
    readonly disabled = input(false);
    readonly loading = input<boolean>(false);
    readonly buttonType = input.required<'button' | 'submit'>();
    readonly variant = input<'primary' | 'secondary'>('primary');
}
