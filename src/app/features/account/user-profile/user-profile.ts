import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  template: `
  
  <div class="grid grid-cols-12">
    
    <!-- left side -->
    <div class="col-start-3 col-end-5">
        <!-- Image and name -->
        <div class="border-b border-black flex justify-center items-center flex-col">
            <button
                type="button"
                class="cursor-pointer group flex flex-col items-center"
                (click)="changeProfilePic()"
                aria-label="Change profile picture">
                <!-- Profile Picture Container -->
                <div class="relative">
                    <!-- Profile Picture -->
                    <div
                        class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex justify-center items-center border-4 border-white shadow-md">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Profile picture"
                            class="w-full h-full object-cover"/>

                        <!-- Camera Icon-->
                        <div
                            class="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-orange-500 text-white flex justify-center items-center border-4 border-white shadow-md group-hover:bg-orange-600 transition-colors duration-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="w-5 h-5">
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                                <circle cx="12" cy="13" r="3"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </button>
            <!-- Username -->
            <span class="mt-3 text-base font-bold">
                {{ userName }}
            </span>
        </div>
        <ul class="font-medium">
            <li class="p-2">
                <a 
                    routerLinkActive="bg-blue-500 text-white"
                    [routerLinkActiveOptions]="{exact: true}"
                    [routerLink]="['/overview']">
                    Overview
                </a>
            </li>
            <li class="p-2">
                <a href="Settings">Setings</a>
            </li>
            <li class="p-2">
                <a href="Settings">Subscriptions</a>
            </li>
            <li class="p-2">
                <a href="Settings">Transaction History</a>
            </li>
        </ul>







    </div>
    <!-- End of left side -->




  </div>
  <!-- right side -->
  <router-outlet></router-outlet>`,
  styles: ``,
})
export class UserProfile {
    userName = 'Alex Andrei'
    protected changeProfilePic () {
        console.log('Attempted to change profile pic')
    }
}
