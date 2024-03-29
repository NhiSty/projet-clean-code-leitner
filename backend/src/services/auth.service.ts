import { inject } from "@adonisjs/fold";
import {
  AbstractAuthService,
  CreateUserDto,
} from "./interfaces/auth.interface.js";
import { User } from "../database/models/user.model.js";
import { AbstractUserService } from "./interfaces/user.interface.js";
import { HttpRequest, HttpResponse } from "../utils/types.js";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../errors.js";

/**
 * This service handle all authentication-related operations.
 */
@inject()
export class AuthService implements AbstractAuthService {
  public constructor(private userService: AbstractUserService) {}

  /**
   * @see {@link AbstractAuthService.login}
   * */
  public async login(username: string, password: string): Promise<User> {
    const user = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.password !== password) {
      throw new BadRequestError("Invalid password");
    }

    return user;
  }

  /**
   * @see {@link AbstractAuthService.register}
   */
  public async register(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.findUserByUsername(
      user.username
    );

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    return this.userService.createUser(user.username, user.password);
  }

  /**
   * @see {@link AbstractAuthService.ensureLoggedIn}
   */
  public async ensureLoggedIn(
    request: HttpRequest,
    response: HttpResponse
  ): Promise<User> {
    const user = request.session.get("user");

    if (!user) {
      response.code(401);
      throw new UnauthorizedError("User not logged in");
    }

    return user;
  }
}
