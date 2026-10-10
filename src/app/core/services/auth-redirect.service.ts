import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthRedirectService {
    private router = inject(Router);

    // Go to ?returnUrl= if it's valid, otherwise to defaultUrl
    async redirectAfterLogin(defaultUrl: string = '/'): Promise<boolean> {
        const returnUrl = this.router
        .parseUrl(this.router.url)
        .queryParamMap.get('returnUrl');

        return this.router.navigateByUrl(
        this.isSafeUrl(returnUrl) ? returnUrl : defaultUrl
        );
    }

    // Only allow in-app paths (block 'https://...' and '//host')
    private isSafeUrl(url: string | null): url is string {
        return !!url && url.startsWith('/') && !url.startsWith('//');
    }
}
