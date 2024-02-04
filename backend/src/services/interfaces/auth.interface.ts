import { User } from "../../database/models/user.model.js";

export interface CreateUserDto {
  username: string;
  password: string;
}

/**
 * This service handle all authentication-related operations.
 */
export abstract class AbstractAuthService {
  /**
   * Logs in a user.
   * @param {string} username - The username.
   * @param {string} password - The password.
   * @returns {User} The logged in user.
   */
  abstract login(username: string, password: string): Promise<User>;

  /**
   * Registers a new user.
   * @param {CreateUserDto} user - The user to register.
   * @returns {User} The registered user.
   */
  abstract register(user: CreateUserDto): Promise<User>;

  /**
   * Logs out the current user.
   */
  abstract logout(): Promise<void>;

  /**
   * Returns the current user.
   * @returns {User | null} The current user or null if no user is logged in.
   */
  abstract getCurrentUser(): Promise<User | null>;
}
