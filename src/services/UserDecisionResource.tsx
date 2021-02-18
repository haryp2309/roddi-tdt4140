import { firestore } from "./Firebase";

export default class UserDecisionResource{
    dodsboId: string;
    objectId: string;
    userId: string;

    constructor(dodsboId: string, objectId: string, userId: string) {
        this.dodsboId = dodsboId
        this.objectId = objectId
        this.userId = userId
    }

    private async getObjectPriority(): Promise<firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>>{
        return await firestore
        .collection('dodsbo')
        .doc(this.dodsboId)
        .collection('objects')
        .doc(this.objectId)
        .collection('user_decisions')
        .doc(this.userId)
    }

    public async getUserDecision(): Promise<string> {
        return (await (await this.getObjectPriority()).get()).data()?.decision
    }



};