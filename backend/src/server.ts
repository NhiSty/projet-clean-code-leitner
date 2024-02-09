import fastify, { FastifyInstance } from "fastify";
import logger from "./utils/logger.js";
import "./database/datasource.js";
import { fastifyErrorHandler } from "./errors.js";
import { setupRoutes } from "./routes.js";
import { container } from "./utils/ioc.js";
import { MikroORM } from "@mikro-orm/postgresql";
import { AbstractAuthService } from "./services/interfaces/auth.interface.js";
import { AuthService } from "./services/auth.service.js";
import { AbstractUserService } from "./services/interfaces/user.interface.js";
import { UserService } from "./services/user.service.js";
import { FakeUserService } from "../tests/stubs/fakeUser.service.js";
import { FakeAuthService } from "../tests/stubs/fakeAuth.service.js";
import fastifySecureSession from "@fastify/secure-session";
import { User } from "./database/models/user.model.js";
import { AbstractDateService } from "./services/interfaces/date.interface.js";
import DateService from "./services/date.service.js";

/**
 * Server is the main class of the application. It is used to start and stop the application.
 */
export class Server {
  public readonly app: FastifyInstance;

  public constructor(private port: number, private dataSource: MikroORM) {
    this.app = fastify({ logger });

    this.app.register(fastifySecureSession, {
      // the name of the session cookie
      cookieName: "token",
      // the secret is required, and is used for signing cookies
      secret: process.env.APP_SECRET as string,
      salt: process.env.SECRET_SALT as string,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });

    this.app.addHook("onClose", async () => {
      await this.dataSource.close();
    });

    this.app.setErrorHandler(fastifyErrorHandler);
  }

  /**
   * Initializes the server by loading the routes and connecting to the database.
   */
  public async initialize(): Promise<void> {
    // Lazy-load routes to ensure that their are loaded after fastify has been initialized
    logger.debug("Loading routes...");
    setupRoutes(this.app);

    logger.debug("Loading database...");
    await this.dataSource.connect();

    logger.debug("Routes loaded\n%s", this.app.printRoutes());
  }

  /**
   * Starts the server and listens for incoming requests.
   */
  public async start(): Promise<void> {
    await this.app.ready();

    try {
      await this.app.listen({ port: this.port });

      const address = this.app.server.address();

      logger.info(`Server listening at ${address}`);
    } catch (error) {
      logger.error(error);
      await this.dataSource.close();
      process.exit(1);
    }
  }

  /**
   * Stops the server and closes the database connection.
   */
  public async stop(): Promise<void> {
    await this.app.close();
  }
}

/**
 * Creates a new server instance.
 * @param port The port to listen on.
 * @returns A new server instance.
 */
export async function createServer(port: number): Promise<Server> {
  const server = await container.make(Server, [
    port,
    await container.make(MikroORM),
  ]);

  // Bind the date server
  container.bind(AbstractDateService, () => container.make(DateService));

  if (process.env.WITH_AUTH === "1") {
    // If this variable is set to true, use the normal auth service
    container.bind(AbstractUserService, () => container.make(UserService));
    container.bind(AbstractAuthService, () => container.make(AuthService));
    logger.info("`WITH_AUTH` is set to true, using normal auth service");
  } else {
    const fakeUser = new User();
    fakeUser.id = "ffffffff-ffff-ffff-ffff-ffffffffffff";
    fakeUser.username = "fake user";
    fakeUser.password = "fake password";

    // Otherwise, use the fake ones
    container.bind(AbstractUserService, () =>
      container.make(FakeUserService, [fakeUser])
    );
    container.bind(AbstractAuthService, () =>
      container.make(FakeAuthService, [fakeUser])
    );
    logger.info("`WITH_AUTH` is set to false, using fake auth service");
  }

  return server;
}
