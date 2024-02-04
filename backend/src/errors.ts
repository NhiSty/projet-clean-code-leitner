import logger from "./utils/logger.js";
import { HttpRequest, HttpResponse } from "./utils/types.js";
import { errors as vineErrors } from "@vinejs/vine";

export function fastifyErrorHandler(
  error: Error,
  request: HttpRequest,
  reply: HttpResponse
) {
  if (error instanceof vineErrors.E_VALIDATION_ERROR) {
    logger.debug(error);
    return reply.status(400).send({
      message: "Validation error",
      errors: error.messages,
    });
  }

  logger.error(error);
  return reply.status(500).send({
    message: "Internal server error",
  });
}
