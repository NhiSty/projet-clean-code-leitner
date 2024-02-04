import { inject } from "@adonisjs/fold";
import { AbstractUserService } from "./interfaces/user.interface.js";
import { User } from "../database/models/user.model.js";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";

@inject()
export class UserService implements AbstractUserService {
  private userRepository: EntityRepository<User>;
  public constructor(private em: EntityManager) {
    this.userRepository = this.em.getRepository(User);
  }

  public async createUser(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    // The password isn't hashed ! This is just a demo project.
    // In a real project, you should hash the password before storing it in the database.
    user.password = password;

    return this.userRepository.create(user);
  }

  public async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ username });
  }
}
