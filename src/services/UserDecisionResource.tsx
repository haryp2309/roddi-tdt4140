import {auth, firestore} from "./Firebase";
import {DodsboObject} from "../services/DodsboObjectResource";
import firebase from "firebase";


/**
 * Represents the User's decision about an object.
 */
export default class UserDecisionResource {
    dodsboId: string;
    objectId: string;
    userId: string;

    constructor(dodsboId: string, objectId: string, userId: string) {
        this.dodsboId = dodsboId;
        this.objectId = objectId;
        this.userId = userId;
    }

    /**
     * Returns the user's user-decission document from the database.
     */
    private async getObjectPriority(): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
        return await firestore
            .collection("dodsbo")
            .doc(this.dodsboId)
            .collection("objects")
            .doc(this.objectId)
            .collection("user_decisions")
            .doc(this.userId);
    }

    /**
     * Returns the User's decission as possibleUserDecisions-type.
     */
    public async getUserDecision(): Promise<possibleUserDecisions> {
        let decision = (await (await this.getObjectPriority()).get()).data()
            ?.decision;
        if (decision == possibleUserDecisions.GIVE_AWAY)
            return possibleUserDecisions.GIVE_AWAY;
        else if (decision == possibleUserDecisions.THROW)
            return possibleUserDecisions.THROW;
        else if (decision == possibleUserDecisions.DISTRUBUTE)
            return possibleUserDecisions.DISTRUBUTE;
        else throw "Unsupported decision recieved.";
    }

    public async setUserDecision(decision: string): Promise<void> {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("Current user is not logged in, cannot set user decision")
        var newDodsboObjectDecision = firestore
            .collection("dodsbo")
            .doc(this.dodsboId)
            .collection("objects")
            .doc(this.objectId)
            .collection("user_decisions")
            .doc(this.userId);
        await newDodsboObjectDecision.set({
            decision: decision,
        });
        firestore
            .collection("dodsbo")
            .doc(this.dodsboId)
            .collection("user_priority")
            .doc(currentUser.uid)
            .get().then(snapshot => {
            const data = snapshot.data()
            const priority: string[] = data ? data.priority : []
            let newPriority = undefined
            if (decision === possibleUserDecisions.DISTRUBUTE) {
                if (!priority.includes(this.objectId)) {
                    priority.push(this.objectId)
                    newPriority = priority
                }
            } else {
                if (priority.includes(this.objectId)) {
                    newPriority = priority.filter(id => id !== this.objectId)
                }
            }
            if (newPriority) {
                firestore
                    .collection("dodsbo")
                    .doc(this.dodsboId)
                    .collection("user_priority")
                    .doc(currentUser.uid)
                    .set({
                        priority: newPriority
                    })
            }
        })

    }
}

/**
 * Represents all possible user-desicions the user can choose from.
 */
export enum possibleUserDecisions {
    GIVE_AWAY = "GIS_BORT",
    THROW = "KASTES",
    DISTRUBUTE = "FORDELES",
}

export class UserDecisions {
    userID: string;
    objects: Map<number, DodsboObject>;

    constructor(userID: string) {
        this.userID = userID;
        this.objects = new Map<number, DodsboObject>();
    }

    public addPriority(object: DodsboObject, priority: number) {
        this.objects.set(priority, object);
    }

}
