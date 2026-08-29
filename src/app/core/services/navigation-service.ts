import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
    private router = inject(Router);

    goToUrl(url:string):void {
        this.router.navigate(['url']);
        console.log('navigating')
    }
}
