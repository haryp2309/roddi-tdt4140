/**
 * @jest-environment node
 */

import React, { useCallback } from "react";
import { createSuper } from "typescript";
import { firestore, testMode } from "../services/Firebase";
import Service from "../services/Service";
import UserResource, { User } from "../services/UserResource";

testMode.startTesting();

const user1 = {
  firstName: "Olav",
  lastName: "Nordmann",
  emailAddress: "olav.nordmann@ymail.com",
  birthday: "1999-02-03",
  password: "Passordsajdasklnj",
};

describe("jkdajd", () => {});

test("createUserAndSignIn", (done) => {
  resetEmulator();

  const user: User = user1;

  Service.createUser(
    user.firstName,
    user.lastName,
    user.emailAddress,
    user.birthday,
    user.password
  ).then(() => {
    Service.signIn(user.emailAddress, user.password).then(
      async (resuletedUser: UserResource) => {
        try {
          // First time loading
          expect(await resuletedUser.getFirstName()).toEqual(user.firstName);
          expect(await resuletedUser.getLastName()).toEqual(user.lastName);
          expect(await resuletedUser.getEmailAddress()).toEqual(
            user.emailAddress
          );
          expect(await resuletedUser.getDateOfBirth()).toEqual(
            new Date(user.birthday)
          );
          // Loading from cache
          expect(await resuletedUser.getFirstName()).toEqual(user.firstName);
          expect(await resuletedUser.getLastName()).toEqual(user.lastName);
          expect(await resuletedUser.getEmailAddress()).toEqual(
            user.emailAddress
          );
          expect(await resuletedUser.getDateOfBirth()).toEqual(
            new Date(user.birthday)
          );
          done();
        } catch (error) {
          done(error);
        }
      }
    );
  });
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
