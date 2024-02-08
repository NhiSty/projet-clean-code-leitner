import { UniqueConstraintViolationException } from "@mikro-orm/core";
import logger from "./utils/logger.js";
import { HttpRequest, HttpResponse } from "./utils/types.js";
import { errors as vineErrors } from "@vinejs/vine";

abstract class HttpError extends Error {
  public code: number;

  public constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "HttpError";
  }
}

export class UnauthorizedError extends HttpError {
  public constructor(message: string) {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends HttpError {
  public constructor(message: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends HttpError {
  public constructor(message: string) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class ConflictError extends HttpError {
  public constructor(message: string) {
    super(409, message);
    this.name = "ConflictError";
  }
}

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
