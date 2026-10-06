import { Injectable, inject, signal } from '@angular/core';
import { AppwriteService } from '@core/services/appwrite.service';
import { ID, Permission, Role, Models } from 'appwrite';
import { environment } from '@/environments/environment.development';
import { BankAccountService } from '../bank-account/bank-account.service';
import { ProfileService } from '../profile.service';

export interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: string;
    street: string;
    postalCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private bankAccountService = inject(BankAccountService);
    private appwrite = inject(AppwriteService);
    private profileService = inject(ProfileService);

    public currentUser = signal<Models.User<Models.Preferences> | null>(null);

    async getCurrentUser(forceRefresh = false) {
        if(!forceRefresh && this.currentUser()) {
            return this.currentUser();
        }

        try {
            const user = await this.appwrite.account.get();
            this.currentUser.set(user);
            await this.loadUserData(user.$id);
            return user;
        } catch {
            this.currentUser.set(null);
            return null;
        };
    };

    async logOut() {
        try {
            await this.appwrite.account.deleteSession({
                sessionId: 'current'
            });
        } catch (error) {
            console.log('Logout method error:', error)
        } finally {
            this.currentUser.set(null);
            this.bankAccountService.bankAccount.set(null);
            this.profileService.profile.set(null);
        };
    };


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

    async logIn(email: string, password: string): Promise<void> {
        try {
            await this.appwrite.account.deleteSession({sessionId: 'current'})
        } catch(err) {
            
        }
        this.currentUser.set(null);
        this.bankAccountService.bankAccount.set(null);
        await this.appwrite.account.createEmailPasswordSession({
            email,
            password
        });
        await this.getCurrentUser(true);
    }

    async insertRows(data: RegisterPayload, userId: string) {
        await this.insertRowsUserProfile(data, userId);
        await this.insertRowsBankAccount(userId);
    }

    async insertRowsUserProfile(data:RegisterPayload, userId: string) {
        await this.appwrite.tablesDB.createRow({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteProfilesTableId,
            rowId: ID.unique(),
            data: {
                userId: userId,
                email: data.email.trim().toLowerCase(),
                firstName: data.firstName,
                lastName: data.lastName,
                country: data.country,
                street: data.street,
                postalCode: data.postalCode
            },
            permissions: [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        })
    }

    async insertRowsBankAccount(userId: string) {
        await this.appwrite.tablesDB.createRow({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteBankAccountsId,
            rowId: ID.unique(),
            data: {
                userId: userId,
                plan: 'free',
                eur: 0,
            },
            permissions: [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
                // NOTE: Users can update their own row so deposits work from the client.
                // In production, this would be read-only for users, and plan/balance
                // changes (and this row's creation) would go through a backend or Appwrite Function in this case,
                // since client-side permissions can be bypassed via dev tools.
            ]
        })
    }

    async register(data: RegisterPayload) {
        const accountId = await this.createAccount(data);
        await this.logIn(data.email, data.password);
        try {
            await this.insertRows(data, accountId);
            await this.loadUserData(accountId);
        } catch (err) {
            console.error(err);
            throw new Error('Account created, but setting up your profile failed. Please contact support.');
        }
       
    }

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

    async init(): Promise<void> {
        await Promise.race([
            this.getCurrentUser(),
            new Promise<void>(resolve => setTimeout(resolve, 5000))
        ])
    }
}
