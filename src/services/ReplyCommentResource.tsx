import CommentResource from "./CommentResource";
import { firestore } from "./Firebase";
import UserResource from "./UserResource";

/**
 * Represents a reply-comment
 */
export default class ReplyCommentResource extends CommentResource {
    reply_commentId: string;

    constructor(dodsboId: string, objectId: string, commentId: string, reply_commentId: string) {
        super(dodsboId, objectId, commentId)
        this.reply_commentId = reply_commentId
    }
};