import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../database/models/user.model.js";

declare module "@fastify/secure-session" {
  /**
   * Interface for the session data used by the secure session plugin
   */
  interface SessionData {
    /**
     * The user that is currently logged in
     */
    user?: User;
  }
}

/**
 * Alias for the HTTP request type
 */
export type HttpRequest = FastifyRequest;
/**
 * Alias for the HTTP response type
 */
export type HttpResponse = FastifyReply;

/**
 * Alias for the database ID type
 */
export type DbID = string;
