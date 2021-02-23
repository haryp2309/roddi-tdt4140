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

    public getFirstName() {
        return this.userInfo
        .get()
        .first_name
    }

    public getLastName() {
        return this.userInfo
        .get()
        .last_name
    }

    public getDateOfBirth(): Date {
        return this.userInfo
        .get()
        .date_of_birth
    }

    public getEmailAddress(): string {
        return this.userInfo
        .get()
        .email_address
    }
    
    public getUserId(): string {
        return this.userId
    }
}
