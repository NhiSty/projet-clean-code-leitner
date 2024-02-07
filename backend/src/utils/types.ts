import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../database/models/user.model.js";

declare module "@fastify/secure-session" {
  interface SessionData {
    user?: User;
  }
}

// Alias the Fastify types
export type HttpRequest = FastifyRequest;
export type HttpResponse = FastifyReply;

// Alias for the DB id
export type DbID = string;
