import DodsboResource from "./DodsboResource";
import { firebase, auth, firestore } from "./Firebase"
import { UserContext } from '../components/UserContext';

class Service {
    async authenticate() {
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
        return auth.currentUser?.uid;
    }

    signOut() {
        auth.signOut()
    }

    async getDodsbos() {
        console.log(auth.currentUser?.uid)
        const result: any[] = []
        const roles = ["members", "admins", "owners"]
        roles.forEach(async role => {
            const dodsbos = await firestore
                .collection("dodsbo")
                .where(role, 'array-contains', auth.currentUser?.uid)
                .get();

            dodsbos.forEach(element => {
                let Dodsbo = new DodsboResource(element)
                result.push()
            });
        })
        return result
    }

}

export default new Service();
