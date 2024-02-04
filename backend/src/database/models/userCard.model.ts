import {
    Entity,
    ManyToOne,
    PrimaryKey,
    PrimaryKeyProp,
    Property,
} from "@mikro-orm/core";
import { CardCategory } from "./cardCategory.enum.js";
import type { DbID } from "../../utils/types.js";

/**
 * This model represent the relation between a card and a user, it has an extra field to track the progression of the user with this card.
 */
@Entity()
export class UserCard {
    /**
     * The card id.
     */
    @PrimaryKey()
    declare cardId: DbID;

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
    @Property({ default: CardCategory.FIRST })
    declare category: CardCategory;
}
