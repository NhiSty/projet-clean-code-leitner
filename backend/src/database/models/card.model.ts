import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Tag } from "./tag.model.js";

/**
 * CardCategory is an enum that represents the category of a card.
 */
export enum CardCategory {
  FIRST = "first",
  SECOND = "second",
  THIRD = "third",
  FOURTH = "fourth",
  FIFTH = "fifth",
  SIXTH = "sixth",
  SEVENTH = "seventh",
  DONE = "done",
}

/**
 * Card is a MikroORM entity that represents a card in the database.
 */
@Entity()
export class Card {
  /**
   * The id of the card.
   */
  @PrimaryKey()
  declare id: number;

  /***
   * The category where the card is in.
   */
  @Property({ columnType: "varchar", defaultRaw: CardCategory.FIRST })
  declare category: CardCategory;

  /**
   * The question of the card.
   */
  @Property({ unique: true })
  declare question: string;

  /**
   * The answer associated with the question of the card.
   */
  @Property()
  declare answer: string;

  /**
   * The tags associated with the card.
   */
  @ManyToOne(() => Tag, { name: "tagId" })
  declare tag: Tag;
}
