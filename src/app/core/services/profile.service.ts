import { Injectable, computed, inject, signal } from '@angular/core';
import { Models, Query, ID } from 'appwrite';
import { AppwriteService } from '@core/services/appwrite.service';
import { AvatarsService } from './avatars.service';
import { environment } from '@/environments/environment';
import { ownerPermissions } from '@core/utils/permissions';
import { ProfileRow, Recipient, NewProfileData, RegisterPayload } from '@core/models/profile/profile.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
    private appwrite = inject(AppwriteService);
    private avatars = inject(AvatarsService);

    profile = signal<ProfileRow | null>(null);
    readonly fullName = computed(() => {
        const p = this.profile();
        return p ? `${p.firstName} ${p.lastName}` : '';
    });

    async loadProfile(userId: string, forceRefresh = false): Promise<ProfileRow | null> {
        const cached = this.profile();
        if(!forceRefresh && cached && cached.userId === userId) return cached;

        const result = await this.appwrite.tablesDB.listRows<ProfileRow>({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteProfilesTableId,
            queries: [Query.equal('userId', userId), Query.limit(1)]
        });

        const profile = result.rows[0] ?? null;
        this.profile.set(profile);
        return profile;
    }

    async createProfile(data: NewProfileData, userId: string): Promise<ProfileRow> {
        const row = await this.appwrite.tablesDB.createRow({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteProfilesTableId,
            rowId: ID.unique(),
            data: {
                userId,
                email: data.email.trim().toLowerCase(),
                firstName: data.firstName,
                lastName: data.lastName,
                country: data.country,
                street: data.street,
                postalCode: data.postalCode,
            }, 
            permissions: ownerPermissions(userId)
        })

        const profile = row as unknown as ProfileRow;
        this.profile.set(profile);
        return profile;
    }

    avatarUrl(): string | null {
        return this.avatars.getImagePreview(this.profile()?.image);
    }

    async changeAvatar(file: File) {
        const profile = this.profile();
        if (!profile) throw new Error('No profile loaded');

        const newFileId = await this.avatars.upload(profile.userId, file);

        await this.appwrite.tablesDB.updateRow({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteProfilesTableId,
            rowId: profile.$id,
            data: { image: newFileId }
        });

        if (profile.image) await this.avatars.delete(profile.image).catch(() => {});
        this.profile.set({ ...profile, image: newFileId });
    }

    async findRecipientByEmail(email: string): Promise<Recipient> {
        const result = await this.appwrite.tablesDB.listRows<ProfileRow>({
            databaseId: environment.appwriteDatabaseId,
            tableId: environment.appwriteProfilesTableId,
            queries: [
                Query.equal('email', email.trim().toLowerCase()),
                Query.select(['userId', 'firstName', 'lastName', 'image']),
                Query.limit(1)
            ]
        });

        const profile = result.rows[0];
        if (!profile) throw new Error('Recipient not found');

        return {
            userId: profile.userId,
            name: `${profile.firstName} ${profile.lastName}`,
            image: this.avatars.getImagePreview(profile.image)
        };
    };






}
