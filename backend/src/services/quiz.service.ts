import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "./interfaces/date.interface.js";
import {
  EntityManager,
  EntityRepository,
  NotFoundError,
} from "@mikro-orm/postgresql";
import { Card } from "../database/models/card.model.js";
import { DbID } from "../utils/types.js";
import { UserCard } from "../database/models/userCard.model.js";
import {
  CardCategory,
  getNextCategory,
} from "../database/models/cardCategory.enum.js";
import { Quiz } from "../database/models/userQuiz.model.js";
import { UserService } from "./user.service.js";
import { AbstractUserService } from "./interfaces/user.interface.js";

@inject()
export class QuizService {
  private userCardRepository: EntityRepository<UserCard>;
  private cardRepository: EntityRepository<Card>;
  private quizRepository: EntityRepository<Quiz>;

  public constructor(
    private dateService: AbstractDateService,
    private userService: AbstractUserService,
    private em: EntityManager
  ) {
    this.userCardRepository = this.em.getRepository(UserCard);
    this.cardRepository = this.em.getRepository(Card);
    this.quizRepository = this.em.getRepository(Quiz);
  }

  public async retrieveQuiz(date: Date, userId: DbID): Promise<Card[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // First, try to check if there isn't already a quiz in the database
    const quiz = await this.quizRepository.findOne(
      {
        date: date,
        user: {
          id: userId,
        },
      },
      {
        fields: ["cards"],
      }
    );

    // If there is a quiz, returns the cards
    if (quiz !== null && quiz.cards.length > 0) {
      return quiz.cards.getItems();
    }

    // Otherwise, if there isn't any quiz in the database yet,
    // generate a new one with random cards using the Leither system

    // Get all the cards that can be retrieved
    const cards = await this.cardRepository.findAll({
      where: {
        $or: [
          // Select cards that haven't been presented yet to the user,
          // (i.e. cards that don't have "user cards" associated to them)
          {
            users: {
              $none: {
                id: userId,
              },
            },
          },

          // Select all cards that match the Leither system
          {
            // For each card category
            $or: Object.values(CardCategory)
              // Exclude the "done" category
              .filter((cat) => cat !== CardCategory.DONE)
              // And map the value on each categories
              .map((category) => ({
                userCards: {
                  category: category,
                  userId,
                  lastSeen: {
                    $lt: this.dateService.getNextDate(date, category),
                  },
                },
              })),
          },
        ],
      },
    });

    // If there is no cards, return an empty array
    if (cards.length === 0) {
      return [];
    }

    // Otherwise, generate a new quiz
    const newQuiz = new Quiz();
    newQuiz.date = date;
    newQuiz.user = user;
    newQuiz.cards.add(cards);

    await this.quizRepository.insert(newQuiz);

    return newQuiz.cards.getItems();
  }

  /**
   * Update the learning step of a card for a user. If he responded correctly,
   * the learning step will be increased. If he responded incorrectly, the
   * learning step will be decreased. (based on the Leither logic)
   *
   * @param id id of the card
   * @param valid state of the card
   */
  public async answerCard(
    id: DbID,
    userId: DbID,
    valid: boolean
  ): Promise<void> {
    // Get the current user card value
    let userCard = await this.userCardRepository.findOne({
      card: {
        id,
      },
      userId: userId,
    });

    // If there is no card, set the default values
    if (userCard == null) {
      userCard = new UserCard();
      userCard.card = await this.cardRepository.findOneOrFail({ id });
      userCard.userId = userId;
      userCard.category = CardCategory.FIRST;
    }

    if (valid) {
      // Increase the learning step
      userCard.category = getNextCategory(userCard.category);
    } else {
      // Decrease the learning step
      userCard.category = getNextCategory(userCard.category);
    }

    // Update the category and last seen date
    await this.userCardRepository.upsert(
      {
        card: { id },
        userId: userId,
        category: userCard.category,
        lastSeen: this.dateService.getToday(),
      },
      {
        upsert: true,
      }
    );
  }
}
