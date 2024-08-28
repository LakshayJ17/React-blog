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