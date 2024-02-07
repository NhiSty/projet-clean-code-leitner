import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  type Rel,
} from "@mikro-orm/core";
import type { DbID } from "../../utils/types.js";
import { User } from "./user.model.js";
import { Card } from "./card.model.js";

/**
 * Quiz is a MikroORM entity that represents
 */
@Entity()
export class Quiz {
  /**
   * The id of the quiz.
   */
  @PrimaryKey()
  declare id: DbID;

  /**
   * The date of the quiz.
   */
  @Property()
  declare date: Date;

  /**
   * The user linked to the quiz.
   */
  @ManyToOne(() => User)
  declare user: Rel<User>;

  /**
   * A quiz has many cards
   */
  @ManyToMany(() => Card)
  public cards = new Collection<Card>(this);
}
