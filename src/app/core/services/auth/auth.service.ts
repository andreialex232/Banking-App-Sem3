import { Injectable, inject, signal } from '@angular/core';
import { AppwriteService } from '@core/services/appwrite.service';
import { ID, Models } from 'appwrite';
import { BankAccountService } from '../bank-account/bank-account.service';
import { ProfileService } from '../profile.service';
import { RegisterPayload } from '@core/models/profile/profile.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private bankAccountService = inject(BankAccountService);
    private appwrite = inject(AppwriteService);
    private profileService = inject(ProfileService);

    public currentUser = signal<Models.User<Models.Preferences> | null>(null);

    // Only checks who is logged in. Does NOT load profile or bank data.
    async restoreSession(forceRefresh = false) {
        if(!forceRefresh && this.currentUser()) {
            return this.currentUser();
        }

        try {
            const user = await this.appwrite.account.get();
            this.currentUser.set(user);
            return user;
        } catch {
            this.currentUser.set(null);
            return null;
        }
    }

    async logOut() {
        try {
            await this.appwrite.account.deleteSession({
                sessionId: 'current'
            });
        } catch (error) {
            console.log('Logout method error:', error)
        } finally {
            this.clearUserStates()
        };
    }

    // Empties everything that belongs to the previous user
    private clearUserStates() {
        this.currentUser.set(null);
        this.bankAccountService.bankAccount.set(null);
        this.profileService.profile.set(null);
    }


    async createAccount(data: RegisterPayload): Promise<string> {
        const fullName = `${data.firstName} ${data.lastName}`
        const user = await this.appwrite.account.create({
            userId: ID.unique(),
            email: data.email,
            password: data.password,
            name: fullName
        })
        return user.$id;
    }

    async logIn(email: string, password: string, repair = true): Promise<void> {
        try {
            await this.appwrite.account.deleteSession({sessionId: 'current'})
        } catch {
            // Expected when nobody is logged in: there is no session to delete.
        }
        this.clearUserStates();

        await this.appwrite.account.createEmailPasswordSession({ email, password });

        const user = await this.restoreSession(true);
        if (!user) throw new Error('Login failed. Please try again.');

        // register() passes repair = false and creates the rows itself
        if (repair) await this.ensureRowsExist(user);
    }

    // Loads the user's rows and creates any that are missing (old accounts)
    private async ensureRowsExist(user: Models.User<Models.Preferences>) {
        try {
            const [profile, bank] = await Promise.all([
                this.profileService.loadProfile(user.$id, true),
                this.bankAccountService.loadBankAccount(user.$id, true),
            ]);

            const jobs: Promise<unknown>[] = [];

            if (!profile) {
                const [firstName, ...rest] = user.name.split(' ');
                jobs.push(this.profileService.createProfile({
                    email: user.email,
                    firstName,
                    lastName: rest.join(' '),
                    country: '',
                    street: '',
                    postalCode: '',
                }, user.$id));
            }

            if (!bank) {
                jobs.push(this.bankAccountService.createBankAccount(user.$id));
            }

            await Promise.all(jobs);

        } catch (err) {
            console.error('Could not verify account rows:', err);
        }
    }

    async register(data: RegisterPayload) {
        const accountId = await this.createAccount(data);
        await this.logIn(data.email, data.password, false);
        try {
            // Both create methods set their own signal from the returned row
            await Promise.all([
                this.profileService.createProfile(data, accountId),
                this.bankAccountService.createBankAccount(accountId),
            ]);
        } catch (err) {
            console.error(err);
            throw new Error('Account created, but setting up your profile failed. Please contact support.');
        }
    }

    async init(): Promise<void> {
        await Promise.race([
            this.restoreSessionAndData(),
            new Promise<void>(resolve => setTimeout(resolve, 5000))
        ]);
    }

    // Loads the profile and bank account of this user into their signals.
    private async loadUserData(userId: string) {
        try {
            await Promise.all([
                this.profileService.loadProfile(userId, true),
                this.bankAccountService.loadBankAccount(userId, true),
            ]);
        } catch (err) {
            console.error('Could not load user data:', err);
        }
    }

    private async restoreSessionAndData() {
        const user = await this.restoreSession();
        if (user) await this.loadUserData(user.$id);
    }
}
