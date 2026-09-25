import { Injectable, inject, signal } from '@angular/core';
import { AppwriteService } from '@core/services/appwrite.service';
import { ID } from 'appwrite';
import { environment } from '@/environments/environment.development';

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
    private appwrite = inject(AppwriteService);
    public currentUser = signal<any>(null);

    async getCurrentUser() {
        try {
            const user = await this.appwrite.account.get();
            this.currentUser.set(user);
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
        } catch {

        }
        await this.appwrite.account.createEmailPasswordSession({
            email,
            password
        });
    }

    async insertRows(data: RegisterPayload, userId: string) {
        await this.appwrite.tablesDB.createRow({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteProfilesTableId,
            rowId: ID.unique(),
            data: {
                userId: userId,
                firstName: data.firstName,
                lastName: data.lastName,
                country: data.country,
                street: data.street,
                postalCode: data.postalCode
            }
        })
    }

    async register(data: RegisterPayload) {
        const accountId = await this.createAccount(data);
        await this.logIn(data.email, data.password);
        await this.insertRows(data, accountId);
    }
}
