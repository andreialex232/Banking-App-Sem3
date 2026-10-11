import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { INavigation } from '@core/models/navigation';
import { ProfileService } from '@core/services/profile.service';
import { ProfileBadge } from '@shared/ui/profile-badge/profile-badge';

@Component({
  selector: 'app-user-profile',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, ProfileBadge],
  template: `
  
<div class="mt-[6rem] grid grid-cols-12">
    
    <!-- left side -->
    <div class="col-start-3 col-end-5">
        <!-- Image and name -->
        @if (profile(); as p) {
            <app-profile-badge
                [imageUrl]="avatarUrl()"
                [isChangeable]="true"
                [userEmail]="p.email"
                (changePicture)="fileInput.click()"
                [userName]="fullName()">
            </app-profile-badge>
            <input
                #fileInput
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                (change)="onFileSelected($event)">

            @if (isUploading()) {
                <p role="status" class="text-xs text-gray-500 text-center">Uploading...</p>
            } @else if (avatarState()) {
                <p role="alert" class="text-xs text-red-500 text-center">{{ avatarState() }}</p>
            }
        }
        
        <nav aria-label="Account sections">
            <ul class="font-medium">
            @for (item of nav; track item.name) {
                <li class="p-2 relative">
                    <a 
                        ariaCurrentWhenActive="page"
                        routerLinkActive="active-link"
                        class="block p-2 capitalize"
                        [routerLink]="item.href">
                        {{ item.name }}
                    </a>
                </li>
            }
            </ul>
        </nav>
        
    </div>
    <!-- End of left side -->
    <!-- right side -->
    <div class="shadow-custom mb-40 p-10 col-start-6 col-end-12">
        <router-outlet></router-outlet>
    </div>
    



</div>
  
  `,
  styles: ``,
})
export class UserProfile {
    private profileService = inject(ProfileService);
    protected profile = this.profileService.profile;
    protected readonly fullName = this.profileService.fullName;
    protected readonly avatarUrl = computed(() => this.profileService.avatarUrl());
    protected avatarState = signal<string | null>(null);
    protected isUploading = signal(false);

    protected async onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        this.isUploading.set(true);
        this.avatarState.set(null);
        try {
            await this.profileService.changeAvatar(file);
        } catch (e: any) {
            this.avatarState.set(e.message);
        } finally {
            this.isUploading.set(false);
            input.value = ''; // lets you pick the same file again
        }
    }


    protected nav: INavigation[] = [
        {
            name: 'overview',
            href: 'overview'
        },
        {
            name: 'settings',
            href: 'settings'   
        },
        {
            name: 'subscriptions',
            href: 'subscriptions'
        },
        {
            name: 'transaction history',
            href: 'transaction-history'
        }
    ]
}
