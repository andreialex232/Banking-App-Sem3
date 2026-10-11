import { CanActivateFn } from '@angular/router';
import { SupportedCurrency, SUPPORTED_CURRENCIES } from '@core/models/currency/currency.models';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const currencyGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const currency = route.paramMap.get('currency');

    if(currency && SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)) {
        return true;
    }

    return router.createUrlTree(['/user/overview/eur']);
    /* router.navigate(['/user/overview/eur']); */
    /* return false; */
};
