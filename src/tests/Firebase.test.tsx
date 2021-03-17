/**
 * @jest-environment node
 */

import React, { useCallback } from "react";
import { createSuper } from "typescript";
import DodsboObjectResource from "../services/DodsboObjectResource";
import DodsboResource from "../services/DodsboResource";
import { auth } from "../services/Firebase";
import Service from "../services/Service";
import UserResource, { User } from "../services/UserResource";

const user1 = {
  firstName: "Olav",
  lastName: "Nordmann",
  emailAddress: "olav.nordmann@ymail.com",
  birthday: "1999-02-03",
  password: "Passordsajdasklnj",
};

const user2 = {
  firstName: "Kari",
  lastName: "Nordli",
  emailAddress: "kari.nordli@ymail.com",
  birthday: "1998-12-02",
  password: "Passsadordsajdasklnj",
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
    const createdDodsbo: DodsboResource = (await Service.getDodsbos())[0]

    await createdDodsbo.createDodsboObject(
      dodsboObject1.title,
      dodsboObject1.description,
      dodsboObject1.value
    );
    const objects: DodsboObjectResource[] = await createdDodsbo.getObjects()

    // Testing createDodsboObject
    try {
      expect(objects.length).toBe(1);
    } catch (error) {
      done(error);
    }

    // Further setup
    const createdObject: DodsboObjectResource = objects[0]

    // Testing getTitle, getDecription and getValue
    try {
      expect(await createdObject.getTitle()).toBe(dodsboObject1.title);
      expect(await createdObject.getDescription()).toBe(dodsboObject1.description);
      expect((await createdObject.getValue())).toBe(dodsboObject1.value);

    } catch (error) {
      done(error);
    }

    // Delete object
    await createdObject.deleteDodsboObject()
    const noObjects: DodsboObjectResource[] = await createdDodsbo.getObjects()

    try {
      expect(noObjects.length).toBe(0);
      done()
    } catch (error) {
      done(error);
    }
  }
  actualTest()
})

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

test("createDodsbo", (done) => {
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
    const dodsbos: DodsboResource[] = await Service.getDodsbos();

    // Testing
    try {
      expect(dodsbos.length).toBe(1);
    } catch (error) {
      done(error);
    }

    // Further setup
    const createdDodsbo: DodsboResource = dodsbos[0];

    // Testing
    try {
      expect(await createdDodsbo.getTitle()).toBe(dodsbo1.title);
      expect(await createdDodsbo.getDescription()).toBe(dodsbo1.description);
      expect((await createdDodsbo.getParticipants()).length).toBe(2);
      expect((await createdDodsbo.getMembers()).length).toBe(1);
      expect((await createdDodsbo.getAdmins()).length).toBe(1);
      for (const admin of await createdDodsbo.getAdmins()) {
        expect(await admin.getEmailAddress()).toBe(user1.emailAddress);
      }
      for (const member of await createdDodsbo.getMembers()) {
        expect(await member.getEmailAddress()).toBe(user2.emailAddress);
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
      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

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
