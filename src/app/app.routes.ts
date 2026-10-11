import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from '@core/guards/auth-guard';
import { guestGuard } from '@core/guards/guest-guard';

export const routes: Routes = [
    {
        path: '', 
        title: 'Your Bank - Banking at your fingertips',
        component: Home
    },
    {
        path: 'home', 
        title: 'Your Bank - Banking at your fingertips',
        component: Home
    },
    {
        path: 'login',
        title: 'Log in - Your Bank',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        title: 'Create account - Your Bank',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
    },
    {
        path: 'user',
        canActivate: [authGuard],
        loadChildren: () => import('@/app/features/account/user.routes').then(m => m.USER_ROUTES)
    },
    {
        path: '**', redirectTo: ''
    },
];
