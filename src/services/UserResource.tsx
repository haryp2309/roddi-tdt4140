import { exception } from "console";
import firebase from "./Firebase"
import {auth, firestore} from "./Firebase"

export default class UserResource {
    userId: string;
    userInfo: any;

    constructor(userId: string | undefined ) {
        this.userInfo = firestore
        .collection("user")
        .doc(userId)
        if (userId != undefined) {
            this.userId = userId
        } else {
            throw "UserId is not defined."
        }
        
    }

    public async getFirstName(): Promise<String> {
        return await(await this.userInfo
        .get()).data()
        .first_name
    }

    public async getLastName(): Promise<string> {
        return await(await this.userInfo
        .get()).data()
        .last_name
    }

    public async getDateOfBirth(): Promise<Date> {
        return await(await this.userInfo
        .get()).data()
        .date_of_birth
    }

    public async getEmailAddress(): Promise<string> {       
        return await(await this.userInfo
        .get()).data()
        .email_address
    }
    
    public getUserId(): string {
        return this.userId
    }
}
