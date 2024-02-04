import { FastifyReply, FastifyRequest } from "fastify";

// Alias the Fastify types
export type HttpRequest = FastifyRequest;
export type HttpResponse = FastifyReply;

// Alias for the DB id
export type DbID = string;
