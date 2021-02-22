import { firestore } from "./Firebase";
import UserResource from "./UserResource";

export default class CommentResource{
    dodsboId: string;
    objectId: string;
    commentId: string;

    constructor(dodsboId: string, objectId: string, commentId: string) {
        this.dodsboId = dodsboId
        this.objectId = objectId
        this.commentId = commentId
    }

    protected async getComment(): Promise<firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>>{
        return await firestore
        .collection('dodsbo')
        .doc(this.dodsboId)
        .collection('objects')
        .doc(this.objectId)
        .collection('comments')
        .doc(this.commentId)
    }

    public async getContent(): Promise<string> {
        return (await (await this.getComment()).get()).data()?.content
    }

    public async getTimestamp(): Promise<Date> {
        return (await (await this.getComment()).get()).data()?.timestamp.toDate()
    }

    public async getUser(): Promise<UserResource> {
        const userId = (await (await this.getComment()).get()).data()?.user.id
        return new UserResource(userId)
    }
};