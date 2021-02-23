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
        var newDodsbo = firestore.collection('dodsbo').doc();
        var dodsboid = newDodsbo.id;
        newDodsbo.set({
            title: title,
            description: description,
            participants: userIds,
        });
        // Creates a document in participnats-collection for currentuser with role admin andre accepted false
        this.sendRequestToUser(dodsboid, userIds[0], 'ADMIN')
        userIds.shift()
        // Current user accepts the dodsbo
        this.acceptDodsboRequest(dodsboid)        
        // Creates documents for the rest of member with role: member and accepted false
        for await (const userId of userIds) {
            this.sendRequestToUser(dodsboid, userId, 'MEMBER')
        }
    }

    /**
     * Returns if the dodsbo is asccepted by the user
     * @param dodsboID dodsbo's ID
     */
    async isDodsboAccepted(dodsboID: string): Promise<boolean>{
        const currentUser = auth.currentUser
        if (currentUser == undefined) throw "User not logged in."
        let userId: string = currentUser.uid
        let dodsboResource = new DodsboResource(dodsboID)        
        var accepted = await firestore
            .collection('dodsbo')
            .doc(dodsboID)
            .collection('participants')
            .doc(userId).get()
            
        if (accepted == undefined) {
            throw "User dont exists in participant-collection"
        } 
        console.log(accepted.data()?.accepted);
        
        return await accepted.data()?.accepted
    }

    /**
     * Sends an invite to a user for a dodsbo.
     * @param dodsboID dodsbo's ID
     * @param userId user's ID
     * @param userRole user's role in the dodsbo
     */
    async sendRequestToUser(dodsboID: string, userId: string, userRole: string): Promise<void> {
        if (userRole == 'MEMBER') {
            firestore.collection('dodsbo').doc(dodsboID).collection('participants').doc(userId).set({
                role: 'MEMBER',
                accepted: false
            })
        }
        else if (userRole == 'ADMIN') {
            firestore.collection('dodsbo').doc(dodsboID).collection('participants').doc(userId).set({
                role: 'ADMIN',
                accepted: false
            })
        }
        else {
            console.error("Not acceptable role")
        }
    }

    /**
     * Aksepts an invite to a dodsbo for the current user.
     * @param dodsboID dodsboets ID
     */
    async acceptDodsboRequest(dodsboID: string): Promise<void> {
        const currentUser = auth.currentUser
        if (currentUser == undefined) throw "User not logged in."
        let userId: string = currentUser.uid
        const dodsboDoc = new DodsboResource(dodsboID);
        // Updates users accepted-field in users document in participant-collection
        firestore.collection('dodsbo').doc(dodsboID).collection('participants').doc(userId).update({
            accepted: true
        })
    }

    /**
     * Removes current user's membership to the dodsbo.
     * Is also used to decline a dodsbo-request.
     * @param dodsboID dodsbo's ID
     */
    async declineDodsboRequest(dodsboID: string): Promise<void>  {
        const currentUser = auth.currentUser;
        if (currentUser == undefined) throw "User not logged in."
        let userId: string = currentUser.uid;        
        const dodsboDoc = firestore.collection('dodsbo').doc(dodsboID); 
        // Removes users document in participant-collection       
        dodsboDoc.collection('participants').doc(userId).delete()
        var dodsbo = new DodsboResource(dodsboID);
        var participantsIds = await dodsbo.getParticipantsIds();
        for await (const participant of participantsIds) {
            if (participant == userId) {
                // Removes the user from participant-list
                var index = participantsIds.indexOf(participant);
                participantsIds.splice(index, 1)
            }
        }
        // Uppdater participants-list to exclude the user
        dodsboDoc.update({
            participants: participantsIds
        })
    }

    /**
     * Returns the user with the given email-address in the database.
     * @param emailAddress the email-address used for filtering
     */
    async getUserFromEmail(emailAddress: string): Promise<UserResource>  {
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

    /**
     * Returns true if the email-address is already in use.
     * @param emailAddress the email-address to check
     */
    async isEmailUsed(emailAddress: string): Promise<boolean> {
        var isUsed: boolean = true;
        await firestore
            .collection('user')
            .where("email_address", "==", emailAddress)
            .get().then(result => {
                if (result.size == 0) {
                    isUsed = false 
                }
            })
        return isUsed
    }

}

export default new Service();
