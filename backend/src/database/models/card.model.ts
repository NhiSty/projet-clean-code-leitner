import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  type Rel,
} from "@mikro-orm/core";
import { Tag } from "./tag.model.js";
import { User } from "./user.model.js";
import type { DbID } from "../../utils/types.js";

/**
 * Card is a MikroORM entity that represents a card in the database.
 */
@Entity()
export class Card {
  /**
   * The id of the card.
   */
  @PrimaryKey()
  declare id: DbID;

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
  @ManyToOne(() => Tag)
  declare tag: Rel<Tag>;

  /**
   * Many card are referenced in many user cards association.
   */
  @ManyToMany()
  public users = new Collection<User>(this);
}
