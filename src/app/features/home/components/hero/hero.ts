import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Button } from '@shared/ui/button/button';
import { Logo } from '@shared/ui/logo/logo';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, Button, Logo],
  template: `
    <header class="text-grey relative h-screen w-screen before:absolute before:inset-0 before:-z-10 before:-scale-x-100 before:bg-cover before:bg-center before:bg-no-repeat 
                    before:bg-[url('/assets/images/hero-small.jpg')] 
                    md:before:bg-[url('/assets/images/hero-medium.jpg')] 
                    lg:before:bg-[url('/assets/images/hero-huge.jpg')]">

        <!-- ICON AND LOGO -->
        <div class="absolute top-[43%] left-[61.5%] -translate-x-1/2 -translate-y-1/2">
            <app-logo bankSize="text-xl" yourSize="text-lg" variant="vertical"></app-logo>
        </div>

        <!-- LEFT SIDE TEXT -->
        <div class="font-dm absolute top-[50%] left-[48%] -translate-x-1/2 -translate-y-1/2">
            <h1 class="text-lg">Choose <span class="text-orange">Your Bank</span> as your bank TODAY.</h1>
            <ul class="text-lg mt-4 mb-10">
                <div class="pb-2">Benefits include:</div>
                <li>
                    Earn <span class="text-orange">points</span> on your purchases.
                </li>
                <li>
                    Create and add <span class="text-orange">virtual</span> cards.
                </li>
                <li>
                    Spend smartly, send quickly.
                </li>
            </ul>

            <app-button element="anchor" url="/register">
                Sign up now
            </app-button>
            
        </div>
    </header>
  `,
})
export class Hero {}