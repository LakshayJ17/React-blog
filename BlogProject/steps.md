# install required dependencies
```
npm i @reduxjs/toolkit react-redux react-router-dom appwrite @tinymce/tinymce-react html-react-parser react-hook-form
```
## make .env file 
### add it to .gitignore
```
VITE_APPWRITE_URL = "test environment"
VITE_APPWRITE_PROJECT_ID = ""
VITE_APPWRITE_DATABASE_ID = ""
VITE_APPWRITE_COLLECTION_ID = ""
VITE_APPWRITE_BUCKET_ID = ""
```

## make .env.sample file 
```
VITE_APPWRITE_URL = "test environment"
VITE_APPWRITE_PROJECT_ID = ""
VITE_APPWRITE_DATABASE_ID = ""
VITE_APPWRITE_COLLECTION_ID = ""
VITE_APPWRITE_BUCKET_ID = ""
```
## in App.jsx
```
console.log(import.meta.env.VITE_APPWRITE_URL)
```

## folder in src -> conf -> conf.js
``` 
const conf = {
    appwriteUrl : String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId : String(import.meta.env.VITE_PROJECT_ID),
    appwriteDatabaseId : String(import.meta.env.VITE_DATABASE_ID),
    appwriteCollectionId : String(import.meta.env.VITE_COLLECTION_ID),
    appwriteBucketId : String(import.meta.env.VITE_BUCKET_ID)
}


export default conf
```

## src -> appwrite folder -> auth.js
##### The provided code defines an `AuthService` class for managing authentication using the Appwrite platform. It imports configuration details and modules from Appwrite's SDK, including `Client` for server connection and `Account` for user account operations. The `AuthService` class initializes a `Client` instance with the Appwrite server's endpoint and project ID, then creates an `Account` instance for handling authentication tasks. A single instance of `AuthService` is created (`authService`) and exported as the default, making it reusable across the application for consistent authentication management.
##### This code defines an `AuthService` class for managing user authentication using the Appwrite platform. It initializes a `Client` with the Appwrite server's endpoint and project ID, and an `Account` for user operations. The class provides methods to create a user account (`createAccount`), log in (`login`), retrieve the current user (`getCurrentUser`), and log out (`logout`). If account creation is successful, the user is automatically logged in. The `authService` instance is exported for use throughout the application.

``` javascript
import conf from "../conf/conf";
import {Client, Account, ID} from "appwrite"

export class AuthService {
    client = new Client();
    account;

    constructor(){
        this.client 
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(),email, password,name);

            if (userAccount){
                // call another method
                return this.login({email,password})
            } else{
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error)
        }
    }

    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            console.log("Appwrite service :: login :: error", error)
        }
    }

    async getCurrenUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error)
        }

        // If any problem in try catch still null will be returned
        return null;
    }

    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error)
        }
    }
}

const authService = new AuthService();

export default authService
```
