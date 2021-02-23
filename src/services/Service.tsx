import DodsboResource from "./DodsboResource";
import firebase from "./Firebase";
import { auth, firestore } from "./Firebase";
import { UserContext } from '../components/UserContext';
import UserResource from "./UserResource";
import Login from "../screens/Login";

/**
 * The main class for contacting the Database.
 */
class Service {
    /**
     * Handles all of the authentication done with Google-auth. 
     * Returns a UserResource.
     */
    async authenticateWithGoogle(): Promise<UserResource> {
        var provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider)
        const user = auth.currentUser
        const userDoc = await firestore.collection("user").doc(user?.uid).get()
        if (!(await userDoc).exists) {
            // Betyr ny bruker
            if (
                (user != undefined) 
                && (user != null) 
                && (user.displayName != null)
                && (user.email != null)
                ){
                    
                this.updateUserInFirestore(user.uid, user.displayName, "sjadhlkkjbjjkasj", user.email, "December 10, 2000")
            }
        }
        return new UserResource(auth.currentUser?.uid);
    }

    /**
     * Signs in with an email_address and password.
     * 
     * @param email_address string with the user's email-address
     * @param password clear-text string containing the users's password
     */
    async signIn(email_address: string, password: string): Promise<UserResource> {
        await auth.signInWithEmailAndPassword(email_address, password)
        return new UserResource(auth.currentUser?.uid);
    }

    /**
     * Signs the user out from Roddi.
     * This works for all providers, including Google-auth. 
     */
    async signOut() {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log("Sign Out")
          }).catch((error) => {
            // An error happened.
            console.log("Error:", error)
          });
    }

    /**
     * Creates a user with the given parameters. 
     * All parameters are required.
     * @param first_name user's first name
     * @param last_name user's last name
     * @param email_address user's email-address
     * @param date_of_birth user's birthday
     * @param password user's password in clear text
     */
    async createUser(first_name: string, last_name: string, email_address: string, date_of_birth: string, password: string): Promise<UserResource> {
        try {
            this.getUserFromEmail(email_address)  
        } catch (error) {
            console.log(error);
            
        } 
        await auth.createUserWithEmailAndPassword(email_address, password)
        //await this.signIn(email_address, password)
        const user = auth.currentUser
        if (
            user?.uid != undefined
            && user?.email != undefined
        ) {
            this.updateUserInFirestore(user?.uid, first_name, last_name, user?.email, date_of_birth)
        } else {
            throw "Missing information about the user. Aborting createUser."
        }
        
        
        return new UserResource(auth.currentUser?.uid)
    }

    /**
     * Updates the user in Firestore with the given information.
     * Will automatically create fields and documents if it is a new user.
     */
    private async updateUserInFirestore(uid: string, first_name: string, last_name: string, email_address: string, date_of_birth: string) {
        const user = firestore.collection("user").doc(uid)
        console.log(email_address);
        
        user.set({
            "email_address": email_address
        })
        const public_fields = user.collection("fields").doc("public")
        public_fields.set({
            "first_name": first_name,
            "last_name": last_name,
        })
        const private_fields = user.collection("fields").doc("private")
        private_fields.set({
            "date_of_birth": firebase.firestore.Timestamp.fromDate(new Date(date_of_birth))
        })
    }

    /**
     * Returns all dodsbos the user is a part of.
     */
    async getDodsbos(): Promise<DodsboResource[]> {
        const results: DodsboResource[] = []
        await firestore
            .collection("dodsbo")
            .where("participants", 'array-contains', auth.currentUser?.uid)
            .get().then((dodsbos) => {
                dodsbos.forEach(element => {
                    let dodsbo = new DodsboResource(element.id)
                    results.push(dodsbo)
                })
            });
        return results
    }

    /**
     * Creates a dodsbo using the given parameters.
     * All parameters are required.
     * @param title dodsbo's title
     * @param description short description of the dodsbo
     * @param usersEmails a list of email-addresses of the users invited to join the dodsbo
     */
    async createDodsbo(title: string, description: string, usersEmails: string[]): Promise<void> {
        const currentUser = auth.currentUser
        if (currentUser == undefined) throw "User not logged in."
        let userIds: string[] = [currentUser.uid]
        for await (const email of usersEmails) {
            userIds.push((await this.getUserFromEmail(email)).getUserId());
        }
        firestore.collection('dodsbo').add({
            title: title,
            description: description,
            participants: userIds,
        })
    }

    /**
     * Returns the user with the given email-address in the database.
     * @param emailAddress the email-address used for filtering
     */
    async getUserFromEmail(emailAddress: string) {
        let userId: string | undefined = undefined;
        await firestore
        .collection('user')
        .where("email_address", "==", emailAddress)
        .get().then(result => {
            if (result.size > 1) throw "Multiple users with same email exists"
            if (result.size < 1) throw "No users with the email_address exists"
            userId = result.docs[0].id
        })
        return new UserResource(userId)
    }

}

export default new Service();
