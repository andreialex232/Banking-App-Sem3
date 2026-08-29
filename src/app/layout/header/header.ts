import { CommonModule} from '@angular/common';
import { Component } from '@angular/core';
import { INavigation } from '@core/models/navigation';
import { Button } from '@shared/ui/button/button';
import { Logo } from '@shared/ui/logo/logo';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [CommonModule, Button, Logo, RouterLink],
  template: `
<header class="grid w-full grid-cols-12 items-center">
    <nav class="col-span-11">
        <ul class="flex justify-start items-center gap-4 w-full">
            <a routerLink="/">
                <app-logo bankSize="text-xl" yourSize="text-lg" variant="horizontal"></app-logo>
            </a>
            @for (item of primaryNav; track item.name) {
                <li class="">
                    <a class="group hover:text-white px-4 py-2 hover:bg-[#222] gap-2 hover:rounded-md flex font-quicksand justify-center items-center flex-row-reverse transition-all hover:translate-y-[2px] active:translate-y-[3px]" href="{{item.href}}">{{item.name}}
                        <img [src]="item.svgUrl" aria-hidden="true" alt="" width="24px" class="group-hover:brightness-0 group-hover:invert">
                    </a>
                    
                </li>
            }
        </ul>
    </nav>
    <app-button element="anchor" url="/register" class="justify-self-end col-start-13">
        Create Account
    </app-button>
</header>
  `,
  styles: ``,
})
export class Header {
    protected readonly primaryNav:INavigation[] = [
        {
            name: "Accounts",
            href: "",
            svgUrl: "assets/svgs/account.svg"
        },
        {
            name: "Cards",
            href: "",
            svgUrl: "assets/svgs/credit-cards.svg"
        },
        {
            name: "Loans & Mortgages",
            href: "",
            svgUrl: 'assets/svgs/loans.svg'
        },
        {
            name: "Investments",
            href: "",
            svgUrl: 'assets/svgs/investments.svg'
        },
        {
            name: "Security & Support",
            href: "",
            svgUrl: 'assets/svgs/security.svg'
        }
    ];







}
