import { Injectable } from '@angular/core';
import { Client, Account, TablesDB, Storage } from 'appwrite';
import { environment } from '@/environments/environment.development';

@Injectable({
    providedIn: 'root'
})

export class AppwriteService {
    client = new Client();
    account: Account;
    tablesDB: TablesDB;
    storage: Storage;

    constructor() {
        this.client
            .setEndpoint(environment.appwriteEndpoint)
            .setProject(environment.appwriteProjectId);
        
        this.account = new Account(this.client);
        this.tablesDB = new TablesDB(this.client);
        this.storage = new Storage(this.client);

        /* this.client.ping()
            .then((res) => console.log('Appwrite connected', res))
            .catch((err) => console.error('Appwrite connection failed', err)) */
    }
}