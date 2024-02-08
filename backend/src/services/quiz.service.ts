import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "./interfaces/date.interface.js";
import {
  EntityManager,
  EntityRepository,
  raw,
  wrap,
} from "@mikro-orm/postgresql";
import { Card } from "../database/models/card.model.js";
import { UserCard } from "../database/models/userCard.model.js";
import {
  CardCategory,
  getNextCategory,
} from "../database/models/cardCategory.enum.js";
import { Quiz } from "../database/models/quiz.model.js";
import { User } from "../database/models/user.model.js";
import { LeitnerSystemService } from "./leitner.service.js";
import { generateUUID } from "../database/datasource.js";

@inject()
export class QuizService {
  private userCardRepository: EntityRepository<UserCard>;
  private cardRepository: EntityRepository<Card>;
  private quizRepository: EntityRepository<Quiz>;

  public constructor(
    private leitnerService: LeitnerSystemService,
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

    // Otherwise, if there is no quiz and this is a date in the past:
    if (!this.dateService.isToday(date)) {
      return [];
    }

    // Otherwise, if there isn't any quiz in the database yet, generate a new one with random cards using the Leitner system
    const cards = await this.populateCards(user, date);

    // If there is no cards, return an empty array
    if (cards.length === 0) {
      return [];
    }

    // Otherwise, generate a new quiz
    const newQuiz = this.em.create(Quiz, {
      id: generateUUID(),
      date,
      user: this.em.getReference(User, user.id),
      cards: cards.map((c) => this.em.getReference(Card, c.id)),
    });

    await this.em.persistAndFlush(newQuiz);

    return newQuiz.cards.getItems();
  }

  /**
   * Populate an array of maximum 10 cards.
   *
   * @param user the user to work with
   * @param date the date to work with
   * @returns the array of cards
   */
  private async populateCards(user: User, date: Date): Promise<Card[]> {
    /*
     * Get all the cards that can be retrieved
     * To explain a bit, we want:
     * - All the cards that the user has never seen (= no user_card entries)
     * - All the cards that the user has seen and that he can see again
     *  (= user_cards entries that have a date above the computed date from the leitner system)
     */
    const query = this.cardRepository
      .createQueryBuilder("c")
      .addSelect("userCards")
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
            .map((cat) => this.leitnerService.getDays(cat)),
        ]
      )
      .orderBy({
        id: "ASC",
      })
      .limit(10);

    return await query.execute();
  }

  /**
   * Update the learning step of a card for a user. If he responded correctly,
   * the learning step will be increased. If he responded incorrectly, the
   * learning step will be decreased. (based on the Leitner logic)
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
      // Reset the learning step
      userCard.category = CardCategory.FIRST;
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
