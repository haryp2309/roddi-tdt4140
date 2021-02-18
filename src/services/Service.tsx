import DodsboResource from "./DodsboResource";
import { firebase, auth, firestore } from "./Firebase"
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

    signOut() {
        auth.signOut()
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

}

export default new Service();
