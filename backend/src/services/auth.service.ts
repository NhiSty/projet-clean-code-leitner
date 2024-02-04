import { inject } from "@adonisjs/fold";
import {
    AbstractAuthService,
    CreateUserDto,
} from "./interfaces/auth.interface.js";
import { User } from "../database/models/user.model.js";
import { AbstractUserService } from "./interfaces/user.interface.js";

@inject()
export class AuthService implements AbstractAuthService {
    public constructor(private userService: AbstractUserService) {}

    public async login(username: string, password: string): Promise<User> {
        const user = await this.userService.findUserByUsername(username);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.password !== password) {
            throw new Error("Invalid password");
        }

        return user;
    }

    public async register(user: CreateUserDto): Promise<User> {
        const existingUser = await this.userService.findUserByUsername(
            user.username
        );

        if (existingUser) {
            throw new Error("User already exists");
        }

        return this.userService.createUser(user.username, user.password);
    }

    public async logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getCurrentUser(): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}
