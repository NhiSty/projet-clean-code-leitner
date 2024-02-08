import { CardService } from "../../services/card.service.js";
import { TagService } from "../../services/tag.service.js";
import {
  createCardValidator,
  getAllCardsParamsValidator,
} from "../../validation/card.validation.js";
import { HttpRequest, HttpResponse } from "../../utils/types.js";
import { inject } from "@adonisjs/fold";
import { errors as vineErrors } from "@vinejs/vine";
import { AbstractAuthService } from "../../services/interfaces/auth.interface.js";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import { ConflictError } from "../../errors.js";

/**
 * CardController provides routes for the cards manipulations
 */
@inject()
export class CardController {
  public constructor(
    private cardService: CardService,
    private tagService: TagService,
    private authService: AbstractAuthService
  ) {}

  /**
   * Simple index route to test if the server is running
   *
   * Example: `GET /`
   */
  public async index(request: HttpRequest, reply: HttpResponse) {
    reply.send("Hello World");
  }

  /**
   * With this route, we can get all the cards from the database
   * and return them as a JSON response.
   *
   * It can take a `tags` query parameter to filter the cards by tags.
   *
   * Example: `GET /cards?tags=tag1,tag2`
   */
  public async getAllCards(request: HttpRequest, reply: HttpResponse) {
    const user = await this.authService.ensureLoggedIn(request, reply);
    const params = await getAllCardsParamsValidator.validate(request.query);

    const tags = params.tags ? params.tags.split(",") : [];

    const cards = await this.cardService.getAllCards(tags, user);

    reply.send(
      cards.map((card) => ({
        id: card.id,
        question: card.question,
        answer: card.answer,
        tag: card.tag.name,
        category: card.userCards.getItems()?.[0]?.category ?? "first",
      }))
    );
  }

  /**
   * With this route, we can create a new card in the database and return it
   * as a JSON response.
   *
   * It takes a JSON body with the following structure:
   * ```json
   * {
   *   "title": "Card title",
   *   "description": "Card description",
   * }
   * ```
   *
   * Example: `POST /cards`
   */
  public async createCard(request: HttpRequest, reply: HttpResponse) {
    const card = await createCardValidator.validate(request.body);
    let tag = await this.tagService.findTagByName(card.tag);

    if (!tag) {
      tag = await this.tagService.createTag(card.tag);
    }

    try {
      const createdCard = await this.cardService.createCard(
        card.question,
        card.answer,
        tag
      );

      reply.send({
        question: createdCard.question,
        answer: createdCard.answer,
        tag: createdCard.tag.name,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictError("The card already exists");
      }

      throw error;
    }
  }
}
