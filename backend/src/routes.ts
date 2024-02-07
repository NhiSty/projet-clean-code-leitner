/**
 * @fileoverview This file is the main file for the routes of the application.
 * It contains all the routes of the application. The routes are registered using the Router class.
 */
import { FastifyInstance } from "fastify";
import { CardController } from "./controllers/cards/card.controller.js";
import { container } from "./utils/ioc.js";
import { LearningController } from "./controllers/learning/learning.controller.js";
import { AuthController } from "./controllers/auth/auth.controller.js";

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

  // Cards routes
  app.get("/cards", async (request, reply) => {
    const ctrl = await container.make(CardController);
    return ctrl.getAllCards(request, reply);
  });

  app.post("/cards", async (request, reply) => {
    const ctrl = await container.make(CardController);
    return ctrl.createCard(request, reply);
  });

  // Auth routes
  app.post("/auth", async (request, reply) => {
    const ctrl = await container.make(AuthController);
    return ctrl.login(request, reply);
  });

  app.get("/auth", async (request, reply) => {
    const ctrl = await container.make(AuthController);
    return ctrl.me(request, reply);
  });

  app.delete("/auth", async (request, reply) => {
    const ctrl = await container.make(AuthController);
    return ctrl.logout(request, reply);
  });

  // Learning routes
  app.get("/cards/quizz", async (request, reply) => {
    const ctrl = await container.make(LearningController);
    return ctrl.getQuiz(request, reply);
  });

  app.post("/cards/quizz", async (request, reply) => {
    const ctrl = await container.make(LearningController);
    return ctrl.answerQuizCard(request, reply);
  });
}
