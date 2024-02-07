import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { UserCard } from "./userCard.model.js";
import { Card } from "./card.model.js";
import type { DbID } from "../../utils/types.js";
import { Quiz } from "./userQuiz.model.js";

/**
 * User is a MikroORM entity that represents a user in the database.
 * A user is a person that can log in to the application.
 */
@Entity()
export class User {
  /**
   * The id of the user.
   */
  @PrimaryKey()
  declare id: DbID;

  /**
   * The username of the user.
   */
  @Property({ unique: true })
  declare username: string;

  /**
   * The password of the user.
   */
  @Property()
  declare password: string;

  /**
   * Many users can have many cards associated with it.
   */
  @ManyToMany({
    entity: () => Card,
    pivotEntity: () => UserCard,
  })
  public cards = new Collection<Card>(this);

  /**
   * A users can have many quiz associated with it.
   */
  @OneToMany(() => Quiz, (quiz) => quiz.user)
  public quizzes = new Collection<Quiz>(this);
}
