import { exception } from "console";
import firebase from "./Firebase"
import {auth, firestore} from "./Firebase"

/**
 * Represents a user in the database. 
 * This class has to be used to get info about the user.
 */
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

    /**
     * Gets the first name of the user.
     */
    public async getFirstName(): Promise<String> {
        return await(await this.userInfo
        .get()).data()
        .first_name
    }
    /**
     * Gets the last name of the user.
     */
    public async getLastName(): Promise<string> {
        return await(await this.userInfo
        .get()).data()
        .last_name
    }
    /**
     * Gets the last name of the user.
     */
    public async getDateOfBirth(): Promise<Date> {
        return await(await this.userInfo
        .get()).data()
        .date_of_birth
    }
    /**
     * Gets the user's email-address.
     */
    public async getEmailAddress(): Promise<string> {       
        return await(await this.userInfo
        .get()).data()
        .email_address
    }
    
    /**
     * Gets the user's unique ID. 
     * This is the same ID used to store user-info in the database.
     * This method does not contact the database, 
     * it just returns the locally stored UID of the given user.
     */
    public getUserId(): string {
        return this.userId
    }
}
