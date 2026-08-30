import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface IPlan {
  name: string;
  price: string;
  description: string;
  buttonText: string;
  isPopular?: boolean;
  includesText?: string;
  features: string[];
}

@Component({
  selector: 'app-plans',
  imports: [RouterLink],
  template:`

    <div class="col-start-2 col-end-12 text-center mb-10">
        <h2 class="font-dm text-4xl font-bold text-black sm:text-5xl">
        Find your ideal plan.
        </h2>
        <p class="font-quicksand mt-4 text-base text-gray-600 max-w-2xl mx-auto">
        Choose from four unique plans. Only pay for what you need. No hidden fees – just fair, transparent prices.
        </p>
    </div>
    <section class="grid grid-cols-12 gap-4 py-12">
      <div class="col-start-2 col-end-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        @for (plan of plans; track plan.name) {
          <div
            [class]="
              plan.isPopular
                ? 'bg-orange text-white'
                : 'bg-neutral-100 text-black'
            "
            class="flex flex-col justify-between rounded-3xl p-6 shadow-sm"
          >
            <div>
              <h3 class="font-dm text-3xl font-bold">{{ plan.name }}</h3>
              <div class="my-3 flex items-baseline gap-1 font-dm">
                <span class="text-3xl font-bold">{{ plan.price }}</span>
                <span class="text-sm">DKK /month</span>
              </div>
              <p class="font-quicksand min-h-12 text-sm">
                {{ plan.description }}
              </p>

                <a
                    routerLink="/register"
                    [class]="
                        plan.isPopular
                        ? 'bg-black text-white'
                        : 'bg-orange text-white'
                    "
                    class="cursor-pointer mt-6 block w-full rounded-full py-3 text-center font-dm font-semibold transition hover:opacity-90"
                    >
                    {{ plan.buttonText }}
                </a>

              @if (plan.includesText) {
                <p class="my-4 font-quicksand mb-3 text-xs font-semibold">
                  {{ plan.includesText }}
                </p>
              }

              <ul class="my-4 flex flex-col gap-3">
                @for (feature of plan.features; track feature) {
                  <li class="flex items-start gap-2">
                    <div
                      class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black text-white"
                    >
                      <svg
                        class="h-2.5 w-2.5 stroke-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="3"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span class="font-quicksand text-xs">
                      {{ feature }}
                    </span>
                  </li>
                }
              </ul>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: ``,
})
export class Plans {
    protected readonly plans: IPlan[] = [
    {
      name: 'Light',
      price: '0',
      description: 'A free account catering to all your basic needs.',
      buttonText: 'Get Light',
      features: [
        'No-cost account with a free digital card and basic tools for easy money management.',
      ],
    },
    {
      name: 'Standard',
      price: '39',
      description:
        'Tools tailored for your day-to-day finances. Manage your money smarter.',
      buttonText: 'Get Standard',
      includesText: 'Everything Light has to offer – and more:',
      features: [
        '3 accounts with physical and digital cards.',
        'Automatic savings, Joint account, budgeting by category, and so much more.',
        '+0.25% interest on up to 100,000 DKK.*',
      ],
    },
    {
      name: 'Plus',
      price: '79',
      description:
        'Multiple accounts and travel benefits that make life a little easier at home and abroad.',
      buttonText: 'Get Plus',
      isPopular: true,
      includesText: 'Everything Standard has to offer – and more:',
      features: [
        '6 free accounts with physical and digital cards, including access to Your Bank Youth.',
        'Worldwide travel insurance included.',
        'No withdrawal or exchange fees.***',
        '+0.50% interest on your entire balance. Paid out monthly.**',
      ],
    },
    {
      name: 'Unlimited',
      price: '149',
      description:
        'Get a personalized metal card, our highest interest rate, and premium rewards.',
      buttonText: 'Get Unlimited',
      includesText: 'Everything Plus has to offer – and more:',
      features: [
        'An unlimited number of accounts with physical and digital cards.',
        'Your Bank Rewards card included.',
        'A stand-out metal card with personalised laser engraving.',
        'Extended travel insurance included.',
        '+1% interest on your whole balance. Paid out monthly.**',
      ],
    },
  ];
}
