import fastify, { FastifyInstance } from "fastify";
import logger from "./utils/logger.js";
import "./database/datasource.js";
import { fastifyErrorHandler } from "./errors.js";
import { setupRoutes } from "./routes.js";
import { container } from "./utils/ioc.js";
import { MikroORM } from "@mikro-orm/core";

/**
 * Server is the main class of the application. It is used to start and stop the application.
 */
export class Server {
  public readonly app: FastifyInstance;

  public constructor(private port: number, private dataSource: MikroORM) {
    this.app = fastify({ logger });
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
    await this.dataSource.close();
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
  return server;
}
