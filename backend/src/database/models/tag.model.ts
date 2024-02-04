import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Card } from "./card.model.js";

/**
 * Tag is a MikroORM entity that represents a tag in the database.
 * A tag is a label that can be associated with a card.
 */
@Entity()
export class Tag {
  /**
   * The id of the tag.
   */
  @PrimaryKey()
  declare id: number;

  /**
   * The name of the tag.
   */
  @Property({ unique: true })
  declare name: string;

  /**
   * All the cards that are associated with this tag.
   */
  @OneToMany(() => Card, (card) => card.tag)
  declare card: Card[];
}
