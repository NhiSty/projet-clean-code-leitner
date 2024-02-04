import { FastifyReply, FastifyRequest } from "fastify";

// Alias the Fastify types
export type HttpRequest = FastifyRequest;
export type HttpResponse = FastifyReply;

// Alias the route function type
export type RouteFn = (
  request: HttpRequest,
  response: HttpResponse
) => Promise<void>;

type MaybePromise<T> = T | Promise<T>;

/**
 * AllowedFn is a type that represents a function that can be used as a route handler.
 */
export type AllowedFn =
  | (() => MaybePromise<void>)
  | ((request: HttpRequest) => MaybePromise<void>)
  | ((request: HttpRequest, response: HttpResponse) => MaybePromise<void>);

/**
 * Representation of a constructable class
 */
export interface Constructable<T = any> {
  new (...args: any[]): T;
}

/***
 * GetControllerHandlers is a type that will get all the keys of a controller and filter out the ones that are not a {@link AllowedFn}.
 */
export type GetControllerHandlers<Controller extends Constructable<any>> = {
  // Get all the keys of the instance
  // And return it if it does match the type of a function
  // Otherwise return never (which will be filtered out)
  [K in keyof InstanceType<Controller>]: InstanceType<Controller>[K] extends AllowedFn
    ? K
    : never;
}[keyof InstanceType<Controller>];
