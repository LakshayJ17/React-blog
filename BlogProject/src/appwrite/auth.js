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
            const userAccount = await this.account.create(ID.unique(),email, password, name);

            if (userAccount){
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


