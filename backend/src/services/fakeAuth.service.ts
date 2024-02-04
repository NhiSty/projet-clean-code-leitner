import { inject } from "@adonisjs/fold";
import { AbstractUserService } from "./interfaces/user.interface.js";
import { User } from "../database/models/user.model.js";

@inject()
export class FakeAuthService implements AbstractUserService {
  public async createUser(username: string, password: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  public async findUserById(id: number): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
}
