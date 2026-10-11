import { Routes } from '@angular/router';
import { UserProfile } from './user-profile/user-profile';
import { currencyGuard } from '@core/guards/currency-guard';

export const USER_ROUTES: Routes = [
    {
        path: '',
        component: UserProfile,
        children: [
            {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full'
            },
            {
                path: 'overview',
                title: 'Overview - Your Bank',
                loadComponent: () => import('./overview/overview').then(m => m.Overview),
                children: [
                    {
                        path: '',
                        redirectTo: 'eur',
                        pathMatch: 'full'
                    },
                    {
                        path: ':currency',
                        canActivate: [currencyGuard],
                        loadComponent: () => import('./overview/balance/balance').then(m => m.Balance),
                    },
                ]
            },
            {
                path: 'settings',
                title: 'Settings - Your Bank',
                loadComponent: () => import('./settings/settings').then(m => m.Settings)
            },
        ]
    }
];