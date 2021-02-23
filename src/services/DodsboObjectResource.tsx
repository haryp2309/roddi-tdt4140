import { firestore } from "./Firebase";
import MainCommentResource from "./MainCommentResource";
import ObjectPriorityResource from "./ObjectPriorityResource";
import UserDecisionResource from "./UserDecisionResource";

export default class DodsboObjectResource{
    dodsboId: string;
    objectId: string;

    // initiate with desired dodsbo object 
    constructor(dodsboId: string, objectId: string) {
        this.dodsboId = dodsboId
        this.objectId = objectId
    }

    // path to dodsbo object in firestore
    private async getDodsboObject(): Promise<firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>>{
        return await firestore
        .collection('dodsbo')
        .doc(this.dodsboId)
        .collection('objects')
        .doc(this.objectId)
    }

    // return title of dodsbo object as string
    public async getTitle(): Promise<string> {
        return (await (await this.getDodsboObject()).get()).data()?.title
    }

    // return description of dodsbo object as string
    public async getDescription(): Promise<string> {
        return (await (await this.getDodsboObject()).get()).data()?.description
    }

    // return comments on dodsbo object as array of comments
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

    // return user assigned priorities of dodsbo object as array of priority
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

    // return user assigned decisions of dodsbo object as array of decision
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