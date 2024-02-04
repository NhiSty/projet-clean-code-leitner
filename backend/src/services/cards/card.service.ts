import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  FindOptions,
} from "@mikro-orm/core";
import { Card, CardCategory } from "../../database/models/card.model.js";
import { Tag } from "../../database/models/tag.model.js";
import { inject } from "@adonisjs/fold";

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
  public async getAllCards(tags: string[] = []): Promise<Card[]> {
    const opts: FilterQuery<Card> = {};

    if (tags.length > 0) {
      opts.tag = { name: { $in: tags } };
    }

    const cards = await this.cardRepository.find(opts, {
      populate: ["id", "question", "answer", "tag"],
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
    card.question = question;
    card.answer = answer;
    card.category = CardCategory.FIRST;
    card.tag = tag;

    this.em.persist(card);
    await this.em.flush();

    return card;
  }

  /**
   * Find a card by its id
   * @param id id of the card to find
   */
  public async findCardById(id: number): Promise<Card | null> {
    return await this.cardRepository.findOne({ id });
  }

  /**
   * Delete a card from the database
   * @param id id of the card to delete
   */
  public async deleteCard(id: number): Promise<void> {
    await this.cardRepository.nativeDelete(id);
  }
}
