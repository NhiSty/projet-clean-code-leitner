/**
 * @fileoverview This file is the main file for the routes of the application.
 * It contains all the routes of the application. The routes are registered using the Router class.
 */
import { FastifyInstance } from "fastify";
import { CardController } from "./controllers/cards/card.controller.js";
import { container } from "./utils/ioc.js";

/**
 * Registers all the routes of the application on the given fastify instance.
 * @param app The fastify instance to register the routes on.
 */
export async function setupRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const ctrl = await container.make(CardController);
    const cards = await ctrl.index(request, reply);
    return cards;
  });
  app.get("/cards", async (request, reply) => {
    const ctrl = await container.make(CardController);
    return ctrl.getAllCards(request, reply);
  });
  app.post("/cards", async (request, reply) => {
    const ctrl = await container.make(CardController);
    return ctrl.createCard(request, reply);
  });
}
