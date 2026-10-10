import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

export const guestGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = await auth.restoreSession();
    if (!user) return true;

    return router.createUrlTree(['/']);
};
