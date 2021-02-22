import DodsboResource from "./DodsboResource";
import firebase from "./Firebase";
import { auth, firestore } from "./Firebase";
import { UserContext } from '../components/UserContext';
import UserResource from "./UserResource";

class Service {
    async authenticate(): Promise<UserResource> {
        var provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider)
        auth.onAuthStateChanged(async (user: any) => {
            const users = firestore.collection("user")
            if (user != undefined) {
                users.doc(user?.uid).set({
                    email_address: user?.email,
                    first_name: user?.displayName,
                    last_name: "sjadhlkkjbjjkasj",
                    date_of_birth: firebase.firestore.Timestamp.fromDate(new Date("December 10, 2000"))
                })
            }
        })
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

    async getDodsbos(): Promise<DodsboResource[]> {
        console.log(auth.currentUser?.uid)
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
            console.log(email);
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
