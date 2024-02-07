import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
  type Rel,
} from "@mikro-orm/core";
import { CardCategory } from "./cardCategory.enum.js";
import type { DbID } from "../../utils/types.js";
import { Card } from "./card.model.js";

/**
 * This model represent the relation between a card and a user, it has an extra field to track the progression of the user with this card.
 */
@Entity()
export class UserCard {
  /**
   * The user id.
   */
  @PrimaryKey()
  declare userId: DbID;

  /**
   * Last time the user saw the card.
   */
  @Property()
  declare lastSeen: Date;

  /**
   * The card id.
   */
  [PrimaryKeyProp]?: ["cardId", "userId"];

  /**
   * The card category for the user.
   */
  @Enum({ default: CardCategory.FIRST })
  declare category: CardCategory;

  /**
   * Card relationship
   */
  @ManyToOne({ entity: () => Card, mapToPk: true })
  declare card: Rel<Card>;
}
