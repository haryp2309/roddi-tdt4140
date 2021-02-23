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

    async isDodsboAccepted(dodsboID: string) {
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

    async sendRequestToUser(dodsboID: string, userId: string, userRole: string) {
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

    async acceptDodsboRequest(dodsboID: string) {
        const currentUser = auth.currentUser
        if (currentUser == undefined) throw "User not logged in."
        let userId: string = currentUser.uid
        const dodsboDoc = new DodsboResource(dodsboID);
        // Updates users accepted-field in users document in participant-collection
        firestore.collection('dodsbo').doc(dodsboID).collection('participants').doc(userId).update({
            accepted: true
        })
    }

    async declineDodsboRequest(dodsboID: string) {
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
