import DodsboObjectResource from "./DodsboObjectResource";
import { firestore } from "./Firebase";
import UserResource from "./UserResource";

export default class DodsboResource {
    id: string;
    // initiate with desired dodsbo 
    public constructor(id: string) {
        this.id = id;
    }
    // path to dodsbo in firestore
    private async getDodsbo(): Promise<firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>>{
        return await firestore.collection('dodsbo').doc(this.id).get()
    }
    /**
     * return title of dodsbo as string  
     * throw error as string if dodsbo does not exist.
    */
    public async getTitle(): Promise<string> {
        const dodsbo = await this.getDodsbo()
        if (dodsbo.exists) {
            return dodsbo.data()?.title
        } else {
            throw "Title not found. Does the Dodsbo exist?"
        }
    }
    /** 
     * return participants (admin + members) of dodsbo as a list of user objects.
     * throw error if no 
    */ 
    public async getParticipants(): Promise<UserResource[]> {
        const participants = await firestore.collection('dodsbo')
        .doc(this.id)
        .collection('participants')
        .get()
        if (!participants.empty) {
            const participantsArray: UserResource[] = []
            participants.docs.forEach(participant => {
                participantsArray.push(new UserResource(participant.id))
            })
            return participantsArray
        } else {
            throw "Participants not found. Does the Dodsbo exist?"
        }
    }

    /**
     * Return true if the user is a admin.
     */
    public async isUserAdmin(userId: string): Promise<boolean> {
        var admins = await this.getAdmins();
        for await (const admin of admins) {
            if (userId == admin.getUserId()) {
                return true
            }
        }
        return false
    }

    /**
     * Gets all the participants Id's
     */
    public async getParticipantsIds(): Promise<string[]> {
        const dodsbo = await this.getDodsbo()
        if (dodsbo.exists) {
            return dodsbo.data()?.participants
        } else {
            throw "Participants not found. Does the Dodsbo exist?"
        }
    }
    
    /**
     * return administrators of dodsbo as list of users
     * throw error if
     */
    public async getAdmins(): Promise<UserResource[]> {
        const admins = await firestore.collection('dodsbo')
        .doc(this.id)
        .collection('participants')
        .where("role", "==", "ADMIN")
        .get()
        if (!admins.empty) {
            const adminsArray: UserResource[] = []
            admins.docs.forEach(admin => {
                adminsArray.push(new UserResource(admin.id))
            })
            return adminsArray
        } else {
            throw "Admins not found. Does the Dodsbo exist?"
        }
    }

    /** 
     * return members of dodsbo as list of users
     * throw error if no participants exist
    */
    public async getMembers(): Promise<UserResource[]> {
        const members = await firestore.collection('dodsbo')
        .doc(this.id)
        .collection('participants')
        .where("role", "==", "MEMBER")
        .get()
        if (!members.empty) {
            const membersArray: UserResource[] = []
            members.docs.forEach(member => {
                membersArray.push(new UserResource(member.id))
            })
            return membersArray
        } else {
            throw "Members not found. Does the Dodsbo exist?"
        }
    }
    
    /**
     * return title of dodsbo as string
     * throw error if description does not exist
     */
    public async getDescription(): Promise<string> {
        const dodsbo = await this.getDodsbo()
        if (dodsbo.exists) {
            return dodsbo.data()?.description
        } else {
            throw "Description not found. Does the Dodsbo exist?"
        }
    }
    
    // return id of dodsbo as string
    public getId(): string {
        return this.id
    }

    /**
     * return objects in dodsbo as a list of objects
     * throw error if there exist no objects
     */
    public async getObjects(): Promise<DodsboObjectResource[]> {
        const objects = await firestore.collection('dodsbo')
        .doc(this.id)
        .collection('objects')
        .get()
        if (!objects.empty) {
            const objectsArray: DodsboObjectResource[] = []
            objects.docs.forEach(objects => {
                objectsArray.push(new DodsboObjectResource(this.id, objects.id))
            })
            return objectsArray
        } else {
            throw "DodsboObject not found. Does the Dodsbo exist?"
        }
    }

}