import { firestore } from "./Firebase";
import UserResource from "./UserResource";

export default abstract class CommentResource{
    dodsboId: string;
    objectId: string;
    commentId: string;

    // initiate with desired comment object
    constructor(dodsboId: string, objectId: string, commentId: string) {
        this.dodsboId = dodsboId
        this.objectId = objectId
        this.commentId = commentId
    }

    // path to comment collection in firestore
    protected async getComment(): Promise<firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>>{
        return await firestore
        .collection('dodsbo')
        .doc(this.dodsboId)
        .collection('objects')
        .doc(this.objectId)
        .collection('comments')
        .doc(this.commentId)
    }
    // return content of comment as string
    public async getContent(): Promise<string> {
        return (await (await this.getComment()).get()).data()?.content
    }

    // return time of comment as date object
    public async getTimestamp(): Promise<Date> {
        return (await (await this.getComment()).get()).data()?.timestamp.toDate()
    }

    // return user who commented as a user object
    public async getUser(): Promise<UserResource> {
        const userId = (await (await this.getComment()).get()).data()?.user.id
        return new UserResource(userId)
    }
};