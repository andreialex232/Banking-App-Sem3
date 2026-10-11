import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink],
  template: `
    <div class="bg-[url('/assets/images/test-register-2.jpg')] min-h-screen bg-cover bg-center grid grid-cols-12 items-start gap-4 py-10">
        <div class="px-8 py-8 col-start-2 col-end-8 text-black bg-white rounded-xl h-fit">
            <h2 class="text-3xl text-black sm:text-5xl font-bold">
                <span class="text-primary">{{ highlight() }}</span> {{ heading() }}
            </h2>
            <p class="font-medium text-xl mt-2">{{ subtitle() }}</p>

            <ng-content />

            <a class="mt-4 inline-block text-sm cursor-pointer hover:underline" [routerLink]="footerLink()">
            {{ footerText() }}
            </a>
        </div>
    </div>
  `,
})
export class AuthLayout {
    highlight = input.required<string>();
    heading = input.required<string>();
    subtitle = input.required<string>();
    footerText = input.required<string>();
    footerLink = input.required<string>();
}