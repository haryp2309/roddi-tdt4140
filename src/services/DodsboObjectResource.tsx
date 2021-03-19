import firebase, { firestore, auth } from "./Firebase";
import MainCommentResource from "./MainCommentResource";
import ObjectPriorityResource from "./ObjectPriorityResource";
import UserDecisionResource, {
  possibleUserDecisions,
} from "./UserDecisionResource";

export default class DodsboObjectResource {
  dodsboId: string;
  objectId: string;

  // initiate with desired dodsbo object
  constructor(dodsboId: string, objectId: string) {
    this.dodsboId = dodsboId;
    this.objectId = objectId;
  }

  // path to dodsbo object in firestore
  private async getDodsboObject(): Promise<
    firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  > {
    return await firestore
      .collection("dodsbo")
      .doc(this.dodsboId)
      .collection("objects")
      .doc(this.objectId);
  }

  // return title of dodsbo object as string
  public async getTitle(): Promise<string> {
    return (await (await this.getDodsboObject()).get()).data()?.title;
  }

  // return description of dodsbo object as string
  public async getDescription(): Promise<string> {
    return (await (await this.getDodsboObject()).get()).data()?.description;
  }

  // return value of dodsbo object as number
  public async getValue(): Promise<number> {
    return (await (await this.getDodsboObject()).get()).data()?.value;
  }

  // return comments on dodsbo object as array of comments
  public async getComments(): Promise<MainCommentResource[]> {
    const commentsArray: MainCommentResource[] = [];
    const comments = await (await this.getDodsboObject())
      .collection("comments")
      .get();
    if (!comments.empty) {
      comments.docs.forEach((comment) => {
        commentsArray.push(
          new MainCommentResource(this.dodsboId, this.objectId, comment.id)
        );
      });
    }
    return commentsArray;
  }

  observeDodsboObjects = (
    callback: (
      documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    ) => void
  ) => {
    if (!auth.currentUser) throw "User is not logged in";
    return firestore
      .collection("dodsbo")
      .doc(this.dodsboId)
      .collection("objects")
      .doc(this.objectId)
      .collection("user_decisions")
      .doc(auth.currentUser.uid)
      .onSnapshot(callback);
  };

  // return user assigned priorities of dodsbo object as array of priority
  public async getObjectPriority(): Promise<ObjectPriorityResource[]> {
    const userPrioritiesArray: ObjectPriorityResource[] = [];
    const userPriorities = await (await this.getDodsboObject())
      .collection("priority")
      .get();
    if (!userPriorities.empty) {
      userPriorities.docs.forEach((userPriority) => {
        userPrioritiesArray.push(
          new ObjectPriorityResource(
            this.dodsboId,
            this.objectId,
            userPriority.id
          )
        );
      });
    }
    return userPrioritiesArray;
  }

  // return user assigned decisions of dodsbo object as array of decision
  public async getUserDecision(): Promise<UserDecisionResource[]> {
    const userDecisionsArray: UserDecisionResource[] = [];
    const userDecisions = await (await this.getDodsboObject())
      .collection("user_decisions")
      .get();
    if (!userDecisions.empty) {
      userDecisions.docs.forEach((userDecision) => {
        userDecisionsArray.push(
          new UserDecisionResource(
            this.dodsboId,
            this.objectId,
            userDecision.id
          )
        );
      });
    }
    return userDecisionsArray;
  }
  public async deleteDodsboObject(): Promise<void> {
    await firestore
      .collection("dodsbo")
      .doc(this.dodsboId)
      .collection("objects")
      .doc(this.objectId)
      .delete();
  }
}

export class DodsboObject {
  id: string;
  title: string;
  description: string;
  value: number;
  userDecision: possibleUserDecisions | undefined;
  objectObserver: (() => void) | undefined;
  userDecisionObserver: (() => void) | undefined;

  constructor(id: string, title: string, description: string, value: number) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.value = value;
  }
}
