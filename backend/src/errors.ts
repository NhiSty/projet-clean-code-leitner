import { UniqueConstraintViolationException } from "@mikro-orm/core";
import logger from "./utils/logger.js";
import { HttpRequest, HttpResponse } from "./utils/types.js";
import { errors as vineErrors } from "@vinejs/vine";

/**
 * Abstract class for HTTP errors
 */
abstract class HttpError extends Error {
  /**
   * HTTP status code
   */
  public code: number;

  /**
   * Constructor
   * @param code HTTP status code
   * @param message Error message
   */
  public constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "HttpError";
  }
}

/**
 * Error thrown when the user is not authenticated
 */
export class UnauthorizedError extends HttpError {
  /**
   * Constructor
   * @param message Error message
   */
  public constructor(message: string) {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Error thrown when the requested resource is not found
 */
export class NotFoundError extends HttpError {
  /**
   * Constructor
   * @param message Error message
   */
  public constructor(message: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

/**
 * Error thrown when the request is malformed
 */
export class BadRequestError extends HttpError {
  /**
   * Constructor
   * @param message Error message
   */
  public constructor(message: string) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

/**
 * Error thrown when the resource already exists
 */
export class ConflictError extends HttpError {
  /**
   * Constructor
   * @param message Error message
   */
  public constructor(message: string) {
    super(409, message);
    this.name = "ConflictError";
  }
}

/**
 * Error handler for the HTTP server.
 *
 * This function is called when an error is thrown in a route handler.
 * It will convert then into HTTP errors understandable by browsers.
 *
 * @param error the thrown error
 * @param request fastify http request object
 * @param reply fastify http reply object
 */
export function fastifyErrorHandler(
  error: Error,
  request: HttpRequest,
  reply: HttpResponse
) {
  if (error instanceof vineErrors.E_VALIDATION_ERROR) {
    logger.debug(error);
    return reply.status(422).send({
      message: "Validation error",
      errors: error.messages,
    });
  }

  if (error instanceof HttpError) {
    logger.debug(error);
    return reply.status(error.code).send({
      message: error.message,
    });
  }

  if (error instanceof UniqueConstraintViolationException) {
    logger.debug(error);
    return reply.status(409).send({
      message: "Conflict error",
    });
  }

  logger.error(error);
  return reply.status(500).send({
    message: "Internal server error",
  });
}
