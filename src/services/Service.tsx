import DodsboResource from "./DodsboResource";
import firebase from "./Firebase";
import { auth, firestore } from "./Firebase";
import { UserContext } from '../components/UserContext';
import UserResource from "./UserResource";
import Login from "../screens/Login";

class Service {
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

    async signIn(email_address: string, password: string): Promise<UserResource> {
        await auth.signInWithEmailAndPassword(email_address, password)
        return new UserResource(auth.currentUser?.uid);
    }

    async signOut() {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log("Sign Out")
          }).catch((error) => {
            // An error happened.
            console.log("Error:", error)
          });
    }

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
