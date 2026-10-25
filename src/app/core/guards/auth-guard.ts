import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = await auth.restoreSession();
    if (user) return true;

    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
    });
};
