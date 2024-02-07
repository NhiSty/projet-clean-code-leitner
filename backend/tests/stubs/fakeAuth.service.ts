import { inject } from "@adonisjs/fold";
import { User } from "../../src/database/models/user.model.js";
import {
  AbstractAuthService,
  CreateUserDto,
} from "../../src/services/interfaces/auth.interface.js";
import { HttpRequest, HttpResponse } from "../../src/utils/types.js";
import { BadRequestError } from "../../src/errors.js";

@inject()
export class FakeAuthService implements AbstractAuthService {
  public constructor(private fakeUser: User) {}

  public async login(username: string, password: string): Promise<User> {
    if (username !== this.fakeUser.username) {
      throw new BadRequestError("Invalid username");
    }

    return this.fakeUser;
  }

  public async register(user: CreateUserDto): Promise<User> {
    return this.fakeUser;
  }

  async ensureLoggedIn(
    request: HttpRequest,
    response: HttpResponse
  ): Promise<User> {
    return this.fakeUser;
  }
}
