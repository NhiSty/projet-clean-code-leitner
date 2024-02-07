import { inject } from "@adonisjs/fold";
import { AbstractUserService } from "../../src/services/interfaces/user.interface.js";
import { User } from "../../src/database/models/user.model.js";
import { DbID } from "../../src/utils/types.js";

@inject()
export class FakeUserService implements AbstractUserService {
  public constructor(private fakeUser: User) {}

  public async createUser(username: string, password: string): Promise<User> {
    return this.fakeUser;
  }

  public async findUserById(id: DbID): Promise<User | null> {
    if (id !== this.fakeUser.id) {
      return null;
    }

    return this.fakeUser;
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    if (username !== this.fakeUser.username) {
      return null;
    }

    return this.fakeUser;
  }
}
