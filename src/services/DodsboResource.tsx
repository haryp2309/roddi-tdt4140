import DodsboObjectResource from "./DodsboObjectResource";
import { firestore } from "./Firebase";
import UserResource from "./UserResource";

export default class DodsboResource {
    id: string;

    public constructor(id: string) {
        this.id = id;
    }
    
    private async getDodsbo(): Promise<firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>>{
        return await firestore.collection('dodsbo').doc(this.id).get()
    }

    public async getTitle(): Promise<string> {
        const dodsbo = await this.getDodsbo()
        if (dodsbo.exists) {
            return dodsbo.data()?.title
        } else {
            throw "Title not found. Does the Dodsbo exist?"
        }
    }

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
    
    
    public async getAdmins(): Promise<UserResource[]> {
        const participants = await firestore.collection('dodsbo')
        .doc(this.id)
        .collection('participants')
        .where("role", "==", "ADMIN")
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

    public async getMembers(): Promise<UserResource[]> {
        const participants = await firestore.collection('dodsbo')
        .doc(this.id)
        .collection('participants')
        .where("role", "==", "MEMBER")
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

    public async getDescription(): Promise<string> {
        const dodsbo = await this.getDodsbo()
        if (dodsbo.exists) {
            return dodsbo.data()?.description
        } else {
            throw "Description not found. Does the Dodsbo exist?"
        }
    }

    public getId(): string {
        return this.id
    }

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