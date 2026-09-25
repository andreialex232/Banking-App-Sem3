import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    async redirectUser(url: string): Promise<void> {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

        if(returnUrl) {
            await this.router.navigateByUrl(returnUrl);
        } else {
            await this.router.navigate([url])
        }
    }

    
}
