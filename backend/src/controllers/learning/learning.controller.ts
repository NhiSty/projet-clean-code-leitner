import { inject } from "@adonisjs/fold";
import { HttpRequest, HttpResponse } from "../../utils/types.js";
import { AbstractAuthService } from "../../services/interfaces/auth.interface.js";
import { QuizService as QuizService } from "../../services/quiz.service.js";
import {
  answerCardBodyValidator,
  cardIdParamValidator,
  getQuizValidator,
} from "../../validation/learning.validation.js";
import { CardService } from "../../services/card.service.js";

/**
 * LearningController provides routes for the learning process
 */
@inject()
export class LearningController {
  public constructor(
    private authService: AbstractAuthService,
    private cardService: CardService,
    private quizService: QuizService
  ) {}

  /**
   * With this route, the user card retrieve a quiz for a specific date.
   *
   * It can take a `date` query parameter to enforce the wanted date.
   *
   * Example: `GET /cards/quizz?date=2024-01-31`
   */
  public async getQuiz(request: HttpRequest, response: HttpResponse) {
    const user = await this.authService.ensureLoggedIn(request, response);

    const { date } = await getQuizValidator.validate(request.params);

    const quiz = await this.quizService.retrieveQuiz(date ?? new Date(), user);

    response.status(200).send(quiz);
  }

  /**
   * With this route, the user can answer a specific question card.
   *
   * It takes a JSON body with the following structure:
   * ```json
   * {
   *  isValid: true
   * }
   * ```
   *
   * Example: `PATCH /cards/:cardId/answer`
   */
  public async answerQuizCard(request: HttpRequest, response: HttpResponse) {
    const user = await this.authService.ensureLoggedIn(request, response);

    const { cardId } = await cardIdParamValidator.validate(request.params);
    const { isValid } = await answerCardBodyValidator.validate(request.body);

    // Check if the card exists
    const card = await this.cardService.findCardById(cardId);
    if (card === null) {
      response.status(404).send();
      return;
    }

    await this.quizService.answerCard(card, user, isValid);
    response.status(204).send();
  }
}
