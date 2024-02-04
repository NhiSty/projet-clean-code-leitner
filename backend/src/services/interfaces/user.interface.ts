import { User } from "../../database/models/user.model.js";

/**
 * This service handle all user-related operations.
 */
export abstract class AbstractUserService {
  /**
   * Creates a new user with the specified username and password.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves when the user is created.
   */
  abstract createUser(username: string, password: string): Promise<User>;

  /**
   * Finds a user by their ID.
   * @param id - The ID of the user.
   * @returns A promise that resolves with the found user or null if no user is found.
   */
  abstract findUserById(id: number): Promise<User | null>;

  /**
   * Finds a user by their username.
   * @param username - The username of the user.
   * @returns A promise that resolves with the found user or null if no user is found.
   */
  abstract findUserByUsername(username: string): Promise<User | null>;
}
