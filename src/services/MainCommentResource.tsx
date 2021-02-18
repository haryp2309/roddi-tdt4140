import CommentResource from "./CommentResource";
import { firestore } from "./Firebase";
import ReplyCommentResource from "./ReplyCommentResource";
import UserResource from "./UserResource";

export default class MainCommentResource extends CommentResource{

    public async getReplyComments(): Promise<ReplyCommentResource[]> {
        const commentsArray: ReplyCommentResource[] = []
        const comments = await ((await this.getComment()).collection('reply_comments').get())
        if (!comments.empty) {
            comments.docs.forEach(reply_comment => {
                commentsArray.push(new ReplyCommentResource(this.dodsboId, this.objectId,this.commentId, reply_comment.id))
            })
        }
        return commentsArray
        
    }

};