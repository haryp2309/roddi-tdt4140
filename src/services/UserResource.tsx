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

  constructor(userId: string | undefined) {
    this.userInfo = firestore.collection("user").doc(userId);
    if (userId != undefined) {
      this.userId = userId;
    } else {
      throw "UserId is not defined.";
    }
  }

  /**
   * Gets the first name of the user.
   */
  public async getFirstName(): Promise<string> {
    const dataPublic = await this.userInfo
      .collection("fields")
      .doc("public")
      .get();
    return await dataPublic.data().first_name;
  }
  /**
   * Gets the last name of the user.
   */
  public async getLastName(): Promise<string> {
    const dataPublic = await this.userInfo
      .collection("fields")
      .doc("public")
      .get();
    return await dataPublic.data().last_name;
  }

  /**
   * Gets the full name of the user.
   */
  public async getFullName(): Promise<string> {
    const dataPublic = await this.userInfo
      .collection("fields")
      .doc("public")
      .get();
    const firstName: string = await dataPublic.data().first_name;
    const lastName: string = await dataPublic.data().last_name;
    return firstName + " " + lastName;
  }
  /**
   * Gets the date of birth of the user.
   */
  public async getDateOfBirth(): Promise<Date> {
    const dataPrivate = await this.userInfo
      .collection("fields")
      .doc("private")
      .get();
    return await dataPrivate.data().date_of_birth.toDate();
  }
  /**
   * Gets the user's email-address.
   */
  public async getEmailAddress(): Promise<string> {
    const dataEmail = await this.userInfo.get();
    return await dataEmail.data().email_address;
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
