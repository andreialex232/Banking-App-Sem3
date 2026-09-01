import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from '@shared/ui/button/button';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, Button],
  template: `
<header class="grid grid-cols-12 bg-[url('/assets/images/hero-test.jpg')] bg-cover bg-no-repeat bg-center h-[70vh] sm:h-screen">
    <div class="bg-white/80 backdrop-blur-sm p-6 rounded-xl flex mt-auto mb-auto -translate-y-25 lg:-translate-y-20 xl:-translate-y-25 2xl:-translate-y-30 self-center flex-col gap-6 col-start-2 md:col-start-7 col-end-12 lg:col-end-11">
        <h1 class="text-3xl text-black sm:text-5xl font-bold capitalize">Banking at <span class="text-orange">your</span> fingertips</h1>
        <div class="flex lg:text-base xl:text-lg flex-col gap-6">
        <p class="text-grey lg:hidden font-medium text-xl">Take full control of your finances with high-yield savings and 24/7 protection.</p>
        <p class="hidden lg:block font-medium text-xl">Simple, secure, and responsible banking designed around your life. Take full control of your finances with high-yield savings and 24/7 protection.</p>
            <app-button url="/register" class="capitalize" element="anchor">Join today</app-button>
        </div>
    </div>
</header>
  `,
})
export class Hero {}