import { Factory } from "@mikro-orm/seeder";
import { faker } from "@faker-js/faker/locale/en";
import { EntityData } from "@mikro-orm/postgresql";
import { Card } from "../../src/database/models/card.model.js";

export class CardFactory extends Factory<Card> {
  model = Card;

  protected definition(): EntityData<Card> {
    return {
      id: faker.string.uuid(),
      question: faker.lorem.sentence(),
      answer: faker.lorem.sentence(),
    };
  }
}
