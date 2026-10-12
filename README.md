# Bank App: a multi-currency digital banking app

Open an account, hold balances in EUR, DKK, SEK and PLN, convert between them at live exchange rates, and send money to other users by email. All on a serverless backend.

Built with **Angular 21** (standalone components, signals, lazy-loaded routes), **Appwrite** (Auth, TablesDB, Storage), **Tailwind CSS 4** and **Chart.js**, with live FX data from the **Frankfurter API**.

> School project for the Advanced JavaScript elective (Multimedia Design, 3rd semester). Built with Angular.

## Highlights

- Signal-based state, with a service layer separated from UI components
- Auth guard, guest guard and param-validating currency guard, with return-URL redirect after login
- Row-level owner permissions on every Appwrite row and file
- Plan-based daily deposit limits with a live usage chart
- Reactive forms with custom validators (password match, country-aware postal codes, currency-pair checks)
- WCAG-minded: skip link, ARIA roles and error announcements, reduced-motion support
- Disciplined workflow: feature branches, PRs, and conventional commits

## Features

| --- | --- |
| **Auth** | Register (validated form, country-aware postal codes), log in, log out, session restore on reload |
| **Accounts** | A EUR base account is created on sign-up. Add or remove DKK, SEK and PLN sub-accounts |
| **Money** | Deposit, withdraw, convert between your own currencies, send money to another user by email |
| **Limits** | Daily deposit cap by plan (free: 100,000 EUR, premium: 500,000 EUR), shown as a doughnut chart |
| **Profile** | Avatar upload (image only, max 2 MB) stored in Appwrite Storage |

## Tech stack

| --- | --- |
| Framework | Angular 21: standalone components, signals, `inject()`, functional guards, new control flow |
| Backend | Appwrite Cloud: Auth, TablesDB (database), Storage (avatars) |
| Styling | Tailwind CSS 4 |
| Charts | Chart.js, with only the doughnut pieces registered to keep the bundle small |
| External API | [Frankfurter](https://frankfurter.dev) exchange rates over `HttpClient` and RxJS |
| Tooling | Angular CLI, Vitest, Prettier |

## Architecture

```
src/app/
├── core/                  # App-wide, UI-free code
│   ├── guards/            # authGuard, guestGuard, currencyGuard
│   ├── models/            # Interfaces and types (BankAccount, Profile, Plan, Currency)
│   ├── services/          # AppwriteService, AuthService, BankAccountService,
│   │                      # ProfileService, AvatarsService, ExchangeRateService
│   └── utils/             # permissions.ts (owner-only Appwrite permissions)
├── features/              # Feature areas, lazy-loaded where possible
│   ├── home/              # Public landing page
│   ├── auth/              # Login, register, validators, shared form components
│   └── account/           # Overview, balance, currency converter, send money, settings
├── layout/                # Header, footer
└── shared/                # Reusable UI (button, chart, badge), directives, form fields, utils
```

Path aliases (`@core`, `@shared`, `@`) keep imports short and make the layer boundaries visible.

### Separation of concerns

| --- | --- |
| Concern | Where it lives |
| UI | Components in `features/` and `shared/ui/` |
| Application logic | Services in `core/services/` (for example `BankAccountService` owns deposits, withdrawals, transfers and limits) |
| Data access | `AppwriteService` is the single place the SDK client is created. Services call `tablesDB` and `storage` through it |
| Authentication | `AuthService` plus the route guards |
| External services | `ExchangeRateService` (Frankfurter) with a 1-hour in-memory cache |

Services hold state in signals (`bankAccount`, `profile`, `currentUser`). Components read them directly or through `computed()` values such as `dailyLimit`, `depositedToday`, `balance` and `usedPercentage`. This avoids manual subscriptions and keeps components thin.

### Routing and guards

| Route | Guard | Notes |
| --- | --- | --- |
| `/`, `/home` | none | Public landing page |
| `/login`, `/register` | `guestGuard` | Logged-in users are redirected away |
| `/user/**` | `authGuard` | Redirects to `/login?returnUrl=…`, lazy-loaded child routes |
| `/user/overview/:currency` | `currencyGuard` | Rejects unknown currencies and falls back to `/user/overview/eur` |

### Data model (Appwrite)

Every row and file is created with owner-only permissions (`read`, `update`, `delete` for `Role.user(userId)`), so the backend enforces access, not just the UI.

### CRUD

| Operation | Example in the app |
| --- | --- |
| **Create** | Register (profile and bank account rows), add a currency account, upload an avatar |
| **Read** | Load profile and balances, look up a recipient by email |
| **Update** | Deposit, withdraw, convert, send, change avatar |
| **Delete** | Remove a currency account, replace and delete an old avatar file |

### UX states

Loading flags (`isProcessing`, `isSending`, `isLooking`, `isUploading`) disable actions while requests run. Errors surface from services as readable messages, and form errors are announced with `role="alert"` and `aria-describedby`.

## AI-assisted development

I came to this project from **Angular 16**, and a lot has changed since then. I used AI mainly as a guide to current Angular practice instead of relying on what I already knew.

**Mostly used for:**
- Learning what modern Angular looks like and what replaced the patterns I knew:
  - Standalone components instead of NgModules
  - Signals and `computed()` instead of manual state and subscriptions
  - `inject()` instead of constructor injection
  - `input()` and `input.required()` instead of `@Input()`
  - `viewChild()` instead of `@ViewChild`
  - Functional guards instead of class-based guards
  - Lazy loading with `loadComponent` and `loadChildren`
  - `takeUntilDestroyed()` for subscription cleanup
  - Built-in control flow (`@if`, `@for`) instead of structural directives
- Explaining and structuring Appwrite concepts such as permissions, rows and storage

**Reflection:** AI was most useful for catching up on new framework features quickly. Human judgement was still needed to check that suggestions fit the existing architecture, handle errors and edge cases, and are secure. Money logic and permissions especially need careful review and shouldn't be accepted blindly.

## Known limitations and roadmap

- **Settings, Subscriptions and Transaction History:** planned pages, not built
- **Server-side money logic:** balance updates and the daily limit currently run in the browser. A production system would move transfers into an Appwrite Function so they are atomic and cannot be tampered with from the client
- **Tests:** unit test coverage is nonexistent

## Author

Andrei Alex, Multimedia Design, 3rd semester.
