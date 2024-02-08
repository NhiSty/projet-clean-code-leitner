import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from "@mikro-orm/postgresql";
import { Card } from "../database/models/card.model.js";
import { Tag } from "../database/models/tag.model.js";
import { inject } from "@adonisjs/fold";
import { DbID } from "../utils/types.js";
import { generateUUID } from "../database/datasource.js";
import { User } from "../database/models/user.model.js";

@inject()
export class CardService {
  private cardRepository: EntityRepository<Card>;

  public constructor(private em: EntityManager) {
    this.cardRepository = this.em.getRepository(Card);
  }

  /**
   * Get all cards from the database
   * @param tags (optional) Filter cards by tags
   */
  public async getAllCards(
    tags: string[] = [],
    forUser: User | null = null
  ): Promise<Card[]> {
    const opts: FilterQuery<Card> = {};

    if (tags.length > 0) {
      opts.tag = { name: { $in: tags } };
    }

    const cards = await this.cardRepository.find(opts, {
      populate:
        forUser !== null
          ? ["id", "question", "answer", "tag", "userCards"]
          : ["id", "question", "answer", "tag"],
    });

    return cards;
  }

  /**
   * Create a new question card that will be shown to the user
   * @param question question to ask
   * @param answer answer to the question
   * @param tags possible tags to add to the card
   */
  public async createCard(
    question: string,
    answer: string,
    tag: Tag
  ): Promise<Card> {
    const card = new Card();
    card.id = generateUUID();
    card.question = question;
    card.answer = answer;
    card.tag = tag;

    await this.cardRepository.insert(card);
    return card;
  }

  /**
   * Find a card by its id
   * @param id id of the card to find
   */
  public async findCardById(id: DbID): Promise<Card | null> {
    return await this.cardRepository.findOne({ id });
  }

  /**
   * Delete a card from the database
   * @param id id of the card to delete
   */
  public async deleteCard(id: DbID): Promise<void> {
    await this.cardRepository.nativeDelete(id);
  }
}
