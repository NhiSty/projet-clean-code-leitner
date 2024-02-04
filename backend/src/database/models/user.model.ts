import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

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
  declare id: number;

  /**
   * The username of the user.
   */
  @Property({ unique: true })
  declare username: string;
}
