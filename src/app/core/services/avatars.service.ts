import { Injectable, inject } from '@angular/core';
import { ID, Permission, Role } from 'appwrite';
import { AppwriteService } from '@core/services/appwrite.service';
import { environment } from '@/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AvatarsService {
    private appwrite = inject(AppwriteService);

    async upload(userId: string, file: File) {
        if (!file.type.startsWith('image/')) throw new Error('File must be an image');
        if (file.size > 2 * 1024 * 1024) throw new Error('Image must be under 2 MB');

        const uploaded = await this.appwrite.storage.createFile({
            bucketId: environment.appwriteBucketId,
            fileId: ID.unique(),
            file,
            permissions: [
                Permission.read(Role.any()),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        })

        return uploaded.$id
    }

    getImagePreview(fileId: string | null | undefined): string | null {
        if(!fileId) return null;
        return this.appwrite.storage.getFileView({
            bucketId: environment.appwriteBucketId,
            fileId,
        }).toString();
    }

    async delete(fileId: string) {
        await this.appwrite.storage.deleteFile({
            bucketId: environment.appwriteBucketId,
            fileId
        })
    }
}
