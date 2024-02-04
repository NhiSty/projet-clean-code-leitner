import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Card } from "../../src/database/models/card.model";
import { CardFactory } from "../factories/card.factory";
import { TagFactory } from "../factories/tag.factory";

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
