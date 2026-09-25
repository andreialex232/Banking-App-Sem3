import { Routes } from '@angular/router';
import { UserProfile } from './user-profile/user-profile';

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
                loadComponent: () => import('./overview/overview').then(m => m.Overview)
            },
            {
                path: 'settings',
                loadComponent: () => import('./settings/settings').then(m => m.Settings)
            },
        ]
    }
];