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

### src -> appwrite -> config.js
For database related functions - https://appwrite.io/docs/references/cloud/client-web/databases
For bucket/ store related - https://appwrite.io/docs/references/cloud/client-web/storage

##### This JavaScript code defines a `Service` class that interacts with the Appwrite backend services for managing posts and files. Here's a brief overview:

- **Initialization**: The `Service` class sets up an Appwrite client with the provided endpoint and project ID. It also initializes instances for interacting with databases and file storage.

- **Post Management**:
  - `createPost`: Adds a new post document to the database.
  - `updatePost`: Updates an existing post document in the database.
  - `deletePost`: Removes a post document from the database.
  - `getPost`: Retrieves a specific post document by its slug.
  - `getPosts`: Lists post documents based on query filters (e.g., status equal to "active").

- **File Management**:
  - `uploadFile`: Uploads a file to the Appwrite storage bucket.
  - `deleteFile`: Deletes a file from the Appwrite storage bucket.
  - `getFilePreview`: Retrieves a preview of a file from the Appwrite storage bucket.

Each method handles errors by logging them and returning a `false` value if something goes wrong, or the appropriate data if successful.

```javascript
import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite"

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error)
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error)
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error)
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error)
            return false;
        }
    }

    // Get values whose status == active
    // Index needs to be made in db to use queries
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error)
            return false;
        }
    }

    //  File upload service - bucket
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error)
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error)
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const service = new Service()
export default service
```

### src -> store folder -> store.js
```
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
const store = configureStore({
    reducer: {
        auth : authSlice,
    }
});

export default store;
```

src -> store folder -> authSlice.js
```
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.status = false;
            userData = null;
        }
    }
})

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;

```

### src -> components -> Header -> Header.jsx
### src -> components -> Footer -> Footer.jsx
### src -> components -> index.js
```
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export{
    Header, Footer
}
```

### App.jsx
```
import { useState, useEffect } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import { Footer, Header } from './components'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          Todo : {/* <Outlet /> */}
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App

```

### main.jsx
```
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
```
