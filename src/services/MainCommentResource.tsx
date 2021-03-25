import CommentResource from "./CommentResource";
import { firestore, auth } from "./Firebase";
import ReplyCommentResource from "./ReplyCommentResource";
import UserResource from "./UserResource";

export default class MainCommentResource extends CommentResource {
  /**
   * return replies to comment as a list of replycommentresource
   */
  public async getReplyComments(): Promise<ReplyCommentResource[]> {
    const commentsArray: ReplyCommentResource[] = [];
    const comments = await (await this.getComment())
      .collection("reply_comments")
      .get();
    if (!comments.empty) {
      comments.docs.forEach((reply_comment) => {
        commentsArray.push(
          new ReplyCommentResource(
            this.dodsboId,
            this.objectId,
            this.commentId,
            reply_comment.id
          )
        );
      });
    }
    return commentsArray;
  }

  public async createDodsboObjectReply(reply: string): Promise<void> {
    if (!auth.currentUser) throw "Cannot create comment. Not signed in.";
    var newDodsboObjectReply = firestore
      .collection("dodsbo")
      .doc(this.dodsboId)
      .collection("objects")
      .doc(this.objectId)
      .collection("comments")
      .doc(this.commentId)
      .collection("reply_comments");
    await newDodsboObjectReply.add({
      content: reply,
      timestamp: Date.now(),
      user: auth.currentUser.uid,
    });
  }

  public async deleteDodsboObjectComment(): Promise<void> {
    const documentsIds = await firestore
      .collection("dodsbo")
      .doc(this.dodsboId)
      .collection("objects")
      .doc(this.objectId)
      .collection("comments")
      .doc(this.commentId).get().data()?.reply_comments;
    
    for (const documentId of documentsIds) {
      await firestore
        .collection("dodsbo")
        .doc(this.dodsboId)
        .collection("objects")
        .doc(this.objectId)
        .collection("comments")
        .doc(this.commentId)
        .collection("reply_comments")
        .doc(documentId)
        .delete();
    }

    await firestore
      .collection("dodsbo")
      .doc(this.dodsboId)
      .collection("objects")
      .doc(this.objectId)
      .collection("comments")
      .doc(this.commentId)
      .delete();
  }
}

export class DodsboObjectMainComment {
  id: string;
  dodsboId: string | undefined;
  dodsboObjectId: string | undefined;
  content: string;
  userName: string;
  timestamp: Date;

  constructor(id: string, content: string, userName: string, timestamp: Date) {
    this.id = id;
    this.content = content;
    this.userName = userName;
    this.timestamp = timestamp;
  }
}
