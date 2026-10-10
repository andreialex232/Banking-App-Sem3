import { Models } from 'appwrite';

export interface ProfileRow extends Models.Row {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string | null;
}

export interface Recipient {
    userId: string;
    name: string;
    image?: string | null;
}

export interface NewProfileData {
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    street: string;
    postalCode: string;
}

export interface RegisterPayload extends NewProfileData {
    password: string;
}