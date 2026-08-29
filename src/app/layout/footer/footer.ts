import { Component } from '@angular/core';
import { INavigation } from '@core/models/navigation';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
<footer class="grid grid-cols-12 pb-20 pt-20 text-white bg-grey">
    <div class="mb-10 col-start-2 col-end-12 flex gap-12 justify-center items-center">
    @for (section of footerSections; track section.title) {
        <div>
        <h3 class="font-dm mb-2 font-semibold text-lg">{{ section.title }}</h3>
        <ul>
            @for (item of section.items; track item.name) {
            <li [class.pb-1]="!$last" class="font-quicksand">
                <a class="hover:opacity-70" [routerLink]="item.href">{{ item.name }}</a>
            </li>
            }
        </ul>
        </div>
    }
    </div>

    <div class="mt-10 pt-10 col-start-2 col-end-12 text-center text-sm border-solid border-t-[1px] border-white font-quicksand">
        <p>&copy; Your Bank reserves all rights. Read our Cookie Policy and Privacy Policy.</p>
        <p>Your Bank A/S is under supervision of The Danish Financial Supervisory Authority and is a 100% owned subsidiary of Your Bank A/S. Users who have registered in the app are subject to the applicable terms and conditions found in Your Bank A/S.</p>
    </div>

</footer>
  `,
  styles: ``,
})
export class Footer {
    protected readonly footerSections: { title: string; items: INavigation[] }[] = [
  {
    title: 'Accounts',
    items: [
      { name: 'Checking Accounts', href: '' },
      { name: 'Savings & CD Accounts', href: '' },
      { name: 'Student Banking', href: '' },
      { name: 'Business Accounts', href: '' },
    ],
  },
  {
    title: 'Cards',
    items: [
      { name: 'Credit Cards', href: '' },
      { name: 'Debit Cards', href: '' },
      { name: 'Gift & Prepaid Cards', href: '' },
      { name: 'Cards Rewards Program', href: '' },
    ],
  },
  {
    title: 'Loans',
    items: [
      { name: 'Home Mortgages', href: '' },
      { name: 'Refinancing Options', href: '' },
      { name: 'Personal Loans', href: '' },
      { name: 'Auto Loans', href: '' },
    ],
  },
  {
    title: 'Investments',
    items: [
      { name: 'Retirement & IRAs', href: '' },
      { name: 'Stocks & ETFs', href: '' },
      { name: 'Portfolio Management', href: '' },
      { name: 'Financial Planning', href: '' },
    ],
  },
  {
    title: 'Security',
    items: [
      { name: 'Privacy & Security', href: '' },
      { name: 'Fraud Prevention', href: '' },
      { name: 'Help & FAQ', href: '' },
      { name: 'Contact Us', href: '' },
    ],
  },
];
}
