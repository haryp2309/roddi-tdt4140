import { firestore } from "./Firebase";

/**
 * Represents a user's priority of an object.
 */
export default class ObjectPriorityResource{
    dodsboId: string;
    objectId: string;
    userId: string;

    constructor(dodsboId: string, objectId: string, userId: string) {
        this.dodsboId = dodsboId
        this.objectId = objectId
        this.userId = userId
    }

    /**
     * Returns the object priority document.
     */
    private async getObjectPriority(): Promise<firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>>{
        return await firestore
        .collection('dodsbo')
        .doc(this.dodsboId)
        .collection('objects')
        .doc(this.objectId)
        .collection('priority')
        .doc(this.userId)
    }

    /**
     * Returns the user's priority of the object.
     */
    public async getPriorityLevel(): Promise<number> {
        return (await (await this.getObjectPriority()).get()).data()?.priority_level
    }



};