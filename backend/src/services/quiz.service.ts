import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "./interfaces/date.interface.js";
import { EntityManager, EntityRepository, raw } from "@mikro-orm/postgresql";
import { Card } from "../database/models/card.model.js";
import { UserCard } from "../database/models/userCard.model.js";
import {
  CardCategory,
  getNextCategory,
} from "../database/models/cardCategory.enum.js";
import { Quiz } from "../database/models/quiz.model.js";
import { AbstractUserService } from "./interfaces/user.interface.js";
import { User } from "../database/models/user.model.js";
import { LeitherSystem as LeitherSystemService } from "./leither.service.js";

@inject()
export class QuizService {
  private userCardRepository: EntityRepository<UserCard>;
  private cardRepository: EntityRepository<Card>;
  private quizRepository: EntityRepository<Quiz>;

  public constructor(
    private leitherService: LeitherSystemService,
    private dateService: AbstractDateService,
    private em: EntityManager
  ) {
    this.userCardRepository = this.em.getRepository(UserCard);
    this.cardRepository = this.em.getRepository(Card);
    this.quizRepository = this.em.getRepository(Quiz);
  }

  public async retrieveQuiz(date: Date, user: User): Promise<Card[]> {
    // First, try to check if there isn't already a quiz in the database
    const quiz = await this.quizRepository.findOne(
      { date, user },
      {
        fields: ["cards"],
      }
    );

    // If there is a quiz, returns the cards
    if (quiz !== null && quiz.cards.length > 0) {
      return quiz.cards.getItems();
    }

    // Otherwise, if there isn't any quiz in the database yet, generate a new one with random cards using the Leither system

    /*
     * Get all the cards that can be retrieved
     * To explain a bit, we want:
     * - All the cards that the user has never seen (= no user_card entries)
     * - All the cards that the user has seen and that he can see again
     *  (= user_cards entries that have a date above the computed date from the leither system)
     */
    const query = this.cardRepository
      .createQueryBuilder("c")
      .leftJoin("c.userCards", "uc")
      .where(
        `
        (NOT EXISTS(SELECT id FROM user_card as "uc" WHERE uc.user_id = ?))
        OR
        (
          (uc.user_id = ?)
          AND
          (
            (category = 'first' AND (AGE(NOW(), last_seen) > INTERVAL '? day'))
            OR
            (category = 'second' AND (AGE(NOW(), last_seen) > INTERVAL '? day'))
            OR
            (category = 'third' AND (AGE(NOW(), last_seen) > INTERVAL '? day'))
            OR
            (category = 'fourth' AND (AGE(NOW(), last_seen) > INTERVAL '? day'))
            OR
            (category = 'fifth' AND (AGE(NOW(), last_seen) > INTERVAL '? day'))
            OR
            (category = 'sixth' AND (AGE(NOW(), last_seen) > INTERVAL '? day'))
            OR
            (category = 'seventh' AND (AGE(NOW(), last_seen) > INTERVAL '? day'))
          )
        )
      `,
        [
          // User ID: first and second binding
          user.id,
          user.id,
          // Categories (from first to seventh): third to ninth binding
          ...Object.values(CardCategory)
            .filter((cat) => cat !== CardCategory.DONE)
            .map((cat) => this.leitherService.getDays(cat)),
        ]
      );

    const cards = await query.execute();

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
    card: Card,
    user: User,
    valid: boolean
  ): Promise<void> {
    // Get the current user card value
    let userCard = await this.userCardRepository.findOne({
      card,
      user,
    });

    // If there is no card, set the default values
    if (userCard == null) {
      userCard = new UserCard();
      userCard.card = card;
      userCard.user = user;
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
        card,
        user,
        category: userCard.category,
        lastSeen: this.dateService.getToday(),
      },
      {
        upsert: true,
      }
    );
  }
}
