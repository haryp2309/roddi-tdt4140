import DodsboObjectResource, { DodsboObject } from "./DodsboObjectResource";
import { auth, firestore } from "./Firebase";
import Service from "./Service";
import UserResource, { PublicUser,User } from "./UserResource";
import firebase from "./Firebase";
import { UserDecisions } from "./UserDecisionResource";
import { DodsboResults } from "../classes/DodsboResults";
import {DodsboResultsPreview} from "../classes/DodsboResultsPreview";

export default class DodsboResource {
  id: string;

  // initiate with desired dodsbo
  public constructor(id: string) {
    this.id = id;
  }

  observeMyMembership = (
    callback: (
      documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    ) => void
  ) => {
    if (!auth.currentUser) throw "User is not logged in";
    return firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("participants")
      .doc(auth.currentUser.uid)
      .onSnapshot(callback);
  };

  observeDodsboPaticipants = (
    callback: (
      documentSnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    ) => void
  ) => {
    if (!auth.currentUser) throw "User is not logged in";
    return firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("participants")
      .onSnapshot(callback);
  };

  observeDodsboMembersCount = (callback: (count: number) => void) => {
    const internalCallback = (
        querySnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    ) => {
      const internalCallback = (querySnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
        callback(querySnapshot.docs.length)
      }
      this.observeDodsboMembers(internalCallback)
    };
  }

    observeDodsboMembersAsUserIds = (
        callback: (
            memberIds: string[]
        ) => void
    ) => {
        const internalCallback = (querySnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
            const memberIds = querySnapshot.docs.map((doc) => doc.id)
            callback(memberIds)
        }
        this.observeDodsboMembers(internalCallback)
    };

    observeDodsboMembers = (
        callback: (querySnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void
    ) => {
        if (!auth.currentUser) throw "User is not logged in";
        return firestore
            .collection("dodsbo")
            .doc(this.id)
            .collection("participants")
            .where("role", "==", "MEMBER")
            .onSnapshot(callback);
    };

  observeDodsboObjects = (
    callback: (
      documentSnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    ) => void
  ) => {
    if (!auth.currentUser) throw "User is not logged in";
    return firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("objects")
      .onSnapshot(callback);
  };

  observeDodsbo = async (callback: (dodsbo: Dodsbo) => void) => {
    const internalCallback = (
      snapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    ) => {
      const data = snapshot.data();
      if (!data) throw "Dodsbo is not defined. Cannot observe.";
      const dodsbo = new Dodsbo(
        snapshot.id,
        data.title,
        data.description,
        data.step
      );
      callback(dodsbo);
    };
    return firestore
      .collection("dodsbo")
      .doc(this.id)
      .onSnapshot(internalCallback);
  };

  observeDodsboObjectPriority = (
    callback: (
      documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    ) => void
  ) => {
    if (!auth.currentUser) throw "User is not logged in";
    return firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("user_priority")
      .doc(auth.currentUser.uid)
      .onSnapshot(callback);
  };

  // path to dodsbo in firestore
  private async getDodsbo(): Promise<
    firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  > {
    return await firestore.collection("dodsbo").doc(this.id).get();
  }

  /**
   * return title of dodsbo as string
   * throw error as string if dodsbo does not exist.
   */
  public async getTitle(): Promise<string> {
    const dodsbo = await this.getDodsbo();
    if (dodsbo.exists) {
      return dodsbo.data()?.title;
    } else {
      throw "Title not found. Does the Dodsbo exist?";
    }
  }

  /**
   * return participants (admin + members) of dodsbo as a list of user objects.
   * throw error if no
   */
  public async getParticipants(): Promise<UserResource[]> {
    const participants = await firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("participants")
      .get();
    if (!participants.empty) {
      const participantsArray: UserResource[] = [];
      participants.docs.forEach((participant) => {
        participantsArray.push(new UserResource(participant.id));
      });
      return participantsArray;
    } else {
      throw "Participants not found. Does the Dodsbo exist?";
    }
  }

  /**
   * Return true if the user is a admin.
   */
  public async isAdmin(): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (currentUser == undefined) throw "User not logged in.";
    let userId: string = currentUser.uid;
    const myDoc = await firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("participants")
      .doc(userId)
      .get();
    const role = await myDoc.data()?.role;
    if (await Service.checkIsOwner()) {
      return true;
    }
    return role == "ADMIN";
  }

  /**
   * Gets all the participants Id's
   */
  public async getParticipantsIds(): Promise<string[]> {
    const dodsbo = await this.getDodsbo();
    if (dodsbo.exists) {
      return dodsbo.data()?.participants;
    } else {
      throw "Participants not found. Does the Dodsbo exist?";
    }
  }

  /**
   * return administrators of dodsbo as list of users
   * throw error if
   */
  public async getAdmins(): Promise<UserResource[]> {
    const admins = await firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("participants")
      .where("role", "==", "ADMIN")
      .get();
    if (!admins.empty) {
      const adminsArray: UserResource[] = [];
      admins.docs.forEach((admin) => {
        adminsArray.push(new UserResource(admin.id));
      });
      return adminsArray;
    } else {
      throw "Admins not found. Does the Dodsbo exist?";
    }
  }

  /**
   * return members of dodsbo as list of users
   * throw error if no participants exist
   */
  public async getMembers(): Promise<UserResource[]> {
    const members = await firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("participants")
      .where("role", "==", "MEMBER")
      .get();
    if (!members.empty) {
      const membersArray: UserResource[] = [];
      members.docs.forEach((member) => {
        membersArray.push(new UserResource(member.id));
      });
      return membersArray;
    } else {
      throw "Members not found. Does the Dodsbo exist?";
    }
  }

  /**
   * return title of dodsbo as string
   * throw error if description does not exist
   */
  public async getDescription(): Promise<string> {
    const dodsbo = await this.getDodsbo();
    if (dodsbo.exists) {
      return dodsbo.data()?.description;
    } else {
      throw "Description not found. Does the Dodsbo exist?";
    }
  }

  /**
   *   return id of dodsbo as string
   */
  public getId(): string {
    return this.id;
  }

  /**
   * return objects in dodsbo as a list of objects
   * throw error if there exist no objects
   */
  public async getObjects(): Promise<DodsboObjectResource[]> {
    const objects = await firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("objects")
      .get();
    if (!objects.empty) {
      const objectsArray: DodsboObjectResource[] = [];
      objects.docs.forEach((objects) => {
        objectsArray.push(new DodsboObjectResource(this.id, objects.id));
      });
      return objectsArray;
    } else {
      return [];
    }
  }

  public async createDodsboObject(
    title: string,
    description: string,
    value: number
  ): Promise<void> {
    if (
      !(title != undefined && description != undefined && value != undefined)
    ) {
      throw "Recieved invalid data. Aborting createDodsbo.";
    }
    if (!this.isAdmin()) throw "User not admin in dødsbo.";
    // legge inn sjekk på om bruker er admin

    var newDodsboObject = firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("objects")
      .doc();
    await newDodsboObject.set({
      title: title,
      description: description,
      value: value,
    });
  }

  public async getInfo(): Promise<Dodsbo> {
    const dodsbo = this.getDodsbo();
    const isAccepted = Service.isDodsboAccepted(this.id);
    await Promise.allSettled([dodsbo, isAccepted]);
    const settledDodsbo = await dodsbo;
    const settledIsAccepted = await isAccepted;
    if (settledDodsbo.exists) {
      const id = this.id;
      const title = settledDodsbo.data()?.title;
      const description = settledDodsbo.data()?.description;
      const step = settledDodsbo.data()?.step;
      const dodsbo = new Dodsbo(id, title, description, step);
      dodsbo.isAccepted = settledIsAccepted;
      return dodsbo;
    } else {
      throw "Dodsbo not found. Does the Dodsbo exist?";
    }
  }

  public async deleteDodsboParticipant(participantId: string): Promise<void> {
    const dodsbo = firestore.collection("dodsbo").doc(this.id);
    await dodsbo.update({
      participants: firebase.firestore.FieldValue.arrayRemove(
        ...[participantId]
      ),
    });

    await dodsbo.collection("participants").doc(participantId).delete();
  }

  async sendRequestsToUsers(
    usersEmails: string[],
    roles: string[]
  ): Promise<void> {
    const notSettledAlreadyParticipants = this.getParticipantsIds();
    const userResources = usersEmails.map((email) => {
      return Service.getUserFromEmail(email);
    });
    const settledUserResources = await Promise.all(userResources);
    const userIds: string[] = settledUserResources.map((user) =>
      user.getUserId()
    );
    const alreadyParticipants = await notSettledAlreadyParticipants;
    const dodsbo = firestore.collection("dodsbo").doc(this.id);
    console.log(userIds, roles);
    await dodsbo.update({
      participants: firebase.firestore.FieldValue.arrayUnion(...userIds),
    });
    const sendingRequests: Promise<void>[] = [];
    userIds.forEach((userId, index) => {
      if (!alreadyParticipants.includes(userId)) {
        const request = dodsbo.collection("participants").doc(userId).set({
          role: roles[index],
          accepted: false,
        });
        sendingRequests.push(request);
      }
    });
    await Promise.all(sendingRequests);
  }

  public async isActive(): Promise<boolean> {
    const dodsbo = await firestore.collection("dodsbo").doc(this.id).get();
    if (dodsbo.exists) {
      let step = dodsbo.data()?.step;
      if (step == 0 || step == 1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sets the current users priority of objects
   *
   * @param userPriority, a list of objectsId in prioritized order
   */
  public async setUserPriority(userPriority: DodsboObject[]): Promise<void> {
    const currentUser = auth.currentUser;
    if (currentUser == undefined) throw "User not logged in.";
    await firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("user_priority")
      .doc(currentUser.uid)
      .set({
        priority: userPriority.map((priority) => priority.id),
      });
  }

  public async setStep(step: number) {
    await firestore.collection("dodsbo").doc(this.id).update({
      step: step,
    });
  }

  public async getDecisions() {
    const promises = [];
    promises.push(
      firestore.collection("dodsbo").doc(this.id).collection("objects").get()
    );
    promises.push(
      firestore
        .collection("dodsbo")
        .doc(this.id)
        .collection("user_priority")
        .get()
    );

    const [objectsQuerySnapshot, priorityQuerySnapshot] = await Promise.all(
      promises
    );

    const objects: Map<string, DodsboObject> = new Map<string, DodsboObject>();

    objectsQuerySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const object: DodsboObject = new DodsboObject(
        doc.id,
        this.id,
        data.title,
        data.description,
        data.value
      );
      objects.set(doc.id, object);
    });

    const userPriorities: UserDecisions[] = [];
    priorityQuerySnapshot.docs.forEach((doc) => {
      const decision = new UserDecisions(doc.id);
      const priorityArray: string[] = doc.data().priority;
      priorityArray.forEach((objectId, index) => {
        const dodsboObject = objects.get(objectId);
        if (!dodsboObject)
          throw Error("DodsboObject is not found. Something is wrong...");
        decision.addPriority(dodsboObject, index);
      });
      userPriorities.push(decision);
    });

    return userPriorities;
  }

  public async setResult(results: any) {
    await firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("results")
      .add(results);
  }

  observeResults = (onResultsReceived: (results: DodsboResults) => void) => {
    const callback = (
      querySnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    ) => {
      if (querySnapshot.docs.length === 0) return;
      const documentSnapshot = querySnapshot.docs.reduce((doc1, doc2) => {
        const timestamp1 = doc1.data()
          .timestamp as firebase.firestore.Timestamp;
        const timestamp2 = doc2.data()
          .timestamp as firebase.firestore.Timestamp;
        if (timestamp1.toDate() > timestamp2.toDate()) return doc1;
        else return doc2;
      });
      const results = DodsboResults.fromJSON(documentSnapshot.data());
      onResultsReceived(results);
    };
    firestore
      .collection("dodsbo")
      .doc(this.id)
      .collection("results")
      .onSnapshot(callback);
  };
}

export enum dodsboSteps {
  STEP1 = 0,
  STEP2 = 1,
  STEP3 = 2,
}

export class Dodsbo {
  id: string;
  title: string;
  description: string;
  isAccepted: boolean;
  step: dodsboSteps;
  isAdmin: boolean | undefined;
  participantsObserver: (() => void) | undefined;
  objectsObserver: (() => void) | undefined;

  constructor(
    id: string,
    title: string,
    description: string,
    step: dodsboSteps
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isAccepted = false;
    this.step = step;
  }
}
