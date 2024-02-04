import { FastifyBaseLogger } from "fastify";
import { pino } from "pino";

/**
 * ILogger is an interface that represents a logger.
 */
export type ILogger = FastifyBaseLogger;

// Create a logger instance
let logger: ILogger;

// If the environment is production, create a logger that only logs info messages, otherwise create a logger a bit more verbose
if (process.env.NODE_ENV === "development") {
  logger = pino({
    level: "trace",
    transport: {
      target: "pino-pretty",
    },
  });
} else {
  logger = pino({
    level: process.env.NODE_ENV === "test" ? "trace" : "info",
  });
}

export { logger as default };
