import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  type Rel,
} from "@mikro-orm/postgresql";
import { Tag } from "./tag.model.js";
import { User } from "./user.model.js";
import type { DbID } from "../../utils/types.js";
import { Quiz } from "./quiz.model.js";
import { UserCard } from "./userCard.model.js";

/**
 * Card is a MikroORM entity that represents a card in the database.
 */
@Entity()
export class Card {
  /**
   * The id of the card.
   */
  @PrimaryKey({ type: "uuid" })
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
  @ManyToMany({
    entity: () => User,
    mappedBy: (user: User) => user.cards,
  })
  public users = new Collection<User>(this);

  /**
   * A card is referenced in many quizzes
   */
  @ManyToMany(() => Quiz, (quiz) => quiz.cards)
  public quizzes = new Collection<Quiz>(this);

  /**
   * User card relationships
   */
  @OneToMany({ entity: () => UserCard, mappedBy: (userCard) => userCard.card })
  public userCards = new Collection<UserCard>(this);
}
