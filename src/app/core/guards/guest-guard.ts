import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth-service';

export const guestGuard: CanActivateFn = async (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = await auth.getCurrentUser();
    console.log('Auth Guard User:', user)

    if(!user) {
        return true;
    }

    return router.createUrlTree(['/']);
};
