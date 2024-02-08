import { User } from "../../database/models/user.model.js";
import { HttpRequest, HttpResponse } from "../../utils/types.js";

/**
 * DTO interface for the user registration method
 */
export interface CreateUserDto {
  /**
   * The username.
   */
  username: string;
  /**
   * The password.
   */
  password: string;
}

/**
 * This service handle all authentication-related operations.
 */
export abstract class AbstractAuthService {
  /**
   * Logs in a user.
   * @param username - The username.
   * @param password - The password.
   * @returns The logged in user.
   */
  abstract login(username: string, password: string): Promise<User>;

  /**
   * Registers a new user.
   * @param user - The user to register.
   * @returns The registered user.
   */
  abstract register(user: CreateUserDto): Promise<User>;

  /**
   * Check if the user is logged in.
   * @param request - The request
   * @param response - The response
   * @returns The current user or null if no user is logged in.
   */
  abstract ensureLoggedIn(
    request: HttpRequest,
    response: HttpResponse
  ): Promise<User>;
}
