import { Component, computed, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-profile-badge',
  imports: [NgTemplateOutlet],
  template: `
    <div class="flex justify-center items-center flex-col my-4">
        @if (isChangeable()) {
            <button
                type="button"
                class="group rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
                [attr.aria-label]="'Change profile picture for ' + userName()"
                (click)="changePicture.emit()">
                <ng-container *ngTemplateOutlet="avatar" />
            </button>
        } @else {
            <ng-container *ngTemplateOutlet="avatar" />
        }

        <div class="flex flex-col">
            <span class="mt-3 text-base font-bold">{{ userName() }}</span>
            <span class="text-gray-500 text-xs text-base">{{ userEmail() }}</span>
        </div>
    </div>

    <ng-template #avatar>
        <div class="relative">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
            <img
                [src]="src()"
                [alt]="imageAlt()"
                class="w-full h-full object-cover" />
            </div>

        @if (isChangeable()) {
            <div
                aria-hidden="true"
                class="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-orange-500 text-white flex justify-center items-center border-4 border-white shadow-md group-hover:bg-orange-600 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="w-5 h-5">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                </svg>
            </div>
            }
        </div>
    </ng-template>
  `,
})
export class ProfileBadge {
    userName = input.required<string>();
    userEmail = input<string>();
    imageUrl = input<string | null | undefined>(null);
    protected readonly defaultAvatar = '/assets/svgs/default-avatar.svg'
    protected readonly src = computed(() => {
        return this.imageUrl() || this.defaultAvatar
    })
    
    isChangeable = input(false);

    changePicture = output<void>();

    // Inside a button, the button's aria-label already describes the action,
    // so the image is decorative (alt="") to avoid double announcements.
    imageAlt = computed(() =>
        this.isChangeable() ? '' : `${this.userName()}'s profile picture`
    );
}