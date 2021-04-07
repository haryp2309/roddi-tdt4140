/**
 * @jest-environment node
 */

import React, { useCallback } from "react";
import { createSuper } from "typescript";
import DodsboObjectResource from "../services/DodsboObjectResource";
import DodsboResource from "../services/DodsboResource";
import { auth } from "../services/Firebase";
import Service from "../services/Service";
import UserDecisionResource from "../services/UserDecisionResource";
import UserResource, { User } from "../services/UserResource";

const user1 = {
  firstName: "Olav",
  lastName: "Nordmann",
  emailAddress: "olav.nordmann@ymail.com",
  birthday: "1999-02-03",
  password: "Passordsajdasklnj",
  userDecision: "KASTES",
};

const user2 = {
  firstName: "Kari",
  lastName: "Nordli",
  emailAddress: "kari.nordli@ymail.com",
  birthday: "1998-12-02",
  password: "Passsadordsajdasklnj",
  userDecision: "FORDELES",
};

const user3 = {
  firstName: "Nora",
  lastName: "Nordli",
  emailAddress: "nora.nordli@ymail.com",
  birthday: "1996-11-02",
  password: "Passsadordsajdasklnj",
  userDecision: "FORDELES",
};

const dodsbo1 = {
  title: "Dodsbo1",
  description: "Dette er et dodsbo",
  userEmails: ["kari.nordli@ymail.com"],
};

const dodsboObject1 = {
  title: "DodsboObject1",
  description: "Dette er et dodsboObject",
  value: 200,
};

const dodsboComment1 = {
  content: "Dette er en kommentar",
};

const dodsboComment2 = {
  content: "Dette er en annen kommentar",
};

/* TEMPLATE FOR TESTER 
test("exampleTest", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator()
    // ... 

    // Testing
    try {
      // ... (eks. expect(something).toBe(somethingElse))

      done();
    } catch (error) {
      done(error);
    }
  }
  actualTest()
})
TEMPLATE FOR TESTER */

test("CreateAndDeleteComment", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator();
    await createUser(user2);
    await createUser(user1);
    await Service.createDodsbo(
      dodsbo1.title,
      dodsbo1.description,
      dodsbo1.userEmails
    );

    const createdDodsbo: DodsboResource = (await Service.getDodsbos())[0];

    await createdDodsbo.createDodsboObject(
      dodsboObject1.title,
      dodsboObject1.description,
      dodsboObject1.value
    );

    const object: DodsboObjectResource = (await createdDodsbo.getObjects())[0];
    await Service.signOut();
    await Service.signIn(user2.emailAddress, user2.password);

    // Testing
    try {
      object.createDodsboObjectComment(dodsboComment1.content);
      expect((await object.getComments()).length).toBe(1);
      let comment1 = (await object.getComments())[0];
      expect(await comment1.getContent()).toBe(dodsboComment1.content);

      // Swiing to admin
      await Service.signOut();
      await Service.signIn(user1.emailAddress, user1.password);

      object.createDodsboObjectComment(dodsboComment2.content);
      expect((await object.getComments()).length).toBe(2);

      // Delete first comment
      await comment1.deleteDodsboObjectComment();
      expect((await object.getComments()).length).toBe(1);
      let comment2 = (await object.getComments())[0];
      expect(await comment2.getContent()).toBe(dodsboComment2.content);

      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

test("getNumberOfUsers", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator();
    await createUser(user2);
    await createUser(user1);
    await createUser(user3);

    // Testing
    try {
      expect(await Service.getUsers()).toBe(3);

      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

test("createDodsboObjectAndDelete", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator();
    await createUser(user2);
    await createUser(user1);
    await Service.createDodsbo(
      dodsbo1.title,
      dodsbo1.description,
      dodsbo1.userEmails
    );
    const createdDodsbo: DodsboResource = (await Service.getDodsbos())[0];

    await createdDodsbo.createDodsboObject(
      dodsboObject1.title,
      dodsboObject1.description,
      dodsboObject1.value
    );
    const objects: DodsboObjectResource[] = await createdDodsbo.getObjects();

    // Testing createDodsboObject
    try {
      expect(objects.length).toBe(1);
    } catch (error) {
      done(error);
    }

    // Further setup
    const createdObject: DodsboObjectResource = objects[0];

    // Testing getTitle, getDecription and getValue
    try {
      expect(await createdObject.getTitle()).toBe(dodsboObject1.title);
      expect(await createdObject.getDescription()).toBe(
        dodsboObject1.description
      );
      expect(await createdObject.getValue()).toBe(dodsboObject1.value);
    } catch (error) {
      done(error);
    }

    // Delete object
    await createdObject.deleteDodsboObject();
    const noObjects: DodsboObjectResource[] = await createdDodsbo.getObjects();

    try {
      expect(noObjects.length).toBe(0);
      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

test("createUserAndSignIn", (done) => {
  const actualTest = async () => {
    // Setup
    await resetEmulator();
    const user: User = user1;
    await createUser(user);
    const resultedUser: UserResource = await Service.signIn(
      user.emailAddress,
      user.password
    );

    // Testing
    try {
      // First time loading
      expect(await resultedUser.getFirstName()).toEqual(user.firstName);
      expect(await resultedUser.getLastName()).toEqual(user.lastName);
      expect(await resultedUser.getEmailAddress()).toEqual(user.emailAddress);
      expect(await resultedUser.getDateOfBirth()).toEqual(
        new Date(user.birthday)
      );
      // Loading from cache
      expect(await resultedUser.getLastName()).toEqual(user.lastName);
      expect(await resultedUser.getFirstName()).toEqual(user.firstName);
      expect(await resultedUser.getEmailAddress()).toEqual(user.emailAddress);
      expect(await resultedUser.getDateOfBirth()).toEqual(
        new Date(user.birthday)
      );
      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

test("createDodsboAndAccept/DeclineDodsbo", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator();
    await createUser(user2);
    await createUser(user3);
    await createUser(user1);
    await Service.createDodsbo(
      dodsbo1.title,
      dodsbo1.description,
      dodsbo1.userEmails
    );

    const dodsbos: DodsboResource[] = await Service.getDodsbos();

    // Testing
    try {
      expect(dodsbos.length).toBe(1);
    } catch (error) {
      done(error);
    }

    // Further setup
    const createdDodsbo: DodsboResource = dodsbos[0];
    createdDodsbo.sendRequestsToUsers([user3.emailAddress], ["MEMBER"]);

    // Testing
    try {
      expect(await createdDodsbo.getTitle()).toBe(dodsbo1.title);
      expect(await createdDodsbo.getDescription()).toBe(dodsbo1.description);
      expect((await createdDodsbo.getParticipants()).length).toBe(3);
      expect((await createdDodsbo.getMembers()).length).toBe(2);
      expect((await createdDodsbo.getAdmins()).length).toBe(1);
      for (const admin of await createdDodsbo.getAdmins()) {
        expect(await admin.getEmailAddress()).toBe(user1.emailAddress);
      }

      expect(await createdDodsbo.isAdmin()).toBeTruthy();

      // Switcher over til user2
      await Service.signOut();
      await Service.signIn(user2.emailAddress, user2.password);
      expect(await createdDodsbo.isAdmin()).toBeFalsy();
      expect(await Service.isDodsboAccepted(createdDodsbo.getId())).toBeFalsy();
      await Service.acceptDodsboRequest(createdDodsbo.getId());
      expect(
        await Service.isDodsboAccepted(createdDodsbo.getId())
      ).toBeTruthy();

      // Switcher over til user3
      await Service.signOut();
      await Service.signIn(user3.emailAddress, user3.password);
      expect(await createdDodsbo.isAdmin()).toBeFalsy();
      expect(await Service.isDodsboAccepted(createdDodsbo.getId())).toBeFalsy();
      await Service.declineDodsboRequest(createdDodsbo.getId());

      // Switcher til admin
      await Service.signOut();
      await Service.signIn(user1.emailAddress, user1.password);
      expect((await createdDodsbo.getParticipants()).length).toBe(2);
      expect((await createdDodsbo.getMembers()).length).toBe(1);

      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

test("SetUserDecision", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator();
    await createUser(user2);
    let user2id;
    let user1id;
    if (auth.currentUser != null) {
      user2id = auth.currentUser.uid;
    }
    await createUser(user1);
    if (auth.currentUser != null) {
      user1id = auth.currentUser.uid;
    }
    await Service.createDodsbo(
      dodsbo1.title,
      dodsbo1.description,
      dodsbo1.userEmails
    );
    const createdDodsbo: DodsboResource = (await Service.getDodsbos())[0];
    await createdDodsbo.createDodsboObject(
      dodsboObject1.title,
      dodsboObject1.description,
      dodsboObject1.value
    );
    const createdObject: DodsboObjectResource = (
      await createdDodsbo.getObjects()
    )[0];

    // Testing empthy getAllUserDecision
    try {
      expect((await createdObject.getUserDecision()).length).toBe(0);
    } catch (error) {
      done(error);
    }
    // Setting userDecision user1
    const user1Decision = new UserDecisionResource(
      createdDodsbo.id,
      createdObject.objectId,
      user1id
    );
    await user1Decision.setUserDecision(user1.userDecision);
    // Switcher over til user2
    await Service.signOut();
    await Service.signIn(user2.emailAddress, user2.password);
    const user2Decision = new UserDecisionResource(
      createdDodsbo.id,
      createdObject.objectId,
      user2id
    );

    await user2Decision.setUserDecision(user2.userDecision);

    // Testing getUserDecision
    try {
      expect((await createdObject.getUserDecision()).length).toBe(2);

      expect(await user2Decision.getUserDecision()).toBe(user2.userDecision);

      // Switcher over til user1
      await Service.signOut();
      await Service.signIn(user1.emailAddress, user1.password);

      expect(await user1Decision.getUserDecision()).toBe(user1.userDecision);

      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

test("IsDodsboActive", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator();
    await createUser(user1);
    await Service.createDodsbo(dodsbo1.title, dodsbo1.description, []);
    const createdDodsbo = (await Service.getDodsbos())[0];

    // Testing
    try {
      expect(await createdDodsbo.isActive()).toBe(true);
      createdDodsbo.setStep(1);
      expect(await createdDodsbo.isActive()).toBe(true);
      createdDodsbo.setStep(2);
      expect(await createdDodsbo.isActive()).toBe(false);

      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

/* 
test("observeDodsbo", (done) => {
  const actualTest = async () => {
    // Setup code
    await resetEmulator();
    await createUser(user2);
    await createUser(user1);
    var addedBool: boolean = false;
    const added = async (dodsbo: DodsboResource) => {
      console.log("added");
      const dodsbos = await Service.getDodsbos();
      expect(dodsbos.length).toBe(1);
      expect(dodsbo.getId()).toBe(dodsbos[0].getId());
      addedBool = true;
    };

    var modifiedBool: boolean = false;
    const modified = () => {
      console.log("modified");
      modifiedBool = true;
    };

    var removedBool: boolean = false;
    const removed = async () => {
      console.log("removed");
      const dodsbos = await Service.getDodsbos();
      expect(dodsbos.length).toBe(0);
      removedBool = true;
    };

    Service.observeDodsbos(added, modified, removed);
    console.log("HEEEEEEEEEEEEEER");

    await Service.createDodsbo(
      dodsbo1.title,
      dodsbo1.description,
      dodsbo1.userEmails
    );
    while (!added) {}
    const dodsbo: DodsboResource = (await Service.getDodsbos())[0];

    // TODO: add testing for modifyied
    while (!modified) {}

    await Service.deleteDodsbo(dodsbo.getId());
    while (!removed) {}
    // Testing
    try {
      // ... (eks. expect(something).toBe(somethingElse))
    } catch (error) {
      done(error);
    }
    done();
  };
  actualTest();
});
 */

async function createUser(user: User): Promise<void> {
  await Service.createUser(
    user.firstName,
    user.lastName,
    user.emailAddress,
    user.birthday,
    user.password
  );
}

async function resetEmulator() {
  const fetch = require("node-fetch");
  await fetch(
    "http://localhost:1324/emulator/v1/projects/roddi-dev-91fcb/databases/(default)/documents",
    {
      method: "DELETE",
    }
  );
  await fetch(
    "http://localhost:4321/emulator/v1/projects/roddi-dev-91fcb/accounts",
    {
      method: "DELETE",
    }
  );
}
