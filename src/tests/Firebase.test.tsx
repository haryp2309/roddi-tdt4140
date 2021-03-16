/**
 * @jest-environment node
 */

import React, { useCallback } from "react";
import { createSuper } from "typescript";
import Service from "../services/Service";
import UserResource, { User } from "../services/UserResource";

const user1 = {
  firstName: "Olav",
  lastName: "Nordmann",
  emailAddress: "olav.nordmann@ymail.com",
  birthday: "1999-02-03",
  password: "Passordsajdasklnj",
};

describe("jkdajd", () => {});

test("createUserAndSignIn", (done) => {
  const actualTest = async () => {
    // Setup
    resetEmulator();
    const user: User = user1;
    await Service.createUser(
      user.firstName,
      user.lastName,
      user.emailAddress,
      user.birthday,
      user.password
    );
    const resuletedUser: UserResource = await Service.signIn(
      user.emailAddress,
      user.password
    );
    // Testing
    try {
      // First time loading
      expect(await resuletedUser.getFirstName()).toEqual(user.firstName);
      expect(await resuletedUser.getLastName()).toEqual(user.lastName);
      expect(await resuletedUser.getEmailAddress()).toEqual(user.emailAddress);
      expect(await resuletedUser.getDateOfBirth()).toEqual(
        new Date(user.birthday)
      );
      // Loading from cache
      expect(await resuletedUser.getLastName()).toEqual(user.lastName);
      expect(await resuletedUser.getFirstName()).toEqual(user.firstName);
      expect(await resuletedUser.getEmailAddress()).toEqual(user.emailAddress);
      expect(await resuletedUser.getDateOfBirth()).toEqual(
        new Date(user.birthday)
      );
      done();
    } catch (error) {
      done(error);
    }
  };
  actualTest();
});

/* test("Opprette dodsbo", (done) => {}); */

function createUser(user: User, callback: (user: UserResource) => any) {
  Service.createUser(
    user.firstName,
    user.lastName,
    user.emailAddress,
    user.birthday,
    user.password
  ).then(() => {
    Service.signIn(user.emailAddress, user.password).then(
      async (resuletedUser: UserResource) => {
        callback(resuletedUser);
      }
    );
  });
}

function resetEmulator() {
  const fetch = require("node-fetch");
  fetch(
    "http://localhost:1324/emulator/v1/projects/roddi-dev-91fcb/databases/(default)/documents",
    {
      method: "DELETE",
    }
  );
  fetch("http://localhost:4321/emulator/v1/projects/roddi-dev-91fcb/accounts", {
    method: "DELETE",
  });
}
