import { inject } from "@adonisjs/fold";
import { HttpRequest, HttpResponse } from "../../utils/types.js";
import { loginValidator } from "../../validation/auth.validation.js";
import { AbstractAuthService } from "../../services/interfaces/auth.interface.js";

/**
 * AuthController provides routes for the user authentication
 */
@inject()
export class AuthController {
  public constructor(private authService: AbstractAuthService) {}

  /**
   * Login route for the user
   *
   * Example: `POST /auth`
   */
  public async login(request: HttpRequest, reply: HttpResponse) {
    const { username, password } = await loginValidator.validate(request.body);

    const user = await this.authService.login(username, password);
    request.session.set("user", user);
    reply.send(user);
  }

  /**
   * Fetch user informations
   *
   * Example: `GET /auth`
   */
  public async me(request: HttpRequest, reply: HttpResponse) {
    const user = await this.authService.ensureLoggedIn(request, reply);

    reply.send(user);
  }

  /**
   * Logout route for the user
   *
   * Example: `DELETE /auth`
   */
  public async logout(request: HttpRequest, reply: HttpResponse) {
    // Delete `token` cookie
    request.session.delete();
  }
}
