# Bank App

A multi-currency digital banking app. Open an account, hold balances in EUR, DKK, SEK and PLN, convert between them at live exchange rates, and send money to other users by email.

**Version 1.0.0** (first complete release). School project for the Advanced JavaScript elective (Multimedia Design, 3rd semester).

Built with **Angular 21**, **Appwrite** (Auth, TablesDB, Storage), **Tailwind CSS 4** and **Chart.js**, with live rates from the [Frankfurter API](https://frankfurter.dev).

## Features

- **Auth:** register with a validated form (country-aware postal codes), log in and out, session restored on reload
- **Accounts:** a EUR account on sign-up, plus optional DKK, SEK and PLN accounts
- **Money:** deposit, withdraw, convert between your own currencies, send money to another user by email
- **Limits:** daily deposit cap by plan (free 100,000 EUR, premium 500,000 EUR), shown as a doughnut chart
- **Profile:** avatar upload (JPEG, PNG or WebP, max 2 MB)

## Highlights

- Modern Angular: standalone components, signals, `inject()`, functional guards, lazy-loaded routes, new control flow
- State lives in signals inside services, with `computed()` values for the UI. No manual subscriptions
- Guards: `authGuard`, `guestGuard`, and a `currencyGuard` that validates the route parameter. Return-URL redirect after login
- Owner-only permissions on every Appwrite row and file
- Reactive forms with custom validators (password match, postal codes per country, currency pair)
- Accessibility: skip link, ARIA roles, announced form errors, reduced-motion support
- Feature branches, pull requests and conventional commits

## Getting started

```bash
npm install
npm start        # dev server at http://localhost:4200
npm test         # unit tests (Vitest)
npm run build    # production build
```

The app talks to an Appwrite Cloud project. The hostname you open the app from must be registered as a Web platform in that project, or login requests will be blocked.

## Project structure

```
src/app/
├── core/       # guards, models, services (Auth, BankAccount, Profile, ExchangeRate), utils
├── features/   # home, auth (login, register), account (overview, balance, converter, send)
├── layout/     # header, footer
└── shared/     # button, chart, badge, form fields, directives, utils
```

Services own the logic (for example `BankAccountService` handles deposits, withdrawals, transfers and limits). `AppwriteService` is the single place the SDK client is created. Exchange rates are cached in memory for one hour. Path aliases (`@core`, `@shared`, `@`) keep imports short.

| Route | Guard | Notes |
| --- | --- | --- |
| `/`, `/home` | none | Public landing page |
| `/login`, `/register` | `guestGuard` | Logged-in users are redirected to `/user/overview` |
| `/user/**` | `authGuard` | Redirects to `/login?returnUrl=…` |
| `/user/overview/:currency` | `currencyGuard` | Unknown currencies fall back to EUR |

## Documentation

- [Data model](docs/bank-app-data-model.pdf): tables, fields, relations, plans and rules
- [User flow](docs/bank-app-flow.pdf): from register to using the app, with a link table and a try-it checklist

## AI-assisted development

I came to this project from **Angular 16** and used AI mainly as a guide to current Angular practice, not to replace what I already knew. It helped me catch up on what replaced the patterns I used before: standalone components over NgModules, signals over manual state, `inject()`, `input()` and `viewChild()`, functional guards, `loadComponent`, `takeUntilDestroyed()` and built-in control flow. It also helped me understand Appwrite permissions, rows and storage.

AI was most useful for catching up quickly. I still had to check that suggestions fit the architecture, handle errors and edge cases, and are secure. Money logic and permissions need careful review and shouldn't be accepted blindly.

## Known limitations and roadmap

- **Not built yet:** Settings, Subscriptions and Transaction history pages, and the other header sections
- **Money logic runs in the browser.** A production system would move transfers and the daily limit into an Appwrite Function so they are atomic and can't be tampered with from the client
- **No unit tests yet**

## Author

Andrei Alex, Multimedia Design, 3rd semester.
