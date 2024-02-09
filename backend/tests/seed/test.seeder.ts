import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { Card } from "../../src/database/models/card.model.js";
import { CardFactory } from "../factories/card.factory.js";
import { TagFactory } from "../factories/tag.factory.js";
import { User } from "../../src/database/models/user.model.js";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const cards: Card[] = await new CardFactory(em)
      .each((card) => {
        card.tag = new TagFactory(em).makeOne();
      })
      .create(10);

    const fakeUser = new User();
    fakeUser.id = "ffffffff-ffff-ffff-ffff-ffffffffffff";
    fakeUser.username = "fake user";
    fakeUser.password = "fake password";
    em.persist(fakeUser);
  }
}
