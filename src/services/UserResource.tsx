import { exception } from "console";
import firebase from "./Firebase";
import { auth, firestore } from "./Firebase";

/**
 * Represents a user in the database.
 * This class has to be used to get info about the user.
 */
export default class UserResource {
  private userId: string;
  private userInfo: any;

  private lastUpdatedEmail: Date | undefined;
  private lastUpdatedPublic: Date | undefined;
  private lastUpdatedPrivate: Date | undefined;

  private firstName: string | undefined;
  private lastName: string | undefined;
  private dateOfBirth: Date | undefined;
  private email_address: string | undefined;

  constructor(userId: string | undefined) {
    this.userInfo = firestore.collection("user").doc(userId);
    if (userId != undefined) {
      this.userId = userId;
    } else {
      throw "UserId is not defined.";
    }
  }

  private async updateData(): Promise<void> {
    const dataTimeout: number = 5;

    var actuallyUpdateEmail: boolean = false;
    var actuallyUpdatePrivate: boolean = false;
    var actuallyUpdatePublic: boolean = false;

    if (
      this.lastUpdatedEmail &&
      this.lastUpdatedPrivate &&
      this.lastUpdatedPublic
    ) {
      let lastUpdatedEmail = this.lastUpdatedEmail;
      const now = new Date();

      lastUpdatedEmail.setSeconds(lastUpdatedEmail.getSeconds() + dataTimeout);
      if (now > lastUpdatedEmail) {
        actuallyUpdateEmail = true;
      }

      let lastUpdatedPublic = this.lastUpdatedPublic;
      lastUpdatedPublic.setSeconds(
        lastUpdatedPublic.getSeconds() + dataTimeout
      );
      if (now > lastUpdatedPublic) {
        actuallyUpdatePublic = true;
      }

      if (this.userId == auth.currentUser?.uid) {
        let lastUpdatedPrivate = this.lastUpdatedPrivate;
        lastUpdatedPrivate.setSeconds(
          lastUpdatedPrivate.getSeconds() + dataTimeout
        );
        if (now > lastUpdatedPrivate) {
          actuallyUpdatePrivate = true;
        }
      }
    } else {
      actuallyUpdateEmail = true;
      actuallyUpdatePublic = true;
      if (this.userId == auth.currentUser?.uid) actuallyUpdatePrivate = true;
    }

    if (actuallyUpdateEmail) {
      this.lastUpdatedEmail = new Date();
      const dataEmail = await this.userInfo.get();
      this.email_address = await dataEmail.data().email_address;
    }
    if (actuallyUpdatePublic) {
      this.lastUpdatedPublic = new Date();
      const dataPublic = await this.userInfo
        .collection("fields")
        .doc("public")
        .get();
      this.firstName = await dataPublic.data().first_name;
      this.lastName = await dataPublic.data().last_name;
    }
    if (actuallyUpdatePrivate) {
      this.lastUpdatedPrivate = new Date();
      const dataPrivate = await this.userInfo
        .collection("fields")
        .doc("private")
        .get();
      this.dateOfBirth = await dataPrivate.data().date_of_birth.toDate();
    }
  }

  /**
   * Gets the first name of the user.
   */
  public async getFirstName(): Promise<string> {
    await this.updateData();
    if (this.firstName) {
      return this.firstName;
    } else {
      throw "Something went wrong.";
    }
  }
  /**
   * Gets the last name of the user.
   */
  public async getLastName(): Promise<string> {
    await this.updateData();
    if (this.lastName) {
      return this.lastName;
    } else {
      throw "Something went wrong.";
    }
  }
  /**
   * Gets the date of birth of the user.
   */
  public async getDateOfBirth(): Promise<Date> {
    await this.updateData();
    if (this.dateOfBirth) {
      return this.dateOfBirth;
    } else {
      throw "Something went wrong.";
    }
  }
  /**
   * Gets the user's email-address.
   */
  public async getEmailAddress(): Promise<string> {
    await this.updateData();
    if (this.email_address) {
      return this.email_address;
    } else {
      throw "Something went wrong.";
    }
  }

  /**
   * Gets the user's unique ID.
   * This is the same ID used to store user-info in the database.
   * This method does not contact the database,
   * it just returns the locally stored UID of the given user.
   */
  public getUserId(): string {
    return this.userId;
  }
}

export class User {
  firstName: string;
  lastName: string;
  emailAddress: string;
  birthday: string;
  password: string;

  constructor(
    firstName: string,
    lastName: string,
    emailAddress: string,
    birthday: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.birthday = birthday;
    this.password = password;
  }
}
