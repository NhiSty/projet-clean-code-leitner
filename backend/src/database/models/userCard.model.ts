import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKeyProp,
  Property,
  type Rel,
} from "@mikro-orm/postgresql";
import { CardCategory } from "./cardCategory.enum.js";
import { Card } from "./card.model.js";
import { User } from "./user.model.js";

/**
 * This model represent the relation between a card and a user, it has an extra field to track the progression of the user with this card.
 */
@Entity({ tableName: "user_card" })
export class UserCard {
  /**
   * Last time the user saw the card.
   */
  @Property()
  declare lastSeen: Date;

  /**
   * The card id.
   */
  [PrimaryKeyProp]?: ["user", "card"];

  /**
   * The card category for the user.
   */
  @Enum({ default: CardCategory.FIRST })
  declare category: CardCategory;

  /**
   * User relationship
   */
  @ManyToOne({ entity: () => User, primary: true, joinColumn: "user_id" })
  declare user: Rel<User>;

  /**
   * Card relationship
   */
  @ManyToOne({ entity: () => Card, primary: true, joinColumn: "card_id" })
  declare card: Rel<Card>;
}
