import { CommonModule} from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { INavigation } from '@core/models/navigation';
import { Logo } from '@shared/ui/logo/logo';
import { RouterLink } from "@angular/router";
import { AuthService } from '@core/auth/auth-service';
import { Router } from '@angular/router';
import { Button } from '@shared/ui/button/button';
@Component({
  selector: 'app-header',
  imports: [CommonModule, Logo, RouterLink, Button],
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
    <ul class="flex gap-4 justify-self-end col-start-13">
        @if(!currentUser()) {
            <li>
                <a routerLink="/register" class="btn-base btn-primary">
                    Create account
                </a>
            </li>
            <li>
                <a routerLink="/login" class="btn-base btn-primary">
                    Log in
                </a>
            </li>
        } @else {
            <button appButton 
                (click)="logOut()"
                [loading]="isLogouting()"
                buttonType="button">
                Log out
            </button>
        }
    </ul>
</header>
  `,
  styles: ``,
})
export class Header {
    private auth = inject(AuthService);
    private router = inject(Router);

    protected currentUser = this.auth.currentUser;
    protected isLogouting = signal(false);

    protected async logOut() {
        try {
            this.isLogouting.set(true);
            await this.auth.logOut();
            await this.router.navigate(['']);
        } catch (err) {
            console.log(err)
        } finally {
            this.isLogouting.set(false);
        }
        
    }
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
