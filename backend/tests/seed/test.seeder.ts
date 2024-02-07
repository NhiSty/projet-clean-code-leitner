import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { Card } from "../../src/database/models/card.model.js";
import { CardFactory } from "../factories/card.factory.js";
import { TagFactory } from "../factories/tag.factory.js";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const cards: Card[] = new CardFactory(em)
      .each((card) => {
        card.tag = new TagFactory(em).makeOne();
      })
      .make(10);

    em.persist(cards);
  }
}
