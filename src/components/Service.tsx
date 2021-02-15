// Eksemepl på hvordan det kan gjøre med henting av data:
// const baseUrl = "https://gbfs.urbansharing.com/oslobysykkel.no/"
// class Service {
//     getBikeInfo() {
//         return fetch(baseUrl + "station_information.json").then(res => res.json());
//     }

//     getBikeStatus() {
//         return fetch(baseUrl + "station_status.json").then(res => res.json());
//     }
// }

// export default new Service();

import DodsboObject from "./DodsboObject";
import { firebase, auth, firestore } from "./Firebase"

class Service {

    async authenticate() {
        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
        auth.onAuthStateChanged(async (user: any) => {
            const users = firestore.collection("user")
            users.doc(user?.uid).set({
                email_adress: user?.email,
                first_name: user?.displayName,
                last_name: "sjadhlkkjbjjkasj",
                date_of_birth: firebase.firestore.Timestamp.fromDate(new Date("December 10, 2000"))
            })  

            return auth.currentUser?.uid;
        })
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
                    let Dodsbo = new DodsboObject(element)
                result.push()
            });
        })
        return result
    }

}

export default new Service();