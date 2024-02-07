import { User } from "../../database/models/user.model.js";
import { HttpRequest, HttpResponse } from "../../utils/types.js";

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
   * Check if the user is logged in.
   * @param {HttpRequest} request - The request
   * @param {HttpResponse} response - The response
   * @returns {User | null} The current user or null if no user is logged in.
   */
  abstract ensureLoggedIn(
    request: HttpRequest,
    response: HttpResponse
  ): Promise<User>;
}
