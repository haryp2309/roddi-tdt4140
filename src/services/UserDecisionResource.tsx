import { firestore } from "./Firebase";

/**
 * Represents the User's decision about an object.
 */
export default class UserDecisionResource{
    dodsboId: string;
    objectId: string;
    userId: string;

    constructor(dodsboId: string, objectId: string, userId: string) {
        this.dodsboId = dodsboId
        this.objectId = objectId
        this.userId = userId
    }

    /**
     * Returns the user's user-decission document from the database.
     */
    private async getObjectPriority(): Promise<firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>>{
        return await firestore
        .collection('dodsbo')
        .doc(this.dodsboId)
        .collection('objects')
        .doc(this.objectId)
        .collection('user_decisions')
        .doc(this.userId)
    }

    /**
     * Returns the User's decission as possibleUserDecisions-type.
     */
    public async getUserDecision(): Promise<possibleUserDecisions> {
        let decision = (await (await this.getObjectPriority()).get()).data()?.decision
        if (decision == possibleUserDecisions.GIS_BORT) return possibleUserDecisions.GIS_BORT
        else if (decision == possibleUserDecisions.KASTES) return possibleUserDecisions.KASTES
        else if (decision == possibleUserDecisions.FORDELES) return possibleUserDecisions.FORDELES
        else throw "Unsupported decision recieved." 
    }

    public async setUserDecision(decision: string): Promise<void> {
        var newDodsboObjectDecision = firestore.collection('dodsbo').doc(this.dodsboId).collection('objects').doc(this.objectId).collection('user_decisions').doc();
        await newDodsboObjectDecision.set({
            decision: decision
        });
    }
};

/**
 * Represents all possible user-desicions the user can choose from.
 */
export enum possibleUserDecisions {
    GIS_BORT = "GIS_BORT",
    KASTES = "KASTES",
    FORDELES = "FORDELES"
}