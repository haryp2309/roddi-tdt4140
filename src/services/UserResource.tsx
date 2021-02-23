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
    public getFirstName() {
        return this.userInfo
        .get()
        .first_name
    }

    /**
     * Gets the last name of the user.
     */
    public getLastName() {
        return this.userInfo
        .get()
        .last_name
    }

    /**
     * Gets the user's birthday as a Date-object.
     */
    public getDateOfBirth(): Date {
        return this.userInfo
        .get()
        .date_of_birth
    }

    /**
     * Gets the user's email-address.
     */
    public getEmailAddress(): string {
        return this.userInfo
        .get()
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
