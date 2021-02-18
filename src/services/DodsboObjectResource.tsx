import { firestore } from "./Firebase";
import MainCommentResource from "./MainCommentResource";
import ObjectPriorityResource from "./ObjectPriorityResource";
import UserDecisionResource from "./UserDecisionResource";

export default class DodsboObjectResource{
    dodsboId: string;
    objectId: string;

    constructor(dodsboId: string, objectId: string) {
        this.dodsboId = dodsboId
        this.objectId = objectId
    }

    private async getDodsboObject(): Promise<firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>>{
        return await firestore
        .collection('dodsbo')
        .doc(this.dodsboId)
        .collection('objects')
        .doc(this.objectId)
    }

    public async getTitle(): Promise<string> {
        return (await (await this.getDodsboObject()).get()).data()?.title
    }

    public async getDescription(): Promise<string> {
        return (await (await this.getDodsboObject()).get()).data()?.description
    }

    public async getComments(): Promise<MainCommentResource[]> {
        const commentsArray: MainCommentResource[] = []
        const comments = await ((await this.getDodsboObject()).collection('comments').get())
        if (!comments.empty) {
            comments.docs.forEach(comment => {
                commentsArray.push(new MainCommentResource(this.dodsboId, this.objectId, comment.id))
            })
        }
        return commentsArray
    }

    public async getObjectPriority(): Promise<ObjectPriorityResource[]> {
        const userPrioritiesArray: ObjectPriorityResource[] = []
        const userPriorities = await ((await this.getDodsboObject()).collection('priority').get())
        if (!userPriorities.empty) {
            userPriorities.docs.forEach(userPriority => {
                userPrioritiesArray.push(new ObjectPriorityResource(this.dodsboId, this.objectId, userPriority.id))
            })
        }
        return userPrioritiesArray
    }

    public async getUserDecision(): Promise<UserDecisionResource[]> {
        const userDecisionsArray: UserDecisionResource[] = []
        const userDecisions = await ((await this.getDodsboObject()).collection('user_decisions').get())
        if (!userDecisions.empty) {
            userDecisions.docs.forEach(userDecision => {
                userDecisionsArray.push(new UserDecisionResource(this.dodsboId, this.objectId, userDecision.id))
            })
        }
        return userDecisionsArray
    }

};