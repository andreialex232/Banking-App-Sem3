import { Permission, Role } from 'appwrite';

export function ownerPermissions(userId: string): string[] {
    return [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
    ];
}