const assert = require("assert");
const firebase = require("@firebase/testing");

const MY_PROJECT_ID = "roddi-dev-91fcb";
const user1Auth = { uid: "user_abc", email: "abc@xyz.com" };
const user2Auth = { uid: "user_abcdef", email: "abcdef@xyz.com" };
const adminAuth = { uid: "admin_abc", email: "admin@admin.com" };
const dodsbo1 = {
  id: "min_dodsbo",
  title: "MIN BOD",
  description: "JAAA",
  participants: [adminAuth.uid, user1Auth.uid],
  role: ["ADMIN", "MEMBER"],
  step: 0,
};
const dodsbo2 = {
  id: "min_dodsbo2",
  title: "MIN BOD2",
  description: "JAAAa",
  participants: [adminAuth.uid, user1Auth.uid, user2Auth],
  role: ["ADMIN", "MEMBER", "MEMBER"],
  step: 0,
};

// Runs firebase test app against
function getFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
}

// Bypass rules
function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

// Clear database before new test
beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

describe("roddi_dev", () => {
  it("Admin can add item to dodsbo", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );

    // Testing
    const db = getFirestore(adminAuth);
    const testDoc = db
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects");
    await firebase.assertSucceeds(
      testDoc.add({ title: "Yas", value: 123, description: "Meow" })
    );
  });

  it("User can't add item to dodsbo", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );

    // Testing
    const db = getFirestore(user1Auth);
    const testDoc = db
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects");
    await firebase.assertFails(
      testDoc.add({ title: "Yas", value: 123, description: "Meow" })
    );
  });

  it("User can create dodsbo", async () => {
    // Populate dummy data

    // Testing
    const db = getFirestore(user1Auth);
    const testDoc = db.collection("dodsbo");
    await firebase.assertSucceeds(
      testDoc.add({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
  });

  it("User can accept dodsbo", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );

    // Testing
    const db = getFirestore(user1Auth);
    const user1PaCol = db
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(user1Auth.uid);
    await firebase.assertSucceeds(user1PaCol.update({ accepted: true }));
  });

  it("User can decline dodsbo", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );

    // Testing
    const db = getFirestore(user1Auth);
    const user1PaCol = db
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(user1Auth.uid);
    await firebase.assertSucceeds(user1PaCol.delete());
    const user1Pa = db.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      user1Pa.update({ participants: [adminAuth.uid] })
    );
  });

  it("User can comment on object", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );
    const object = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects")
      .doc("object_id");
    await firebase.assertSucceeds(
      object.set({ title: "Yas", value: 123, description: "Meow" })
    );

    // Testing
    const db = getFirestore(user1Auth);

    const comment = db
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects")
      .doc("object_id")
      .collection("comments");

    await firebase.assertSucceeds(
      comment.add({
        content: "hei",
        timestamp: new Date(),
        user: user1Auth.uid,
      })
    );
  });

  it("Admin can delete comment", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );
    const comment = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects")
      .doc("object_id")
      .collection("comments");
    await firebase.assertSucceeds(
      comment.add({
        content: "hei",
        timestamp: new Date(),
        user: adminAuth.uid,
      })
    );

    // Testing
    const theComment = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects")
      .doc("object_id")
      .collection("comments")
      .doc("object_id");

    await firebase.assertSucceeds(theComment.delete());
  });

  it("User can't delete comment", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );
    const comment = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects")
      .doc("object_id")
      .collection("comments")
      .doc("comment_id");
    await firebase.assertSucceeds(
      comment.set({
        content: "hei",
        timestamp: new Date(),
        user: adminAuth.uid,
      })
    );

    // Testing
    const db = getFirestore(user1Auth);
    const theComment = db
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects")
      .doc("object_id")
      .collection("comments")
      .doc("comment_id");

    await firebase.assertFails(theComment.delete());
  });

  it("User can decide object", async () => {
    // Populate dummy data
    const admin = getFirestore(adminAuth);
    const dodsbo = admin.collection("dodsbo").doc(dodsbo1.id);
    await firebase.assertSucceeds(
      dodsbo.set({
        title: dodsbo1.title,
        description: dodsbo1.description,
        participants: dodsbo1.participants,
        step: dodsbo1.step,
      })
    );
    const user0 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[0]);
    await firebase.assertSucceeds(
      user0.set({ role: dodsbo1.role[0], accepted: false })
    );
    await firebase.assertSucceeds(user0.update({ accepted: true }));
    const user1 = admin
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("participants")
      .doc(dodsbo1.participants[1]);
    await firebase.assertSucceeds(
      user1.set({ role: dodsbo1.role[1], accepted: false })
    );

    // Testing
    const db = getFirestore(user1Auth);
    const decision = db
      .collection("dodsbo")
      .doc(dodsbo1.id)
      .collection("objects")
      .doc("object_id")
      .collection("user_decisions")
      .doc(user1Auth.uid);
    await firebase.assertSucceeds(decision.set({ decision: "KASTES" }));
  });
});

// Clear database after test is done
after(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
