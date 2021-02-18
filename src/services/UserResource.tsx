import {auth, firebase, firestore} from "./Firebase"

export default class UserResource {
    userInfo: any

    constructor(userId: string) {
        this.userInfo = firestore
        .collection("user")
        .doc(userId)
    }

    getFirstName() {
        return this.userInfo
        //.collection("public")
        .get()
        .first_name
    }

    getLastName() {
        return this.userInfo
        //.collection("public")
        .get()
        .last_name
    }

    getDateOfBirth(): Date {
        return this.userInfo
        //.collection("private")
        .get()
        .date_of_birth
    }

    getEmailAddress(): string {
        return this.userInfo
        //.collection("private")
        .get()
        .email_address
    }
}
